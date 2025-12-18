# @cnarsugu/store

Redux Toolkit store with RTK Query for CNAR Sugu insurance platform.

## Overview

This package provides a centralized Redux store with RTK Query for managing application state and API calls. It includes:

- **RTK Query API**: Type-safe API endpoints for fetching pricing data
- **Product Selection**: State management for Auto, Moto, Multirisk Pro, and IAC products
- **Enrollment**: State management for the subscription enrollment flow
- **Payment**: State management for the payment flow

## Installation

This package is part of the monorepo and is automatically linked via workspace dependencies.

```json
{
  "dependencies": {
    "@cnarsugu/store": "workspace:*"
  }
}
```

## Usage

### Setting up the Store

Wrap your application with the Redux Provider:

```tsx
import { Provider } from 'react-redux';
import { store } from '@cnarsugu/store';

function App() {
  return (
    <Provider store={store}>
      <YourApp />
    </Provider>
  );
}
```

### Using RTK Query Hooks

Fetch pricing data using the provided hooks:

```tsx
import { useGetAutoPricingQuery } from '@cnarsugu/store';

function AutoPricingComponent() {
  const { data, isLoading, error } = useGetAutoPricingQuery({
    cvMin: 2,
    cvMax: 4,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading pricing</div>;

  return (
    <div>
      {data?.map((pricing) => (
        <div key={pricing.id}>
          {pricing.formulaType}: {pricing.price12m} FCFA
        </div>
      ))}
    </div>
  );
}
```

### Using Typed Hooks

Use the typed hooks for dispatch and selector:

```tsx
import { useAppDispatch, useAppSelector } from '@cnarsugu/store';
import { setAutoSelection, selectAutoSelection } from '@cnarsugu/store';

function ProductSelection() {
  const dispatch = useAppDispatch();
  const autoSelection = useAppSelector(selectAutoSelection);

  const handleSelectFormula = () => {
    dispatch(
      setAutoSelection({
        cvRange: { min: 2, max: 4, label: '2-4 CV' },
        formula: 'TIERS',
        price: 50000,
        coverages: ['RC', 'DEFENSE'],
      })
    );
  };

  return <button onClick={handleSelectFormula}>Select Formula</button>;
}
```

### Using Selectors

Access state using the provided selectors:

```tsx
import { useAppSelector } from '@cnarsugu/store';
import {
  selectTotalPrice,
  selectHasProductSelection,
  selectCurrentProductDetails,
} from '@cnarsugu/store';

function PriceSummary() {
  const totalPrice = useAppSelector(selectTotalPrice);
  const hasSelection = useAppSelector(selectHasProductSelection);
  const productDetails = useAppSelector(selectCurrentProductDetails);

  if (!hasSelection) return <div>No product selected</div>;

  return (
    <div>
      <h3>Selected Product: {productDetails?.type}</h3>
      <p>Total Price: {totalPrice} FCFA</p>
    </div>
  );
}
```

## API Endpoints

### Pricing API

- `useGetAutoPricingQuery({ cvMin, cvMax })` - Get Auto pricing for CV range
- `useGetAllAutoPricingQuery()` - Get all Auto pricing
- `useGetMotoPricingQuery({ category })` - Get Moto pricing for category
- `useGetAllMotoPricingQuery()` - Get all Moto pricing
- `useGetMultirisquePackagesQuery()` - Get all Multirisk Pro packages
- `useGetMultirisquePackageQuery(packageCode)` - Get specific package
- `useGetIACProductQuery()` - Get IAC product information
- `useGetCoverageDefinitionsQuery()` - Get coverage definitions

## Slices

### Product Selection Slice

Manages the state of selected insurance products.

**Actions:**
- `setProductType(type)` - Set the selected product type
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

**Selectors:**
- `selectProductType` - Get selected product type
- `selectAutoSelection` - Get Auto selection
- `selectMotoSelection` - Get Moto selection
- `selectMultirisqueSelection` - Get Multirisk selection
- `selectIACAddOn` - Get IAC add-on
- `selectTotalPrice` - Calculate total price with IAC
- `selectHasProductSelection` - Check if any product is selected
- `selectCurrentProductDetails` - Get current product details

### Enrollment Slice

Manages the enrollment/subscription flow.

**Actions:**
- `updateEnrollmentForm(data)` - Update form data
- `setClientType(type)` - Set client type (INDIVIDUAL/BUSINESS)
- `setEnrollmentStep(step)` - Set current step
- `nextEnrollmentStep()` - Go to next step
- `previousEnrollmentStep()` - Go to previous step
- `setEnrollmentSubmitting(boolean)` - Set submitting state
- `setEnrollmentError(error)` - Set error message
- `resetEnrollmentForm()` - Reset form

**Selectors:**
- `selectEnrollmentForm` - Get form data
- `selectEnrollmentStep` - Get current step
- `selectIsEnrollmentSubmitting` - Check if submitting
- `selectEnrollmentError` - Get error message
- `selectIsEnrollmentFormValid` - Check if form is valid

### Payment Slice

Manages the payment flow.

**Actions:**
- `updatePaymentForm(data)` - Update payment form
- `setPaymentMethod(method)` - Set payment method
- `setPaymentAmount(amount)` - Set payment amount
- `setAdditionalInfos(infos)` - Set additional information
- `setPaymentStatus(status)` - Set payment status
- `setPaymentId(id)` - Set payment ID
- `setPaymentProcessing(boolean)` - Set processing state
- `setPaymentError(error)` - Set error message
- `startPaymentProcessing()` - Start payment processing
- `paymentSuccess(id)` - Mark payment as successful
- `paymentFailed(error)` - Mark payment as failed
- `resetPaymentForm()` - Reset payment form

**Selectors:**
- `selectPaymentForm` - Get payment form data
- `selectPaymentStatus` - Get payment status
- `selectPaymentId` - Get payment ID
- `selectIsPaymentProcessing` - Check if processing
- `selectPaymentError` - Get error message
- `selectIsPaymentSuccessful` - Check if payment succeeded
- `selectHasPaymentFailed` - Check if payment failed

## Environment Variables

Configure the API base URL using environment variables:

- **Next.js**: `NEXT_PUBLIC_API_URL`
- **React Native/Expo**: `EXPO_PUBLIC_API_URL`
- **Default**: `http://localhost:3000`

## TypeScript Support

All exports are fully typed using TypeScript. Import types as needed:

```tsx
import type {
  RootState,
  AppDispatch,
  ProductSelectionState,
  EnrollmentFormData,
  PaymentFormData,
} from '@cnarsugu/store';
```

## Dependencies

- `@reduxjs/toolkit` - Redux Toolkit for state management
- `react-redux` - React bindings for Redux
- `@cnarsugu/types` - Shared TypeScript types

## License

Private package for CNAR Sugu platform.
