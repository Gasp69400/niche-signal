"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { canAccessReports } from "@/lib/auth/access";
import { getSiteUrl } from "@/lib/supabase/env";
import type { Profile } from "@/types/auth";

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  canAnalyze: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null; session: Session | null }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{
    error: string | null;
    session: Session | null;
    needsEmailConfirmation: boolean;
  }>;
  resetPassword: (
    email: string,
    locale: string
  ) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, plan")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return data as Profile;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    void import("@/lib/supabase/client").then(({ createClient }) => {
      setSupabase(createClient());
    });
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data: { user: currentUser } } = await supabase.auth.getUser();
    setUser(currentUser);
    if (currentUser) {
      const p = await fetchProfile(supabase, currentUser.id);
      setProfile(p);
    } else {
      setProfile(null);
    }
  }, [supabase]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    refreshProfile().finally(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          const p = await fetchProfile(supabase, session.user.id);
          setProfile(p);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, refreshProfile]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!supabase) {
        return { error: "Supabase non configuré", session: null };
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message, session: null };
      }

      if (data.session?.user) {
        setUser(data.session.user);
        const profile = await fetchProfile(supabase, data.session.user.id);
        setProfile(profile);
      }

      return { error: null, session: data.session };
    },
    [supabase]
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      if (!supabase) {
        return {
          error: "Supabase non configuré",
          session: null,
          needsEmailConfirmation: false,
        };
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${getSiteUrl()}/fr`,
        },
      });

      if (error) {
        return {
          error: error.message,
          session: null,
          needsEmailConfirmation: false,
        };
      }

      if (data.session?.user) {
        setUser(data.session.user);
        const profile = await fetchProfile(supabase, data.session.user.id);
        setProfile(profile);
      }

      return {
        error: null,
        session: data.session,
        needsEmailConfirmation: Boolean(data.user && !data.session),
      };
    },
    [supabase]
  );

  const resetPassword = useCallback(
    async (email: string, locale: string) => {
      try {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, locale }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          return {
            error:
              typeof data.error === "string"
                ? data.error
                : "Impossible d'envoyer l'email de réinitialisation",
          };
        }

        return { error: null };
      } catch {
        return { error: "Impossible d'envoyer l'email de réinitialisation" };
      }
    },
    []
  );

  const updatePassword = useCallback(
    async (password: string) => {
      if (!supabase) {
        return { error: "Supabase non configuré" };
      }

      const { error } = await supabase.auth.updateUser({ password });
      return { error: error?.message ?? null };
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, [supabase]);

  const canAnalyze = user ? canAccessReports(profile?.plan ?? "free") : false;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        canAnalyze,
        signIn,
        signUp,
        resetPassword,
        updatePassword,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
