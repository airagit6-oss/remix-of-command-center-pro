import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, X } from 'lucide-react';

/**
 * HONEST NOTIFICATION: Show when language falls back to English
 * User is aware that their selected language isn't fully supported
 */
export function LanguageFallbackNotification() {
  const { i18n, t } = useTranslation('common');
  const [showNotification, setShowNotification] = useState(false);
  const supportedLanguages = ['en', 'es', 'zh-CN', 'hi', 'ar', 'fr', 'de', 'pt-BR', 'ja', 'ru', 'ko', 'id', 'vi', 'th', 'tr', 'nl', 'pl', 'ro', 'el', 'sv', 'no', 'da', 'fi'];

  useEffect(() => {
    const currentLang = i18n.language;
    const isSupported = supportedLanguages.includes(currentLang);
    const hasSeenNotification = localStorage.getItem(`language_fallback_${currentLang}`);

    if (!isSupported && !hasSeenNotification) {
      setShowNotification(true);
      localStorage.setItem(`language_fallback_${currentLang}`, 'true');
    }
  }, [i18n.language]);

  if (!showNotification) return null;

  return (
    <div className="fixed top-16 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md shadow-lg z-50 animate-in slide-in-from-top-2">
      <div className="flex gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-900">{t('coming_soon')}</h3>
          <p className="text-sm text-yellow-800 mt-1">
            {t('language_not_available')} Supported languages: English, Spanish, Chinese, Hindi, Arabic, French, German, Portuguese, Japanese, Russian, Korean, Indonesian, Vietnamese, Thai, Turkish, Dutch, Polish, Romanian, Greek, Swedish, Norwegian, Danish, Finnish.
          </p>
        </div>
        <button
          onClick={() => setShowNotification(false)}
          className="flex-shrink-0 text-yellow-600 hover:text-yellow-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
