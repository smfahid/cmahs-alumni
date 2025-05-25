"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { getBrowserClient } from "./supabase";
import type { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (
    identifier: string,
    password: string
  ) => Promise<{
    error: any | null;
    data: any | null;
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
    const fetchSession = async () => {
      try {
        const supabase = getBrowserClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSessionState(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Check if user is admin
          const { data } = await supabase
            .from("users")
            .select("role")
            .eq("id", session.user.id)
            .single();

          setIsAdmin(data?.role === "admin");
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    try {
      const supabase = getBrowserClient();
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        console.log("session->", session);
        setSessionState(session);
        setUser(session?.user ?? null);
        console.log("user->", session?.user);

        if (session?.user) {
          console.log("data----->", supabase);

          // Re-check admin status on auth state change
          const { data } = await supabase
            .from("users")
            .select("role")
            .eq("id", session.user.id)
            .single();
          console.log("role->", data?.role);
          setIsAdmin(data?.role === "admin");
        } else {
          setIsAdmin(false); // Reset admin status if no user
        }
        setIsLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error("Error setting up auth subscription:", error);
      setIsLoading(false);
      return () => {};
    }
  }, []);

  const signIn = async (identifier: string, password: string) => {
    try {
      const supabase = getBrowserClient();
      let emailToAuth = identifier;

      // Check if the identifier is likely a phone number (e.g., doesn't contain '@')
      // You might want a more robust check here (e.g., regex for phone patterns)
      if (!identifier.includes("@")) {
        // Assume it's a phone number, try to get email from users table
        // Make sure your 'users' table has a 'phone' column that stores the mobile numbers
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("email")
          .eq("phone", identifier) // Assuming 'phone' is the column name for mobile numbers
          .single();

        if (userError || !userData?.email) {
          console.error(
            "Error fetching user by phone or user not found:",
            userError
          );
          return {
            error: { message: "Invalid login credentials." },
            data: null,
          };
        }
        emailToAuth = userData.email;
      }

      const response = await supabase.auth.signInWithPassword({
        email: emailToAuth, // Use the resolved email
        password,
      });

      if (response.data.user) {
        // Check if user is admin
        const { data } = await supabase
          .from("users")
          .select("role, is_approved")
          .eq("id", response.data.user.id)
          .single();

        setIsAdmin(data?.role === "admin");

        // If user is not approved and not admin, sign them out
        if (!data?.is_approved && data?.role !== "admin") {
          await supabase.auth.signOut();
          // Clear local state as well
          setUser(null);
          setSessionState(null);
          setIsAdmin(false);
          return {
            error: { message: "Your account is pending approval." },
            data: null,
          };
        }
        // If login is successful and user is approved (or admin), update state
        setUser(response.data.user as User);
        setSessionState(response.data.session);
      } else if (response.error) {
        // Handle errors from signInWithPassword (e.g., wrong password for the resolved email)
        return {
          error: response.error,
          data: null,
        };
      }

      return response;
    } catch (error: any) {
      console.error("Error signing in:", error);
      return {
        error: { message: error.message || "An unexpected error occurred." },
        data: null,
      };
    }
  };

  const signOut = async () => {
    console.log("AuthContext: signOut initiated."); // Renamed for clarity
    try {
      const supabase = getBrowserClient();
      console.log(
        "AuthContext: Supabase client obtained for signOut:",
        supabase ? "Yes" : "No"
      );

      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        console.error(
          "AuthContext: Error from supabase.auth.signOut():",
          signOutError
        );
      } else {
        console.log(
          "AuthContext: supabase.auth.signOut() successful, no error object returned."
        );
      }

      setUser(null);
      setSessionState(null);
      setIsAdmin(false);
      console.log("AuthContext: Local state (user, session, isAdmin) cleared.");
    } catch (error) {
      console.error("AuthContext: General error in signOut function:", error);
    }
  };

  const value = {
    user,
    session: sessionState,
    isLoading,
    signIn,
    signOut,
    isAdmin,
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
