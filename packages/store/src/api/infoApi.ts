import { baseApi } from './baseApi';

export interface TermsAndConditions {
    id: number;
    title: string;
    description: string;
    content: any[];
    isActive: boolean;
    createdAt: string;
}

export const infoApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTermsAndConditions: builder.query<TermsAndConditions[], boolean | void>({
            query: (activeOnly = true) => `/v2/terms-conditions?active_only=${activeOnly}`,
        }),
    }),
});

export const { useGetTermsAndConditionsQuery } = infoApi;
