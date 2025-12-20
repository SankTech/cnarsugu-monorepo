import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

declare var process: any;


/**
 * Base API URL - can be overridden via environment variable
 * Uses globalThis to access environment variables in both Node and browser environments
 */
const getApiBaseUrl = (): string => {
  const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiUrl = process.env.API_URL;

  // Browser check
  if (typeof window !== 'undefined') {
    console.log('BaseAPI: Browser environment - NEXT_PUBLIC_API_URL:', publicApiUrl);
    // If NEXT_PUBLIC_API_URL is empty or undefined, fall back to production domain
    return (publicApiUrl && publicApiUrl.trim() !== '') ? publicApiUrl : 'https://cnarsugu.cloud';
  }

  // Server/Node check
  const resolvedUrl = (publicApiUrl && publicApiUrl.trim() !== '') ? publicApiUrl : apiUrl;
  console.log('BaseAPI: Server/Node - Final Resolved URL:', resolvedUrl || 'https://cnarsugu.cloud');

  return resolvedUrl || 'https://cnarsugu.cloud';
};

const API_BASE_URL = getApiBaseUrl();
console.log('BaseAPI: API_BASE_URL:', API_BASE_URL);
console.log('BaseAPI: Constructed baseUrl:', `${API_BASE_URL}`);

/**
 * Base API configuration for RTK Query
 * All API endpoints will extend this base API
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}`,
    prepareHeaders: (headers, { arg }) => {
      // Add API Key for authentication
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || '03e42c19-45d3-4bab-b5b2-d9b2eed04a62';
      headers.set('x-api-key', apiKey);

      // Add content type if not set and NOT FormData
      // When body is FormData, we MUST NOT set Content-Type to allow the browser to set it with its own boundary
      if (!headers.has('Content-Type') && !(arg instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
      }

      return headers;
    },
  }),
  tagTypes: ['AutoPricing', 'MotoPricing', 'MultirisquePackage', 'IACProduct', 'CoverageDefinition'],
  endpoints: () => ({}),
});
