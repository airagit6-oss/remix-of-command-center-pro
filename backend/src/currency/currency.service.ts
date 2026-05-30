// ============================================================
// CURRENCY SERVICE
// Enterprise multi-currency support with real-time rates
// ============================================================

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  symbolPosition: 'before' | 'after';
  decimalPlaces: number;
  thousandsSeparator: string;
  decimalSeparator: string;
  flag: string;
  isActive: boolean;
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  timestamp: Date;
}

export class CurrencyService {
  private static readonly SUPPORTED_CURRENCIES: Currency[] = [
    // Major currencies
    { code: 'USD', name: 'US Dollar', symbol: '$', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.', flag: '🇺🇸', isActive: true },
    { code: 'EUR', name: 'Euro', symbol: '€', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: '.', decimalSeparator: ',', flag: '🇪🇺', isActive: true },
    { code: 'GBP', name: 'British Pound', symbol: '£', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.', flag: '🇬🇧', isActive: true },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', symbolPosition: 'before', decimalPlaces: 0, thousandsSeparator: ',', decimalSeparator: '.', flag: '🇯🇵', isActive: true },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.', flag: '🇨🇳', isActive: true },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.', flag: '🇮🇳', isActive: true },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.', flag: '🇦🇺', isActive: true },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.', flag: '🇨🇦', isActive: true },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: "'", decimalSeparator: '.', flag: '🇨🇭', isActive: true },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.', flag: '🇭🇰', isActive: true },
    
    // Asian currencies
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.', flag: '🇸🇬', isActive: true },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩', symbolPosition: 'before', decimalPlaces: 0, thousandsSeparator: ',', decimalSeparator: '.', flag: '🇰🇷', isActive: true },
    { code: 'TWD', name: 'Taiwan Dollar', symbol: 'NT$', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.', flag: '🇹🇼', isActive: true },
    { code: 'THB', name: 'Thai Baht', symbol: '฿', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.', flag: '🇹🇭', isActive: true },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.', flag: '🇲🇾', isActive: true },
    { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', symbolPosition: 'before', decimalPlaces: 0, thousandsSeparator: '.', decimalSeparator: ',', flag: '🇮🇩', isActive: true },
    { code: 'PHP', name: 'Philippine Peso', symbol: '₱', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.', flag: '🇵🇭', isActive: true },
    { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', symbolPosition: 'before', decimalPlaces: 0, thousandsSeparator: '.', decimalSeparator: ',', flag: '🇻🇳', isActive: true },
    { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.', flag: '🇧🇩', isActive: true },
    { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.', flag: '🇵🇰', isActive: true },
    { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.', flag: '🇱🇰', isActive: true },
    
    // Middle Eastern currencies
    { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.', flag: '🇸🇦', isActive: true },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.', flag: '🇦🇪', isActive: true },
    { code: 'QAR', name: 'Qatari Riyal', symbol: '﷼', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.', flag: '🇶🇦', isActive: true },
    { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', symbolPosition: 'before', decimalPlaces: 3, thousandsSeparator: ',', decimalSeparator: '.', flag: '🇰🇼', isActive: true },
    { code: 'BHD', name: 'Bahraini Dinar', symbol: 'BD', symbolPosition: 'before', decimalPlaces: 3, thousandsSeparator: ',', decimalSeparator: '.', flag: '🇧🇭', isActive: true },
    { code: 'OMR', name: 'Omani Rial', symbol: '﷼', symbolPosition: 'before', decimalPlaces: 3, thousandsSeparator: ',', decimalSeparator: '.', flag: '🇴🇲', isActive: true },
    { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.', flag: '🇮🇱', isActive: true },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.', flag: '🇹🇷', isActive: true },
    
    // European currencies
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', symbolPosition: 'after', decimalPlaces: 2, thousandsSeparator: '.', decimalSeparator: ',', flag: '🇳🇴', isActive: true },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', symbolPosition: 'after', decimalPlaces: 2, thousandsSeparator: '.', decimalSeparator: ',', flag: '🇸🇪', isActive: true },
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr', symbolPosition: 'after', decimalPlaces: 2, thousandsSeparator: '.', decimalSeparator: ',', flag: '🇩🇰', isActive: true },
    { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', symbolPosition: 'after', decimalPlaces: 2, thousandsSeparator: '.', decimalSeparator: ',', flag: '🇵🇱', isActive: true },
    { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', symbolPosition: 'after', decimalPlaces: 2, thousandsSeparator: '.', decimalSeparator: ',', flag: '🇨🇿', isActive: true },
    { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', symbolPosition: 'after', decimalPlaces: 2, thousandsSeparator: '.', decimalSeparator: ',', flag: '🇭🇺', isActive: true },
    { code: 'RON', name: 'Romanian Leu', symbol: 'lei', symbolPosition: 'after', decimalPlaces: 2, thousandsSeparator: '.', decimalSeparator: ',', flag: '🇷🇴', isActive: true },
    { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв', symbolPosition: 'after', decimalPlaces: 2, thousandsSeparator: '.', decimalSeparator: ',', flag: '🇧🇬', isActive: true },
    { code: 'HRK', name: 'Croatian Kuna', symbol: 'kn', symbolPosition: 'after', decimalPlaces: 2, thousandsSeparator: '.', decimalSeparator: ',', flag: '🇭🇷', isActive: true },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: '.', decimalSeparator: ',', flag: '🇷🇺', isActive: true },
    
    // Americas
    { code: 'MXN', name: 'Mexican Peso', symbol: '$', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.', flag: '🇲🇽', isActive: true },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: '.', decimalSeparator: ',', flag: '🇧🇷', isActive: true },
    { code: 'ARS', name: 'Argentine Peso', symbol: '$', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: '.', decimalSeparator: ',', flag: '🇦🇷', isActive: true },
    { code: 'CLP', name: 'Chilean Peso', symbol: '$', symbolPosition: 'before', decimalPlaces: 0, thousandsSeparator: '.', decimalSeparator: ',', flag: '🇨🇱', isActive: true },
    { code: 'COP', name: 'Colombian Peso', symbol: '$', symbolPosition: 'before', decimalPlaces: 0, thousandsSeparator: '.', decimalSeparator: ',', flag: '🇨🇴', isActive: true },
    { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: '.', decimalSeparator: ',', flag: '🇵🇪', isActive: true },
    
    // African currencies
    { code: 'ZAR', name: 'South African Rand', symbol: 'R', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: '.', decimalSeparator: ',', flag: '🇿🇦', isActive: true },
    { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: '.', decimalSeparator: ',', flag: '🇪🇬', isActive: true },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: '.', decimalSeparator: ',', flag: '🇳🇬', isActive: true },
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: '.', decimalSeparator: ',', flag: '🇰🇪', isActive: true },
    { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: '.', decimalSeparator: ',', flag: '🇬🇭', isActive: true },
    
    // Additional currencies
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.', flag: '🇳🇿', isActive: true },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: '.', decimalSeparator: ',', flag: '🇿🇦', isActive: true },
  ];

  private static exchangeRates: Map<string, ExchangeRate> = new Map();
  private static baseCurrency = 'USD';

  static getSupportedCurrencies(): Currency[] {
    return this.SUPPORTED_CURRENCIES.filter(c => c.isActive);
  }

  static getCurrency(code: string): Currency | undefined {
    return this.SUPPORTED_CURRENCIES.find(c => c.code === code);
  }

  static isCurrencySupported(code: string): boolean {
    return this.SUPPORTED_CURRENCIES.some(c => c.code === code && c.isActive);
  }

  static format(amount: number, currencyCode: string): string {
    const currency = this.getCurrency(currencyCode);
    if (!currency) {
      return `${amount.toFixed(2)} ${currencyCode}`;
    }

    const formattedAmount = this.formatNumber(amount, currency);
    
    if (currency.symbolPosition === 'before') {
      return `${currency.symbol}${formattedAmount}`;
    } else {
      return `${formattedAmount}${currency.symbol}`;
    }
  }

  private static formatNumber(amount: number, currency: Currency): string {
    const rounded = amount.toFixed(currency.decimalPlaces);
    const parts = rounded.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1] || '';

    // Add thousands separator
    let formattedInteger = '';
    let counter = 0;
    for (let i = integerPart.length - 1; i >= 0; i--) {
      if (counter > 0 && counter % 3 === 0) {
        formattedInteger = currency.thousandsSeparator + formattedInteger;
      }
      formattedInteger = integerPart[i] + formattedInteger;
      counter++;
    }

    if (decimalPart) {
      return formattedInteger + currency.decimalSeparator + decimalPart;
    }

    return formattedInteger;
  }

  static async convert(
    amount: number,
    from: string,
    to: string
  ): Promise<number> {
    if (from === to) {
      return amount;
    }

    const rate = await this.getExchangeRate(from, to);
    return amount * rate;
  }

  static async getExchangeRate(from: string, to: string): Promise<number> {
    const key = `${from}_${to}`;
    
    if (this.exchangeRates.has(key)) {
      const rate = this.exchangeRates.get(key)!;
      // Check if rate is still valid (1 hour old)
      if (Date.now() - rate.timestamp.getTime() < 3600000) {
        return rate.rate;
      }
    }

    // TODO: Fetch from external API (e.g., Open Exchange Rates, Fixer.io)
    // For now, return 1 as placeholder
    const rate = 1;
    
    this.exchangeRates.set(key, {
      from,
      to,
      rate,
      timestamp: new Date(),
    });

    return rate;
  }

  static async updateExchangeRates(): Promise<void> {
    // TODO: Implement bulk rate update from external API
    console.log('Updating exchange rates...');
  }

  static setBaseCurrency(code: string): void {
    if (this.isCurrencySupported(code)) {
      this.baseCurrency = code;
    }
  }

  static getBaseCurrency(): Currency {
    return this.getCurrency(this.baseCurrency) || this.SUPPORTED_CURRENCIES[0];
  }
}
