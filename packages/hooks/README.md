# @cnarsugu/hooks

Shared React hooks for CNAR Sugu application. This package provides typed Redux hooks and product-specific hooks for managing insurance product selections.

## Installation

This package is part of the CNAR Sugu monorepo and is installed automatically via workspace dependencies.

```bash
pnpm add @cnarsugu/hooks
```

## Available Hooks

### Redux Hooks

#### `useAppDispatch`
Typed version of `useDispatch` hook from React Redux.

```tsx
import { useAppDispatch } from '@cnarsugu/hooks';

function MyComponent() {
  const dispatch = useAppDispatch();
  // dispatch is fully typed with AppDispatch
}
```

#### `useAppSelector`
Typed version of `useSelector` hook from React Redux.

```tsx
import { useAppSelector } from '@cnarsugu/hooks';

function MyComponent() {
  const productType = useAppSelector((state) => state.productSelection.selectedProductType);
  // state is fully typed with RootState
}
```

### Product-Specific Hooks

#### `useAutoSelection`
Hook for managing Auto Prestige product selection.

```tsx
import { useAutoSelection } from '@cnarsugu/hooks';

function AutoPrestigeScreen() {
  const { autoSelection, selectAuto, toggleIAC, clearAuto, isSelected, hasIAC } = useAutoSelection();

  const handleSelectFormula = () => {
    selectAuto({
      cvRange: { min: 2, max: 4 },
      formula: 'TIERS',
      price: 45000,
      coverages: ['RC', 'Defense'],
    });
  };

  const handleAddIAC = () => {
    toggleIAC(true);
  };

  return (
    <div>
      {isSelected && <p>Selected: {autoSelection.formula}</p>}
      {hasIAC && <p>IAC included</p>}
    </div>
  );
}
```

**Returns:**
- `autoSelection`: Current Auto selection state or null
- `selectAuto`: Function to select an Auto formula
- `toggleIAC`: Function to toggle IAC add-on
- `clearAuto`: Function to clear Auto selection
- `isSelected`: Boolean indicating if Auto is selected
- `hasIAC`: Boolean indicating if IAC is added

#### `useMotoSelection`
Hook for managing Moto product selection.

```tsx
import { useMotoSelection } from '@cnarsugu/hooks';

function MotoScreen() {
  const { 
    motoSelection, 
    selectMoto, 
    clearMoto, 
    isSelected, 
    includesIAC,
    canUpgradeToEssentielle 
  } = useMotoSelection();

  const handleSelectTiers = () => {
    selectMoto({
      category: 'DJAKARTA',
      formula: 'TIERS',
      price: 35000,
      coverages: ['RC', 'Defense'],
      includesIac: false,
    });
  };

  const handleUpgrade = () => {
    selectMoto({
      category: 'DJAKARTA',
      formula: 'ESSENTIELLE',
      price: 40000,
      coverages: ['RC', 'Defense', 'IAC'],
      includesIac: true,
    });
  };

  return (
    <div>
      {isSelected && <p>Selected: {motoSelection.formula}</p>}
      {canUpgradeToEssentielle && <button onClick={handleUpgrade}>Upgrade</button>}
    </div>
  );
}
```

**Returns:**
- `motoSelection`: Current Moto selection state or null
- `selectMoto`: Function to select a Moto formula
- `clearMoto`: Function to clear Moto selection
- `isSelected`: Boolean indicating if Moto is selected
- `includesIAC`: Boolean indicating if IAC is included
- `canUpgradeToEssentielle`: Boolean indicating if upgrade is available

#### `useMultirisqueSelection`
Hook for managing Multirisk Pro product selection.

```tsx
import { useMultirisqueSelection } from '@cnarsugu/hooks';

function MultirisqueProScreen() {
  const { 
    multirisqueSelection, 
    selectMultirisk, 
    clearMultirisk, 
    isSelected,
    businessType,
    packageCode 
  } = useMultirisqueSelection();

  const handleSelectPackage = () => {
    selectMultirisk({
      packageCode: 'HOTEL_STANDARD',
      name: 'Hôtels & Restaurants',
      businessType: 'HOTEL',
      price: 150000,
      coverageDetails: {
        incendie: { limit: 50000000, franchise: 100000 },
        vol: { limit: 10000000, franchise: 50000 },
        // ... other coverages
      },
    });
  };

  return (
    <div>
      {isSelected && <p>Selected: {multirisqueSelection.name}</p>}
      {businessType && <p>Business Type: {businessType}</p>}
    </div>
  );
}
```

**Returns:**
- `multirisqueSelection`: Current Multirisk selection state or null
- `selectMultirisk`: Function to select a Multirisk package
- `clearMultirisk`: Function to clear Multirisk selection
- `isSelected`: Boolean indicating if Multirisk is selected
- `businessType`: Current business type or undefined
- `packageCode`: Current package code or undefined

#### `useProductSelection`
Hook for managing general product selection state, including product type, IAC add-on, and total pricing.

```tsx
import { useProductSelection } from '@cnarsugu/hooks';

function CheckoutScreen() {
  const {
    productType,
    iacAddOn,
    totalPrice,
    hasSelection,
    currentProduct,
    setProduct,
    addIAC,
    toggleIAC,
    clearAll,
    isIACSelected,
  } = useProductSelection();

  const handleAddIAC = () => {
    addIAC({
      selected: true,
      price: 5000,
      deathCapital: 5000000,
      disabilityCapital: 5000000,
      treatmentCapital: 500000,
    });
  };

  return (
    <div>
      {hasSelection && (
        <>
          <p>Product Type: {productType}</p>
          <p>Total Price: {totalPrice} FCFA</p>
          {isIACSelected && <p>IAC included (+{iacAddOn.price} FCFA)</p>}
        </>
      )}
    </div>
  );
}
```

**Returns:**
- `productType`: Current product type or null
- `iacAddOn`: IAC add-on state or null
- `totalPrice`: Total price including IAC if selected
- `hasSelection`: Boolean indicating if any product is selected
- `currentProduct`: Current product details with type
- `setProduct`: Function to set product type
- `addIAC`: Function to add IAC add-on
- `toggleIAC`: Function to toggle IAC selection
- `clearAll`: Function to clear all selections
- `isIACSelected`: Boolean indicating if IAC is selected

## Type Safety

All hooks are fully typed using TypeScript and leverage types from `@cnarsugu/types` and `@cnarsugu/store` packages. This ensures type safety across the entire application.

## Dependencies

- `@cnarsugu/store`: Redux store and actions
- `@cnarsugu/types`: TypeScript type definitions
- `react-redux`: React bindings for Redux

## Development

```bash
# Build the package
pnpm build

# Watch mode for development
pnpm dev

# Type check
pnpm type-check
```

## Usage in Applications

### React Native (Mobile)

```tsx
import { useAutoSelection, useProductSelection } from '@cnarsugu/hooks';

function AutoScreen() {
  const { selectAuto } = useAutoSelection();
  const { totalPrice } = useProductSelection();
  
  // Use hooks in your component
}
```

### Next.js (Web)

```tsx
'use client';

import { useMotoSelection, useProductSelection } from '@cnarsugu/hooks';

export default function MotoPage() {
  const { selectMoto } = useMotoSelection();
  const { totalPrice } = useProductSelection();
  
  // Use hooks in your component
}
```

## Best Practices

1. **Use product-specific hooks** for managing individual product selections
2. **Use `useProductSelection`** for accessing cross-product state like total price
3. **Always check `isSelected`** before accessing selection details
4. **Use `clearAll`** when navigating away from product selection flows
5. **Leverage TypeScript** for type safety and autocomplete

## License

Private - CNAR Sugu
