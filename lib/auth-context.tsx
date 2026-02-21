"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { crudService, AUTH_EVENT_NAME } from "./crudService";
import { environment } from "./environment";
import type { User, Session } from "@/types/database";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Session storage key for persisting auth across soft refreshes
const AUTH_STORAGE_KEY = "ecometrics_auth_state";

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
  const [showTokenExpiredDialog, setShowTokenExpiredDialog] = useState(false);
  // Use the imported singleton instance directly
  const crudServiceInstance = crudService;

  // Helper to save auth state to sessionStorage
  const saveAuthToStorage = (userData: User | null, authenticated: boolean) => {
    if (typeof window !== "undefined") {
      if (authenticated && userData) {
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
          user: userData,
          isAuthenticated: authenticated,
          timestamp: Date.now()
        }));
      } else {
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  };

  // Helper to load auth state from sessionStorage
  const loadAuthFromStorage = (): { user: User | null; isAuthenticated: boolean } | null => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Check if stored data is less than 1 hour old
          const maxAge = 60 * 60 * 1000; // 1 hour in milliseconds
          if (parsed.timestamp && (Date.now() - parsed.timestamp) < maxAge) {
            return {
              user: parsed.user,
              isAuthenticated: parsed.isAuthenticated
            };
          }
        } catch (e) {
          console.log("Failed to parse stored auth state");
        }
      }
    }
    return null;
  };

  useEffect(() => {
    // Check for existing session by trying to get user info
    const checkAuthStatus = async () => {
      // First, try to restore from sessionStorage (survives soft refresh)
      const storedAuth = loadAuthFromStorage();
      if (storedAuth && storedAuth.isAuthenticated && storedAuth.user) {
        console.log("DEBUG: Restored auth from sessionStorage (soft refresh)");
        setUser(storedAuth.user);
        setIsAuthenticated(true);
        setSession({ access_token: "cookie-based" } as Session);
        setLoading(false);
        return;
      }

      // If no stored auth, check with server (hard refresh or first load)
      try {
        // Try to get current user - if we get a valid response, user is authenticated
        const userData = await crudServiceInstance.getCurrentUser();
        console.log("DEBUG: Auth check response:", userData);

        if (userData && (userData as any).Status === 200) {
          const userRecord = (userData as any).Data?.[0];
          if (userRecord) {
            const userDataObj: User = {
              id: userRecord.Id || "1",
              name: userRecord.Name || userRecord.name || "User",
              email: userRecord.Email || userRecord.email || "",
              username: userRecord.Username || userRecord.username || "",
              company: userRecord.Company || userRecord.company || "",
              createdAt: userRecord.CreatedAt || new Date().toISOString(),
              updatedAt: userRecord.UpdatedAt || new Date().toISOString(),
            } as User;
            setUser(userDataObj);
            setIsAuthenticated(true);
            // For cookie-based auth, we don't need to store tokens in session
            setSession({ access_token: "cookie-based" } as Session);
            // Save to sessionStorage for soft refresh persistence
            saveAuthToStorage(userDataObj, true);
          }
        } else {
          console.log("DEBUG: User not authenticated or invalid response");
          setIsAuthenticated(false);
          setUser(null);
          setSession(null);
          saveAuthToStorage(null, false);
        }
      } catch (error) {
        console.log("DEBUG: Auth check failed:", error);
        // If auth check fails, user is not authenticated
        setIsAuthenticated(false);
        setUser(null);
        setSession(null);
        saveAuthToStorage(null, false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [crudService]);

  // Listen for authentication errors (401) from CRUD service
  // Only redirect to login if user was previously authenticated (token expired)
  useEffect(() => {
    const handleAuthError = async () => {
      // Only process auth error if user was logged in (token expired scenario)
      // If user is not authenticated, they're just browsing public pages
      if (!isAuthenticated) {
        console.log("🚨 Auth error event received but user not authenticated - ignoring (public page access)");
        return;
      }
      
      console.log("🚨 Auth error event received - token expired, showing dialog");
      
      // Show the token expired dialog
      setShowTokenExpiredDialog(true);
    };

    window.addEventListener(AUTH_EVENT_NAME, handleAuthError);
    
    return () => {
      window.removeEventListener(AUTH_EVENT_NAME, handleAuthError);
    };
  }, [isAuthenticated]);

  // Handle token expired dialog confirmation
  const handleTokenExpiredConfirm = () => {
    // Clear local state
    setUser(null);
    setIsAuthenticated(false);
    setSession(null);
    setShowTokenExpiredDialog(false);
    // Clear sessionStorage
    saveAuthToStorage(null, false);
    
    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

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
        // Save to sessionStorage for soft refresh persistence
        saveAuthToStorage(userData, true);

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
        // Save to sessionStorage for soft refresh persistence
        saveAuthToStorage(userData, true);

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
      // Clear sessionStorage
      saveAuthToStorage(null, false);
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear local state
      setUser(null);
      setIsAuthenticated(false);
      setSession(null);
      // Clear sessionStorage
      saveAuthToStorage(null, false);
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

  return (
    <AuthContext.Provider value={value}>
      {children}
      
      {/* Token Expired Dialog */}
      <Dialog open={showTokenExpiredDialog} onOpenChange={setShowTokenExpiredDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Session Expired</DialogTitle>
            <DialogDescription>
              Your token has expired. Please click OK to log in again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={handleTokenExpiredConfirm}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
