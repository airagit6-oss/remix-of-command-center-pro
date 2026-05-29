import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Get stored locale or default to 'en'
const getStoredLocale = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('app-locale') || 'en';
  }
  return 'en';
};

// Store locale preference
export const setStoredLocale = (locale: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('app-locale', locale);
  }
};

// Available locales
export const availableLocales = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ar'];

// RTL locales
export const rtlLocales = ['ar', 'he', 'fa', 'ur'];

// Check if locale is RTL
export const isRTLLocale = (locale: string) => rtlLocales.includes(locale);

// Initialize i18n
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: getStoredLocale(),
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'app-locale',
    },
    react: {
      useSuspense: false,
    },
    load: 'languageOnly',
    ns: ['common'],
    defaultNS: 'common',
  });

// Listen for language changes and update document
i18n.on('languageChanged', (lng) => {
  setStoredLocale(lng);
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
    document.documentElement.dir = isRTLLocale(lng) ? 'rtl' : 'ltr';
  }
});

// Set initial direction
if (typeof document !== 'undefined') {
  const currentLng = i18n.language || getStoredLocale();
  document.documentElement.lang = currentLng;
  document.documentElement.dir = isRTLLocale(currentLng) ? 'rtl' : 'ltr';
}

export default i18n;
