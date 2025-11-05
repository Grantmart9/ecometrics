"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

interface UserProfile {
  name: string;
  email: string;
  company?: string;
  id: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error?: AuthError }>;
  register: (
    email: string,
    password: string,
    name: string,
    company?: string
  ) => Promise<{ error?: AuthError }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
      } else if (session) {
        setSession(session);
        setIsAuthenticated(true);
        // Fetch user profile
        await fetchUserProfile(session.user);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session) {
        setIsAuthenticated(true);
        await fetchUserProfile(session.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (supabaseUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", supabaseUser.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching user profile:", error);
        return;
      }

      if (profile) {
        setUser({
          id: profile.id,
          name:
            profile.name ||
            supabaseUser.user_metadata?.name ||
            supabaseUser.email?.split("@")[0] ||
            "User",
          email: profile.email || supabaseUser.email || "",
          company: profile.company || supabaseUser.user_metadata?.company || "",
        });
      } else {
        // Create default profile if it doesn't exist
        const newProfile = {
          id: supabaseUser.id,
          name:
            supabaseUser.user_metadata?.name ||
            supabaseUser.email?.split("@")[0] ||
            "User",
          email: supabaseUser.email || "",
          company: supabaseUser.user_metadata?.company || "",
        };

        const { error: insertError } = await supabase
          .from("user_profiles")
          .insert(newProfile);

        if (insertError) {
          console.error("Error creating user profile:", insertError);
        } else {
          setUser(newProfile);
        }
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        return { error };
      }

      // User will be set by the auth state change listener
      return { error: undefined };
    } catch (error) {
      setLoading(false);
      return { error: error as AuthError };
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    company?: string
  ) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            company: company || "",
          },
        },
      });

      if (error) {
        setLoading(false);
        return { error };
      }

      // User will be set by the auth state change listener
      return { error: undefined };
    } catch (error) {
      setLoading(false);
      return { error: error as AuthError };
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    user,
    session,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
