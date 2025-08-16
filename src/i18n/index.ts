import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import bundled JSON (typed as any to keep tsconfig strict flags happy)
import enCommon from './locales/en/common.json';
import heCommon from './locales/he/common.json';

i18n
  .use(LanguageDetector)      // detects from localStorage, navigator, etc.
  .use(initReactI18next)      // hooks for React
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'he'],
    defaultNS: 'common',
    resources: {
      en: { common: enCommon as any },
      he: { common: heCommon as any },
    },
    interpolation: { escapeValue: false },
    detection: {
      // Persist the user choice
      caches: ['localStorage'],
      order: ['localStorage', 'navigator'],
    },
  });

export default i18n;
