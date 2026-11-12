import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SupportedLanguage,
  TextDirection,
  TranslationDictionary,
  LanguageMetadata,
} from './types';
import { enTranslations } from './locales/en';
import { hiTranslations } from './locales/hi';
import { teTranslations } from './locales/te';

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageMetadata> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    defaultLocale: 'en-US',
    defaultTimezone: 'UTC',
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    direction: 'ltr',
    defaultLocale: 'hi-IN',
    defaultTimezone: 'Asia/Kolkata',
  },
  te: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    direction: 'ltr',
    defaultLocale: 'te-IN',
    defaultTimezone: 'Asia/Kolkata',
  },
};

const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: enTranslations,
  hi: hiTranslations,
  te: teTranslations,
};

interface I18nContextValue {
  language: SupportedLanguage;
  direction: TextDirection;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: keyof TranslationDictionary, fallback?: string) => string;
  formatLocalizedDateTime: (date: Date | number, explicitTimezone?: string) => string;
  activeTimezone: string;
  setTimezone: (tz: string) => void;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode; initialLanguage?: SupportedLanguage }> = ({
  children,
  initialLanguage = 'en',
}) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('assessiq_candidate_lang');
    return (saved as SupportedLanguage) || initialLanguage;
  });

  const [activeTimezone, setActiveTimezone] = useState<string>(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
    } catch {
      return 'UTC';
    }
  });

  const metadata = SUPPORTED_LANGUAGES[language] || SUPPORTED_LANGUAGES.en;
  const direction = metadata.direction;

  const setLanguage = (lang: SupportedLanguage) => {
    if (SUPPORTED_LANGUAGES[lang]) {
      setLanguageState(lang);
      localStorage.setItem('assessiq_candidate_lang', lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = SUPPORTED_LANGUAGES[lang].direction;
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [language, direction]);

  const t = (key: keyof TranslationDictionary, fallback?: string): string => {
    const dict = TRANSLATIONS[language] || enTranslations;
    return dict[key] || enTranslations[key] || fallback || String(key);
  };

  const formatLocalizedDateTime = (date: Date | number, explicitTimezone?: string): string => {
    const d = typeof date === 'number' ? new Date(date) : date;
    const tz = explicitTimezone || activeTimezone;
    try {
      const formatter = new Intl.DateTimeFormat(metadata.defaultLocale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
        timeZone: tz,
      });
      return formatter.format(d);
    } catch {
      return d.toUTCString();
    }
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        direction,
        setLanguage,
        t,
        formatLocalizedDateTime,
        activeTimezone,
        setTimezone: setActiveTimezone,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    // Fallback safe defaults if used outside provider
    return {
      language: 'en' as SupportedLanguage,
      direction: 'ltr' as TextDirection,
      setLanguage: () => {},
      t: (key: keyof TranslationDictionary, fallback?: string) => enTranslations[key] || fallback || String(key),
      formatLocalizedDateTime: (d: Date | number) => new Date(d).toLocaleString(),
      activeTimezone: 'UTC',
      setTimezone: () => {},
    };
  }
  return context;
};

export const useI18n = useTranslation;

/**
 * Drop-in Language Switcher UI Pill for Candidate Headers
 */
export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage, activeTimezone } = useTranslation();

  return (
    <div className={`flex items-center space-x-1.5 text-xs font-sans ${className}`}>
      <span className="text-[10px] font-mono text-[#64748B] hidden sm:inline">LANG:</span>
      {(['en', 'hi', 'te'] as SupportedLanguage[]).map((langCode) => {
        const isSelected = language === langCode;
        return (
          <button
            key={langCode}
            onClick={() => setLanguage(langCode)}
            className={`px-2 py-0.5 rounded-md font-bold text-[11px] transition-all ${
              isSelected
                ? 'bg-[#6C4DFF] text-white shadow-xs'
                : 'bg-white border border-[#CBD5E1] text-[#475569] hover:bg-[#F1F5F9]'
            }`}
          >
            {SUPPORTED_LANGUAGES[langCode].nativeName}
          </button>
        );
      })}
    </div>
  );
};

