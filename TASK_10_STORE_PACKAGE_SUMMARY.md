# Task 10: Redux Toolkit Store Package Implementation

## Summary

Successfully implemented the `@cnarsugu/store` package with Redux Toolkit and RTK Query for centralized state management and API calls.

## Completed Tasks

### Task 10: Create packages/store (Redux Toolkit)
✅ Set up Redux Toolkit with RTK Query
✅ Create baseApi pointing to backend v2
✅ Create pricingApi with all pricing endpoints
✅ Create slices for product selection
✅ Export store configuration

### Task 10.1: Create Redux slices
✅ productSelectionSlice (Auto/Moto/Multirisk/IAC)
✅ Keep existing enrollment and payment slices compatible

## Implementation Details

### 1. API Layer (`src/api/`)

#### Base API (`baseApi.ts`)
- Configured RTK Query with `fetchBaseQuery`
- Base URL: `http://localhost:3000/api/v2` (configurable via environment variables)
- Tag types for cache invalidation: AutoPricing, MotoPricing, MultirisquePackage, IACProduct, CoverageDefinition
- Common headers setup

#### Pricing API (`pricingApi.ts`)
Implemented all pricing endpoints with typed hooks:
- `useGetAutoPricingQuery({ cvMin, cvMax })` - Get Auto pricing for CV range
- `useGetAllAutoPricingQuery()` - Get all Auto pricing
- `useGetMotoPricingQuery({ category })` - Get Moto pricing for category
- `useGetAllMotoPricingQuery()` - Get all Moto pricing
- `useGetMultirisquePackagesQuery()` - Get all Multirisk Pro packages
- `useGetMultirisquePackageQuery(packageCode)` - Get specific package
- `useGetIACProductQuery()` - Get IAC product information
- `useGetCoverageDefinitionsQuery()` - Get coverage definitions

### 2. State Slices (`src/slices/`)

#### Product Selection Slice (`productSelectionSlice.ts`)
Manages product selection state with actions:
- `setProductType(type)` - Set selected product type
- `setAutoSelection(data)` - Set Auto product selection
- `toggleAutoIAC(boolean)` - Toggle IAC add-on for Auto
- `setMotoSelection(data)` - Set Moto product selection
- `setMultirisqueSelection(data)` - Set Multirisk Pro selection
- `setIACAddOn(data)` - Set IAC add-on details
- `toggleIACAddOn()` - Toggle IAC add-on selection
- `clearProductSelection()` - Clear all selections
- `clearAutoSelection()` - Clear Auto selection
- `clearMotoSelection()` - Clear Moto selection
- `clearMultirisqueSelection()` - Clear Multirisk selection

#### Enrollment Slice (`enrollmentSlice.ts`)
Manages enrollment/subscription flow:
- Form data management (name, surname, phone, etc.)
- Client type selection (INDIVIDUAL/BUSINESS)
- Multi-step form navigation
- Submission state and error handling
- Compatible with existing enrollment flows

#### Payment Slice (`paymentSlice.ts`)
Manages payment flow:
- Payment method selection (MOBILE_MONEY, CREDIT_CARD, PAYPAL)
- Payment form data
- Payment status tracking (PENDING, PROCESSING, SUCCESS, FAILED)
- Error handling
- Compatible with existing payment flows

### 3. Selectors (`src/selectors/`)

#### Product Selectors (`productSelectors.ts`)
- `selectProductType` - Get selected product type
- `selectAutoSelection` - Get Auto selection
- `selectMotoSelection` - Get Moto selection
- `selectMultirisqueSelection` - Get Multirisk selection
- `selectIACAddOn` - Get IAC add-on
- `selectTotalPrice` - Calculate total price with IAC
- `selectHasProductSelection` - Check if any product is selected
- `selectCurrentProductDetails` - Get current product details

#### Enrollment Selectors (`enrollmentSelectors.ts`)
- `selectEnrollmentForm` - Get form data
- `selectEnrollmentStep` - Get current step
- `selectIsEnrollmentSubmitting` - Check if submitting
- `selectEnrollmentError` - Get error message
- `selectIsEnrollmentFormValid` - Check if form is valid

#### Payment Selectors (`paymentSelectors.ts`)
- `selectPaymentForm` - Get payment form data
- `selectPaymentStatus` - Get payment status
- `selectPaymentId` - Get payment ID
- `selectIsPaymentProcessing` - Check if processing
- `selectPaymentError` - Get error message
- `selectIsPaymentSuccessful` - Check if payment succeeded
- `selectHasPaymentFailed` - Check if payment failed

### 4. Store Configuration (`store.ts`)

Configured Redux store with:
- RTK Query API reducer and middleware
- Product selection reducer
- Enrollment reducer
- Payment reducer
- Setup listeners for refetchOnFocus and refetchOnReconnect

### 5. Typed Hooks (`hooks.ts`)

Created typed versions of Redux hooks:
- `useAppDispatch` - Typed dispatch hook
- `useAppSelector` - Typed selector hook

### 6. Testing

Created comprehensive test suite (`__tests__/store.test.ts`):
- Store configuration tests
- Product selection tests (Auto, Moto, Multirisk)
- Selector tests (total price, has selection)
- All 7 tests passing ✅

## File Structure

```
packages/store/
├── src/
│   ├── api/
│   │   ├── baseApi.ts
│   │   └── pricingApi.ts
│   ├── slices/
│   │   ├── productSelectionSlice.ts
│   │   ├── enrollmentSlice.ts
│   │   └── paymentSlice.ts
│   ├── selectors/
│   │   ├── productSelectors.ts
│   │   ├── enrollmentSelectors.ts
│   │   └── paymentSelectors.ts
│   ├── __tests__/
│   │   └── store.test.ts
│   ├── store.ts
│   ├── hooks.ts
│   └── index.ts
├── dist/ (compiled output)
├── jest.config.js
├── tsconfig.json
├── package.json
└── README.md
```

## Dependencies

- `@reduxjs/toolkit`: ^2.2.1 - Redux Toolkit for state management
- `react-redux`: ^9.1.0 - React bindings for Redux
- `@cnarsugu/types`: workspace:* - Shared TypeScript types

## Usage Example

```tsx
import { Provider } from 'react-redux';
import { store, useAppDispatch, useAppSelector } from '@cnarsugu/store';
import { useGetAutoPricingQuery, setAutoSelection, selectTotalPrice } from '@cnarsugu/store';

// Wrap app with Provider
function App() {
  return (
    <Provider store={store}>
      <YourApp />
    </Provider>
  );
}

// Use in components
function ProductSelection() {
  const dispatch = useAppDispatch();
  const totalPrice = useAppSelector(selectTotalPrice);
  
  const { data, isLoading } = useGetAutoPricingQuery({
    cvMin: 2,
    cvMax: 4,
  });

  const handleSelect = () => {
    dispatch(setAutoSelection({
      cvRange: { min: 2, max: 4, label: '2-4 CV' },
      formula: 'TIERS',
      price: 50000,
      coverages: ['RC', 'DEFENSE'],
    }));
  };

  return <div>Total: {totalPrice} FCFA</div>;
}
```

## Environment Variables

Configure API base URL:
- **Next.js**: `NEXT_PUBLIC_API_URL`
- **React Native/Expo**: `EXPO_PUBLIC_API_URL`
- **Default**: `http://localhost:3000`

## Build & Test

```bash
# Build the package
pnpm build

# Run type checking
pnpm type-check

# Run tests
pnpm test

# Watch mode for development
pnpm dev
```

## Integration Points

This package integrates with:
- `@cnarsugu/types` - Shared TypeScript types
- Backend API v2 - Pricing endpoints at `/api/v2/pricing/*`
- Future mobile and web applications

## Next Steps

The store package is now ready to be used in:
1. React Native mobile app (Task 14+)
2. Next.js web application (Task 25+)
3. Any other React-based applications in the monorepo

## Backward Compatibility

- Enrollment and payment slices maintain compatibility with existing flows
- Can be gradually migrated from easy-peasy to Redux Toolkit
- No breaking changes to existing API contracts

## Status

✅ **COMPLETE** - All tasks and subtasks implemented and tested successfully.
