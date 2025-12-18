/**
 * Data Service for Web Application
 * Provides a unified interface for data fetching with fallback support
 * Similar to the mobile app's dataService but adapted for web
 */

import {
  getPaymentMethods,
  getTermsAndConditions,
  getCachedPaymentMethods,
  getCachedTermsAndConditions,
  type PaymentMethod,
  type TermsAndConditions,
} from './api';

import type {
  InsuranceProduct,
  CoverageFormula,
  ProductFilters,
  SearchFilters,
} from './api';

// Fallback data (similar to mobile app's hardcoded data)
const FALLBACK_INSURANCE_PRODUCTS: InsuranceProduct[] = [
  {
    id: 1,
    title: 'Auto Prestige',
    description: 'Assurance automobile complète avec plusieurs formules adaptées à votre véhicule',
    productType: 'AUTO',
    clientType: 3,
    color: '#0768AE',
    coverage: [
      'Responsabilité civile',
      'Défense et recours',
      'Assistance 24h/7j',
      'Protection juridique'
    ],
    extraFields: [],
    iconUrl: '/icons/auto.png',
    backgroundUrl: '/images/auto-bg.jpg'
  },
  {
    id: 2,
    title: 'Moto',
    description: 'Protection complète pour votre deux-roues avec formules Tiers et Essentielle',
    productType: 'MOTO',
    clientType: 3,
    color: '#029D40',
    coverage: [
      'Responsabilité civile',
      'Défense et recours',
      'Vol et incendie',
      'Assistance dépannage'
    ],
    extraFields: [],
    iconUrl: '/icons/moto.png',
    backgroundUrl: '/images/moto-bg.jpg'
  },
  {
    id: 3,
    title: 'Multirisque Professionnelle',
    description: 'Packages professionnels pour restaurants, hôtels, boutiques et bars',
    productType: 'MULTIRISK_PRO',
    clientType: 2,
    color: '#F8F104',
    coverage: [
      'Incendie et périls annexes',
      'Vol et vandalisme',
      'Dégâts des eaux',
      'Responsabilité civile exploitation'
    ],
    extraFields: [],
    iconUrl: '/icons/multirisk.png',
    backgroundUrl: '/images/multirisk-bg.jpg'
  },
  {
    id: 4,
    title: 'IAC',
    description: 'Indemnité Accident Corporel - Protection en cas d\'accident',
    productType: 'IAC',
    clientType: 3,
    color: '#DC0123',
    coverage: [
      'Capital décès: 2,000,000 FCFA',
      'Capital invalidité: 2,000,000 FCFA',
      'Frais de traitement: 500,000 FCFA'
    ],
    extraFields: [],
    iconUrl: '/icons/iac.png',
    backgroundUrl: '/images/iac-bg.jpg'
  },
  // Legacy products
  {
    id: 5,
    title: 'Santé (+AMO)',
    description: 'Couverture maladie et accident complète',
    productType: 'LEGACY',
    clientType: 3,
    color: '#4CAF50',
    coverage: [
      'Soins médicaux',
      'Hospitalisation',
      'Pharmacie',
      'Analyses médicales'
    ],
    extraFields: [],
    iconUrl: '/icons/health.png'
  },
  {
    id: 6,
    title: 'Assistance Voyage',
    description: 'Voyagez l\'esprit tranquille partout dans le monde',
    productType: 'LEGACY',
    clientType: 3,
    color: '#2196F3',
    coverage: [
      'Assistance médicale',
      'Rapatriement',
      'Bagages',
      'Annulation voyage'
    ],
    extraFields: [],
    iconUrl: '/icons/travel.png'
  },
  {
    id: 7,
    title: 'Transport',
    description: 'Sécurité optimale pour vos marchandises',
    productType: 'LEGACY',
    clientType: 2,
    color: '#FF9800',
    coverage: [
      'Marchandises transportées',
      'Responsabilité transporteur',
      'Avaries communes',
      'Frais de sauvetage'
    ],
    extraFields: [],
    iconUrl: '/icons/transport.png'
  },
  {
    id: 8,
    title: 'Risques Techniques',
    description: 'Protection chantiers et équipements industriels',
    productType: 'LEGACY',
    clientType: 2,
    color: '#795548',
    coverage: [
      'Tous risques chantier',
      'Bris de machines',
      'Perte d\'exploitation',
      'Responsabilité décennale'
    ],
    extraFields: [],
    iconUrl: '/icons/technical.png'
  },
  {
    id: 9,
    title: 'RC Scolaire',
    description: 'Assurance scolaire pour les élèves et établissements',
    productType: 'LEGACY',
    clientType: 3,
    color: '#9C27B0',
    coverage: [
      'Responsabilité civile',
      'Accidents corporels',
      'Protection juridique',
      'Assistance scolaire'
    ],
    extraFields: [],
    iconUrl: '/icons/school.png'
  }
];

const FALLBACK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 1,
    title: 'Orange Money',
    serviceCode: 'ML_PAIEMENTMARCHAND_OM_TP',
    validationCall: '#144#37#',
    isActive: true
  },
  {
    id: 2,
    title: 'Moov Money',
    serviceCode: 'ML_PAIEMENTMARCHAND_MOOV_TP',
    validationCall: '#',
    isActive: true
  },
  {
    id: 3,
    title: 'Wave',
    serviceCode: 'ML_PAIEMENTWAVE_TP',
    validationCall: '#',
    isActive: true
  }
];

const FALLBACK_TERMS: TermsAndConditions[] = [
  {
    id: 1,
    title: "Contrat d'utilisation de l'application web",
    description: "Conditions générales d'utilisation de la plateforme CNAR Sugu",
    content: [
      {
        title: "Article 1 - Objet",
        content: "Les présentes conditions générales ont pour objet de définir les modalités et conditions d'utilisation de la plateforme CNAR Sugu."
      },
      {
        title: "Article 2 - Acceptation",
        content: "L'utilisation de la plateforme implique l'acceptation pleine et entière des présentes conditions générales."
      },
      {
        title: "Article 3 - Services",
        content: "CNAR Sugu propose des services d'assurance en ligne pour particuliers et entreprises."
      }
    ],
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

// Cache management
class WebCacheManager {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

class WebDataService {
  private cache = new WebCacheManager();

  // Insurance Products - Note: These methods now return fallback data
  // The actual API calls should use Redux hooks in components
  async getInsuranceProducts(filters: ProductFilters = {}, useCache = true): Promise<InsuranceProduct[]> {
    console.warn('DataService: getInsuranceProducts called - consider using Redux hooks instead');
    
    // Return filtered fallback data
    return FALLBACK_INSURANCE_PRODUCTS.filter(product => {
      if (filters.productType && product.productType !== filters.productType) return false;
      if (filters.clientType && product.clientType !== filters.clientType) return false;
      if (filters.search && !product.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }

  async getInsuranceProductById(id: number, useCache = true): Promise<InsuranceProduct | null> {
    console.warn('DataService: getInsuranceProductById called - consider using Redux hooks instead');
    return FALLBACK_INSURANCE_PRODUCTS.find(p => p.id === id) || null;
  }

  // Coverage Formulas - Note: This method now returns fallback data
  async getProductFormulas(productId: number, useCache = true): Promise<CoverageFormula[]> {
    console.warn('DataService: getProductFormulas called - consider using Redux hooks instead');
    // Return empty array for now - in a real app, you'd have fallback coverage data
    return [];
  }

  // Get all coverages (for backward compatibility with mobile app structure)
  async getAllCoverages(useCache = true): Promise<CoverageFormula[][]> {
    try {
      // Get formulas for main product types
      const autoCoverages = await this.getProductFormulas(1, useCache);
      const multiCoverages = await this.getProductFormulas(3, useCache);
      
      return [autoCoverages, multiCoverages];
    } catch (error) {
      console.warn('API failed, using fallback coverages:', error);
      return [[], []];
    }
  }

  // Payment Methods
  async getPaymentMethods(useCache = true): Promise<PaymentMethod[]> {
    if (useCache) {
      const cached = this.cache.get('payment_methods');
      if (cached) {
        return cached;
      }
    }

    try {
      const paymentMethods = await getPaymentMethods(true);
      this.cache.set('payment_methods', paymentMethods);
      return paymentMethods;
    } catch (error) {
      console.warn('API failed, using fallback payment methods:', error);
      return FALLBACK_PAYMENT_METHODS;
    }
  }

  // Terms and Conditions
  async getTermsAndConditions(useCache = true): Promise<TermsAndConditions[]> {
    if (useCache) {
      const cached = this.cache.get('terms_conditions');
      if (cached) {
        return cached;
      }
    }

    try {
      const terms = await getTermsAndConditions(true);
      this.cache.set('terms_conditions', terms);
      return terms;
    } catch (error) {
      console.warn('API failed, using fallback terms:', error);
      return FALLBACK_TERMS;
    }
  }

  // Search functionality - Note: This method now returns fallback data
  async searchProducts(searchParams: SearchFilters, useCache = true): Promise<InsuranceProduct[]> {
    console.warn('DataService: searchProducts called - consider using Redux hooks instead');
    
    // Simple fallback search in hardcoded data
    return FALLBACK_INSURANCE_PRODUCTS.filter(product => 
      product.title.toLowerCase().includes(searchParams.query?.toLowerCase() || '') ||
      product.description.toLowerCase().includes(searchParams.query?.toLowerCase() || '')
    );
  }

  // Cache management
  async clearCache(): Promise<void> {
    this.cache.clear();
    console.log('Cache cleared successfully');
  }

  async refreshData(): Promise<void> {
    await this.clearCache();
    // Pre-load essential data
    await Promise.all([
      this.getInsuranceProducts({}, false),
      this.getPaymentMethods(false),
      this.getTermsAndConditions(false)
    ]);
  }

  // Legacy product filtering
  getNewProducts(): Promise<InsuranceProduct[]> {
    return this.getInsuranceProducts({}).then(products => 
      products.filter(p => ['AUTO', 'MOTO', 'MULTIRISK_PRO', 'IAC'].includes(p.productType))
    );
  }

  getLegacyProducts(): Promise<InsuranceProduct[]> {
    return this.getInsuranceProducts({ 
      productType: 'LEGACY'
    });
  }

  // Product type specific methods
  async getAutoProducts(): Promise<InsuranceProduct[]> {
    return this.getInsuranceProducts({ productType: 'AUTO' });
  }

  async getMotoProducts(): Promise<InsuranceProduct[]> {
    return this.getInsuranceProducts({ productType: 'MOTO' });
  }

  async getMultiriskProducts(): Promise<InsuranceProduct[]> {
    return this.getInsuranceProducts({ productType: 'MULTIRISK_PRO' });
  }

  async getIACProducts(): Promise<InsuranceProduct[]> {
    return this.getInsuranceProducts({ productType: 'IAC' });
  }
}

// Export singleton instance
export default new WebDataService();