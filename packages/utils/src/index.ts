/**
 * @cnarsugu/utils
 * Shared utility functions and constants for CNAR Sugu platform
 */

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * CV (Chevaux Fiscaux) ranges for Auto Prestige pricing
 */
export const CV_RANGES = [
  { min: 1, max: 1, label: '1 CV' },
  { min: 2, max: 4, label: '2-4 CV' },
  { min: 5, max: 7, label: '5-7 CV' },
  { min: 8, max: 10, label: '8-10 CV' },
  { min: 11, max: 99, label: '11+ CV' },
] as const;

/**
 * Auto insurance formula types
 */
export const AUTO_FORMULAS = {
  TIERS: 'TIERS',
  ESSENTIELLE: 'ESSENTIELLE',
  ETENDUE: 'ETENDUE',
  CONFORT: 'CONFORT',
} as const;

/**
 * Moto categories for pricing
 */
export const MOTO_CATEGORIES = {
  DJAKARTA: {
    code: 'DJAKARTA',
    label: 'Djakarta',
    description: 'Petites cylindrées',
  },
  GROSSE_CYLINDREE: {
    code: 'GROSSE_CYLINDREE',
    label: 'Grosse Cylindrée',
    description: 'Motos de grande cylindrée',
  },
  MOTO_TAXI: {
    code: 'MOTO_TAXI',
    label: 'Moto Taxi',
    description: 'Motos commerciales',
  },
} as const;

/**
 * Moto formula types
 */
export const MOTO_FORMULAS = {
  TIERS: 'TIERS',
  ESSENTIELLE: 'ESSENTIELLE',
} as const;

/**
 * Business types for Multirisk Professional packages
 */
export const BUSINESS_TYPES = {
  BOUTIQUE: {
    code: 'BOUTIQUE',
    label: 'Boutique',
    description: 'Commerce de détail',
    packageCode: 'MR_BOUTIQUE',
  },
  RESTAURANT: {
    code: 'RESTAURANT',
    label: 'Restaurant',
    description: 'Restauration',
    packageCode: 'MR_RESTAURANT',
  },
  HOTEL: {
    code: 'HOTEL',
    label: 'Hôtel',
    description: 'Hôtellerie',
    packageCode: 'MR_HOTEL',
  },
  BAR_CLUB: {
    code: 'BAR_CLUB',
    label: 'Bar/Club',
    description: 'Bar et discothèque',
    packageCode: 'MR_BAR_CLUB',
  },
} as const;

/**
 * Product types
 */
export const PRODUCT_TYPES = {
  AUTO: 'AUTO',
  MOTO: 'MOTO',
  MULTIRISK_PRO: 'MULTIRISK_PRO',
  IAC: 'IAC',
  LEGACY: 'LEGACY',
} as const;

/**
 * Payment status constants
 */
export const PAYMENT_STATUS = {
  UNPAID: 'UNPAID',
  PAID: 'PAID',
  ERROR: 'ERROR',
} as const;

/**
 * Payment method data
 */
export const PAYMENT_METHODS = [
  {
    id: 2,
    serviceCode: 'ML_PAIEMENTMARCHAND_OM_TP',
    title: 'Orange Money',
    validationCall: '#144#37#',
  },
  {
    id: 3,
    serviceCode: 'ML_PAIEMENTMARCHAND_MOOV_TP',
    title: 'Moov Money',
    validationCall: '#',
  },
  {
    id: 4,
    serviceCode: 'ML_PAIEMENTWAVE_TP',
    title: 'Wave',
    validationCall: '#',
  },
  {
    id: 1,
    serviceCode: 'ML_INIT_PAIEMENT_TP',
    validationCall: '#',
    title: 'TouchPoint',
  },
] as const;

/**
 * Client types
 */
export const CLIENT_TYPES = [
  {
    id: 1,
    title: 'Particuliers',
  },
  {
    id: 2,
    title: 'Entreprise',
  },
] as const;

/**
 * IAC add-on price (in FCFA)
 */
export const IAC_ADDON_PRICE = 5000;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a unique ID based on timestamp
 */
export function getIdFromClient(): string {
  return Date.now().toString();
}

/**
 * Clean price string by removing non-numeric characters
 * @param price - Price string to clean
 * @returns Cleaned price string with only numbers and decimal point
 */
export function cleanPrice(price: string | undefined | null): string {
  if (price == undefined || price == null || price.length < 1) {
    return '';
  }
  
  // Remove non-numeric characters (except dots)
  const cleanedPrice = price.replace(/[^\d.]/g, '');

  // If there are multiple dots, keep only the first one
  const dotIndex = cleanedPrice.indexOf('.');
  if (dotIndex !== -1) {
    const beforeDot = cleanedPrice.substring(0, dotIndex);
    const afterDot = cleanedPrice.substring(dotIndex + 1);
    return `${beforeDot}.${afterDot.replace(/\./g, '')}`;
  }

  return cleanedPrice;
}

/**
 * Format price for display with thousand separators
 * @param price - Price to format (number or string)
 * @param currency - Currency symbol (default: 'FCFA')
 * @returns Formatted price string
 */
export function formatPrice(
  price: number | string,
  currency: string = 'FCFA'
): string {
  const numPrice = typeof price === 'string' ? parseFloat(cleanPrice(price)) : price;
  
  if (isNaN(numPrice)) {
    return `0 ${currency}`;
  }

  // Format with thousand separators
  const formatted = numPrice.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return `${formatted} ${currency}`;
}

/**
 * Format price for display (compact version without currency)
 * @param price - Price to format
 * @returns Formatted price string
 */
export function formatPriceCompact(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(cleanPrice(price)) : price;
  
  if (isNaN(numPrice)) {
    return '0';
  }

  return numPrice.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * Calculate monthly price from annual price
 * @param annualPrice - Annual price
 * @returns Monthly price
 */
export function calculateMonthlyPrice(annualPrice: number): number {
  return Math.round(annualPrice / 12);
}

/**
 * Find CV range for a given CV value
 * @param cv - CV value
 * @returns CV range object or undefined
 */
export function findCVRange(cv: number) {
  return CV_RANGES.find((range) => cv >= range.min && cv <= range.max);
}

/**
 * Get CV range label for a given CV value
 * @param cv - CV value
 * @returns CV range label or 'Unknown'
 */
export function getCVRangeLabel(cv: number): string {
  const range = findCVRange(cv);
  return range ? range.label : 'Unknown';
}

/**
 * Check if a product is eligible for IAC add-on
 * @param productType - Product type
 * @param formulaType - Formula type
 * @returns True if eligible for IAC add-on
 */
export function isIACEligible(
  productType: string,
  formulaType: string
): boolean {
  // IAC can be added to Auto Tiers or Moto Tiers
  return (
    (productType === PRODUCT_TYPES.AUTO && formulaType === AUTO_FORMULAS.TIERS) ||
    (productType === PRODUCT_TYPES.MOTO && formulaType === MOTO_FORMULAS.TIERS)
  );
}

/**
 * Check if a formula includes IAC by default
 * @param productType - Product type
 * @param formulaType - Formula type
 * @returns True if formula includes IAC
 */
export function includesIAC(
  productType: string,
  formulaType: string
): boolean {
  // Moto Essentielle includes IAC by default
  return (
    productType === PRODUCT_TYPES.MOTO &&
    formulaType === MOTO_FORMULAS.ESSENTIELLE
  );
}

/**
 * Generate a random number between 0 and max (exclusive)
 * @param max - Maximum value (exclusive)
 * @returns Random number
 */
export function getRandomNumber(max: number): number {
  return Math.floor(Math.random() * max);
}

/**
 * Base64 encoding/decoding utilities
 */
export const Base64 = {
  /**
   * Encode a string to Base64
   * @param input - String to encode
   * @returns Base64 encoded string
   */
  encode(input: string): string {
    const map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    let c1 = 0,
      c2 = 0,
      c3 = 0,
      e1 = 0,
      e2 = 0,
      e3 = 0,
      e4 = 0;
    
    for (let i = 0; i < input.length; ) {
      c1 = input.charCodeAt(i++);
      e1 = c1 >> 2;
      c2 = input.charCodeAt(i++);
      e2 = ((c1 & 3) << 4) | (c2 >> 4);
      c3 = input.charCodeAt(i++);
      e3 = ((c2 & 15) << 2) | (c3 >> 6);
      e4 = c3 & 63;
      
      if (isNaN(c2)) {
        e3 = e4 = 64;
      } else if (isNaN(c3)) {
        e4 = 64;
      }
      
      output += map.charAt(e1) + map.charAt(e2) + map.charAt(e3) + map.charAt(e4);
    }
    
    return output;
  },

  /**
   * Decode a Base64 string
   * @param input - Base64 string to decode
   * @returns Decoded string
   */
  decode(input: string): string {
    const map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    let c1 = 0,
      c2 = 0,
      c3 = 0,
      e1 = 0,
      e2 = 0,
      e3 = 0,
      e4 = 0;
    
    input = input.replace(/[^\w\+\/\=]/g, '');
    
    for (let i = 0; i < input.length; ) {
      e1 = map.indexOf(input.charAt(i++));
      e2 = map.indexOf(input.charAt(i++));
      c1 = (e1 << 2) | (e2 >> 4);
      output += String.fromCharCode(c1);
      
      e3 = map.indexOf(input.charAt(i++));
      c2 = ((e2 & 15) << 4) | (e3 >> 2);
      if (e3 !== 64) {
        output += String.fromCharCode(c2);
      }
      
      e4 = map.indexOf(input.charAt(i++));
      c3 = ((e3 & 3) << 6) | e4;
      if (e4 !== 64) {
        output += String.fromCharCode(c3);
      }
    }
    
    return output;
  },
};

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type CVRange = (typeof CV_RANGES)[number];
export type AutoFormulaType = keyof typeof AUTO_FORMULAS;
export type MotoFormulaType = keyof typeof MOTO_FORMULAS;
export type MotoCategoryCode = keyof typeof MOTO_CATEGORIES;
export type BusinessTypeCode = keyof typeof BUSINESS_TYPES;
export type ProductType = keyof typeof PRODUCT_TYPES;
export type PaymentStatusType = keyof typeof PAYMENT_STATUS;
