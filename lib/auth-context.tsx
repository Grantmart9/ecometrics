"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { crudService } from "./crudService";
import { environment } from "./environment";
import type { User, Session } from "@/types/database";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  login: (identifier: string, password: string) => Promise<{ error?: string }>;
  register: (
    identifier: string,
    password: string,
    name: string,
    company?: string,
    username?: string
  ) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  // Use the imported singleton instance directly
  const crudServiceInstance = crudService;

  useEffect(() => {
    // Check for existing session by trying to get user info
    const checkAuthStatus = async () => {
      try {
        // Try to get current user - if we get a valid response, user is authenticated
        const userData = await crudServiceInstance.getCurrentUser();
        console.log("DEBUG: Auth check response:", userData);

        if (userData && (userData as any).Status === 200) {
          const userRecord = (userData as any).Data?.[0];
          if (userRecord) {
            setUser({
              id: userRecord.Id || "1",
              name: userRecord.Name || userRecord.name || "User",
              email: userRecord.Email || userRecord.email || "",
              username: userRecord.Username || userRecord.username || "",
              company: userRecord.Company || userRecord.company || "",
              createdAt: userRecord.CreatedAt || new Date().toISOString(),
              updatedAt: userRecord.UpdatedAt || new Date().toISOString(),
            } as User);
            setIsAuthenticated(true);
            // For cookie-based auth, we don't need to store tokens in session
            setSession({ access_token: "cookie-based" } as Session);
          }
        } else {
          console.log("DEBUG: User not authenticated or invalid response");
          setIsAuthenticated(false);
          setUser(null);
          setSession(null);
        }
      } catch (error) {
        console.log("DEBUG: Auth check failed:", error);
        // If auth check fails, user is not authenticated
        setIsAuthenticated(false);
        setUser(null);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [crudService]);

  const login = async (identifier: string, password: string) => {
    try {
      setLoading(true);

      // Determine if identifier is email or username
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmail = emailRegex.test(identifier);

      // Call the login method through CRUD service with proper data object
      // Based on server error, try different data structures
      const loginData = isEmail
        ? { email: identifier, password }
        : { username: identifier, password };

      console.log("Attempting login with data structure:", loginData);
      const result = await crudServiceInstance.login(loginData);

      if (result && result.Status === 200) {
        const userRecord = result.Data?.[0];

        // Set user data
        const userData: User = {
          id: userRecord?.id || "1",
          name:
            userRecord?.name ||
            (isEmail ? identifier.split("@")[0] : identifier),
          email:
            userRecord?.email ||
            (isEmail ? identifier : userRecord?.email || ""),
          username: !isEmail ? identifier : userRecord?.username || "",
          company: userRecord?.company || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setUser(userData);
        setIsAuthenticated(true);
        // Use token if available, otherwise cookie-based
        setSession({ access_token: result.token || "cookie-based" } as Session);

        return { error: undefined };
      } else {
        return { error: result?.error || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { error: "Login failed. Please try again." };
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    identifier: string,
    password: string,
    name: string,
    company?: string,
    username?: string
  ) => {
    try {
      setLoading(true);

      // Determine if identifier is email or username
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmail = emailRegex.test(identifier);

      // Create registration data
      const registerData = {
        email: isEmail ? identifier : "", // Only send email if identifier is email
        username: !isEmail ? identifier : username, // Use identifier as username if not email
        password,
        name,
        company: company || "",
      };

      // Call the signup method through CRUD service
      const result = await crudServiceInstance.signup(registerData);

      if (result && result.Status === 200) {
        const userRecord = result.Data?.[0];

        // Set user data
        const userData: User = {
          id: userRecord?.id || "1",
          name: userRecord?.name || name,
          username: userRecord?.username || username || (!isEmail ? identifier : ""),
          email:
            userRecord?.email ||
            (isEmail ? identifier : userRecord?.email || ""),
          company: userRecord?.company || company || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setUser(userData);
        setIsAuthenticated(true);
        // For cookie-based auth, session is managed by cookies
        setSession({ access_token: "cookie-based" } as Session);

        return { error: undefined };
      } else {
        return { error: result?.error || "Registration failed" };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return { error: "Registration failed. Please try again." };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);

      // Call logout method through CRUD service
      await crudServiceInstance.logout();

      // Clear state - cookies will be cleared by the server
      setUser(null);
      setIsAuthenticated(false);
      setSession(null);
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear local state
      setUser(null);
      setIsAuthenticated(false);
      setSession(null);
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
