import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import type { Session } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import type { Profile, UserRole } from "../types";

interface AuthContextValue {
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string, role?: UserRole) => Promise<void>;
  signUp: (payload: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role: UserRole;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  setActiveRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const demoProfiles: Record<UserRole, Profile> = {
  patient: {
    id: "demo-patient",
    role: "patient",
    fullName: "Amina Carter",
    email: "patient@medirescue.local",
    phone: "+1 555 0164",
    preferredLanguage: "en",
    darkMode: false
  },
  doctor: {
    id: "demo-doctor",
    role: "doctor",
    fullName: "Dr. Lina Okafor",
    email: "doctor@medirescue.local",
    phone: "+1 555 0198",
    preferredLanguage: "en",
    darkMode: false
  },
  ambulance_provider: {
    id: "demo-provider",
    role: "ambulance_provider",
    fullName: "Noah Dispatch",
    email: "provider@medirescue.local",
    phone: "+1 555 0151",
    preferredLanguage: "en",
    darkMode: false
  },
  admin: {
    id: "demo-admin",
    role: "admin",
    fullName: "MediRescue Admin",
    email: "admin@medirescue.local",
    phone: "+1 555 0120",
    preferredLanguage: "en",
    darkMode: false
  }
};

function readDemoProfile() {
  const storedRole = localStorage.getItem("medirescue-demo-role") as UserRole | null;
  return storedRole && demoProfiles[storedRole] ? demoProfiles[storedRole] : null;
}

function mapProfileRow(row: Record<string, unknown>): Profile {
  return {
    id: String(row.id),
    role: row.role as UserRole,
    fullName: String(row.full_name ?? ""),
    email: String(row.email ?? ""),
    phone: row.phone ? String(row.phone) : undefined,
    avatarUrl: row.avatar_url ? String(row.avatar_url) : undefined,
    preferredLanguage: String(row.preferred_language ?? "en"),
    darkMode: Boolean(row.dark_mode)
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(() => {
    if (isSupabaseConfigured) {
      return null;
    }

    return readDemoProfile();
  });
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const loadProfile = useCallback(async (userId: string) => {
    if (!supabase) {
      return null;
    }

    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

    if (error || !data) {
      return null;
    }

    return mapProfileRow(data as Record<string, unknown>);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) {
        return;
      }

      setSession(data.session);
      setProfile(data.session?.user ? await loadProfile(data.session.user.id) : null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession?.user) {
        setProfile(null);
        return;
      }

      void loadProfile(nextSession.user.id).then(setProfile);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(
    async (email: string, password: string, role: UserRole = "patient") => {
      if (!supabase) {
        localStorage.setItem("medirescue-demo-role", role);
        setProfile({ ...demoProfiles[role], email: email || demoProfiles[role].email });
        setSession(null);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        throw error;
      }

      setSession(data.session);
      setProfile(data.user ? await loadProfile(data.user.id) : null);
    },
    [loadProfile]
  );

  const signUp = useCallback(
    async (payload: {
      email: string;
      password: string;
      fullName: string;
      phone?: string;
      role: UserRole;
    }) => {
      if (!supabase) {
        const nextProfile: Profile = {
          ...demoProfiles[payload.role],
          email: payload.email,
          fullName: payload.fullName,
          phone: payload.phone
        };
        localStorage.setItem("medirescue-demo-role", payload.role);
        setProfile(nextProfile);
        setSession(null);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: {
          data: {
            full_name: payload.fullName,
            phone: payload.phone,
            role: payload.role
          }
        }
      });

      if (error) {
        throw error;
      }

      setSession(data.session);
      if (data.user) {
        const loaded = await loadProfile(data.user.id);
        setProfile(
          loaded ?? {
            id: data.user.id,
            role: payload.role,
            fullName: payload.fullName,
            email: payload.email,
            phone: payload.phone,
            preferredLanguage: "en",
            darkMode: false
          }
        );
      }
    },
    [loadProfile]
  );

  const signOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }

    localStorage.removeItem("medirescue-demo-role");
    setProfile(null);
    setSession(null);
  }, []);

  const setActiveRole = useCallback(async (role: UserRole) => {
    if (supabase && profile) {
      const { error } = await supabase.from("profiles").update({ role }).eq("id", profile.id);
      if (error) {
        throw error;
      }
    }

    localStorage.setItem("medirescue-demo-role", role);
    setProfile((current) => ({
      ...(current ?? demoProfiles[role]),
      role,
      id: current?.id ?? demoProfiles[role].id,
      email: current?.email ?? demoProfiles[role].email,
      fullName: current?.fullName ?? demoProfiles[role].fullName,
      preferredLanguage: current?.preferredLanguage ?? "en",
      darkMode: current?.darkMode ?? false
    }));
  }, [profile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      profile,
      session,
      loading,
      isAuthenticated: Boolean(profile),
      signIn,
      signUp,
      signOut,
      setActiveRole
    }),
    [loading, profile, session, signIn, signOut, signUp, setActiveRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
