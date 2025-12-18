import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

declare var process: any;


/**
 * Base API URL - can be overridden via environment variable
 * Uses globalThis to access environment variables in both Node and browser environments
 */
const getApiBaseUrl = (): string => {
  console.log('BaseAPI: resolving base URL');
  console.log('BaseAPI: typeof window:', typeof window);

  if (typeof window !== 'undefined') {
    // Browser environment - use relative path to allow proxying via Next.js
    console.log('BaseAPI: Browser environment detected, returning empty string');
    return '';
  }
  // Node environment or React Native
  console.log('BaseAPI: Server/Node environment detected');
  console.log('BaseAPI: process.env.API_URL:', process.env.API_URL);
  return process.env.API_URL || 'https://cnarsugu.cloud/';
};

const API_BASE_URL = getApiBaseUrl();
console.log('BaseAPI: API_BASE_URL:', API_BASE_URL);
console.log('BaseAPI: Constructed baseUrl:', `${API_BASE_URL}/api`);

/**
 * Base API configuration for RTK Query
 * All API endpoints will extend this base API
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api`,
    prepareHeaders: (headers) => {
      // Add any common headers here (e.g., authentication tokens)
      return headers;
    },
  }),
  tagTypes: ['AutoPricing', 'MotoPricing', 'MultirisquePackage', 'IACProduct', 'CoverageDefinition'],
  endpoints: () => ({}),
});
