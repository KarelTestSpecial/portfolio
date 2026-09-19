import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import nl from './nl.json';
import en from './en.json';

type Language = 'nl' | 'en';

const translations: Record<Language, Record<string, string>> = { nl, en };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function detectLanguage(): Language {
  const stored = localStorage.getItem('portfolio-lang');
  if (stored === 'nl' || stored === 'en') return stored;
  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith('nl') ? 'nl' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLangState] = useState<Language>(detectLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLangState(lang);
    localStorage.setItem('portfolio-lang', lang);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
