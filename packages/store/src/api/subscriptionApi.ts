import { baseApi } from './baseApi';

// Define types for subscription API
export interface CreateSubscriptionRequest {
  // Add specific fields as needed
  [key: string]: any;
}

export const subscriptionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createSubscriptionV2: builder.mutation<any, FormData>({
            query: (body) => ({
                url: '/v2/subscription',
                method: 'POST',
                body,
                // The browser will set the correct Content-Type (multipart/form-data) with boundary
                // when passing a FormData object. We might need to ensure 'Content-Type' is not forced to json.
                // But fetchBaseQuery default headers usually apply. 
                // We can unset content-type in prepareHeaders? 
                // Or simply passing FormData usually works with fetch.
            }),
            // We need to override the Content-Type header to undefined so the browser sets it
            // However, fetchBaseQuery might force application/json if we set it in baseApi.
            // We can try to rely on fetch behavior.
        }),
    }),
});

export const { useCreateSubscriptionV2Mutation } = subscriptionApi;
