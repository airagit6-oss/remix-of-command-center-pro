// ============================================================
// TRANSLATION SERVICE
// Enterprise translation service with caching
// ============================================================

import { LocaleService, Translation } from './locale.service';
import { productCache } from '../cache/cache.service';

export class TranslationService {
  private static translations: Map<string, Translation> = new Map();
  private static cachePrefix = 'translation:';

  static async loadTranslations(localeCode: string): Promise<Translation> {
    const cacheKey = `${this.cachePrefix}${localeCode}`;
    
    // Try to get from cache first
    const cached = await productCache.get<Translation>(cacheKey);
    if (cached) {
      return cached;
    }

    // Load from database or file system
    const translations = await this.loadTranslationsFromSource(localeCode);
    
    // Cache for 1 hour
    await productCache.set(cacheKey, translations, 3600);
    
    return translations;
  }

  private static async loadTranslationsFromSource(localeCode: string): Promise<Translation> {
    // TODO: Implement actual loading from database or JSON files
    // For now, return empty object
    return {};
  }

  static async translate(
    key: string,
    localeCode: string = 'en',
    params?: Record<string, string | number>
  ): Promise<string> {
    const translations = await this.loadTranslations(localeCode);
    const value = this.getNestedValue(translations, key);
    
    if (!value) {
      // Fallback to English
      const enTranslations = await this.loadTranslations('en');
      const enValue = this.getNestedValue(enTranslations, key);
      return enValue || key;
    }

    if (params) {
      return this.interpolate(value, params);
    }

    return value;
  }

  static async translateBatch(
    keys: string[],
    localeCode: string = 'en'
  ): Promise<Record<string, string>> {
    const translations = await this.loadTranslations(localeCode);
    const result: Record<string, string> = {};

    for (const key of keys) {
      result[key] = this.getNestedValue(translations, key) || key;
    }

    return result;
  }

  static getNestedValue(obj: any, path: string): string | null {
    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return null;
      }
    }

    return typeof current === 'string' ? current : null;
  }

  static interpolate(template: string, params: Record<string, string | number>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return String(params[key] || match);
    });
  }

  static async invalidateCache(localeCode?: string): Promise<void> {
    if (localeCode) {
      await productCache.delete(`${this.cachePrefix}${localeCode}`);
    } else {
      await productCache.deletePattern(`${this.cachePrefix}*`);
    }
  }

  static async getAvailableLanguages(): Promise<string[]> {
    return LocaleService.getSupportedLocales().map(locale => locale.code);
  }

  static async getLanguageName(code: string): Promise<string> {
    const locale = LocaleService.getLocale(code);
    return locale?.name || code;
  }

  static async getLanguageNativeName(code: string): Promise<string> {
    const locale = LocaleService.getLocale(code);
    return locale?.nativeName || code;
  }

  static async isRTL(code: string): Promise<boolean> {
    const locale = LocaleService.getLocale(code);
    return locale?.direction === 'rtl' || false;
  }
}
