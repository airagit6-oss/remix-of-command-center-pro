import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useState } from 'react';

/**
 * HONEST LANGUAGE SWITCHER
 * Shows only 23 supported languages
 * Shows planned languages with "Coming Soon" badge
 */
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
];

const PLANNED_LANGUAGES = [
  { code: 'he', name: 'עברית', flag: '🇮🇱', status: 'coming' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷', status: 'coming' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰', status: 'coming' },
  { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼', status: 'coming' },
  { code: 'pt-PT', name: 'Português (PT)', flag: '🇵🇹', status: 'coming' },
];

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const currentLang = i18n.language;
  const currentLangName = SUPPORTED_LANGUAGES.find(l => l.code === currentLang)?.name || currentLang;

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('saashub_lang', lang);
    
    // Update document direction for RTL
    if (['ar', 'fa', 'ur', 'ps', 'he'].includes(lang)) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
    
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors"
        aria-label={t('language', { defaultValue: 'Language' })}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium uppercase">{currentLang}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-popover border rounded-md shadow-lg z-50">
          <div className="p-2 max-h-96 overflow-y-auto">
            {/* SUPPORTED LANGUAGES */}
            <div className="pb-2 border-b">
              <p className="text-xs font-semibold text-muted-foreground px-2 py-1">✅ FULLY SUPPORTED (23)</p>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left px-3 py-2 rounded-sm text-sm transition-colors flex items-center gap-2 ${
                    currentLang === lang.code
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>

            {/* PLANNED LANGUAGES */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-muted-foreground px-2 py-1">🔄 COMING SOON (5)</p>
              {PLANNED_LANGUAGES.map((lang) => (
                <div
                  key={lang.code}
                  className="w-full text-left px-3 py-2 rounded-sm text-sm text-muted-foreground flex items-center gap-2 opacity-50 cursor-not-allowed"
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded ml-auto">Soon</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
