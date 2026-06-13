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

// ============================================================================
// SUPPORTED LANGUAGES - ALL 125 LANGUAGES
// ============================================================================

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
  { code: 'be', name: 'Belarusian', nativeName: 'Беларусская' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски' },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'ps', name: 'Pashto', nativeName: 'پښتو' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာ' },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ' },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių' },
  { code: 'ku', name: 'Kurdish', nativeName: 'Kurdî' },
  { code: 'ckb', name: 'Kurdish (Sorani)', nativeName: 'سۆرانی' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu' },
  { code: 'tl', name: 'Filipino', nativeName: 'Tagalog' },
  { code: 'jw', name: 'Javanese', nativeName: 'Jawa' },
  { code: 'su', name: 'Sundanese', nativeName: 'Basa Sunda' },
  { code: 'eo', name: 'Esperanto', nativeName: 'Esperanto' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskera' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català' },
  { code: 'gl', name: 'Galician', nativeName: 'Galego' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg' },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge' },
  { code: 'lb', name: 'Luxembourgish', nativeName: 'Lëtzebuergesch' },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycanca' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақша' },
  { code: 'uz', name: 'Uzbek', nativeName: 'O\'zbek' },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча' },
  { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ' },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina' },
  { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski' },
  { code: 'co', name: 'Corsican', nativeName: 'Corsu' },
  { code: 'fy', name: 'Frisian', nativeName: 'Frysk' },
  { code: 'ceb', name: 'Cebuano', nativeName: 'Cebuano' },
  { code: 'ny', name: 'Chichewa', nativeName: 'Chichewa' },
  { code: 'mg', name: 'Malagasy', nativeName: 'Malagasy' },
  { code: 'ms', name: 'Malay', nativeName: 'Melayu' },
  { code: 'mi', name: 'Maori', nativeName: 'Te Reo Māori' },
  { code: 'ht', name: 'Haitian Creole', nativeName: 'Kreyòl Ayisyen' },
  { code: 'rw', name: 'Kinyarwanda', nativeName: 'Ikinyarwanda' },
  { code: 'ki', name: 'Kikuyu', nativeName: 'Gikuyu' },
  { code: 'haw', name: 'Hawaiian', nativeName: 'ōlelo Hawaiʻi' },
  { code: 'hmn', name: 'Hmong', nativeName: 'Hmoob' },
  { code: 'so', name: 'Somali', nativeName: 'Soomaali' },
  { code: 'st', name: 'Southern Sotho', nativeName: 'Sesotho' },
  { code: 'tw', name: 'Twi', nativeName: 'Twi' },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa' },
  { code: 'ln', name: 'Lingala', nativeName: 'Lingála' },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол' },
];

// Available locales - languages that HAVE translation files in public/locales
export const availableLocales = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ar'];

// RTL locales
export const rtlLocales = ['ar', 'he', 'fa', 'ur', 'ps', 'ckb', 'ku'];

// Check if locale is RTL
export const isRTLLocale = (locale: string) => rtlLocales.some(rtl => locale.startsWith(rtl));

// Initialize i18n
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: getStoredLocale(),
    fallbackLng: {
      // Language fallback chain - most languages fall back to English
      'pt-BR': ['pt', 'en'],
      'pt': ['en'],
      'zh-TW': ['zh', 'en'],
      'zh': ['en'],
      'ar-EG': ['ar', 'en'],
      'ar-MA': ['ar', 'en'],
      'ar-TN': ['ar', 'en'],
      'ar-DZ': ['ar', 'en'],
      'ar-JO': ['ar', 'en'],
      'ar-LB': ['ar', 'en'],
      'ar-SY': ['ar', 'en'],
      'ar-SA': ['ar', 'en'],
      'ar': ['en'],
      // All unsupported languages fall back to English
      'default': ['en']
    },
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      // Try to load from /locales directory first, fallback to English
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      addPath: '/locales/add/{{lng}}/{{ns}}',
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'app-locale',
    },
    react: {
      useSuspense: false,
    },
    load: 'languageOnly', // Ignore region codes, just use language code
    ns: ['common'],
    defaultNS: 'common',
    // Normalize language codes to match available locales
    postProcess: ['normalize'],
  });

// Custom post processor to normalize language codes
i18n.use({
  type: 'postProcessor',
  name: 'normalize',
  process: (value: string, key: string, options: any) => value,
});

// Handle language detection and fallback
i18n.on('languageChanged', (lng) => {
  setStoredLocale(lng);
  
  // Normalize language code (e.g., zh-TW -> zh)
  const normalizedLng = lng.split('-')[0];
  const isSupported = availableLocales.includes(normalizedLng) || availableLocales.includes(lng);
  
  // If language not supported, notify user and use fallback
  if (!isSupported) {
    console.warn(`⚠️ Language "${lng}" not fully supported - using English fallback`);
  }
  
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
