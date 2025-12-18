/**
 * API service for the web application
 * Updated to work with Redux store and V2 API endpoints
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Define types locally since they're not properly exported from store yet
export interface InsuranceProduct {
  id: number;
  title: string;
  description: string;
  productType: string;
  clientType: number;
  price?: string;
  color: string;
  coverage: string[];
  extraFields: string[];
  iconUrl?: string;
  backgroundUrl?: string;
  coverageLink?: string;
  createdAt?: string;
  updatedAt?: string;
  formulas?: CoverageFormula[];
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

// Additional types for web app specific features
export interface PaymentMethod {
  id: number;
  title: string;
  serviceCode: string;
  validationCall: string;
  isActive: boolean;
}

export interface TermsAndConditions {
  id: number;
  title: string;
  description: string;
  content: any[];
  isActive: boolean;
  createdAt: string;
}

// HTTP Client
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${url}`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

const apiClient = new ApiClient(API_BASE_URL);

// Note: Insurance Products API calls are now handled by Redux store hooks
// These functions are kept for backward compatibility but should use Redux hooks instead

// Payment Methods API
export const getPaymentMethods = async (activeOnly: boolean = true): Promise<PaymentMethod[]> => {
  const params = activeOnly ? '?active_only=true' : '';
  return apiClient.get<PaymentMethod[]>(`/v2/payment-methods${params}`);
};

// Terms and Conditions API
export const getTermsAndConditions = async (activeOnly: boolean = true): Promise<TermsAndConditions[]> => {
  const params = activeOnly ? '?active_only=true' : '';
  return apiClient.get<TermsAndConditions[]>(`/v2/terms-conditions${params}`);
};

// Legacy API endpoints for backward compatibility
export const getLegacyInsuranceProducts = async (): Promise<any[]> => {
  return apiClient.get<any[]>('/insurance');
};

// Health Check API
export const getHealthStatus = async () => {
  return apiClient.get('/v2/deployment/health');
};

// Subscription/Enrollment API
export const submitEnrollment = async (enrollmentData: any) => {
  return apiClient.post('/subscriptions', enrollmentData);
};

export const submitPayment = async (paymentData: any) => {
  return apiClient.post('/payments', paymentData);
};

// Note: Pricing API calls are now handled by Redux store hooks
// Use useInsuranceProducts with specific productType filters instead

// Error handling utility
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Cache management for client-side caching
class CacheManager {
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

export const cache = new CacheManager();

// Note: Caching is now handled by Redux RTK Query automatically
// These functions are kept for backward compatibility

export const getCachedPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const cacheKey = 'payment_methods';
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return cached;
  }

  const methods = await getPaymentMethods();
  cache.set(cacheKey, methods);
  return methods;
};

export const getCachedTermsAndConditions = async (): Promise<TermsAndConditions[]> => {
  const cacheKey = 'terms_conditions';
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return cached;
  }

  const terms = await getTermsAndConditions();
  cache.set(cacheKey, terms);
  return terms;
};

export default apiClient;