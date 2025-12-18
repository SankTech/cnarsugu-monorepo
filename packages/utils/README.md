# @cnarsugu/utils

Shared utility functions and constants for the CNAR Sugu insurance platform.

## Installation

This package is part of the CNAR Sugu monorepo and is used internally by other packages.

```bash
pnpm add @cnarsugu/utils
```

## Usage

### Constants

#### CV Ranges (Auto Insurance)

```typescript
import { CV_RANGES, findCVRange, getCVRangeLabel } from '@cnarsugu/utils';

// Available CV ranges
console.log(CV_RANGES);
// [
//   { min: 1, max: 1, label: '1 CV' },
//   { min: 2, max: 4, label: '2-4 CV' },
//   { min: 5, max: 7, label: '5-7 CV' },
//   { min: 8, max: 10, label: '8-10 CV' },
//   { min: 11, max: 99, label: '11+ CV' }
// ]

// Find range for a CV value
const range = findCVRange(3); // { min: 2, max: 4, label: '2-4 CV' }

// Get label for a CV value
const label = getCVRangeLabel(3); // '2-4 CV'
```

#### Moto Categories

```typescript
import { MOTO_CATEGORIES } from '@cnarsugu/utils';

console.log(MOTO_CATEGORIES.DJAKARTA);
// {
//   code: 'DJAKARTA',
//   label: 'Djakarta',
//   description: 'Petites cylindrées'
// }
```

#### Business Types (Multirisk Professional)

```typescript
import { BUSINESS_TYPES } from '@cnarsugu/utils';

console.log(BUSINESS_TYPES.RESTAURANT);
// {
//   code: 'RESTAURANT',
//   label: 'Restaurant',
//   description: 'Restauration',
//   packageCode: 'MR_RESTAURANT'
// }
```

#### Product Types

```typescript
import { PRODUCT_TYPES } from '@cnarsugu/utils';

// Available product types
console.log(PRODUCT_TYPES);
// {
//   AUTO: 'AUTO',
//   MOTO: 'MOTO',
//   MULTIRISK_PRO: 'MULTIRISK_PRO',
//   IAC: 'IAC',
//   LEGACY: 'LEGACY'
// }
```

#### Formula Types

```typescript
import { AUTO_FORMULAS, MOTO_FORMULAS } from '@cnarsugu/utils';

// Auto formulas
console.log(AUTO_FORMULAS);
// { TIERS: 'TIERS', ESSENTIELLE: 'ESSENTIELLE', ETENDUE: 'ETENDUE', CONFORT: 'CONFORT' }

// Moto formulas
console.log(MOTO_FORMULAS);
// { TIERS: 'TIERS', ESSENTIELLE: 'ESSENTIELLE' }
```

#### Payment Methods

```typescript
import { PAYMENT_METHODS, PAYMENT_STATUS } from '@cnarsugu/utils';

// Available payment methods
console.log(PAYMENT_METHODS);
// [
//   { id: 2, serviceCode: 'ML_PAIEMENTMARCHAND_OM_TP', title: 'Orange Money', ... },
//   { id: 3, serviceCode: 'ML_PAIEMENTMARCHAND_MOOV_TP', title: 'Moov Money', ... },
//   ...
// ]

// Payment status
console.log(PAYMENT_STATUS);
// { UNPAID: 'UNPAID', PAID: 'PAID', ERROR: 'ERROR' }
```

#### IAC Add-on

```typescript
import { IAC_ADDON_PRICE } from '@cnarsugu/utils';

console.log(IAC_ADDON_PRICE); // 5000 (FCFA)
```

### Utility Functions

#### Price Formatting

```typescript
import { formatPrice, formatPriceCompact, cleanPrice } from '@cnarsugu/utils';

// Format price with currency
formatPrice(50000); // '50 000 FCFA'
formatPrice(50000, 'XOF'); // '50 000 XOF'

// Format price without currency
formatPriceCompact(50000); // '50 000'

// Clean price string
cleanPrice('50,000 FCFA'); // '50000'
cleanPrice('50.000,00'); // '50000.00'
```

#### Price Calculations

```typescript
import { calculateMonthlyPrice } from '@cnarsugu/utils';

// Calculate monthly price from annual
const monthlyPrice = calculateMonthlyPrice(60000); // 5000
```

#### IAC Eligibility

```typescript
import { isIACEligible, includesIAC, PRODUCT_TYPES, AUTO_FORMULAS } from '@cnarsugu/utils';

// Check if product can add IAC
isIACEligible(PRODUCT_TYPES.AUTO, AUTO_FORMULAS.TIERS); // true
isIACEligible(PRODUCT_TYPES.AUTO, AUTO_FORMULAS.ESSENTIELLE); // false

// Check if formula includes IAC by default
includesIAC(PRODUCT_TYPES.MOTO, 'ESSENTIELLE'); // true
includesIAC(PRODUCT_TYPES.MOTO, 'TIERS'); // false
```

#### ID Generation

```typescript
import { getIdFromClient } from '@cnarsugu/utils';

const id = getIdFromClient(); // '1701234567890'
```

#### Base64 Encoding

```typescript
import { Base64 } from '@cnarsugu/utils';

const encoded = Base64.encode('Hello World'); // 'SGVsbG8gV29ybGQ='
const decoded = Base64.decode('SGVsbG8gV29ybGQ='); // 'Hello World'
```

#### Random Number

```typescript
import { getRandomNumber } from '@cnarsugu/utils';

const random = getRandomNumber(10); // Random number between 0-9
```

## Type Exports

The package also exports TypeScript types for better type safety:

```typescript
import type {
  CVRange,
  AutoFormulaType,
  MotoFormulaType,
  MotoCategoryCode,
  BusinessTypeCode,
  ProductType,
  PaymentStatusType,
} from '@cnarsugu/utils';

const formula: AutoFormulaType = 'TIERS';
const category: MotoCategoryCode = 'DJAKARTA';
const business: BusinessTypeCode = 'RESTAURANT';
```

## Development

### Build

```bash
pnpm build
```

### Watch Mode

```bash
pnpm dev
```

### Type Check

```bash
pnpm type-check
```

## License

Private - CNAR Sugu
