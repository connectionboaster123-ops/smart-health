import { Link, NavLink, Outlet } from "react-router-dom";
import {
  Ambulance,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Stethoscope,
  Sun,
  UserRound,
  X
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { initials, roleLabel } from "../../lib/utils";

const navByRole = {
  patient: [
    { label: "Dashboard", href: "/patient", icon: LayoutDashboard },
    { label: "Doctors", href: "/doctors", icon: Search },
    { label: "Book Doctor", href: "/book-doctor", icon: CalendarDays },
    { label: "Ambulance", href: "/ambulance", icon: Ambulance },
    { label: "Settings", href: "/settings", icon: Settings }
  ],
  doctor: [
    { label: "Dashboard", href: "/doctor", icon: LayoutDashboard },
    { label: "Appointments", href: "/doctor", icon: CalendarDays },
    { label: "Patients", href: "/doctor", icon: ClipboardList },
    { label: "Settings", href: "/settings", icon: Settings }
  ],
  ambulance_provider: [
    { label: "Dashboard", href: "/provider", icon: LayoutDashboard },
    { label: "Requests", href: "/provider", icon: Ambulance },
    { label: "Fleet", href: "/provider", icon: ClipboardList },
    { label: "Settings", href: "/settings", icon: Settings }
  ],
  admin: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Doctors", href: "/admin", icon: Stethoscope },
    { label: "Providers", href: "/admin", icon: Ambulance },
    { label: "Security", href: "/admin", icon: ShieldCheck },
    { label: "Settings", href: "/settings", icon: Settings }
  ]
};

export function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const { profile, signOut, setActiveRole } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const navItems = useMemo(() => (profile ? navByRole[profile.role] : navByRole.patient), [profile]);

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-slate-200 bg-white transition dark:border-slate-800 dark:bg-slate-950 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-18 items-center justify-between border-b border-slate-200 px-5 py-3 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-clinical-700 text-white">
              <HeartPulse size={22} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-lg font-black">MediRescue</span>
              <span className="block text-xs font-semibold text-clinical-700 dark:text-clinical-300">{roleLabel(profile.role)}</span>
            </span>
          </Link>
          <button className="grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className="grid gap-1 px-3 py-4" aria-label="Dashboard navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={`${item.href}-${item.label}`}
                to={item.href}
                end={item.href !== "/doctors"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-clinical-50 text-clinical-800 dark:bg-clinical-950/50 dark:text-clinical-100"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`
                }
              >
                <Icon size={18} aria-hidden="true" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-4 dark:border-slate-800">
          <button
            className="flex w-full items-center justify-between rounded-lg bg-slate-50 p-3 text-left dark:bg-slate-900"
            onClick={() => setRoleMenuOpen((current) => !current)}
            aria-expanded={roleMenuOpen}
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-clinical-700 text-sm font-bold text-white">
                {initials(profile.fullName)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold">{profile.fullName}</span>
                <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{profile.email}</span>
              </span>
            </span>
            <ChevronDown size={18} aria-hidden="true" />
          </button>
          {roleMenuOpen ? (
            <div className="mt-2 grid gap-1 rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-950">
              {(["patient", "doctor", "ambulance_provider", "admin"] as const).map((role) => (
                <button
                  key={role}
                  className="rounded-md px-3 py-2 text-left text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  onClick={() => {
                    void setActiveRole(role);
                    setRoleMenuOpen(false);
                  }}
                >
                  {roleLabel(role)}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/88 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/84 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button className="grid h-10 w-10 place-items-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu size={22} aria-hidden="true" />
            </button>
            <div>
              <p className="text-xs font-semibold uppercase text-clinical-700 dark:text-clinical-300">{roleLabel(profile.role)}</p>
              <h1 className="text-lg font-black text-slate-950 dark:text-white">Command center</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" onClick={toggleTheme} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}>
              {isDark ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}
            </Button>
            <Button variant="ghost" leftIcon={<LogOut size={18} aria-hidden="true" />} onClick={() => void signOut()}>
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
