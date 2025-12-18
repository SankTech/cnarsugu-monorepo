// ============================================================================
// Base Types
// ============================================================================

/**
 * Base Insurance type representing insurance products
 */
export interface Insurance {
  id: number;
  title: string;
  description: string;
  price: number;
}

/**
 * Product type enumeration for different insurance products
 */
export enum ProductType {
  AUTO = 'AUTO',
  MOTO = 'MOTO',
  MULTIRISK_PRO = 'MULTIRISK_PRO',
  IAC = 'IAC',
  LEGACY = 'LEGACY',
}

/**
 * CV Range for Auto insurance
 */
export interface CVRange {
  min: number;
  max: number;
  label: string;
}

/**
 * Product details for different insurance types
 */
export interface ProductDetails {
  cvRange?: CVRange;
  formula?: string;
  motoCategory?: string;
  packageCode?: string;
  addIac?: boolean;
  [key: string]: any;
}

/**
 * Subscription entity
 */
export interface Subscription {
  id: number;
  name: string;
  surname: string;
  phoneNumber: string;
  status: string;
  coverage: string;
  insurance: string;
  price?: string;
  extraData?: string;
  attachments?: object[];
  read: boolean;
  createdAt: Date;
  productType?: ProductType;
  productDetails?: ProductDetails;
  cvRange?: string;
  motoCategory?: string;
  payment?: Payment;
}

/**
 * Additional information for payment
 */
export interface AdditionalInfos {
  recipientEmail: string;
  recipientFirstName: string;
  recipientLastName: string;
  destinataire: string;
}

/**
 * Payment entity
 */
export interface Payment {
  id: number;
  idFromClient: string;
  status: string;
  additionnalInfos: AdditionalInfos;
  amount: string;
  callback: string;
  recipientNumber: string;
  serviceCode: string;
  createdAt: Date;
  subscription?: Subscription;
}

// ============================================================================
// Auto Insurance Types
// ============================================================================

/**
 * Auto formula types
 */
export type AutoFormulaType = 'TIERS' | 'ESSENTIELLE' | 'ETENDUE' | 'CONFORT';

/**
 * Auto pricing entity
 */
export interface AutoPricing {
  id: number;
  cvMin: number;
  cvMax: number;
  formulaType: AutoFormulaType;
  price12m: number;
  coverages: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Auto pricing query parameters
 */
export interface AutoPricingQuery {
  cvMin: number;
  cvMax: number;
}

/**
 * Auto product selection
 */
export interface AutoProductSelection {
  cvRange: CVRange;
  formula: AutoFormulaType;
  price: number;
  coverages: string[];
  addIac?: boolean;
}

// ============================================================================
// Moto Insurance Types
// ============================================================================

/**
 * Moto category types
 */
export type MotoCategory = 'DJAKARTA' | 'GROSSE_CYLINDREE' | 'MOTO_TAXI';

/**
 * Moto formula types
 */
export type MotoFormulaType = 'TIERS' | 'ESSENTIELLE';

/**
 * Moto pricing entity
 */
export interface MotoPricing {
  id: number;
  category: MotoCategory;
  formulaType: MotoFormulaType;
  price12m: number;
  includesIac: boolean;
  coverages: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Moto pricing query parameters
 */
export interface MotoPricingQuery {
  category: MotoCategory;
}

/**
 * Moto product selection
 */
export interface MotoProductSelection {
  category: MotoCategory;
  formula: MotoFormulaType;
  price: number;
  coverages: string[];
  includesIac: boolean;
}

// ============================================================================
// Multirisk Pro Insurance Types
// ============================================================================

/**
 * Business types for Multirisk Pro
 */
export type BusinessType = 'BOUTIQUE' | 'RESTAURANT' | 'HOTEL' | 'BAR_CLUB';

/**
 * Coverage item in a package
 */
export interface CoverageItem {
  description: string;
  capital: number;
  franchise: string;
}

/**
 * Coverage chapter grouping related items
 */
export interface CoverageChapter {
  name: string;
  items: CoverageItem[];
}

/**
 * Coverage details structure
 */
export interface CoverageDetails {
  chapters: CoverageChapter[];
}

/**
 * Multirisk package entity
 */
export interface MultirisquePackage {
  id: number;
  packageCode: string;
  name: string;
  businessType: BusinessType;
  priceTtc: number;
  coverageDetails: CoverageDetails;
  displayOrder: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Multirisk product selection
 */
export interface MultirisqueProductSelection {
  packageCode: string;
  name: string;
  businessType: BusinessType;
  price: number;
  coverageDetails: CoverageDetails;
}

// ============================================================================
// IAC (Incapacité Accident Corporel) Types
// ============================================================================

/**
 * IAC product entity
 */
export interface IACProduct {
  id: number;
  price: number;
  deathCapital: number;
  disabilityCapital: number;
  treatmentCapital: number;
  description?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * IAC add-on selection
 */
export interface IACAddOn {
  selected: boolean;
  price: number;
  deathCapital: number;
  disabilityCapital: number;
  treatmentCapital: number;
}

// ============================================================================
// Coverage Definition Types
// ============================================================================

/**
 * Coverage definition entity
 */
export interface CoverageDefinition {
  id: number;
  code: string;
  name: string;
  description?: string;
  createdAt: Date;
}

// ============================================================================
// Pricing Calculation Types
// ============================================================================

/**
 * Price breakdown for a product
 */
export interface PriceBreakdown {
  basePrice: number;
  iacPrice?: number;
  totalPrice: number;
}

/**
 * Pricing calculation result
 */
export interface PricingCalculation {
  productType: ProductType;
  breakdown: PriceBreakdown;
  details: AutoProductSelection | MotoProductSelection | MultirisqueProductSelection;
  iacAddOn?: IACAddOn;
}

// ============================================================================
// Cross-sell Types
// ============================================================================

/**
 * Cross-sell eligibility
 */
export interface CrossSellEligibility {
  eligible: boolean;
  productType: ProductType;
  reason?: string;
}

/**
 * Upgrade suggestion
 */
export interface UpgradeSuggestion {
  available: boolean;
  fromFormula: string;
  toFormula: string;
  additionalPrice: number;
  benefits: string[];
}

// ============================================================================
// API Request/Response Types
// ============================================================================

/**
 * Create subscription request (v2)
 */
export interface CreateSubscriptionRequest {
  coverage: string;
  insurance: string;
  name: string;
  surname: string;
  phoneNumber: string;
  price?: string;
  paymentId?: string;
  extraData?: string;
  files?: string[];
  productType?: ProductType;
  productDetails?: ProductDetails;
  cvRange?: string;
  motoCategory?: string;
}

/**
 * Create payment request (v2)
 */
export interface CreatePaymentRequest {
  idFromClient: string;
  amount: string;
  recipientNumber: string;
  serviceCode: string;
  callback: string;
  additionnalInfos: AdditionalInfos;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * CV ranges for Auto insurance
 */
export const CV_RANGES: CVRange[] = [
  { min: 1, max: 1, label: '1 CV' },
  { min: 2, max: 4, label: '2-4 CV' },
  { min: 5, max: 7, label: '5-7 CV' },
  { min: 8, max: 10, label: '8-10 CV' },
  { min: 11, max: 15, label: '11-15 CV' },
  { min: 16, max: 20, label: '16-20 CV' },
  { min: 21, max: 50, label: '21+ CV' },
];

/**
 * Moto categories
 */
export const MOTO_CATEGORIES: { value: MotoCategory; label: string }[] = [
  { value: 'DJAKARTA', label: 'Djakarta' },
  { value: 'GROSSE_CYLINDREE', label: 'Grosse Cylindrée' },
  { value: 'MOTO_TAXI', label: 'Moto Taxi' },
];

/**
 * Business types for Multirisk Pro
 */
export const BUSINESS_TYPES: { value: BusinessType; label: string }[] = [
  { value: 'BOUTIQUE', label: 'Boutique' },
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'HOTEL', label: 'Hôtel' },
  { value: 'BAR_CLUB', label: 'Bar/Club' },
];

/**
 * Auto formula labels
 */
export const AUTO_FORMULA_LABELS: Record<AutoFormulaType, string> = {
  TIERS: 'Tiers',
  ESSENTIELLE: 'Essentielle',
  ETENDUE: 'Étendue',
  CONFORT: 'Confort',
};

/**
 * Moto formula labels
 */
export const MOTO_FORMULA_LABELS: Record<MotoFormulaType, string> = {
  TIERS: 'Tiers',
  ESSENTIELLE: 'Essentielle',
};

/**
 * Product type labels
 */
export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  AUTO: 'Auto Prestige',
  MOTO: 'Moto',
  MULTIRISK_PRO: 'Multirisque Professionnelle',
  IAC: 'Incapacité Accident Corporel',
  LEGACY: 'Produit Existant',
};
