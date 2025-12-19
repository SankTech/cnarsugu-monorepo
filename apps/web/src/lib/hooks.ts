/**
 * Custom React hooks for the web application
 * Updated to use Redux store with V2 API endpoints
 */

import { useState, useEffect, useCallback } from 'react';
import {
  useGetInsuranceProductsQuery,
  useGetInsuranceProductQuery,
  useGetProductFormulasQuery,
  useSearchInsuranceProductsQuery,
  useGetPaymentMethodsQuery,
  useGetTermsAndConditionsQuery,
} from '@cnarsugu/store';
import type {
  InsuranceProduct,
  CoverageFormula,
  ProductFilters,
  SearchFilters,
} from './api';
import {
  getPaymentMethods,
  getTermsAndConditions,
  getCachedPaymentMethods,
  getCachedTermsAndConditions,
  type PaymentMethod,
  type TermsAndConditions,
} from './api';

// Generic async hook
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
}

// Insurance Products hooks - temporarily using dataService until Redux hooks are fixed
// Insurance Products hooks - using Redux hooks
export function useInsuranceProducts(filters: ProductFilters = {}) {
  const { data, isLoading, error, refetch } = useGetInsuranceProductsQuery(filters);
  return {
    data: data?.data || [],
    loading: isLoading,
    error,
    refetch
  };
}

export function useInsuranceProduct(id: number) {
  const { data, isLoading, error, refetch } = useGetInsuranceProductQuery(id);
  return {
    data,
    loading: isLoading,
    error,
    refetch
  };
}

export function useProductFormulas(productId: number) {
  const { data, isLoading, error, refetch } = useGetProductFormulasQuery(productId);
  return {
    data: data || [],
    loading: isLoading,
    error,
    refetch
  };
}

export function useSearchProducts(searchParams: SearchFilters) {
  const { data, isLoading, error, refetch } = useSearchInsuranceProductsQuery(searchParams);
  return {
    data: data || [],
    loading: isLoading,
    error,
    refetch
  };
}

// Payment Methods hook
export function usePaymentMethods(useCache = true) {
  // RTK Query handles caching automatically
  const { data, isLoading, error, refetch } = useGetPaymentMethodsQuery(useCache);
  return {
    data: data || [],
    loading: isLoading,
    error,
    refetch
  };
}

// Terms and Conditions hook
export function useTermsAndConditions(useCache = true) {
  // RTK Query handles caching automatically
  const { data, isLoading, error, refetch } = useGetTermsAndConditionsQuery(useCache);
  return {
    data: data || [],
    loading: isLoading,
    error,
    refetch
  };
}

// Specific product type hooks using V2 API
export function useAutoPricing() {
  return useInsuranceProducts({ productType: 'auto' });
}

export function useMotoPricing() {
  return useInsuranceProducts({ productType: 'moto' });
}

export function useMultirisquePackages() {
  return useInsuranceProducts({ productType: 'multirisque' });
}

export function useIACProduct() {
  return useInsuranceProducts({ productType: 'iac' });
}

// Local storage hooks
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

// Shopping cart/enrollment state hook
export interface EnrollmentState {
  selectedProduct?: InsuranceProduct;
  selectedFormula?: CoverageFormula;
  personalInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    chassisNumber: string;
  };
  paymentMethod?: PaymentMethod;
  step: number;
}

export function useEnrollment() {
  const [enrollment, setEnrollment] = useLocalStorage<EnrollmentState>('enrollment', {
    step: 1,
  });

  const updateEnrollment = useCallback((updates: Partial<EnrollmentState>) => {
    setEnrollment(prev => ({ ...prev, ...updates }));
  }, [setEnrollment]);

  const nextStep = useCallback(() => {
    setEnrollment(prev => ({ ...prev, step: prev.step + 1 }));
  }, [setEnrollment]);

  const prevStep = useCallback(() => {
    setEnrollment(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  }, [setEnrollment]);

  const resetEnrollment = useCallback(() => {
    setEnrollment({ step: 1 });
  }, [setEnrollment]);

  return {
    enrollment,
    updateEnrollment,
    nextStep,
    prevStep,
    resetEnrollment,
  };
}

// Debounced search hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Search hook with debouncing using Redux store
export function useDebouncedSearch(searchTerm: string, filters: ProductFilters = {}) {
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const searchFilters = {
    ...filters,
    search: debouncedSearchTerm.trim() || undefined,
  };

  return useInsuranceProducts(searchFilters);
}

// Media query hook
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

// Responsive breakpoints
export function useBreakpoint() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  return {
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen: isMobile || isTablet,
  };
}

// Form validation hook
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Record<keyof T, (value: any) => string | null>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));

    // Validate field if it has been touched
    if (touched[field]) {
      const error = validationRules[field]?.(value);
      setErrors(prev => ({ ...prev, [field]: error || undefined }));
    }
  }, [validationRules, touched]);

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    // Validate field when touched
    const error = validationRules[field]?.(values[field]);
    setErrors(prev => ({ ...prev, [field]: error || undefined }));
  }, [validationRules, values]);

  const validateAll = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const error = validationRules[field as keyof T]?.(values[field as keyof T]);
      if (error) {
        newErrors[field as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, field) => ({
      ...acc,
      [field]: true,
    }), {}));

    return isValid;
  }, [validationRules, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
}

// Async form submission hook
export function useAsyncSubmit<T>(
  submitFunction: (data: T) => Promise<any>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(async (data: T) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await submitFunction(data);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Submission failed'));
    } finally {
      setLoading(false);
    }
  }, [submitFunction]);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    submit,
    loading,
    error,
    success,
    reset,
  };
}