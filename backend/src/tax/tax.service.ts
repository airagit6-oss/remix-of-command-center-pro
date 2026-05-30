// ============================================================
// TAX SERVICE
// Enterprise multi-tax support for global compliance
// ============================================================

export interface TaxRate {
  id: string;
  countryCode: string;
  region?: string;
  taxType: 'VAT' | 'GST' | 'SALES_TAX' | 'USE_TAX' | 'EXCISE';
  rate: number;
  name: string;
  description?: string;
  isCompound: boolean;
  appliesToDigital: boolean;
  appliesToPhysical: boolean;
  threshold?: number;
  effectiveFrom: Date;
  effectiveTo?: Date;
}

export interface TaxCalculation {
  subtotal: number;
  taxAmount: number;
  total: number;
  taxes: {
    name: string;
    rate: number;
    amount: number;
    countryCode: string;
  }[];
}

export interface TaxExemption {
  id: string;
  type: 'BUSINESS' | 'CHARITY' | 'GOVERNMENT' | 'EDUCATIONAL' | 'RESELLER';
  certificateNumber?: string;
  validFrom: Date;
  validTo?: Date;
  jurisdictions: string[];
}

export class TaxService {
  private static taxRates: TaxRate[] = [
    // VAT - European Union
    { id: 'eu-vat-standard', countryCode: 'EU', taxType: 'VAT', rate: 20, name: 'Standard VAT', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2021-01-01') },
    { id: 'eu-vat-reduced', countryCode: 'EU', taxType: 'VAT', rate: 10, name: 'Reduced VAT', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2021-01-01') },
    { id: 'gb-vat-standard', countryCode: 'GB', taxType: 'VAT', rate: 20, name: 'UK VAT', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2021-01-01') },
    
    // GST - Canada
    { id: 'ca-gst', countryCode: 'CA', taxType: 'GST', rate: 5, name: 'GST', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2021-01-01') },
    { id: 'ca-hst', countryCode: 'CA', region: 'ON', taxType: 'GST', rate: 13, name: 'HST (Ontario)', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2021-01-01') },
    
    // GST - Australia
    { id: 'au-gst', countryCode: 'AU', taxType: 'GST', rate: 10, name: 'GST', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2021-01-01') },
    
    // GST - New Zealand
    { id: 'nz-gst', countryCode: 'NZ', taxType: 'GST', rate: 15, name: 'GST', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2021-01-01') },
    
    // GST - India
    { id: 'in-gst', countryCode: 'IN', taxType: 'GST', rate: 18, name: 'GST', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2017-07-01') },
    
    // Sales Tax - United States (state-level examples)
    { id: 'us-sales-ca', countryCode: 'US', region: 'CA', taxType: 'SALES_TAX', rate: 7.25, name: 'California Sales Tax', isCompound: false, appliesToDigital: false, appliesToPhysical: true, effectiveFrom: new Date('2021-01-01') },
    { id: 'us-sales-ny', countryCode: 'US', region: 'NY', taxType: 'SALES_TAX', rate: 8, name: 'New York Sales Tax', isCompound: false, appliesToDigital: false, appliesToPhysical: true, effectiveFrom: new Date('2021-01-01') },
    { id: 'us-sales-tx', countryCode: 'US', region: 'TX', taxType: 'SALES_TAX', rate: 6.25, name: 'Texas Sales Tax', isCompound: false, appliesToDigital: false, appliesToPhysical: true, effectiveFrom: new Date('2021-01-01') },
    
    // VAT - Other countries
    { id: 'jp-vat', countryCode: 'JP', taxType: 'VAT', rate: 10, name: 'Japanese Consumption Tax', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2019-10-01') },
    { id: 'kr-vat', countryCode: 'KR', taxType: 'VAT', rate: 10, name: 'VAT', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2021-01-01') },
    { id: 'sg-gst', countryCode: 'SG', taxType: 'GST', rate: 8, name: 'GST', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2023-01-01') },
    { id: 'my-gst', countryCode: 'MY', taxType: 'GST', rate: 6, name: 'GST', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2018-09-01') },
    { id: 'th-vat', countryCode: 'TH', taxType: 'VAT', rate: 7, name: 'VAT', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2021-01-01') },
    { id: 'id-vat', countryCode: 'ID', taxType: 'VAT', rate: 11, name: 'VAT', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2022-04-01') },
    { id: 'ph-vat', countryCode: 'PH', taxType: 'VAT', rate: 12, name: 'VAT', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2021-01-01') },
    { id: 'vn-vat', countryCode: 'VN', taxType: 'VAT', rate: 10, name: 'VAT', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2021-01-01') },
    
    // VAT - Middle East
    { id: 'sa-vat', countryCode: 'SA', taxType: 'VAT', rate: 15, name: 'VAT', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2020-07-01') },
    { id: 'ae-vat', countryCode: 'AE', taxType: 'VAT', rate: 5, name: 'VAT', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2018-01-01') },
    { id: 'il-vat', countryCode: 'IL', taxType: 'VAT', rate: 17, name: 'VAT', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2021-01-01') },
    { id: 'tr-vat', countryCode: 'TR', taxType: 'VAT', rate: 20, name: 'KDV', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2021-01-01') },
    
    // VAT - Latin America
    { id: 'mx-vat', countryCode: 'MX', taxType: 'VAT', rate: 16, name: 'IVA', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2021-01-01') },
    { id: 'br-vat', countryCode: 'BR', taxType: 'VAT', rate: 17, name: 'ICMS', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2021-01-01') },
    { id: 'ar-vat', countryCode: 'AR', taxType: 'VAT', rate: 21, name: 'IVA', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2021-01-01') },
    { id: 'co-vat', countryCode: 'CO', taxType: 'VAT', rate: 19, name: 'IVA', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2021-01-01') },
    { id: 'cl-vat', countryCode: 'CL', taxType: 'VAT', rate: 19, name: 'IVA', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2021-01-01') },
    
    // VAT - Africa
    { id: 'za-vat', countryCode: 'ZA', taxType: 'VAT', rate: 15, name: 'VAT', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2021-01-01') },
    { id: 'eg-vat', countryCode: 'EG', taxType: 'VAT', rate: 14, name: 'VAT', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2021-01-01') },
    { id: 'ng-vat', countryCode: 'NG', taxType: 'VAT', rate: 7.5, name: 'VAT', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2021-01-01') },
    { id: 'ke-vat', countryCode: 'KE', taxType: 'VAT', rate: 16, name: 'VAT', isCompound: false, appliesToDigital: true, appliesToPhysical: true, effectiveFrom: new Date('2021-01-01') },
  ];

  static getApplicableTaxRates(
    countryCode: string,
    region?: string,
    isDigital: boolean = true
  ): TaxRate[] {
    const now = new Date();
    
    return this.taxRates.filter(tax => {
      // Check country match
      if (tax.countryCode !== countryCode && tax.countryCode !== 'EU') {
        return false;
      }

      // For EU, check if country is in EU (simplified check)
      if (tax.countryCode === 'EU' && !this.isEUCountry(countryCode)) {
        return false;
      }

      // Check region match if specified
      if (region && tax.region && tax.region !== region) {
        return false;
      }

      // Check if tax applies to digital/physical goods
      if (isDigital && !tax.appliesToDigital) {
        return false;
      }
      if (!isDigital && !tax.appliesToPhysical) {
        return false;
      }

      // Check effective dates
      if (tax.effectiveFrom > now) {
        return false;
      }
      if (tax.effectiveTo && tax.effectiveTo < now) {
        return false;
      }

      return true;
    });
  }

  private static isEUCountry(countryCode: string): boolean {
    const euCountries = [
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
    ];
    return euCountries.includes(countryCode);
  }

  static calculateTax(
    amount: number,
    countryCode: string,
    region?: string,
    isDigital: boolean = true,
    exemptions?: TaxExemption[]
  ): TaxCalculation {
    const applicableRates = this.getApplicableTaxRates(countryCode, region, isDigital);
    
    // Filter out exempted taxes
    const nonExemptedRates = applicableRates.filter(tax => {
      if (!exemptions || exemptions.length === 0) return true;
      
      return !exemptions.some(exemption => 
        exemption.jurisdictions.includes(tax.countryCode) ||
        exemption.jurisdictions.includes(tax.region || '')
      );
    });

    let totalTax = 0;
    const taxes = [];

    for (const tax of nonExemptedRates) {
      const taxAmount = amount * (tax.rate / 100);
      totalTax += taxAmount;
      
      taxes.push({
        name: tax.name,
        rate: tax.rate,
        amount: taxAmount,
        countryCode: tax.countryCode,
      });
    }

    return {
      subtotal: amount,
      taxAmount: totalTax,
      total: amount + totalTax,
      taxes,
    };
  }

  static async validateTaxExemption(
    exemption: TaxExemption
  ): Promise<boolean> {
    // TODO: Implement validation against tax authority APIs
    const now = new Date();
    
    if (exemption.validFrom > now) {
      return false;
    }
    
    if (exemption.validTo && exemption.validTo < now) {
      return false;
    }
    
    return true;
  }

  static getTaxRate(countryCode: string, region?: string): number {
    const rates = this.getApplicableTaxRates(countryCode, region, true);
    if (rates.length === 0) return 0;
    
    // Return the highest rate (simplified logic)
    return Math.max(...rates.map(r => r.rate));
  }

  static isTaxable(countryCode: string, isDigital: boolean = true): boolean {
    const rates = this.getApplicableTaxRates(countryCode, undefined, isDigital);
    return rates.length > 0;
  }

  static getSupportedCountries(): string[] {
    const countries = new Set(this.taxRates.map(t => t.countryCode));
    return Array.from(countries).sort();
  }

  static getTaxTypes(countryCode: string): string[] {
    const types = new Set(
      this.taxRates
        .filter(t => t.countryCode === countryCode)
        .map(t => t.taxType)
    );
    return Array.from(types);
  }
}
