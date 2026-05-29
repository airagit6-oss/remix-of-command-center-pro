import { useTranslation } from 'react-i18next';
import { availableLocales, isRTLLocale, setStoredLocale } from '@/lib/i18n';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation('common');
  const currentLang = i18n.language || 'en';

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setStoredLocale(lang);
    
    // Update document direction for RTL
    if (isRTLLocale(lang)) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  return (
    <div className="relative group">
      <button 
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors"
        aria-label={t('language', { defaultValue: 'Language' })}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium uppercase">{currentLang}</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-popover border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div className="p-1">
          {availableLocales.map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`w-full text-left px-3 py-2 rounded-sm text-sm transition-colors ${
                currentLang === lang 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-accent'
              }`}
            >
              {t(`lang_${lang}`, { defaultValue: lang.toUpperCase() })}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
