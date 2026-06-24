import { Link, NavLink } from "react-router-dom";
import { Ambulance, HeartPulse, LogIn, Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { roleHomePath } from "../../lib/utils";

const navItems = [
  { label: "Doctors", href: "/doctors" },
  { label: "Ambulance", href: "/ambulance" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "FAQ", href: "/#faq" }
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const { profile } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/86 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/82">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="MediRescue home">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-clinical-700 text-white shadow-soft">
            <HeartPulse aria-hidden="true" size={24} />
          </span>
          <span>
            <span className="block text-lg font-black text-slate-950 dark:text-white">MediRescue</span>
            <span className="block text-xs font-semibold text-clinical-700 dark:text-clinical-300">Rapid care network</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Public navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className="text-sm font-semibold text-slate-600 transition hover:text-clinical-700 dark:text-slate-300 dark:hover:text-clinical-300"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}
          </Button>
          <Button variant="danger" leftIcon={<Ambulance size={18} aria-hidden="true" />} onClick={() => window.location.assign("/ambulance")}>
            SOS
          </Button>
          <Link to={profile ? roleHomePath(profile.role) : "/auth"}>
            <Button variant="primary" leftIcon={<LogIn size={18} aria-hidden="true" />}>
              {profile ? "Dashboard" : "Login"}
            </Button>
          </Link>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={23} aria-hidden="true" /> : <Menu size={23} aria-hidden="true" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <nav className="grid gap-2" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button variant="ghost" onClick={toggleTheme} leftIcon={isDark ? <Sun size={18} /> : <Moon size={18} />}>
              Theme
            </Button>
            <Link to={profile ? roleHomePath(profile.role) : "/auth"}>
              <Button className="w-full" leftIcon={<LogIn size={18} />}>
                {profile ? "Dashboard" : "Login"}
              </Button>
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
