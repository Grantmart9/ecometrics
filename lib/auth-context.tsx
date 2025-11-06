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
    // Check for existing token on mount
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (token) {
          // Validate token by trying to get user info
          const userData = await crudServiceInstance.getCurrentUser();
          if (userData && (userData as any).Status === 200) {
            const userRecord = (userData as any).Data?.[0];
            if (userRecord) {
              setUser({
                id: userRecord.Id || "1",
                name: userRecord.Name || userRecord.name || "User",
                email: userRecord.Email || userRecord.email || "",
                company: userRecord.Company || userRecord.company || "",
                createdAt: userRecord.CreatedAt || new Date().toISOString(),
                updatedAt: userRecord.UpdatedAt || new Date().toISOString(),
              } as User);
              setIsAuthenticated(true);
              setSession({ access_token: token } as Session);
            }
          } else {
            // Token is invalid, remove it
            localStorage.removeItem("auth_token");
          }
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        // Remove invalid token
        localStorage.removeItem("auth_token");
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
      const result = await crudServiceInstance.login({
        email: identifier, // Send as email field for backend compatibility
        password,
        identifier_type: isEmail ? "email" : "username", // Custom field for backend
      });

      if (result && result.Status === 200) {
        const userRecord = result.Data?.[0];
        const token = userRecord?.token || result.token;

        // Store token
        if (token) {
          localStorage.setItem("auth_token", token);
        }

        // Set user data
        const userData: User = {
          id: userRecord?.id || "1",
          name:
            userRecord?.name ||
            (isEmail ? identifier.split("@")[0] : identifier),
          email:
            userRecord?.email ||
            (isEmail ? identifier : userRecord?.email || ""),
          company: userRecord?.company || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setUser(userData);
        setIsAuthenticated(true);
        setSession({ access_token: token || "" } as Session);

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
        const token = userRecord?.token || result.token;

        // For signup, we might not get a token immediately, so handle both cases
        if (token) {
          localStorage.setItem("auth_token", token);
        }

        // Set user data
        const userData: User = {
          id: userRecord?.id || "1",
          name: userRecord?.name || name,
          email:
            userRecord?.email ||
            (isEmail ? identifier : userRecord?.email || ""),
          company: userRecord?.company || company || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setUser(userData);
        setIsAuthenticated(true);
        setSession({ access_token: token || "" } as Session);

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

      // Clear local storage
      localStorage.removeItem("auth_token");

      // Clear state
      setUser(null);
      setIsAuthenticated(false);
      setSession(null);
    } catch (error) {
      console.error("Logout error:", error);
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
