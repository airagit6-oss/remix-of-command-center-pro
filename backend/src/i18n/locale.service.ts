// ============================================================
// LOCALE SERVICE
// HONEST LANGUAGE SUPPORT - Only 23 fully supported languages
// ============================================================

export interface Locale {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag: string;
  region?: string;
  status: 'supported' | 'fallback' | 'planned'; // NEW: Honest status
}

export interface Translation {
  [key: string]: string | Translation;
}

export class LocaleService {
  /**
   * PHASE 1: HONEST LANGUAGE SUPPORT
   * Only 23 languages fully translated (100%)
   * Others will fallback silently to English with notification
   */
  private static readonly SUPPORTED_LOCALES: Locale[] = [
    // TIER 1: Fully Supported & Translated (23 languages)
    { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', flag: '🇬🇧', status: 'supported' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr', flag: '🇪🇸', status: 'supported' },
    { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', direction: 'ltr', flag: '🇨🇳', status: 'supported' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr', flag: '🇮🇳', status: 'supported' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl', flag: '🇸🇦', status: 'supported' },
    { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr', flag: '🇫🇷', status: 'supported' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr', flag: '🇩🇪', status: 'supported' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', direction: 'ltr', flag: '🇧🇷', status: 'supported' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', direction: 'ltr', flag: '🇯🇵', status: 'supported' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', direction: 'ltr', flag: '🇷🇺', status: 'supported' },
    { code: 'ko', name: 'Korean', nativeName: '한국어', direction: 'ltr', flag: '🇰🇷', status: 'supported' },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', direction: 'ltr', flag: '🇮🇩', status: 'supported' },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', direction: 'ltr', flag: '🇻🇳', status: 'supported' },
    { code: 'th', name: 'Thai', nativeName: 'ไทย', direction: 'ltr', flag: '🇹🇭', status: 'supported' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', direction: 'ltr', flag: '🇹🇷', status: 'supported' },
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', direction: 'ltr', flag: '🇳🇱', status: 'supported' },
    { code: 'pl', name: 'Polish', nativeName: 'Polski', direction: 'ltr', flag: '🇵🇱', status: 'supported' },
    { code: 'ro', name: 'Romanian', nativeName: 'Română', direction: 'ltr', flag: '🇷🇴', status: 'supported' },
    { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', direction: 'ltr', flag: '🇬🇷', status: 'supported' },
    { code: 'sv', name: 'Swedish', nativeName: 'Svenska', direction: 'ltr', flag: '🇸🇪', status: 'supported' },
    { code: 'no', name: 'Norwegian', nativeName: 'Norsk', direction: 'ltr', flag: '🇳🇴', status: 'supported' },
    { code: 'da', name: 'Danish', nativeName: 'Dansk', direction: 'ltr', flag: '🇩🇰', status: 'supported' },
    { code: 'fi', name: 'Finnish', nativeName: 'Suomi', direction: 'ltr', flag: '🇫🇮', status: 'supported' },
  ];

  /**
   * TIER 2: Planned (shown in dropdown but with "Coming Soon" badge)
   * These will have placeholder support with fallback notification
   */
  private static readonly PLANNED_LOCALES: Locale[] = [
    { code: 'he', name: 'Hebrew', nativeName: 'עברית', direction: 'rtl', flag: '🇮🇱', status: 'planned' },
    { code: 'fa', name: 'Persian', nativeName: 'فارسی', direction: 'rtl', flag: '🇮🇷', status: 'planned' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو', direction: 'rtl', flag: '🇵🇰', status: 'planned' },
    { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', direction: 'ltr', flag: '🇹🇼', status: 'planned' },
    { code: 'pt-PT', name: 'Portuguese (Portugal)', nativeName: 'Português (Portugal)', direction: 'ltr', flag: '🇵🇹', status: 'planned' },
  ];

  static getSupportedLocales(): Locale[] {
    // Return only SUPPORTED locales (23)
    return this.SUPPORTED_LOCALES;
  }

  static getAllLocales(): Locale[] {
    // Return BOTH supported + planned (28)
    // Frontend can mark planned ones with "Coming Soon"
    return [...this.SUPPORTED_LOCALES, ...this.PLANNED_LOCALES];
  }

  static getLocale(code: string): Locale | undefined {
    const normalized = code.toLowerCase();
    return this.getAllLocales().find(l => l.code.toLowerCase() === normalized);
  }

  static isRTL(code: string): boolean {
    const locale = this.getLocale(code);
    return locale?.direction === 'rtl' || false;
  }

  static isSupported(code: string): boolean {
    const locale = this.getLocale(code);
    return locale?.status === 'supported' || false;
  }

  static getStatus(code: string): 'supported' | 'fallback' | 'planned' {
    const locale = this.getLocale(code);
    return locale?.status || 'fallback';
  }
}
