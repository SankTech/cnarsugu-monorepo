import { baseApi } from './baseApi';

export interface CreatePaymentV2Request {
    amount: string;
    phoneNumber: string;
    serviceCode: string;
    includeIac?: boolean;
    productType?: string;
}

export interface IacPriceResponse {
    price: number;
    currency: string;
    description: string;
}

export interface PaymentMethod {
    id: number;
    title: string;
    serviceCode: string;
    validationCall: string;
    isActive: boolean;
}

export const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createPaymentV2: builder.mutation<any, CreatePaymentV2Request>({
            query: (body) => ({
                url: '/v2/payment',
                method: 'POST',
                body,
            }),
        }),
        getIacPrice: builder.query<IacPriceResponse, void>({
            query: () => '/v2/payment/iac/price',
        }),
        getPaymentMethods: builder.query<PaymentMethod[], boolean | void>({
            query: (activeOnly = true) => `/v2/payment-methods?active_only=${activeOnly}`,
        }),
    }),
});

export const { useCreatePaymentV2Mutation, useGetIacPriceQuery, useGetPaymentMethodsQuery } = paymentApi;
