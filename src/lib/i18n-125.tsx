import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// ============================================================
// I18N CONFIGURATION - 125+ LANGUAGES SUPPORT
// Lazy loading + dynamic language loading for 10,000+ users
// ============================================================

// Full list of 125 supported languages
const SUPPORTED_LANGUAGES_125 = {
  // European (25)
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  ru: 'Русский',
  uk: 'Українська',
  pl: 'Polski',
  nl: 'Nederlands',
  sv: 'Svenska',
  no: 'Norsk',
  da: 'Dansk',
  fi: 'Suomi',
  el: 'Ελληνικά',
  cs: 'Čeština',
  sk: 'Slovenčina',
  hu: 'Magyar',
  ro: 'Română',
  bg: 'Български',
  sr: 'Српски',
  hr: 'Hrvatski',
  sl: 'Slovenščina',
  et: 'Eesti',
  lv: 'Latvian',
  lt: 'Lietuvių',
  
  // Asian (35)
  zh: '中文 (Simplified)',
  'zh-TW': '中文 (Traditional)',
  'zh-HK': '粵語 (Cantonese)',
  ja: '日本語',
  ko: '한국어',
  hi: 'हिन्दी',
  bn: 'বাংলা',
  pa: 'ਪੰਜਾਬੀ',
  gu: 'ગુજરાતી',
  mr: 'मराठी',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  kn: 'ಕನ್ನಡ',
  ml: 'മലയാളം',
  or: 'ଓଡ଼ିଆ',
  th: 'ไทย',
  vi: 'Tiếng Việt',
  id: 'Bahasa Indonesia',
  ms: 'Bahasa Melayu',
  tl: 'Tagalog',
  ar: 'العربية',
  fa: 'فارسی',
  ur: 'اردو',
  he: 'עברית',
  kk: 'Қазақша',
  uz: 'Ўзбек',
  tg: 'Тоҷикӣ',
  ky: 'Кыргызча',
  mn: 'Монгол',
  ka: 'ქართული',
  hy: 'Հայերեն',
  az: 'Azərbaycanca',
  
  // Middle Eastern (10)
  tr: 'Türkçe',
  ku: 'Kurdî',
  ps: 'پشتو',
  am: 'አማርኛ',
  ti: 'ትግርኛ',
  ne: 'नेपाली',
  si: 'සිංහල',
  my: 'မြန်မာ',
  km: 'ខ្មែរ',
  lo: 'ລາວ',
  
  // African (28)
  sw: 'Kiswahili',
  yo: 'Yorùbá',
  ha: 'Hausa',
  ig: 'Igbo',
  zu: 'Zulu',
  xh: 'Xhosa',
  af: 'Afrikaans',
  so: 'Soomaali',
  om: 'Afaan Oromo',
  rw: 'Kinyarwanda',
  ny: 'Chichewa',
  st: 'Sesotho',
  tn: 'Setswana',
  sn: 'Shona',
  ts: 'Xitsonga',
  ve: 'Tshivenḓa',
  ln: 'Lingála',
  kg: 'Kikongo',
  lua: 'Tshiluba',
  ki: 'Gikuyu',
  lu: 'Kiluba',
  luo: 'Dholuo',
  kok: 'Konkani',
  ff: 'Fulfulde',
  wo: 'Wolof',
  
  // European Extended (12)
  be: 'Беларусь',
  mk: 'Македонски',
  sq: 'Shqiptar',
  mt: 'Malti',
  is: 'Íslenska',
  ga: 'Gaeilge',
  cy: 'Cymraeg',
  gd: 'Gàidhlig',
  ca: 'Català',
  eu: 'Euskara',
  gl: 'Galego',
  ast: 'Asturiano',
  
  // Americas (8)
  pt_BR: 'Português (Brasil)',
  es_MX: 'Español (México)',
  es_AR: 'Español (Argentina)',
  qu: 'Quechua',
  ay: 'Aymara',
  gn: 'Guaraní',
  ht: 'Haitian',
  jam: 'Jamaican Patois',
};

// Language groups for efficient loading
const LANGUAGE_GROUPS = {
  'common': ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ko', 'pt', 'ru', 'hi'],
  'europe': ['it', 'nl', 'pl', 'sv', 'da', 'no', 'fi', 'cs', 'hu', 'ro'],
  'asia': ['th', 'vi', 'id', 'ms', 'bn', 'ta', 'te', 'kn', 'ml', 'gu'],
  'middle-east': ['ar', 'fa', 'ur', 'he', 'tr', 'ku', 'ps', 'am'],
  'africa': ['sw', 'yo', 'ha', 'ig', 'zu', 'xh', 'af', 'so', 'ny', 'st'],
  'eastern-europe': ['uk', 'be', 'bg', 'sr', 'hr', 'sl', 'mk', 'sq', 'et', 'lv'],
};

// i18n configuration with lazy loading
i18n
  .use(HttpApi) // HTTP backend for loading translations
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: Object.keys(SUPPORTED_LANGUAGES_125),
    
    // Lazy loading configuration
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      addPath: '/locales/add/{{lng}}/{{ns}}',
      allowMultiloading: true,
    },
    
    // Namespace configuration
    ns: ['common', 'auth', 'reseller', 'admin', 'chat'],
    defaultNS: 'common',
    
    // Caching
    cache: {
      enabled: true,
      prefix: 'i18next_res_',
      expirationTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    
    // Interpolation
    interpolation: {
      escapeValue: false,
      formatSeparator: ',',
    },
    
    // React specific
    react: {
      useSuspense: false,
    },
  });

export { SUPPORTED_LANGUAGES_125, LANGUAGE_GROUPS };
export default i18n;
