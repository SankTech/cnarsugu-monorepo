# Design Document

## Overview

This design outlines the architecture for modernizing the CNAR Sugu insurance platform by creating a dedicated Next.js web application and updating the React Native mobile application. The solution uses a monorepo structure with shared packages for business logic, API integration, and utilities, ensuring consistency across platforms while leveraging platform-specific optimizations.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Monorepo Root                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   apps/web   │  │ apps/mobile  │  │ apps/admin   │      │
│  │  (Next.js)   │  │ (React Native│  │  (Optional)  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │               │
│         └──────────────────┴──────────────────┘              │
│                            │                                  │
│         ┌──────────────────┴──────────────────┐             │
│         │                                       │             │
│  ┌──────▼───────┐  ┌──────────────┐  ┌───────▼──────┐     │
│  │ packages/ui  │  │packages/api  │  │packages/utils│     │
│  │ (Shared UI)  │  │(API Client)  │  │ (Utilities)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │packages/types│  │packages/config│ │packages/schemas│    │
│  │(TypeScript)  │  │(Shared Config)│ │(Validation)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │   NestJS Backend API  │
                │   (Existing Service)  │
                └───────────────────────┘
```

### Technology Stack

**Web Application (apps/web):**
- Next.js 14+ (App Router)
- React 18+
- TypeScript 5+
- Tailwind CSS + shadcn/ui
- Redux Toolkit + RTK Query
- React Hook Form + Zod
- Framer Motion (animations)

**Mobile Application (apps/mobile):**
- React Native 0.74+
- Expo 51+ (managed workflow)
- TypeScript 5+
- NativeWind (Tailwind for RN)
- React Navigation 6+
- Redux Toolkit + RTK Query
- React Hook Form + Zod

**Shared Packages:**
- TypeScript for all packages
- Zod for validation schemas
- Redux Toolkit for state management
- RTK Query for API integration
- Date-fns for date utilities

**Development Tools:**
- Turborepo (monorepo orchestration)
- pnpm (package management)
- ESLint + Prettier
- Husky + lint-staged
- Vitest (unit tests)
- Playwright (E2E web)
- Detox (E2E mobile)

## Components and Interfaces

### Monorepo Structure

```
cnarsugu/
├── apps/
│   ├── web/                          # Next.js web application
│   │   ├── src/
│   │   │   ├── app/                  # App Router pages
│   │   │   │   ├── page.tsx          # Home page
│   │   │   │   ├── products/         # Insurance products
│   │   │   │   ├── coverage/         # Coverage selection
│   │   │   │   ├── enrollment/       # User enrollment
│   │   │   │   ├── payment/          # Payment flow
│   │   │   │   └── confirmation/     # Confirmation page
│   │   │   ├── components/           # Web-specific components
│   │   │   ├── hooks/                # Web-specific hooks
│   │   │   ├── lib/                  # Web utilities
│   │   │   └── styles/               # Global styles
│   │   ├── public/                   # Static assets
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   └── package.json
│   │
│   └── mobile/                       # React Native mobile app
│       ├── src/
│       │   ├── screens/              # Screen components
│       │   │   ├── HomeScreen.tsx
│       │   │   ├── ProductsScreen.tsx
│       │   │   ├── CoverageScreen.tsx
│       │   │   ├── EnrollmentScreen.tsx
│       │   │   ├── PaymentScreen.tsx
│       │   │   └── ConfirmationScreen.tsx
│       │   ├── components/           # Mobile-specific components
│       │   ├── navigation/           # Navigation setup
│       │   ├── hooks/                # Mobile-specific hooks
│       │   └── lib/                  # Mobile utilities
│       ├── app.json
│       ├── App.tsx
│       └── package.json
│
├── packages/
│   ├── store/                        # Redux store package
│   │   ├── src/
│   │   │   ├── store.ts              # Store configuration
│   │   │   ├── api/                  # RTK Query API slices
│   │   │   │   ├── baseApi.ts        # Base API configuration
│   │   │   │   ├── insuranceApi.ts   # Insurance endpoints
│   │   │   │   ├── subscriptionApi.ts # Subscription endpoints
│   │   │   │   ├── paymentApi.ts     # Payment endpoints
│   │   │   │   └── clientApi.ts      # Client endpoints
│   │   │   ├── slices/               # Redux slices
│   │   │   │   ├── insuranceSlice.ts # Insurance state
│   │   │   │   ├── enrollmentSlice.ts # Enrollment state
│   │   │   │   └── paymentSlice.ts   # Payment state
│   │   │   └── types.ts              # State types
│   │   └── package.json
│   │
│   ├── ui/                           # Shared UI components
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Button/
│   │   │   │   ├── Input/
│   │   │   │   ├── Card/
│   │   │   │   ├── Modal/
│   │   │   │   └── Form/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── types/                        # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── insurance.ts
│   │   │   ├── subscription.ts
│   │   │   ├── payment.ts
│   │   │   ├── client.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── schemas/                      # Zod validation schemas
│   │   ├── src/
│   │   │   ├── enrollment.ts
│   │   │   ├── payment.ts
│   │   │   ├── contact.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── utils/                        # Shared utilities
│   │   ├── src/
│   │   │   ├── format.ts             # Formatting utilities
│   │   │   ├── validation.ts         # Validation helpers
│   │   │   ├── constants.ts          # Shared constants
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── config/                       # Shared configuration
│   │   ├── eslint-config/
│   │   ├── typescript-config/
│   │   └── tailwind-config/
│   │
│   └── hooks/                        # Shared React hooks
│       ├── src/
│       │   ├── useAppDispatch.ts
│       │   ├── useAppSelector.ts
│       │   └── index.ts
│       └── package.json
│
├── turbo.json                        # Turborepo configuration
├── pnpm-workspace.yaml               # pnpm workspace config
├── package.json                      # Root package.json
└── README.md
```

### Key Interfaces

#### Redux Store Structure

```typescript
// packages/store/src/types.ts
export interface RootState {
  insurance: InsuranceState;
  enrollment: EnrollmentState;
  payment: PaymentState;
  // RTK Query API states are automatically added
}

export interface InsuranceState {
  selectedInsurance: Insurance | null;
  selectedCoverage: Coverage | null;
}

export interface EnrollmentState {
  enrollmentData: Partial<SubscriptionData>;
  currentStep: 'insurance' | 'coverage' | 'enrollment' | 'payment' | 'confirmation';
}

export interface PaymentState {
  paymentId: string | null;
  paymentStatus: 'idle' | 'pending' | 'success' | 'error';
}
```

#### RTK Query Base API

```typescript
// packages/store/src/api/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || process.env.API_URL,
    prepareHeaders: (headers) => {
      // Add auth token if available
      const token = getAuthToken();
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Insurance', 'Coverage', 'Subscription', 'Payment'],
  endpoints: () => ({}),
});
```

#### Insurance Types

```typescript
// packages/types/src/insurance.ts
export interface Insurance {
  id: number;
  title: string;
  description: string;
  price: number;
  type: 'Formule' | 'Produit' | 'Multirisque';
  icon: string;
  color: string;
}

export interface Coverage {
  id: number;
  insuranceId: number;
  type: string;
  category?: string;
  description: string;
  price: string;
  coverage: string[];
  coverageLink?: string;
  clientType?: 1 | 2; // 1: Individual, 2: Enterprise
  extraFields?: string[];
}
```

#### Subscription Types

```typescript
// packages/types/src/subscription.ts
export interface SubscriptionData {
  name: string;
  surname: string;
  phoneNumber: string;
  coverage: string;
  insurance: string;
  price: string;
  extraData?: string;
  attachments?: File[];
  paymentId?: string;
}

export interface Subscription extends SubscriptionData {
  id: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  read: boolean;
  createdAt: Date;
  payment?: Payment;
}
```

#### Payment Types

```typescript
// packages/types/src/payment.ts
export interface PaymentMethod {
  id: number;
  serviceCode: string;
  title: string;
  validationCall: string;
}

export interface PaymentRequest {
  amount: string;
  phoneNumber: string;
  serviceCode: string;
}

export interface Payment {
  id: number;
  idFromClient: string;
  status: 'UNPAID' | 'PAID' | 'ERROR';
  amount: string;
  recipientNumber: string;
  serviceCode: string;
  createdAt: Date;
}
```

### Component Architecture

#### Web Components (apps/web)

```typescript
// apps/web/src/components/InsuranceCard.tsx
interface InsuranceCardProps {
  insurance: Insurance;
  onSelect: (insurance: Insurance) => void;
}

// apps/web/src/components/CoverageList.tsx
interface CoverageListProps {
  coverages: Coverage[];
  onSelectCoverage: (coverage: Coverage) => void;
}

// apps/web/src/components/EnrollmentForm.tsx
interface EnrollmentFormProps {
  coverage: Coverage;
  onSubmit: (data: EnrollmentFormData) => Promise<void>;
}

// apps/web/src/components/PaymentSelector.tsx
interface PaymentSelectorProps {
  amount: string;
  onPaymentComplete: (paymentId: string) => void;
}
```

#### Mobile Components (apps/mobile)

```typescript
// apps/mobile/src/components/InsuranceCard.tsx
interface InsuranceCardProps {
  insurance: Insurance;
  onPress: () => void;
}

// apps/mobile/src/components/CoverageItem.tsx
interface CoverageItemProps {
  coverage: Coverage;
  onPress: () => void;
}

// apps/mobile/src/screens/EnrollmentScreen.tsx
interface EnrollmentScreenProps {
  route: RouteProp<RootStackParamList, 'Enrollment'>;
  navigation: NavigationProp<RootStackParamList>;
}
```

## Data Models

### State Management with Redux Toolkit

#### Redux Slices

```typescript
// packages/store/src/slices/insuranceSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const insuranceSlice = createSlice({
  name: 'insurance',
  initialState: {
    selectedInsurance: null,
    selectedCoverage: null,
  } as InsuranceState,
  reducers: {
    setSelectedInsurance: (state, action: PayloadAction<Insurance>) => {
      state.selectedInsurance = action.payload;
    },
    setSelectedCoverage: (state, action: PayloadAction<Coverage>) => {
      state.selectedCoverage = action.payload;
    },
    clearSelection: (state) => {
      state.selectedInsurance = null;
      state.selectedCoverage = null;
    },
  },
});

export const { setSelectedInsurance, setSelectedCoverage, clearSelection } = insuranceSlice.actions;
export default insuranceSlice.reducer;

// packages/store/src/slices/enrollmentSlice.ts
const enrollmentSlice = createSlice({
  name: 'enrollment',
  initialState: {
    enrollmentData: {},
    currentStep: 'insurance',
  } as EnrollmentState,
  reducers: {
    updateEnrollmentData: (state, action: PayloadAction<Partial<SubscriptionData>>) => {
      state.enrollmentData = { ...state.enrollmentData, ...action.payload };
    },
    setCurrentStep: (state, action: PayloadAction<EnrollmentState['currentStep']>) => {
      state.currentStep = action.payload;
    },
    clearEnrollmentData: (state) => {
      state.enrollmentData = {};
      state.currentStep = 'insurance';
    },
  },
});

// packages/store/src/slices/paymentSlice.ts
const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    paymentId: null,
    paymentStatus: 'idle',
  } as PaymentState,
  reducers: {
    setPaymentId: (state, action: PayloadAction<string>) => {
      state.paymentId = action.payload;
    },
    setPaymentStatus: (state, action: PayloadAction<PaymentState['paymentStatus']>) => {
      state.paymentStatus = action.payload;
    },
    clearPayment: (state) => {
      state.paymentId = null;
      state.paymentStatus = 'idle';
    },
  },
});
```

#### RTK Query API Endpoints

```typescript
// packages/store/src/api/insuranceApi.ts
import { baseApi } from './baseApi';

export const insuranceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInsurances: builder.query<Insurance[], void>({
      query: () => '/insurances',
      providesTags: ['Insurance'],
      keepUnusedDataFor: 300, // 5 minutes cache
    }),
    getCoverages: builder.query<Coverage[], number>({
      query: (insuranceId) => `/insurances/${insuranceId}/coverages`,
      providesTags: (result, error, insuranceId) => [
        { type: 'Coverage', id: insuranceId },
      ],
    }),
  }),
});

export const { useGetInsurancesQuery, useGetCoveragesQuery } = insuranceApi;

// packages/store/src/api/subscriptionApi.ts
export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSubscription: builder.mutation<Subscription, SubscriptionData>({
      query: (data) => ({
        url: '/subscriptions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subscription'],
    }),
    getSubscription: builder.query<Subscription, number>({
      query: (id) => `/subscriptions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Subscription', id }],
    }),
  }),
});

export const { useCreateSubscriptionMutation, useGetSubscriptionQuery } = subscriptionApi;

// packages/store/src/api/paymentApi.ts
export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPayment: builder.mutation<Payment, PaymentRequest>({
      query: (data) => ({
        url: '/payments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payment'],
    }),
    getPaymentStatus: builder.query<Payment, string>({
      query: (paymentId) => `/payments/${paymentId}`,
      providesTags: (result, error, id) => [{ type: 'Payment', id }],
    }),
  }),
});

export const { useCreatePaymentMutation, useGetPaymentStatusQuery } = paymentApi;
```

#### Store Configuration

```typescript
// packages/store/src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from './api/baseApi';
import insuranceReducer from './slices/insuranceSlice';
import enrollmentReducer from './slices/enrollmentSlice';
import paymentReducer from './slices/paymentSlice';

export const createStore = () => {
  const store = configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      insurance: insuranceReducer,
      enrollment: enrollmentReducer,
      payment: paymentReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });

  setupListeners(store.dispatch);
  
  return store;
};

export type RootState = ReturnType<ReturnType<typeof createStore>['getState']>;
export type AppDispatch = ReturnType<typeof createStore>['dispatch'];

// packages/hooks/src/useAppDispatch.ts
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@cnarsugu/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();

// packages/hooks/src/useAppSelector.ts
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '@cnarsugu/store';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### Validation Schemas

```typescript
// packages/schemas/src/enrollment.ts
import { z } from 'zod';

export const individualEnrollmentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  surname: z.string().min(2, 'Surname must be at least 2 characters'),
  phoneNumber: z.string().regex(/^\d{8,}$/, 'Invalid phone number'),
  activity: z.string().optional(),
});

export const enterpriseEnrollmentSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  address: z.string().min(5, 'Address is required'),
  owner: z.string().optional(),
  activity: z.string().optional(),
  phoneNumber: z.string().regex(/^\d{8,}$/, 'Invalid phone number'),
});

export type IndividualEnrollmentData = z.infer<typeof individualEnrollmentSchema>;
export type EnterpriseEnrollmentData = z.infer<typeof enterpriseEnrollmentSchema>;

// packages/schemas/src/payment.ts
export const paymentSchema = z.object({
  phoneNumber: z.string().regex(/^\d{8,}$/, 'Invalid phone number'),
  serviceCode: z.string().min(1, 'Payment method is required'),
  amount: z.string().min(1, 'Amount is required'),
});

export type PaymentData = z.infer<typeof paymentSchema>;
```

## Data Flow

### User Journey Flow

```
1. Browse Products
   ├─> Web: Server-rendered product list
   └─> Mobile: Fetch products on mount

2. Select Coverage
   ├─> Store selected insurance in Zustand
   ├─> Fetch coverages for selected insurance
   └─> Display coverage options

3. Enrollment
   ├─> Determine client type (Individual/Enterprise)
   ├─> Validate form with Zod schema
   ├─> Store enrollment data in Zustand
   └─> Navigate to payment

4. Payment
   ├─> Select payment method
   ├─> Validate payment data
   ├─> Create payment via API
   ├─> Store payment ID
   └─> Navigate to confirmation

5. Confirmation
   ├─> Create subscription with payment ID
   ├─> Display success message
   └─> Clear state
```

### API Integration Flow

```
Component
   │
   ├─> TanStack Query Hook
   │      │
   │      ├─> API Client Function
   │      │      │
   │      │      ├─> Axios Request
   │      │      │      │
   │      │      │      └─> NestJS Backend
   │      │      │
   │      │      └─> Response Validation (Zod)
   │      │
   │      └─> Cache Management
   │
   └─> Update UI
```

## Correctness Properties


*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Product loading performance

*For any* WebApp page load, when fetching insurance products, the data should be displayed within 2 seconds under normal network conditions
**Validates: Requirements 1.1**

### Property 2: Coverage navigation consistency

*For any* selected insurance product, navigating to the coverage page should fetch and display the correct coverages associated with that product
**Validates: Requirements 1.2**

### Property 3: Server-side rendering verification

*For any* WebApp page, the initial HTML response should contain pre-rendered content (not just loading spinners or empty divs)
**Validates: Requirements 1.3**

### Property 4: Responsive layout adaptation

*For any* viewport size (mobile, tablet, desktop), the WebApp layout should adapt without horizontal scrolling or content overflow
**Validates: Requirements 1.5**

### Property 5: Form validation feedback

*For any* form with invalid input data, the system should prevent submission and display specific validation error messages for each invalid field
**Validates: Requirements 2.4, 3.4**

### Property 6: Loading and error state display

*For any* data fetching operation, the system should display a loading indicator during the fetch and an error message if the fetch fails
**Validates: Requirements 2.5**

### Property 7: Coverage selection navigation

*For any* coverage plan selection, the system should navigate to the enrollment form with the selected coverage data available
**Validates: Requirements 3.1**

### Property 8: Enrollment data persistence

*For any* valid enrollment form submission, the data should be stored in state and accessible on the payment screen
**Validates: Requirements 3.5**

### Property 9: Payment method phone input

*For any* mobile money payment method selection (Orange Money, Moov Money, Wave), the system should display a phone number input field
**Validates: Requirements 4.2**

### Property 10: Payment API integration

*For any* valid payment submission, the system should make an API call and receive a payment ID in the response
**Validates: Requirements 4.3, 4.4**

### Property 11: Payment completion flow

*For any* successful payment transaction, the system should update the payment status and navigate to the confirmation screen
**Validates: Requirements 4.5**

### Property 12: Cross-platform validation consistency

*For any* form validation schema, the same input data should produce the same validation result on both web and mobile platforms
**Validates: Requirements 5.3**

### Property 13: Cross-platform error handling consistency

*For any* API error response, both web and mobile applications should display equivalent user-friendly error messages
**Validates: Requirements 5.5**

### Property 14: Data caching behavior

*For any* repeated API request within the cache time window, the system should return cached data without making a new network request
**Validates: Requirements 6.4**

### Property 15: HTTPS protocol enforcement

*For any* API request from either application, the request URL should use the HTTPS protocol
**Validates: Requirements 8.1**

### Property 16: Secure token storage

*For any* authentication token, the web app should store it in httpOnly cookies and the mobile app should store it in secure storage (Keychain/Keystore)
**Validates: Requirements 8.2**

### Property 17: Input sanitization

*For any* user input containing potentially dangerous characters (script tags, SQL injection patterns), the system should sanitize or reject the input before sending to the API
**Validates: Requirements 8.3**

### Property 18: Error message safety

*For any* API error response, the displayed error message should not contain stack traces, database errors, or internal system details
**Validates: Requirements 8.4**

### Property 19: Sensitive data encryption

*For any* sensitive data stored locally (payment info, personal details), the data should be encrypted before storage
**Validates: Requirements 8.5**

### Property 20: Multi-step progress indication

*For any* multi-step flow (enrollment → payment → confirmation), the system should display a progress indicator showing the current step
**Validates: Requirements 9.3**

### Property 21: User-friendly error messages

*For any* error state, the system should display a message in user-friendly language (French) without technical jargon
**Validates: Requirements 9.4**

### Property 22: API response validation

*For any* API response, the system should validate the response structure against expected TypeScript types and handle invalid responses gracefully
**Validates: Requirements 10.2**

### Property 23: Development build performance

*For any* development build, the build process should complete in under 30 seconds from a clean state
**Validates: Requirements 12.5**

## Error Handling

### Error Categories

1. **Network Errors**
   - Connection timeout
   - No internet connection
   - Server unavailable (5xx errors)

2. **Validation Errors**
   - Invalid form input
   - Missing required fields
   - Format errors (phone number, email)

3. **Business Logic Errors**
   - Payment failed
   - Subscription already exists
   - Invalid coverage selection

4. **System Errors**
   - Unexpected API responses
   - State management errors
   - Navigation errors

### Error Handling Strategy

```typescript
// packages/api/src/error-handler.ts
export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public code?: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Une erreur est survenue';
    const code = error.response?.data?.code;
    
    return new ApiError(message, status, code, error.response?.data);
  }
  
  return new ApiError('Une erreur inattendue est survenue', 500);
}

// Usage in components
try {
  await createPayment(paymentData);
} catch (error) {
  const apiError = handleApiError(error);
  
  if (apiError.status === 400) {
    // Show validation errors
    showValidationErrors(apiError.details);
  } else if (apiError.status >= 500) {
    // Show generic server error
    showErrorToast('Le serveur est temporairement indisponible');
  } else {
    // Show specific error message
    showErrorToast(apiError.message);
  }
}
```

### Retry Strategy

```typescript
// packages/api/src/client.ts
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// Add retry logic for failed requests
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    // Retry on network errors or 5xx errors
    if (!config || !config.retry) {
      config.retry = 0;
    }
    
    const shouldRetry = 
      (!error.response || error.response.status >= 500) &&
      config.retry < 3;
    
    if (shouldRetry) {
      config.retry += 1;
      const delay = Math.pow(2, config.retry) * 1000; // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
      return apiClient(config);
    }
    
    return Promise.reject(error);
  }
);
```

## Testing Strategy

### Unit Testing

**Scope:** Business logic, utilities, validation schemas, API client functions

**Tools:** Vitest, Testing Library

**Coverage Targets:**
- Validation schemas: 100%
- Utility functions: 90%
- API client functions: 85%
- Business logic hooks: 80%

**Example Tests:**

```typescript
// packages/schemas/src/__tests__/enrollment.test.ts
import { describe, it, expect } from 'vitest';
import { individualEnrollmentSchema } from '../enrollment';

describe('individualEnrollmentSchema', () => {
  it('should validate correct individual data', () => {
    const validData = {
      name: 'Amadou',
      surname: 'Diallo',
      phoneNumber: '94022157',
    };
    
    const result = individualEnrollmentSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
  
  it('should reject invalid phone numbers', () => {
    const invalidData = {
      name: 'Amadou',
      surname: 'Diallo',
      phoneNumber: '123', // Too short
    };
    
    const result = individualEnrollmentSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
```

### Property-Based Testing

**Library:** fast-check (JavaScript/TypeScript property-based testing)

**Configuration:** Minimum 100 iterations per property test

**Property Tests:**

```typescript
// packages/schemas/src/__tests__/enrollment.property.test.ts
import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { individualEnrollmentSchema } from '../enrollment';

describe('Property: Form validation consistency', () => {
  it('should consistently validate phone numbers across all inputs', () => {
    // **Feature: web-frontend-modernization, Property 12: Cross-platform validation consistency**
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 2 }),
          surname: fc.string({ minLength: 2 }),
          phoneNumber: fc.string({ minLength: 8 }).filter(s => /^\d+$/.test(s)),
        }),
        (data) => {
          const result = individualEnrollmentSchema.safeParse(data);
          // Valid phone numbers should always pass
          expect(result.success).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// packages/api/src/__tests__/error-handler.property.test.ts
describe('Property: Error message safety', () => {
  it('should never expose internal details in error messages', () => {
    // **Feature: web-frontend-modernization, Property 18: Error message safety**
    fc.assert(
      fc.property(
        fc.record({
          status: fc.integer({ min: 400, max: 599 }),
          message: fc.string(),
          stack: fc.string(),
          internalCode: fc.string(),
        }),
        (errorData) => {
          const apiError = new ApiError(errorData.message, errorData.status);
          const displayMessage = apiError.message;
          
          // Error message should not contain stack traces or internal codes
          expect(displayMessage).not.toContain('at ');
          expect(displayMessage).not.toContain('Error:');
          expect(displayMessage).not.toContain(errorData.stack);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// packages/api/src/__tests__/caching.property.test.ts
describe('Property: Data caching behavior', () => {
  it('should return cached data for repeated requests within cache window', () => {
    // **Feature: web-frontend-modernization, Property 14: Data caching behavior**
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        async (insuranceId) => {
          const queryClient = new QueryClient();
          
          // First request
          const firstResult = await queryClient.fetchQuery({
            queryKey: ['insurance', insuranceId],
            queryFn: () => fetchInsurance(insuranceId),
            staleTime: 5 * 60 * 1000,
          });
          
          // Second request within cache window
          const secondResult = await queryClient.fetchQuery({
            queryKey: ['insurance', insuranceId],
            queryFn: () => fetchInsurance(insuranceId),
          });
          
          // Should return same data without new fetch
          expect(secondResult).toEqual(firstResult);
          expect(fetchInsurance).toHaveBeenCalledTimes(1);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Integration Testing

**Scope:** API integration, state management, navigation flows

**Tools:** Vitest, MSW (Mock Service Worker)

**Example Tests:**

```typescript
// apps/web/src/__tests__/integration/enrollment-flow.test.tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { EnrollmentPage } from '@/app/enrollment/page';

const server = setupServer(
  http.post('/api/subscriptions', () => {
    return HttpResponse.json({ id: 1, status: 'PENDING' });
  })
);

beforeEach(() => server.listen());

describe('Enrollment Flow Integration', () => {
  it('should complete enrollment and navigate to payment', async () => {
    render(<EnrollmentPage />);
    
    // Fill form
    await userEvent.type(screen.getByLabelText('Nom'), 'Diallo');
    await userEvent.type(screen.getByLabelText('Prénom'), 'Amadou');
    await userEvent.type(screen.getByLabelText('Téléphone'), '94022157');
    
    // Submit
    await userEvent.click(screen.getByText('Suivant'));
    
    // Should navigate to payment
    await waitFor(() => {
      expect(window.location.pathname).toBe('/payment');
    });
  });
});
```

### End-to-End Testing

**Web:** Playwright
**Mobile:** Detox

**Critical User Flows:**
1. Browse products → Select coverage → Enroll → Pay → Confirm
2. Error handling (network failure, validation errors)
3. Multi-device responsive behavior (web only)

```typescript
// apps/web/e2e/subscription-flow.spec.ts
import { test, expect } from '@playwright/test';

test('complete subscription flow', async ({ page }) => {
  // Navigate to home
  await page.goto('/');
  
  // Select insurance product
  await page.click('text=Assurance Auto');
  
  // Select coverage
  await page.click('text=Formule Tiers');
  await page.click('text=Souscrire');
  
  // Fill enrollment form
  await page.fill('[name="name"]', 'Diallo');
  await page.fill('[name="surname"]', 'Amadou');
  await page.fill('[name="phoneNumber"]', '94022157');
  await page.click('text=Suivant');
  
  // Select payment method
  await page.click('text=Orange Money');
  await page.fill('[name="phoneNumber"]', '94022157');
  await page.click('text=Payer');
  
  // Verify confirmation
  await expect(page.locator('text=Souscription confirmée')).toBeVisible();
});
```

## Performance Optimization

### Web Application

1. **Code Splitting**
   - Route-based splitting (automatic with Next.js App Router)
   - Component lazy loading for heavy components
   - Dynamic imports for payment integrations

2. **Image Optimization**
   - Use Next.js Image component
   - WebP format with fallbacks
   - Responsive images with srcset
   - Lazy loading below the fold

3. **Caching Strategy**
   - Static pages: ISR with 1-hour revalidation
   - API responses: TanStack Query with 5-minute stale time
   - CDN caching for static assets

4. **Bundle Optimization**
   - Tree shaking unused code
   - Minimize third-party dependencies
   - Use barrel exports carefully
   - Analyze bundle with @next/bundle-analyzer

### Mobile Application

1. **List Virtualization**
   - Use FlashList for long lists
   - Implement pagination for large datasets
   - Optimize item rendering

2. **Image Optimization**
   - Use Expo Image with caching
   - Compress images before upload
   - Lazy load images

3. **Navigation Optimization**
   - Use native stack navigator
   - Implement screen preloading
   - Optimize transition animations

4. **State Management**
   - Minimize re-renders with proper memoization
   - Use Zustand for lightweight global state
   - TanStack Query for server state

## Security Considerations

### Authentication & Authorization

```typescript
// packages/api/src/auth.ts
export async function getAuthToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    // Web: Token in httpOnly cookie (handled by browser)
    return null; // Cookie sent automatically
  } else {
    // Mobile: Token in secure storage
    return await SecureStore.getItemAsync('auth_token');
  }
}

export async function setAuthToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    // Web: Set via API response (httpOnly cookie)
    // No client-side storage needed
  } else {
    // Mobile: Store in secure storage
    await SecureStore.setItemAsync('auth_token', token);
  }
}
```

### Input Sanitization

```typescript
// packages/utils/src/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeInput(input: string): string {
  // Remove HTML tags and dangerous characters
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
}

export function sanitizePhoneNumber(phone: string): string {
  // Keep only digits
  return phone.replace(/\D/g, '');
}
```

### HTTPS Enforcement

```typescript
// packages/api/src/client.ts
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Ensure HTTPS in production
apiClient.interceptors.request.use((config) => {
  if (process.env.NODE_ENV === 'production' && !config.url?.startsWith('https://')) {
    throw new Error('HTTPS required in production');
  }
  return config;
});
```

## Deployment Strategy

### Web Application (Next.js)

**Platform:** Vercel (recommended) or self-hosted

**Configuration:**
```javascript
// next.config.js
module.exports = {
  output: 'standalone',
  images: {
    domains: ['api.cnarsugu.com'],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};
```

**Environment Variables:**
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_PAYMENT_CALLBACK_URL`: Payment callback URL

### Mobile Application

**Platform:** Expo EAS Build

**Configuration:**
```json
// eas.json
{
  "build": {
    "production": {
      "env": {
        "API_URL": "https://api.cnarsugu.com"
      }
    },
    "development": {
      "developmentClient": true,
      "env": {
        "API_URL": "https://dev-api.cnarsugu.com"
      }
    }
  }
}
```

## Migration Strategy

### Phase 1: Setup Monorepo (Week 1)
- Initialize Turborepo structure
- Set up shared packages
- Configure TypeScript, ESLint, Prettier
- Set up CI/CD pipelines

### Phase 2: Shared Packages (Week 2)
- Migrate API client to shared package
- Create TypeScript types package
- Create validation schemas package
- Create utilities package

### Phase 3: Web Application (Weeks 3-5)
- Set up Next.js application
- Implement pages and routing
- Migrate components to React
- Implement state management
- Add tests

### Phase 4: Mobile Application Update (Weeks 6-7)
- Update React Native to latest version
- Migrate to new navigation
- Update state management
- Refactor components
- Add tests

### Phase 5: Testing & QA (Week 8)
- Integration testing
- E2E testing
- Performance testing
- Security audit
- User acceptance testing

### Phase 6: Deployment (Week 9)
- Deploy web application
- Release mobile app updates
- Monitor performance
- Gather user feedback
- Iterate on improvements
