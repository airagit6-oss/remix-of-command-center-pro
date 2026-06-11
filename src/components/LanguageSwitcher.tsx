import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useState } from 'react';
import { SUPPORTED_LANGUAGES } from '../lib/i18n';

/**
 * LANGUAGE SWITCHER - ALL 125 LANGUAGES
 * Now showing all 125 supported languages from i18n configuration
 */
export function LanguageSwitcher() {
  const { i18n, t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const currentLang = i18n.language;
  const currentLangName = SUPPORTED_LANGUAGES.find(l => l.code === currentLang)?.name || currentLang;

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('saashub_lang', lang);
    
    // Update document direction for RTL languages
    const rtlLanguages = ['ar', 'ar-EG', 'ar-MA', 'ar-TN', 'ar-DZ', 'ar-JO', 'ar-LB', 'ar-SY', 'ar-SA', 'fa', 'ur', 'ps', 'he', 'ku', 'ckb'];
    if (rtlLanguages.some(rtlLang => lang.startsWith(rtlLang))) {
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
        <div className="absolute right-0 mt-2 w-72 bg-popover border rounded-md shadow-lg z-50">
          <div className="p-3 max-h-96 overflow-y-auto">
            {/* ALL 125 LANGUAGES */}
            <p className="text-xs font-semibold text-muted-foreground px-2 py-2 sticky top-0 bg-popover">
              🌍 ALL {SUPPORTED_LANGUAGES.length} LANGUAGES
            </p>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-3 py-2 rounded-sm text-sm transition-colors ${
                  currentLang === lang.code
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
              >
                <span className="font-medium">{lang.name}</span>
                <span className="text-xs text-muted-foreground ml-2">({lang.code})</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
