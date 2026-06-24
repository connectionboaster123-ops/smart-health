import { Bell, Globe2, HeartPulse, Moon, Save, ShieldCheck, UserRound } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle } from "../components/ui/Card";
import { Input, Select, Textarea } from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../lib/i18n";
import { roleLabel } from "../lib/utils";

export function SettingsPage() {
  const { profile } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="grid gap-6">
      <section className="rounded-lg bg-slate-950 p-6 text-white shadow-soft sm:p-8">
        <Badge tone="info" className="bg-white/10 text-white ring-white/20">
          Settings
        </Badge>
        <h1 className="mt-4 text-3xl font-black">Profile and preferences</h1>
        <p className="mt-2 max-w-2xl text-slate-300">
          Manage personal details, emergency contacts, notifications, language, theme, and account security.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Profile</CardTitle>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{profile ? roleLabel(profile.role) : "User"} account details.</p>
              </div>
              <UserRound className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
            </CardHeader>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Full name" defaultValue={profile?.fullName ?? ""} />
              <Input label="Email" type="email" defaultValue={profile?.email ?? ""} />
              <Input label="Phone" type="tel" defaultValue={profile?.phone ?? ""} />
              <Input label="Location" defaultValue="742 Lakeview Avenue" />
              <Select label="Blood group" defaultValue="O+">
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                  <option key={group}>{group}</option>
                ))}
              </Select>
              <Input label="Insurance provider" defaultValue="MediSure Gold" />
            </div>
            <div className="mt-4">
              <Textarea label="Medical notes" defaultValue="Penicillin allergy. Emergency contact should be called before non-urgent transfers." />
            </div>
            <Button className="mt-5" leftIcon={<Save size={18} />}>
              Save profile
            </Button>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency contacts</CardTitle>
              <HeartPulse className="text-alert-600 dark:text-alert-300" size={21} aria-hidden="true" />
            </CardHeader>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Primary contact" defaultValue="Maya Carter" />
              <Input label="Primary phone" defaultValue="+1 555 0108" />
              <Input label="Secondary contact" defaultValue="Eli Carter" />
              <Input label="Secondary phone" defaultValue="+1 555 0127" />
            </div>
            <Button className="mt-5" variant="outline" leftIcon={<Save size={18} />}>
              Update contacts
            </Button>
          </Card>
        </div>

        <aside className="grid content-start gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Accessibility and language</CardTitle>
              <Globe2 className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
            </CardHeader>
            <div className="grid gap-4">
              <Select label="Language" value={language} onChange={(event) => setLanguage(event.target.value as "en" | "fr" | "sw" | "es")}>
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="sw">Swahili</option>
                <option value="es">Spanish</option>
              </Select>
              <button
                className="flex items-center justify-between rounded-lg border border-slate-200 p-4 text-left dark:border-slate-800"
                onClick={toggleTheme}
                aria-pressed={isDark}
              >
                <span className="flex items-center gap-3">
                  <Moon className="text-clinical-700 dark:text-clinical-300" size={20} aria-hidden="true" />
                  <span>
                    <span className="block font-bold text-slate-950 dark:text-white">Dark mode</span>
                    <span className="block text-sm text-slate-500 dark:text-slate-400">Use a low-light dashboard theme.</span>
                  </span>
                </span>
                <span className={`h-6 w-11 rounded-full p-1 transition ${isDark ? "bg-clinical-600" : "bg-slate-300"}`}>
                  <span className={`block h-4 w-4 rounded-full bg-white transition ${isDark ? "translate-x-5" : "translate-x-0"}`} />
                </span>
              </button>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <Bell className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
            </CardHeader>
            <div className="grid gap-3">
              {["In-app updates", "Email confirmations", "Ambulance status SMS", "Payment receipts"].map((item) => (
                <label key={item} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{item}</span>
                  <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-slate-300 text-clinical-700 focus:ring-clinical-600" />
                </label>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <ShieldCheck className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
            </CardHeader>
            <div className="grid gap-3 text-sm">
              <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                <p className="font-bold text-slate-950 dark:text-white">Row Level Security</p>
                <p className="mt-1 text-slate-500 dark:text-slate-400">Supabase policies isolate patient, doctor, provider, and admin data.</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                <p className="font-bold text-slate-950 dark:text-white">Audit logs</p>
                <p className="mt-1 text-slate-500 dark:text-slate-400">Sensitive actions are recorded for operational review.</p>
              </div>
            </div>
          </Card>
        </aside>
      </section>
    </div>
  );
}
