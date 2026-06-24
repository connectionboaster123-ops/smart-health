import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
  setDark: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(() => localStorage.getItem("medirescue-theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("medirescue-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      isDark,
      toggleTheme: () => setIsDark((current) => !current),
      setDark: setIsDark
    }),
    [isDark]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
