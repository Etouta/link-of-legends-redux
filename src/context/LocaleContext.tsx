
import React, { createContext, useContext, useState, ReactNode } from "react";
import { translations } from "../locales/translations";

type Lang = "en" | "fr";
type LocaleContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: keyof typeof translations["en"], vars?: Record<string, any>) => string;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("LocaleContext not found");
  return context;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  function t(key: keyof typeof translations["en"], vars?: Record<string, any>) {
    let text = translations[lang][key] || translations.en[key] || key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  }
  return (
    <LocaleContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LocaleContext.Provider>
  );
}
