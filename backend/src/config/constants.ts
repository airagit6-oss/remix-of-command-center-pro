// ============================================================
// APPLICATION CONSTANTS
// Centralized configuration for business rules and limits
// ============================================================

export const PAYOUT_CONFIG = {
  MINIMUM_AMOUNT: 50, // Minimum payout amount in USD
  CURRENCY: 'USD',
  PROCESSING_TIME_DAYS: 7, // Expected processing time in days
} as const;

export const COMMISSION_CONFIG = {
  DEFAULT_REFERRAL_RATE: 0.05, // 5% default referral commission
  DEFAULT_LEAD_CONVERSION_RATE: 0.10, // 10% default lead conversion commission
  CURRENCY: 'USD',
} as const;

export const WALLET_CONFIG = {
  DEFAULT_CURRENCY: 'USD',
  MINIMUM_TRANSFER_AMOUNT: 1, // Minimum transfer amount in USD
} as const;

export const RATE_LIMIT_CONFIG = {
  GENERAL: {
    max: 100,
    timeWindow: 60000, // 1 minute
  },
  STRICT: {
    max: 10,
    timeWindow: 60000, // 1 minute
  },
  PAYOUT: {
    max: 3,
    timeWindow: 3600000, // 1 hour
  },
} as const;

export const FILE_UPLOAD_CONFIG = {
  MAX_PRODUCT_MEDIA_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_DOCUMENT_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_KYC_DOCUMENT_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
} as const;

export const DUPLICATE_PREVENTION_CONFIG = {
  ORDER_DUPLICATE_WINDOW_MS: 10 * 60 * 1000, // 10 minutes
  REFERRAL_DUPLICATE_CHECK: true,
  COMMISSION_DUPLICATE_CHECK: true,
  PAYOUT_DUPLICATE_CHECK: true,
} as const;
