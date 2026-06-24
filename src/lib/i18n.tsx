import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type Language = "en" | "fr" | "sw" | "es";

const dictionaries: Record<Language, Record<string, string>> = {
  en: {
    emergency: "Emergency",
    bookDoctor: "Book a Doctor",
    requestAmbulance: "Request Ambulance",
    dashboard: "Dashboard",
    notifications: "Notifications"
  },
  fr: {
    emergency: "Urgence",
    bookDoctor: "Reserver un medecin",
    requestAmbulance: "Demander une ambulance",
    dashboard: "Tableau de bord",
    notifications: "Notifications"
  },
  sw: {
    emergency: "Dharura",
    bookDoctor: "Weka Miadi na Daktari",
    requestAmbulance: "Omba Ambulansi",
    dashboard: "Dashibodi",
    notifications: "Arifa"
  },
  es: {
    emergency: "Emergencia",
    bookDoctor: "Reservar Doctor",
    requestAmbulance: "Solicitar Ambulancia",
    dashboard: "Panel",
    notifications: "Notificaciones"
  }
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof dictionaries.en) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem("medirescue-language");
    return stored === "fr" || stored === "sw" || stored === "es" ? stored : "en";
  });

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage: (nextLanguage) => {
        localStorage.setItem("medirescue-language", nextLanguage);
        setLanguage(nextLanguage);
      },
      t: (key) => dictionaries[language][key] ?? dictionaries.en[key] ?? key
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
