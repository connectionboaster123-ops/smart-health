import { FormEvent, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Ambulance, HeartPulse, Loader2, LockKeyhole, ShieldCheck, Stethoscope, UserRound } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import { isSupabaseConfigured } from "../lib/supabase";
import { cn, roleHomePath, roleLabel } from "../lib/utils";
import type { UserRole } from "../types";

const roles: Array<{ role: UserRole; icon: typeof UserRound; hint: string }> = [
  { role: "patient", icon: UserRound, hint: "Book doctors and request ambulances" },
  { role: "doctor", icon: Stethoscope, hint: "Manage appointments and earnings" },
  { role: "ambulance_provider", icon: Ambulance, hint: "Dispatch fleet and accept trips" },
  { role: "admin", icon: ShieldCheck, hint: "Verify, monitor, and report" }
];

export function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<UserRole>("patient");
  const [email, setEmail] = useState("patient@medirescue.local");
  const [password, setPassword] = useState("medirescue-demo");
  const [fullName, setFullName] = useState("Amina Carter");
  const [phone, setPhone] = useState("+1 555 0164");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = useMemo(() => {
    const state = location.state as { from?: string } | null;
    return state?.from ?? roleHomePath(role);
  }, [location.state, role]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (mode === "login") {
        await signIn(email, password, role);
      } else {
        await signUp({ email, password, fullName, phone, role });
      }

      navigate(redirectTo, { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Authentication failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function useDemoRole(nextRole: UserRole) {
    setRole(nextRole);
    setEmail(`${nextRole === "ambulance_provider" ? "provider" : nextRole}@medirescue.local`);
    setFullName(
      {
        patient: "Amina Carter",
        doctor: "Dr. Lina Okafor",
        ambulance_provider: "Noah Dispatch",
        admin: "MediRescue Admin"
      }[nextRole]
    );
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <section className="flex flex-col justify-center">
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-clinical-50 px-3 py-1 text-sm font-bold text-clinical-800 ring-1 ring-clinical-200 dark:bg-clinical-950/50 dark:text-clinical-100 dark:ring-clinical-900">
          <HeartPulse size={17} aria-hidden="true" />
          Secure Supabase Auth
        </div>
        <h1 className="mt-5 max-w-2xl text-4xl font-black leading-tight text-slate-950 dark:text-white sm:text-5xl">
          One account for patients, doctors, ambulance teams, and administrators.
        </h1>
        <p className="mt-4 max-w-xl text-slate-600 dark:text-slate-300">
          Role-aware authentication routes each user to the workflows they need, with profile records ready for Row Level Security.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {roles.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.role}
                className={cn(
                  "rounded-lg border p-4 text-left transition",
                  role === item.role
                    ? "border-clinical-500 bg-clinical-50 shadow-glow dark:bg-clinical-950/40"
                    : "border-slate-200 bg-white hover:border-clinical-200 dark:border-slate-800 dark:bg-slate-950"
                )}
                onClick={() => useDemoRole(item.role)}
              >
                <Icon className="text-clinical-700 dark:text-clinical-300" size={22} aria-hidden="true" />
                <p className="mt-3 font-bold text-slate-950 dark:text-white">{roleLabel(item.role)}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.hint}</p>
              </button>
            );
          })}
        </div>
      </section>

      <Card className="self-start p-6 sm:p-8">
        <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-900" role="tablist" aria-label="Authentication mode">
          {(["login", "register"] as const).map((item) => (
            <button
              key={item}
              className={cn(
                "h-10 flex-1 rounded-md text-sm font-bold capitalize transition",
                mode === item ? "bg-white text-clinical-800 shadow-sm dark:bg-slate-800 dark:text-clinical-100" : "text-slate-500 dark:text-slate-400"
              )}
              onClick={() => setMode(item)}
              role="tab"
              aria-selected={mode === item}
            >
              {item}
            </button>
          ))}
        </div>

        {!isSupabaseConfigured ? (
          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
            Demo mode is active because Supabase environment variables are not configured. The same screens will use live auth once `.env.local` is set.
          </div>
        ) : null}

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          {mode === "register" ? (
            <>
              <Input label="Full name" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
              <Input label="Phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required />
            </>
          ) : null}
          <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} />

          <div>
            <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Role</p>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((item) => (
                <button
                  key={item.role}
                  type="button"
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm font-semibold transition",
                    role === item.role
                      ? "border-clinical-500 bg-clinical-50 text-clinical-800 dark:bg-clinical-950/40 dark:text-clinical-100"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                  )}
                  onClick={() => useDemoRole(item.role)}
                >
                  {roleLabel(item.role)}
                </button>
              ))}
            </div>
          </div>

          {error ? <p className="rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-200">{error}</p> : null}

          <Button type="submit" size="lg" disabled={submitting} leftIcon={submitting ? <Loader2 className="animate-spin" size={18} /> : <LockKeyhole size={18} />}>
            {mode === "login" ? "Login" : "Create account"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
          Need to browse first?{" "}
          <Link className="font-bold text-clinical-700 dark:text-clinical-300" to="/doctors">
            View doctors
          </Link>
        </p>
      </Card>
    </main>
  );
}
