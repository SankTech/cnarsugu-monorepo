# @cnarsugu/types

Shared TypeScript types for the CNAR Sugu insurance platform.

## Overview

This package contains all shared TypeScript type definitions used across the CNAR Sugu monorepo, including:

- Base types (Insurance, Subscription, Payment)
- Product-specific types (Auto, Moto, Multirisk Pro, IAC)
- Pricing structures
- API request/response types
- Constants and enums

## Installation

This package is part of the CNAR Sugu monorepo and is automatically linked via pnpm workspaces.

```json
{
  "dependencies": {
    "@cnarsugu/types": "workspace:*"
  }
}
```

## Usage

### Importing Types

```typescript
import {
  ProductType,
  AutoPricing,
  MotoPricing,
  MultirisquePackage,
  IACProduct,
  Subscription,
  Payment,
} from '@cnarsugu/types';
```

### Importing Constants

```typescript
import {
  CV_RANGES,
  MOTO_CATEGORIES,
  BUSINESS_TYPES,
  AUTO_FORMULA_LABELS,
  PRODUCT_TYPE_LABELS,
} from '@cnarsugu/types';
```

## Type Categories

### Base Types

- `Insurance` - Base insurance product
- `Subscription` - Insurance subscription
- `Payment` - Payment information
- `ProductType` - Enum for product types
- `ProductDetails` - Flexible product-specific details

### Auto Insurance

- `AutoPricing` - Auto insurance pricing data
- `AutoFormulaType` - Auto formula types (TIERS, ESSENTIELLE, ETENDUE, CONFORT)
- `AutoProductSelection` - Selected auto product configuration
- `AutoPricingQuery` - Query parameters for auto pricing

### Moto Insurance

- `MotoPricing` - Moto insurance pricing data
- `MotoCategory` - Moto categories (DJAKARTA, GROSSE_CYLINDREE, MOTO_TAXI)
- `MotoFormulaType` - Moto formula types (TIERS, ESSENTIELLE)
- `MotoProductSelection` - Selected moto product configuration

### Multirisk Pro Insurance

- `MultirisquePackage` - Multirisk professional package
- `BusinessType` - Business types (BOUTIQUE, RESTAURANT, HOTEL, BAR_CLUB)
- `CoverageDetails` - Coverage structure with chapters and items
- `MultirisqueProductSelection` - Selected multirisk product

### IAC (Incapacité Accident Corporel)

- `IACProduct` - IAC product details
- `IACAddOn` - IAC add-on selection

### Pricing & Cross-sell

- `PriceBreakdown` - Price calculation breakdown
- `PricingCalculation` - Complete pricing calculation result
- `CrossSellEligibility` - Cross-sell eligibility check
- `UpgradeSuggestion` - Product upgrade suggestion

### API Types

- `CreateSubscriptionRequest` - Subscription creation request
- `CreatePaymentRequest` - Payment creation request
- `ApiResponse<T>` - Generic API response wrapper
- `PaginatedResponse<T>` - Paginated API response

## Constants

### CV_RANGES

Array of CV (Chevaux Fiscaux) ranges for Auto insurance:

```typescript
[
  { min: 1, max: 1, label: '1 CV' },
  { min: 2, max: 4, label: '2-4 CV' },
  // ... more ranges
]
```

### MOTO_CATEGORIES

Array of moto categories with labels:

```typescript
[
  { value: 'DJAKARTA', label: 'Djakarta' },
  { value: 'GROSSE_CYLINDREE', label: 'Grosse Cylindrée' },
  { value: 'MOTO_TAXI', label: 'Moto Taxi' },
]
```

### BUSINESS_TYPES

Array of business types for Multirisk Pro:

```typescript
[
  { value: 'BOUTIQUE', label: 'Boutique' },
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'HOTEL', label: 'Hôtel' },
  { value: 'BAR_CLUB', label: 'Bar/Club' },
]
```

## Development

### Build

```bash
pnpm build
```

### Type Check

```bash
pnpm type-check
```

### Watch Mode

```bash
pnpm dev
```

## License

Private - CNAR Sugu
