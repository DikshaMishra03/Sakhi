// src/context/LangContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { LangCode, translations, t as translate } from '@/i18n/translations';

interface LangContextType {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: (key: keyof typeof translations['en']) => string;
}

const LangContext = createContext<LangContextType>({
  lang: 'en', setLang: () => {}, t: (k) => k,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(
    () => (localStorage.getItem('sakhi_lang') as LangCode) || 'en'
  );

  const setLang = (l: LangCode) => {
    setLangState(l);
    localStorage.setItem('sakhi_lang', l);
  };

  const t = (key: keyof typeof translations['en']) => translate(lang, key);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
