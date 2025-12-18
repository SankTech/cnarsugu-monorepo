# @cnarsugu/store Integration Guide

This guide explains how to integrate the `@cnarsugu/store` package into your React applications (Next.js, React Native, or standard React).

## Table of Contents

1. [Installation](#installation)
2. [Setup](#setup)
3. [Using RTK Query Hooks](#using-rtk-query-hooks)
4. [Managing Product Selection](#managing-product-selection)
5. [Enrollment Flow](#enrollment-flow)
6. [Payment Flow](#payment-flow)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Installation

The package is already part of the monorepo. Add it to your app's dependencies:

```json
{
  "dependencies": {
    "@cnarsugu/store": "workspace:*",
    "@cnarsugu/types": "workspace:*",
    "react-redux": "^9.1.0"
  }
}
```

## Setup

### 1. Configure Environment Variables

Set the API base URL in your environment:

**Next.js** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**React Native/Expo** (`.env`):
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### 2. Wrap Your App with Redux Provider

**Next.js** (`app/layout.tsx` or `pages/_app.tsx`):
```tsx
import { Provider } from 'react-redux';
import { store } from '@cnarsugu/store';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
```

**React Native** (`App.tsx`):
```tsx
import { Provider } from 'react-redux';
import { store } from '@cnarsugu/store';

export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}
```

## Using RTK Query Hooks

### Fetching Auto Pricing

```tsx
import { useGetAutoPricingQuery } from '@cnarsugu/store';

function AutoPricingScreen() {
  const { data, isLoading, error, refetch } = useGetAutoPricingQuery({
    cvMin: 2,
    cvMax: 4,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {data?.map((pricing) => (
        <PricingCard key={pricing.id} pricing={pricing} />
      ))}
    </div>
  );
}
```

### Fetching Moto Pricing

```tsx
import { useGetMotoPricingQuery } from '@cnarsugu/store';

function MotoPricingScreen() {
  const [category, setCategory] = useState<'DJAKARTA' | 'GROSSE_CYLINDREE' | 'MOTO_TAXI'>('DJAKARTA');
  
  const { data, isLoading } = useGetMotoPricingQuery({ category });

  return (
    <div>
      <CategorySelector value={category} onChange={setCategory} />
      {data?.map((pricing) => (
        <PricingCard key={pricing.id} pricing={pricing} />
      ))}
    </div>
  );
}
```

### Fetching Multirisk Packages

```tsx
import { useGetMultirisquePackagesQuery } from '@cnarsugu/store';

function MultirisqueScreen() {
  const { data: packages, isLoading } = useGetMultirisquePackagesQuery();

  return (
    <div className="grid grid-cols-2 gap-4">
      {packages?.map((pkg) => (
        <PackageCard key={pkg.id} package={pkg} />
      ))}
    </div>
  );
}
```

### Fetching IAC Product

```tsx
import { useGetIACProductQuery } from '@cnarsugu/store';

function IACScreen() {
  const { data: iacProduct, isLoading } = useGetIACProductQuery();

  if (!iacProduct) return null;

  return (
    <div>
      <h2>Incapacité Accident Corporel</h2>
      <p>Price: {iacProduct.price} FCFA</p>
      <p>Death Capital: {iacProduct.deathCapital} FCFA</p>
      <p>Disability Capital: {iacProduct.disabilityCapital} FCFA</p>
      <p>Treatment Capital: {iacProduct.treatmentCapital} FCFA</p>
    </div>
  );
}
```

## Managing Product Selection

### Selecting Auto Product

```tsx
import { useAppDispatch, useAppSelector } from '@cnarsugu/store';
import { setAutoSelection, selectAutoSelection } from '@cnarsugu/store';

function AutoFormulaSelector() {
  const dispatch = useAppDispatch();
  const autoSelection = useAppSelector(selectAutoSelection);

  const handleSelectFormula = (pricing: AutoPricing) => {
    dispatch(
      setAutoSelection({
        cvRange: { min: 2, max: 4, label: '2-4 CV' },
        formula: pricing.formulaType,
        price: pricing.price12m,
        coverages: pricing.coverages,
      })
    );
  };

  return (
    <div>
      {/* Formula cards */}
      <button onClick={() => handleSelectFormula(pricing)}>
        Select {pricing.formulaType}
      </button>
    </div>
  );
}
```

### Adding IAC to Auto

```tsx
import { useAppDispatch, toggleAutoIAC } from '@cnarsugu/store';

function IACCrossSellModal() {
  const dispatch = useAppDispatch();

  const handleAddIAC = () => {
    dispatch(toggleAutoIAC(true));
    // Navigate to next step
  };

  const handleSkipIAC = () => {
    dispatch(toggleAutoIAC(false));
    // Navigate to next step
  };

  return (
    <Modal>
      <h3>Add IAC Protection?</h3>
      <p>Only +5,000 FCFA</p>
      <button onClick={handleAddIAC}>Add IAC</button>
      <button onClick={handleSkipIAC}>No Thanks</button>
    </Modal>
  );
}
```

### Selecting Moto Product

```tsx
import { setMotoSelection } from '@cnarsugu/store';

function MotoFormulaSelector() {
  const dispatch = useAppDispatch();

  const handleSelectFormula = (pricing: MotoPricing) => {
    dispatch(
      setMotoSelection({
        category: pricing.category,
        formula: pricing.formulaType,
        price: pricing.price12m,
        coverages: pricing.coverages,
        includesIac: pricing.includesIac,
      })
    );
  };

  return <div>{/* Formula selection UI */}</div>;
}
```

### Selecting Multirisk Package

```tsx
import { setMultirisqueSelection } from '@cnarsugu/store';

function MultirisquePackageSelector() {
  const dispatch = useAppDispatch();

  const handleSelectPackage = (pkg: MultirisquePackage) => {
    dispatch(
      setMultirisqueSelection({
        packageCode: pkg.packageCode,
        name: pkg.name,
        businessType: pkg.businessType,
        price: pkg.priceTtc,
        coverageDetails: pkg.coverageDetails,
      })
    );
  };

  return <div>{/* Package selection UI */}</div>;
}
```

### Using Selectors

```tsx
import {
  useAppSelector,
  selectTotalPrice,
  selectHasProductSelection,
  selectCurrentProductDetails,
} from '@cnarsugu/store';

function PriceSummary() {
  const totalPrice = useAppSelector(selectTotalPrice);
  const hasSelection = useAppSelector(selectHasProductSelection);
  const productDetails = useAppSelector(selectCurrentProductDetails);

  if (!hasSelection) {
    return <div>No product selected</div>;
  }

  return (
    <div>
      <h3>Price Summary</h3>
      <p>Product: {productDetails?.type}</p>
      <p>Total: {totalPrice.toLocaleString()} FCFA</p>
    </div>
  );
}
```

## Enrollment Flow

### Managing Enrollment Form

```tsx
import {
  useAppDispatch,
  useAppSelector,
  updateEnrollmentForm,
  setClientType,
  nextEnrollmentStep,
  previousEnrollmentStep,
  selectEnrollmentForm,
  selectEnrollmentStep,
} from '@cnarsugu/store';

function EnrollmentForm() {
  const dispatch = useAppDispatch();
  const formData = useAppSelector(selectEnrollmentForm);
  const currentStep = useAppSelector(selectEnrollmentStep);

  const handleInputChange = (field: string, value: string) => {
    dispatch(updateEnrollmentForm({ [field]: value }));
  };

  const handleNext = () => {
    dispatch(nextEnrollmentStep());
  };

  const handleBack = () => {
    dispatch(previousEnrollmentStep());
  };

  return (
    <form>
      {currentStep === 1 && (
        <div>
          <input
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Name"
          />
          <input
            value={formData.surname}
            onChange={(e) => handleInputChange('surname', e.target.value)}
            placeholder="Surname"
          />
          <input
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            placeholder="Phone"
          />
        </div>
      )}
      
      <button type="button" onClick={handleBack} disabled={currentStep === 1}>
        Back
      </button>
      <button type="button" onClick={handleNext}>
        Next
      </button>
    </form>
  );
}
```

## Payment Flow

### Managing Payment

```tsx
import {
  useAppDispatch,
  useAppSelector,
  setPaymentMethod,
  setPaymentAmount,
  startPaymentProcessing,
  paymentSuccess,
  paymentFailed,
  selectPaymentForm,
  selectIsPaymentProcessing,
  selectTotalPrice,
} from '@cnarsugu/store';

function PaymentScreen() {
  const dispatch = useAppDispatch();
  const paymentForm = useAppSelector(selectPaymentForm);
  const isProcessing = useAppSelector(selectIsPaymentProcessing);
  const totalPrice = useAppSelector(selectTotalPrice);

  useEffect(() => {
    // Set payment amount from total price
    dispatch(setPaymentAmount(totalPrice.toString()));
  }, [totalPrice]);

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    dispatch(setPaymentMethod(method));
  };

  const handleSubmitPayment = async () => {
    dispatch(startPaymentProcessing());
    
    try {
      // Call payment API
      const response = await fetch('/api/v2/payment', {
        method: 'POST',
        body: JSON.stringify(paymentForm),
      });
      
      const data = await response.json();
      
      if (data.success) {
        dispatch(paymentSuccess(data.paymentId));
      } else {
        dispatch(paymentFailed(data.error));
      }
    } catch (error) {
      dispatch(paymentFailed(error.message));
    }
  };

  return (
    <div>
      <h2>Payment</h2>
      <p>Total: {totalPrice} FCFA</p>
      
      <PaymentMethodSelector
        selected={paymentForm.paymentMethod}
        onSelect={handlePaymentMethodSelect}
      />
      
      <button
        onClick={handleSubmitPayment}
        disabled={isProcessing || !paymentForm.paymentMethod}
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
}
```

## Best Practices

### 1. Use Typed Hooks

Always use `useAppDispatch` and `useAppSelector` instead of the plain Redux hooks:

```tsx
// ✅ Good
import { useAppDispatch, useAppSelector } from '@cnarsugu/store';

// ❌ Bad
import { useDispatch, useSelector } from 'react-redux';
```

### 2. Use Selectors for Derived State

Create selectors for computed values instead of computing in components:

```tsx
// ✅ Good
const totalPrice = useAppSelector(selectTotalPrice);

// ❌ Bad
const totalPrice = useAppSelector((state) => {
  const basePrice = state.productSelection.autoSelection?.price || 0;
  const iacPrice = state.productSelection.iacAddOn?.selected 
    ? state.productSelection.iacAddOn.price 
    : 0;
  return basePrice + iacPrice;
});
```

### 3. Handle Loading and Error States

Always handle loading and error states from RTK Query:

```tsx
const { data, isLoading, error, isFetching } = useGetAutoPricingQuery(params);

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;
```

### 4. Clear State When Appropriate

Clear product selection when navigating away or starting a new flow:

```tsx
import { clearProductSelection } from '@cnarsugu/store';

function handleStartNewQuote() {
  dispatch(clearProductSelection());
  navigate('/products');
}
```

### 5. Use RTK Query Cache Tags

RTK Query automatically caches data. Use the provided tags for cache invalidation:

```tsx
// Data is automatically cached and reused
const { data } = useGetAutoPricingQuery({ cvMin: 2, cvMax: 4 });

// Refetch when needed
const { refetch } = useGetAutoPricingQuery({ cvMin: 2, cvMax: 4 });
```

## Troubleshooting

### Issue: "Cannot find module '@cnarsugu/store'"

**Solution**: Ensure the package is built and linked:
```bash
cd packages/store
pnpm build
cd ../..
pnpm install
```

### Issue: API calls return 404

**Solution**: Check your environment variables:
- Verify `NEXT_PUBLIC_API_URL` or `EXPO_PUBLIC_API_URL` is set
- Ensure the backend is running on the specified URL
- Check that the API version is correct (`/api/v2`)

### Issue: TypeScript errors with types

**Solution**: Ensure `@cnarsugu/types` is installed and built:
```bash
cd packages/types
pnpm build
```

### Issue: State not persisting between screens

**Solution**: Ensure the Redux Provider wraps your entire app at the root level, not within individual screens.

### Issue: RTK Query not refetching data

**Solution**: Use the `refetch` function or configure `refetchOnMount`:
```tsx
const { data, refetch } = useGetAutoPricingQuery(params, {
  refetchOnMountOrArgChange: true,
});
```

## Additional Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [React Redux Hooks](https://react-redux.js.org/api/hooks)
- Package README: `packages/store/README.md`
- Usage Examples: `packages/store/examples/usage-example.tsx`
