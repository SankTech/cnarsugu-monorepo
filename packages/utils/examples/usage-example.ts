/**
 * Usage examples for @cnarsugu/utils package
 */

import {
  // Constants
  CV_RANGES,
  AUTO_FORMULAS,
  MOTO_CATEGORIES,
  BUSINESS_TYPES,
  PRODUCT_TYPES,
  PAYMENT_METHODS,
  IAC_ADDON_PRICE,
  
  // Utility functions
  formatPrice,
  formatPriceCompact,
  calculateMonthlyPrice,
  findCVRange,
  getCVRangeLabel,
  isIACEligible,
  includesIAC,
  cleanPrice,
  getIdFromClient,
  Base64,
  
  // Types
  type CVRange,
  type AutoFormulaType,
  type MotoCategoryCode,
  type BusinessTypeCode,
} from '@cnarsugu/utils';

// ============================================================================
// CONSTANTS USAGE
// ============================================================================

console.log('=== CV Ranges ===');
console.log('Available CV ranges:', CV_RANGES);

console.log('\n=== Moto Categories ===');
console.log('Djakarta:', MOTO_CATEGORIES.DJAKARTA);
console.log('Grosse Cylindrée:', MOTO_CATEGORIES.GROSSE_CYLINDREE);

console.log('\n=== Business Types ===');
console.log('Restaurant:', BUSINESS_TYPES.RESTAURANT);
console.log('Hotel:', BUSINESS_TYPES.HOTEL);

console.log('\n=== Payment Methods ===');
console.log('Available payment methods:', PAYMENT_METHODS);

console.log('\n=== IAC Add-on Price ===');
console.log('IAC add-on price:', formatPrice(IAC_ADDON_PRICE));

// ============================================================================
// UTILITY FUNCTIONS USAGE
// ============================================================================

console.log('\n=== Price Formatting ===');
const annualPrice = 50000;
console.log('Annual price:', formatPrice(annualPrice));
console.log('Compact format:', formatPriceCompact(annualPrice));
console.log('Monthly price:', formatPrice(calculateMonthlyPrice(annualPrice)));

console.log('\n=== CV Range Lookup ===');
const cvValue = 3;
const range = findCVRange(cvValue);
console.log(`CV ${cvValue} is in range:`, range);
console.log(`CV ${cvValue} label:`, getCVRangeLabel(cvValue));

console.log('\n=== IAC Eligibility ===');
console.log(
  'Auto Tiers eligible for IAC:',
  isIACEligible(PRODUCT_TYPES.AUTO, AUTO_FORMULAS.TIERS)
);
console.log(
  'Auto Essentielle eligible for IAC:',
  isIACEligible(PRODUCT_TYPES.AUTO, AUTO_FORMULAS.ESSENTIELLE)
);
console.log(
  'Moto Essentielle includes IAC:',
  includesIAC(PRODUCT_TYPES.MOTO, 'ESSENTIELLE')
);

console.log('\n=== Price Cleaning ===');
console.log('Clean "50,000 FCFA":', cleanPrice('50,000 FCFA'));
console.log('Clean "50.000,00":', cleanPrice('50.000,00'));

console.log('\n=== ID Generation ===');
console.log('Generated ID:', getIdFromClient());

console.log('\n=== Base64 Encoding ===');
const text = 'Hello CNAR Sugu';
const encoded = Base64.encode(text);
const decoded = Base64.decode(encoded);
console.log('Original:', text);
console.log('Encoded:', encoded);
console.log('Decoded:', decoded);

// ============================================================================
// TYPE USAGE
// ============================================================================

console.log('\n=== Type Safety Examples ===');

// Using typed constants
const selectedFormula: AutoFormulaType = 'TIERS';
console.log('Selected formula:', selectedFormula);

const selectedCategory: MotoCategoryCode = 'DJAKARTA';
console.log('Selected category:', selectedCategory);

const selectedBusiness: BusinessTypeCode = 'RESTAURANT';
console.log('Selected business:', selectedBusiness);

// Using CV range type
const cvRanges: CVRange[] = [...CV_RANGES];
console.log('Number of CV ranges:', cvRanges.length);

// ============================================================================
// PRACTICAL EXAMPLES
// ============================================================================

console.log('\n=== Practical Example: Auto Insurance Quote ===');

function calculateAutoQuote(cv: number, formula: AutoFormulaType, addIAC: boolean = false) {
  const cvRange = findCVRange(cv);
  if (!cvRange) {
    throw new Error('Invalid CV value');
  }
  
  // In a real app, you'd fetch the price from the API
  // This is just for demonstration
  const basePrice = 50000;
  
  let totalPrice = basePrice;
  
  // Add IAC if eligible and requested
  if (addIAC && isIACEligible(PRODUCT_TYPES.AUTO, formula)) {
    totalPrice += IAC_ADDON_PRICE;
  }
  
  return {
    cvRange: cvRange.label,
    formula,
    basePrice: formatPrice(basePrice),
    iacAdded: addIAC,
    totalPrice: formatPrice(totalPrice),
    monthlyPrice: formatPrice(calculateMonthlyPrice(totalPrice)),
  };
}

const quote = calculateAutoQuote(3, 'TIERS', true);
console.log('Quote:', quote);

console.log('\n=== Practical Example: Moto Insurance Quote ===');

function calculateMotoQuote(category: MotoCategoryCode, formula: string) {
  const categoryInfo = MOTO_CATEGORIES[category];
  
  // In a real app, you'd fetch the price from the API
  const basePrice = 25000;
  
  // Check if IAC is included
  const hasIAC = includesIAC(PRODUCT_TYPES.MOTO, formula);
  
  return {
    category: categoryInfo.label,
    description: categoryInfo.description,
    formula,
    price: formatPrice(basePrice),
    includesIAC: hasIAC,
    monthlyPrice: formatPrice(calculateMonthlyPrice(basePrice)),
  };
}

const motoQuote = calculateMotoQuote('DJAKARTA', 'ESSENTIELLE');
console.log('Moto quote:', motoQuote);
