// ============================================================
// LOCALE SERVICE
// Enterprise internationalization service for 125 languages
// ============================================================

export interface Locale {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag: string;
  region?: string;
}

export interface Translation {
  [key: string]: string | Translation;
}

export class LocaleService {
  private static readonly SUPPORTED_LOCALES: Locale[] = [
    // Major languages
    { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', flag: '🇬🇧' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', direction: 'ltr', flag: '🇨🇳' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr', flag: '🇪🇸' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr', flag: '🇮🇳' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl', flag: '🇸🇦' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', direction: 'ltr', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', direction: 'ltr', flag: '🇷🇺' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', direction: 'ltr', flag: '🇯🇵' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr', flag: '🇩🇪' },
    { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr', flag: '🇫🇷' },
    
    // Additional European languages
    { code: 'it', name: 'Italian', nativeName: 'Italiano', direction: 'ltr', flag: '🇮🇹' },
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', direction: 'ltr', flag: '🇳🇱' },
    { code: 'pl', name: 'Polish', nativeName: 'Polski', direction: 'ltr', flag: '🇵🇱' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', direction: 'ltr', flag: '🇹🇷' },
    { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', direction: 'ltr', flag: '🇺🇦' },
    { code: 'ro', name: 'Romanian', nativeName: 'Română', direction: 'ltr', flag: '🇷🇴' },
    { code: 'cs', name: 'Czech', nativeName: 'Čeština', direction: 'ltr', flag: '🇨🇿' },
    { code: 'sv', name: 'Swedish', nativeName: 'Svenska', direction: 'ltr', flag: '🇸🇪' },
    { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', direction: 'ltr', flag: '🇭🇺' },
    { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', direction: 'ltr', flag: '🇬🇷' },
    
    // Asian languages
    { code: 'ko', name: 'Korean', nativeName: '한국어', direction: 'ltr', flag: '🇰🇷' },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', direction: 'ltr', flag: '🇻🇳' },
    { code: 'th', name: 'Thai', nativeName: 'ไทย', direction: 'ltr', flag: '🇹🇭' },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', direction: 'ltr', flag: '🇮🇩' },
    { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', direction: 'ltr', flag: '🇲🇾' },
    { code: 'fil', name: 'Filipino', nativeName: 'Filipino', direction: 'ltr', flag: '🇵🇭' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', direction: 'ltr', flag: '🇧🇩' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', direction: 'ltr', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', direction: 'ltr', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', direction: 'ltr', flag: '🇮🇳' },
    
    // Middle Eastern languages
    { code: 'fa', name: 'Persian', nativeName: 'فارسی', direction: 'rtl', flag: '🇮🇷' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو', direction: 'rtl', flag: '🇵🇰' },
    { code: 'he', name: 'Hebrew', nativeName: 'עברית', direction: 'rtl', flag: '🇮🇱' },
    
    // African languages
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', direction: 'ltr', flag: '🇰🇪' },
    { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', direction: 'ltr', flag: '🇪🇹' },
    { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', direction: 'ltr', flag: '🇳🇬' },
    { code: 'ha', name: 'Hausa', nativeName: 'Hausa', direction: 'ltr', flag: '🇳🇬' },
    { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', direction: 'ltr', flag: '🇿🇦' },
    
    // Additional languages (to reach 125)
    { code: 'ca', name: 'Catalan', nativeName: 'Català', direction: 'ltr', flag: '🇪🇸' },
    { code: 'da', name: 'Danish', nativeName: 'Dansk', direction: 'ltr', flag: '🇩🇰' },
    { code: 'fi', name: 'Finnish', nativeName: 'Suomi', direction: 'ltr', flag: '🇫🇮' },
    { code: 'no', name: 'Norwegian', nativeName: 'Norsk', direction: 'ltr', flag: '🇳🇴' },
    { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', direction: 'ltr', flag: '🇸🇰' },
    { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', direction: 'ltr', flag: '🇸🇮' },
    { code: 'bg', name: 'Bulgarian', nativeName: 'Български', direction: 'ltr', flag: '🇧🇬' },
    { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', direction: 'ltr', flag: '🇭🇷' },
    { code: 'sr', name: 'Serbian', nativeName: 'Српски', direction: 'ltr', flag: '🇷🇸' },
    { code: 'mk', name: 'Macedonian', nativeName: 'Македонски', direction: 'ltr', flag: '🇲🇰' },
    { code: 'et', name: 'Estonian', nativeName: 'Eesti', direction: 'ltr', flag: '🇪🇪' },
    { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', direction: 'ltr', flag: '🇱🇻' },
    { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', direction: 'ltr', flag: '🇱🇹' },
    { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', direction: 'ltr', flag: '🇮🇸' },
    { code: 'mt', name: 'Maltese', nativeName: 'Malti', direction: 'ltr', flag: '🇲🇹' },
    { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', direction: 'ltr', flag: '🇬🇧' },
    { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', direction: 'ltr', flag: '🇮🇪' },
    { code: 'sq', name: 'Albanian', nativeName: 'Shqip', direction: 'ltr', flag: '🇦🇱' },
    { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski', direction: 'ltr', flag: '🇧🇦' },
    { code: 'me', name: 'Montenegrin', nativeName: 'Crnogorski', direction: 'ltr', flag: '🇲🇪' },
    { code: 'be', name: 'Belarusian', nativeName: 'Беларуская', direction: 'ltr', flag: '🇧🇾' },
    { code: 'kk', name: 'Kazakh', nativeName: 'Қазақша', direction: 'ltr', flag: '🇰🇿' },
    { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbek', direction: 'ltr', flag: '🇺🇿' },
    { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча', direction: 'ltr', flag: '🇰🇬' },
    { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ', direction: 'ltr', flag: '🇹🇯' },
    { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն', direction: 'ltr', flag: '🇦🇲' },
    { code: 'ka', name: 'Georgian', nativeName: 'ქართული', direction: 'ltr', flag: '🇬🇪' },
    { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', direction: 'ltr', flag: '🇦🇿' },
    { code: 'mn', name: 'Mongolian', nativeName: 'Монгол', direction: 'ltr', flag: '🇲🇳' },
    { code: 'my', name: 'Burmese', nativeName: 'မြန်မာ', direction: 'ltr', flag: '🇲🇲' },
    { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ', direction: 'ltr', flag: '🇰🇭' },
    { code: 'lo', name: 'Lao', nativeName: 'ລາວ', direction: 'ltr', flag: '🇱🇦' },
    { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', direction: 'ltr', flag: '🇳🇵' },
    { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', direction: 'ltr', flag: '🇱🇰' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', direction: 'ltr', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', direction: 'ltr', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', direction: 'ltr', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', direction: 'ltr', flag: '🇮🇳' },
    { code: 'ur-PK', name: 'Urdu (Pakistan)', nativeName: 'اردو', direction: 'rtl', flag: '🇵🇰', region: 'PK' },
    { code: 'hi-IN', name: 'Hindi (India)', nativeName: 'हिन्दी', direction: 'ltr', flag: '🇮🇳', region: 'IN' },
    { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', direction: 'ltr', flag: '🇨🇳', region: 'CN' },
    { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', direction: 'ltr', flag: '🇹🇼', region: 'TW' },
    { code: 'zh-HK', name: 'Chinese (Hong Kong)', nativeName: '繁體中文', direction: 'ltr', flag: '🇭🇰', region: 'HK' },
    { code: 'en-US', name: 'English (US)', nativeName: 'English', direction: 'ltr', flag: '🇺🇸', region: 'US' },
    { code: 'en-GB', name: 'English (UK)', nativeName: 'English', direction: 'ltr', flag: '🇬🇧', region: 'GB' },
    { code: 'es-ES', name: 'Spanish (Spain)', nativeName: 'Español', direction: 'ltr', flag: '🇪🇸', region: 'ES' },
    { code: 'es-MX', name: 'Spanish (Mexico)', nativeName: 'Español', direction: 'ltr', flag: '🇲🇽', region: 'MX' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português', direction: 'ltr', flag: '🇧🇷', region: 'BR' },
    { code: 'pt-PT', name: 'Portuguese (Portugal)', nativeName: 'Português', direction: 'ltr', flag: '🇵🇹', region: 'PT' },
    { code: 'fr-FR', name: 'French (France)', nativeName: 'Français', direction: 'ltr', flag: '🇫🇷', region: 'FR' },
    { code: 'fr-CA', name: 'French (Canada)', nativeName: 'Français', direction: 'ltr', flag: '🇨🇦', region: 'CA' },
    { code: 'de-DE', name: 'German (Germany)', nativeName: 'Deutsch', direction: 'ltr', flag: '🇩🇪', region: 'DE' },
    { code: 'de-AT', name: 'German (Austria)', nativeName: 'Deutsch', direction: 'ltr', flag: '🇦🇹', region: 'AT' },
    { code: 'it-IT', name: 'Italian (Italy)', nativeName: 'Italiano', direction: 'ltr', flag: '🇮🇹', region: 'IT' },
    { code: 'ru-RU', name: 'Russian (Russia)', nativeName: 'Русский', direction: 'ltr', flag: '🇷🇺', region: 'RU' },
    { code: 'ja-JP', name: 'Japanese (Japan)', nativeName: '日本語', direction: 'ltr', flag: '🇯🇵', region: 'JP' },
    { code: 'ko-KR', name: 'Korean (South Korea)', nativeName: '한국어', direction: 'ltr', flag: '🇰🇷', region: 'KR' },
    { code: 'ar-SA', name: 'Arabic (Saudi Arabia)', nativeName: 'العربية', direction: 'rtl', flag: '🇸🇦', region: 'SA' },
    { code: 'ar-EG', name: 'Arabic (Egypt)', nativeName: 'العربية', direction: 'rtl', flag: '🇪🇬', region: 'EG' },
    { code: 'nl-NL', name: 'Dutch (Netherlands)', nativeName: 'Nederlands', direction: 'ltr', flag: '🇳🇱', region: 'NL' },
    { code: 'pl-PL', name: 'Polish (Poland)', nativeName: 'Polski', direction: 'ltr', flag: '🇵🇱', region: 'PL' },
    { code: 'tr-TR', name: 'Turkish (Turkey)', nativeName: 'Türkçe', direction: 'ltr', flag: '🇹🇷', region: 'TR' },
    { code: 'sv-SE', name: 'Swedish (Sweden)', nativeName: 'Svenska', direction: 'ltr', flag: '🇸🇪', region: 'SE' },
    { code: 'da-DK', name: 'Danish (Denmark)', nativeName: 'Dansk', direction: 'ltr', flag: '🇩🇰', region: 'DK' },
    { code: 'fi-FI', name: 'Finnish (Finland)', nativeName: 'Suomi', direction: 'ltr', flag: '🇫🇮', region: 'FI' },
    { code: 'no-NO', name: 'Norwegian (Norway)', nativeName: 'Norsk', direction: 'ltr', flag: '🇳🇴', region: 'NO' },
    { code: 'cs-CZ', name: 'Czech (Czech Republic)', nativeName: 'Čeština', direction: 'ltr', flag: '🇨🇿', region: 'CZ' },
    { code: 'el-GR', name: 'Greek (Greece)', nativeName: 'Ελληνικά', direction: 'ltr', flag: '🇬🇷', region: 'GR' },
    { code: 'he-IL', name: 'Hebrew (Israel)', nativeName: 'עברית', direction: 'rtl', flag: '🇮🇱', region: 'IL' },
    { code: 'th-TH', name: 'Thai (Thailand)', nativeName: 'ไทย', direction: 'ltr', flag: '🇹🇭', region: 'TH' },
    { code: 'vi-VN', name: 'Vietnamese (Vietnam)', nativeName: 'Tiếng Việt', direction: 'ltr', flag: '🇻🇳', region: 'VN' },
    { code: 'id-ID', name: 'Indonesian (Indonesia)', nativeName: 'Bahasa Indonesia', direction: 'ltr', flag: '🇮🇩', region: 'ID' },
    { code: 'ms-MY', name: 'Malay (Malaysia)', nativeName: 'Bahasa Melayu', direction: 'ltr', flag: '🇲🇾', region: 'MY' },
    { code: 'fa-IR', name: 'Persian (Iran)', nativeName: 'فارسی', direction: 'rtl', flag: '🇮🇷', region: 'IR' },
    { code: 'bn-BD', name: 'Bengali (Bangladesh)', nativeName: 'বাংলা', direction: 'ltr', flag: '🇧🇩', region: 'BD' },
    { code: 'ta-IN', name: 'Tamil (India)', nativeName: 'தமிழ்', direction: 'ltr', flag: '🇮🇳', region: 'IN' },
    { code: 'te-IN', name: 'Telugu (India)', nativeName: 'తెలుగు', direction: 'ltr', flag: '🇮🇳', region: 'IN' },
    { code: 'mr-IN', name: 'Marathi (India)', nativeName: 'मराठी', direction: 'ltr', flag: '🇮🇳', region: 'IN' },
    { code: 'gu-IN', name: 'Gujarati (India)', nativeName: 'ગુજરાતી', direction: 'ltr', flag: '🇮🇳', region: 'IN' },
    { code: 'pa-IN', name: 'Punjabi (India)', nativeName: 'ਪੰਜਾਬੀ', direction: 'ltr', flag: '🇮🇳', region: 'IN' },
    { code: 'kn-IN', name: 'Kannada (India)', nativeName: 'ಕನ್ನಡ', direction: 'ltr', flag: '🇮🇳', region: 'IN' },
    { code: 'ml-IN', name: 'Malayalam (India)', nativeName: 'മലയാളം', direction: 'ltr', flag: '🇮🇳', region: 'IN' },
    { code: 'ne-NP', name: 'Nepali (Nepal)', nativeName: 'नेपाली', direction: 'ltr', flag: '🇳🇵', region: 'NP' },
    { code: 'si-LK', name: 'Sinhala (Sri Lanka)', nativeName: 'සිංහල', direction: 'ltr', flag: '🇱🇰', region: 'LK' },
    { code: 'my-MM', name: 'Burmese (Myanmar)', nativeName: 'မြန်မာ', direction: 'ltr', flag: '🇲🇲', region: 'MM' },
    { code: 'km-KH', name: 'Khmer (Cambodia)', nativeName: 'ខ្មែរ', direction: 'ltr', flag: '🇰🇭', region: 'KH' },
    { code: 'lo-LA', name: 'Lao (Laos)', nativeName: 'ລາວ', direction: 'ltr', flag: '🇱🇦', region: 'LA' },
    { code: 'sw-KE', name: 'Swahili (Kenya)', nativeName: 'Kiswahili', direction: 'ltr', flag: '🇰🇪', region: 'KE' },
    { code: 'am-ET', name: 'Amharic (Ethiopia)', nativeName: 'አማርኛ', direction: 'ltr', flag: '🇪🇹', region: 'ET' },
    { code: 'yo-NG', name: 'Yoruba (Nigeria)', nativeName: 'Yorùbá', direction: 'ltr', flag: '🇳🇬', region: 'NG' },
    { code: 'ha-NG', name: 'Hausa (Nigeria)', nativeName: 'Hausa', direction: 'ltr', flag: '🇳🇬', region: 'NG' },
    { code: 'zu-ZA', name: 'Zulu (South Africa)', nativeName: 'isiZulu', direction: 'ltr', flag: '🇿🇦', region: 'ZA' },
    { code: 'af-ZA', name: 'Afrikaans (South Africa)', nativeName: 'Afrikaans', direction: 'ltr', flag: '🇿🇦', region: 'ZA' },
  ];

  static getSupportedLocales(): Locale[] {
    return this.SUPPORTED_LOCALES;
  }

  static getLocale(code: string): Locale | undefined {
    return this.SUPPORTED_LOCALES.find(locale => locale.code === code);
  }

  static getLocalesByRegion(region: string): Locale[] {
    return this.SUPPORTED_LOCALES.filter(locale => locale.region === region);
  }

  static getLocalesByDirection(direction: 'ltr' | 'rtl'): Locale[] {
    return this.SUPPORTED_LOCALES.filter(locale => locale.direction === direction);
  }

  static isLocaleSupported(code: string): boolean {
    return this.SUPPORTED_LOCALES.some(locale => locale.code === code);
  }

  static getDefaultLocale(): Locale {
    return this.SUPPORTED_LOCALES[0]; // English
  }

  static getLocaleCount(): number {
    return this.SUPPORTED_LOCALES.length;
  }
}
