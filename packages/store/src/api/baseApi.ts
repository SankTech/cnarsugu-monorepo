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
    // If NEXT_PUBLIC_API_URL is missing or literally "undefined", fall back
    if (!publicApiUrl || publicApiUrl === 'undefined' || publicApiUrl.trim() === '') {
      return 'https://cnarsugu.cloud';
    }
    return publicApiUrl;
  }

  // Server/Node check
  if (publicApiUrl && publicApiUrl !== 'undefined' && publicApiUrl.trim() !== '') return publicApiUrl;
  if (apiUrl && apiUrl !== 'undefined' && apiUrl.trim() !== '') return apiUrl;

  return 'https://cnarsugu.cloud';
};

const API_BASE_URL = getApiBaseUrl();

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
      let apiKey = process.env.NEXT_PUBLIC_API_KEY;

      // Handle cases where env var is missing or injected as literal string
      if (!apiKey || apiKey === 'undefined' || apiKey === 'null' || apiKey.trim() === '') {
        apiKey = '03e42c19-45d3-4bab-b5b2-d9b2eed04a62';
      }

      headers.set('x-api-key', apiKey);

      // Add content type if not set and NOT FormData
      if (!headers.has('Content-Type') && !(arg instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
      }

      return headers;
    },
  }),
  tagTypes: ['AutoPricing', 'MotoPricing', 'MultirisquePackage', 'IACProduct', 'CoverageDefinition'],
  endpoints: () => ({}),
});
