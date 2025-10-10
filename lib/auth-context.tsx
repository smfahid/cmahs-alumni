"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import type { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (
    identifier: string,
    password: string
  ) => Promise<{
    error: Error | null;
    data: User | null;
  }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionState, setSessionState] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const response = await fetch("/api/auth/status");
        const data = await response.json();

        if (response.ok) {
          setSessionState(data.session);
          setUser(data.user);
          setIsAdmin(data.isAdmin);
        } else {
          console.error("Error fetching auth status:", data.error);
          setSessionState(null);
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error fetching auth status:", error);
        setSessionState(null);
        setUser(null);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthStatus();

    // Set up a simple polling mechanism to check auth status periodically
    // This replaces the Supabase auth state change listener
    const interval = setInterval(fetchAuthStatus, 30000); // Check every 30 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  const signIn = async (identifier: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state with the response data
        setUser(data.user);
        setSessionState(data.session);
        setIsAdmin(data.isAdmin);

        return {
          error: null,
          data: data.user,
        };
      } else {
        return {
          error: new Error(data.error || "Login failed"),
          data: null,
        };
      }
    } catch (error: any) {
      console.error("Error signing in:", error);
      return {
        error: new Error(error.message || "An unexpected error occurred."),
        data: null,
      };
    }
  };

  const signOut = async () => {
    console.log("AuthContext: signOut initiated.");
    try {
      // Optimistically clear local state
      setUser(null);
      setSessionState(null);
      setIsAdmin(false);

      // Clear local storage
      try {
        const clearStores = (store: Storage | null) => {
          if (!store) return;
          const keys: string[] = [];
          for (let i = 0; i < store.length; i++) {
            const key = store.key(i);
            if (key && key.startsWith("sb-")) keys.push(key);
          }
          keys.forEach((k) => store.removeItem(k));
        };
        clearStores(window.localStorage);
        clearStores(window.sessionStorage);
      } catch {}

      // Call logout API
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        console.error("Logout API error:", data.error);
      }

      console.log("AuthContext: Local state (user, session, isAdmin) cleared.");

      // Hard redirect to login to ensure fresh server state
      try {
        window.location.assign("/login");
      } catch {}
    } catch (error) {
      console.error("AuthContext: General error in signOut function:", error);
      setUser(null);
      setSessionState(null);
      setIsAdmin(false);
      try {
        window.location.assign("/login");
      } catch {}
    }
  };

  const value = useMemo(
    () => ({
      user,
      session: sessionState,
      isLoading,
      signIn,
      signOut,
      isAdmin,
    }),
    [user, sessionState, isLoading, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
