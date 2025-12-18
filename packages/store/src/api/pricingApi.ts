import { baseApi } from './baseApi';
import type {
  AutoPricing,
  MotoPricing,
  MultirisquePackage,
  IACProduct,
  CoverageDefinition,
  AutoPricingQuery,
  MotoPricingQuery,
} from '@cnarsugu/types';

// New V2 API Types
export interface InsuranceProduct {
  id: number;
  title: string;
  description: string;
  productType: string;
  clientType: number;
  price?: string;
  color: string;
  coverage?: string[];
  coverageLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoverageFormula {
  id: number;
  type: string;
  category: string;
  description: string;
  price: string;
  coverage?: string[];
  coverageLink?: string;
  insuranceId: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilters {
  productType?: string;
  clientType?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface SearchFilters {
  productType?: string;
  clientType?: number;
  coverageFeatures?: string[];
  minPrice?: number;
  maxPrice?: number;
  query?: string;
}

/**
 * Pricing API endpoints using RTK Query
 * Updated to use new V2 API endpoints
 */
export const pricingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ============================================================================
    // V2 API Endpoints
    // ============================================================================
    
    /**
     * Get all insurance products with filtering (V2)
     */
    getInsuranceProducts: builder.query<PaginatedResult<InsuranceProduct>, ProductFilters | void>({
      query: (filters = {}) => {
        const safeFilters = filters || {};
        return {
          url: '/v2/products',
          params: {
            product_type: safeFilters.productType,
            client_type: safeFilters.clientType,
            min_price: safeFilters.minPrice,
            max_price: safeFilters.maxPrice,
            search: safeFilters.search,
            page: safeFilters.page || 1,
            limit: safeFilters.limit || 20,
          },
        };
      },
      providesTags: ['AutoPricing', 'MotoPricing', 'MultirisquePackage', 'IACProduct'],
    }),

    /**
     * Advanced product search (V2)
     */
    searchInsuranceProducts: builder.query<InsuranceProduct[], SearchFilters>({
      query: (filters) => ({
        url: '/v2/products/search',
        params: {
          product_type: filters.productType,
          client_type: filters.clientType,
          coverage_features: filters.coverageFeatures?.join(','),
          price_range: filters.minPrice && filters.maxPrice ? `${filters.minPrice}-${filters.maxPrice}` : undefined,
          q: filters.query,
        },
      }),
      providesTags: ['AutoPricing', 'MotoPricing', 'MultirisquePackage', 'IACProduct'],
    }),

    /**
     * Get specific product details (V2)
     */
    getInsuranceProduct: builder.query<InsuranceProduct, number>({
      query: (id) => `/v2/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'AutoPricing' as const, id }],
    }),

    /**
     * Get coverage formulas for a product (V2)
     */
    getProductFormulas: builder.query<CoverageFormula[], number>({
      query: (productId) => `/v2/products/${productId}/formulas`,
      providesTags: (_result, _error, productId) => [{ type: 'CoverageDefinition' as const, id: productId }],
    }),

    // ============================================================================
    // Legacy V1 Endpoints (Backward Compatibility)
    // ============================================================================
    
    /**
     * Get Auto Prestige pricing for a specific CV range (Legacy)
     */
    getAutoPricing: builder.query<AutoPricing[], AutoPricingQuery>({
      query: ({ cvMin, cvMax }) => ({
        url: '/pricing/auto',
        params: { cvMin, cvMax },
      }),
      providesTags: ['AutoPricing'],
    }),

    /**
     * Get all Auto Prestige pricing (all CV ranges and formulas) (Legacy)
     */
    getAllAutoPricing: builder.query<AutoPricing[], void>({
      query: () => '/pricing/auto/all',
      providesTags: ['AutoPricing'],
    }),

    /**
     * Get Moto pricing for a specific category (Legacy)
     */
    getMotoPricing: builder.query<MotoPricing[], MotoPricingQuery>({
      query: ({ category }) => ({
        url: '/pricing/moto',
        params: { category },
      }),
      providesTags: ['MotoPricing'],
    }),

    /**
     * Get all Moto pricing (all categories and formulas) (Legacy)
     */
    getAllMotoPricing: builder.query<MotoPricing[], void>({
      query: () => '/pricing/moto/all',
      providesTags: ['MotoPricing'],
    }),

    /**
     * Get all Multirisk Pro packages (Legacy)
     */
    getMultirisquePackages: builder.query<MultirisquePackage[], void>({
      query: () => '/pricing/multirisk-pro',
      providesTags: ['MultirisquePackage'],
    }),

    /**
     * Get a specific Multirisk Pro package by code (Legacy)
     */
    getMultirisquePackage: builder.query<MultirisquePackage, string>({
      query: (packageCode) => `/pricing/multirisk-pro/${packageCode}`,
      providesTags: ['MultirisquePackage'],
    }),

    /**
     * Get IAC product information (Legacy)
     */
    getIACProduct: builder.query<IACProduct, void>({
      query: () => '/pricing/iac',
      providesTags: ['IACProduct'],
    }),

    /**
     * Get all coverage definitions (Legacy)
     */
    getCoverageDefinitions: builder.query<CoverageDefinition[], void>({
      query: () => '/pricing/coverage-definitions',
      providesTags: ['CoverageDefinition'],
    }),
  }),
});

/**
 * Export hooks for use in components
 */
export const {
  // V2 API Hooks
  useGetInsuranceProductsQuery,
  useSearchInsuranceProductsQuery,
  useGetInsuranceProductQuery,
  useGetProductFormulasQuery,
  
  // Legacy V1 API Hooks (Backward Compatibility)
  useGetAutoPricingQuery,
  useGetAllAutoPricingQuery,
  useGetMotoPricingQuery,
  useGetAllMotoPricingQuery,
  useGetMultirisquePackagesQuery,
  useGetMultirisquePackageQuery,
  useGetIACProductQuery,
  useGetCoverageDefinitionsQuery,
} = pricingApi;
