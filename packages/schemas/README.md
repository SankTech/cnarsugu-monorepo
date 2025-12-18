# @cnarsugu/schemas

Zod validation schemas for CNAR Sugu insurance platform. This package provides comprehensive validation for all insurance products including Auto, Moto, Multirisk Pro, and IAC.

## Installation

```bash
pnpm add @cnarsugu/schemas
```

## Features

- ✅ **Type-safe validation** with Zod
- ✅ **Auto insurance** schemas (CV ranges, formulas)
- ✅ **Moto insurance** schemas (categories, formulas)
- ✅ **Multirisk Pro** schemas (business packages)
- ✅ **IAC** (Incapacité Accident Corporel) schemas
- ✅ **Subscription & Payment** schemas
- ✅ **French error messages** for user-facing validation
- ✅ **Shared across web, mobile, and backend**

## Usage

### Basic Validation

```typescript
import { autoProductSelectionSchema, validate } from '@cnarsugu/schemas';

const data = {
  cvRange: { min: 2, max: 4, label: '2-4 CV' },
  formula: 'TIERS',
  price: 150000,
  coverages: ['Responsabilité Civile', 'Défense et Recours'],
  addIac: false,
};

const result = validate(autoProductSelectionSchema, data);

if (result.success) {
  console.log('Valid data:', result.data);
} else {
  console.log('Validation errors:', result.errors);
}
```

### Auto Insurance

```typescript
import {
  autoProductSelectionSchema,
  autoPricingQuerySchema,
  autoEnrollmentSchema,
} from '@cnarsugu/schemas';

// Validate pricing query
const query = { cvMin: 2, cvMax: 4 };
const queryResult = autoPricingQuerySchema.safeParse(query);

// Validate product selection
const selection = {
  cvRange: { min: 2, max: 4, label: '2-4 CV' },
  formula: 'ESSENTIELLE',
  price: 200000,
  coverages: ['RC', 'Défense'],
  addIac: true,
};
const selectionResult = autoProductSelectionSchema.safeParse(selection);

// Validate enrollment data
const enrollment = {
  cvRange: { min: 2, max: 4, label: '2-4 CV' },
  formula: 'TIERS',
  addIac: false,
  vehicleRegistration: 'GN-1234-AB',
  vehicleMake: 'Toyota',
  vehicleModel: 'Corolla',
  vehicleYear: 2020,
};
const enrollmentResult = autoEnrollmentSchema.safeParse(enrollment);
```

### Moto Insurance

```typescript
import {
  motoProductSelectionSchema,
  motoPricingQuerySchema,
  motoEnrollmentSchema,
} from '@cnarsugu/schemas';

// Validate pricing query
const query = { category: 'DJAKARTA' };
const queryResult = motoPricingQuerySchema.safeParse(query);

// Validate product selection
const selection = {
  category: 'GROSSE_CYLINDREE',
  formula: 'ESSENTIELLE',
  price: 120000,
  coverages: ['RC', 'IAC'],
  includesIac: true,
};
const selectionResult = motoProductSelectionSchema.safeParse(selection);
```

### Multirisk Pro

```typescript
import {
  multirisqueProductSelectionSchema,
  multirisqueEnrollmentSchema,
} from '@cnarsugu/schemas';

// Validate package selection
const selection = {
  packageCode: 'BOUTIQUE_STANDARD',
  name: 'Boutique Standard',
  businessType: 'BOUTIQUE',
  price: 500000,
  coverageDetails: {
    chapters: [
      {
        name: 'Incendie',
        items: [
          {
            description: 'Dommages par incendie',
            capital: 10000000,
            franchise: '10% avec minimum 50,000 FCFA',
          },
        ],
      },
    ],
  },
};
const result = multirisqueProductSelectionSchema.safeParse(selection);
```

### IAC (Incapacité Accident Corporel)

```typescript
import { iacAddOnSchema, iacEnrollmentSchema } from '@cnarsugu/schemas';

// Validate IAC add-on
const iacAddOn = {
  selected: true,
  price: 5000,
  deathCapital: 1000000,
  disabilityCapital: 500000,
  treatmentCapital: 100000,
};
const result = iacAddOnSchema.safeParse(iacAddOn);
```

### Subscription

```typescript
import {
  createSubscriptionV2Schema,
  autoSubscriptionSchema,
} from '@cnarsugu/schemas';

// Validate subscription with product details
const subscription = {
  coverage: 'Auto Prestige',
  insurance: 'CNAR',
  name: 'Diallo',
  surname: 'Mamadou',
  phoneNumber: '+224621234567',
  price: '150000',
  productType: 'AUTO',
  productDetails: {
    cvRange: { min: 2, max: 4, label: '2-4 CV' },
    formula: 'TIERS',
    addIac: false,
  },
};
const result = createSubscriptionV2Schema.safeParse(subscription);
```

### Payment

```typescript
import { createPaymentV2Schema } from '@cnarsugu/schemas';

// Validate payment with IAC support
const payment = {
  idFromClient: 'SUB-12345',
  amount: '150000',
  totalAmount: '155000',
  baseAmount: '150000',
  iacAmount: '5000',
  recipientNumber: '+224621234567',
  serviceCode: 'OM',
  callback: 'https://api.cnarsugu.com/payment/callback',
  additionnalInfos: {
    recipientEmail: 'mamadou.diallo@example.com',
    recipientFirstName: 'Mamadou',
    recipientLastName: 'Diallo',
    destinataire: 'Mamadou Diallo',
  },
  productType: 'AUTO',
  includesIac: true,
};
const result = createPaymentV2Schema.safeParse(payment);
```

## Helper Functions

### validate()

Safe validation with formatted error messages:

```typescript
import { validate, autoProductSelectionSchema } from '@cnarsugu/schemas';

const result = validate(autoProductSelectionSchema, data);

if (result.success) {
  // result.data is typed and validated
  console.log(result.data);
} else {
  // result.errors contains formatted error messages
  result.errors.forEach((err) => {
    console.log(`${err.path}: ${err.message}`);
  });
}
```

### safeParse()

Throws error with formatted messages:

```typescript
import { safeParse, autoProductSelectionSchema } from '@cnarsugu/schemas';

try {
  const data = safeParse(autoProductSelectionSchema, rawData);
  // data is typed and validated
} catch (error) {
  console.error(error.message);
}
```

## Available Schemas

### Common Schemas

- `phoneNumberSchema` - Guinean phone number validation
- `nameSchema` - Name validation (first/last name)
- `emailSchema` - Email validation
- `priceSchema` - Price validation (number)
- `priceStringSchema` - Price validation (string)
- `productTypeSchema` - Product type enum
- `cvRangeSchema` - CV range validation

### Auto Schemas

- `autoFormulaTypeSchema` - Formula enum (TIERS, ESSENTIELLE, ETENDUE, CONFORT)
- `autoPricingQuerySchema` - Pricing query validation
- `autoProductSelectionSchema` - Product selection validation
- `autoPricingSchema` - Pricing entity validation
- `autoEnrollmentSchema` - Enrollment data validation

### Moto Schemas

- `motoCategorySchema` - Category enum (DJAKARTA, GROSSE_CYLINDREE, MOTO_TAXI)
- `motoFormulaTypeSchema` - Formula enum (TIERS, ESSENTIELLE)
- `motoPricingQuerySchema` - Pricing query validation
- `motoProductSelectionSchema` - Product selection validation
- `motoPricingSchema` - Pricing entity validation
- `motoEnrollmentSchema` - Enrollment data validation

### Multirisk Schemas

- `businessTypeSchema` - Business type enum (BOUTIQUE, RESTAURANT, HOTEL, BAR_CLUB)
- `coverageItemSchema` - Coverage item validation
- `coverageChapterSchema` - Coverage chapter validation
- `coverageDetailsSchema` - Coverage details validation
- `multirisquePackageSchema` - Package entity validation
- `multirisqueProductSelectionSchema` - Product selection validation
- `multirisqueEnrollmentSchema` - Enrollment data validation

### IAC Schemas

- `iacProductSchema` - IAC product entity validation
- `iacAddOnSchema` - IAC add-on selection validation
- `iacEnrollmentSchema` - IAC enrollment data validation
- `iacCrossSellEligibilitySchema` - Cross-sell eligibility validation

### Subscription Schemas

- `createSubscriptionSchema` - V1 subscription creation
- `createSubscriptionV2Schema` - V2 subscription creation (with product types)
- `autoSubscriptionSchema` - Auto-specific subscription
- `motoSubscriptionSchema` - Moto-specific subscription
- `multiriskSubscriptionSchema` - Multirisk-specific subscription
- `iacSubscriptionSchema` - IAC-specific subscription
- `subscriptionSchema` - Subscription entity validation

### Payment Schemas

- `paymentStatusSchema` - Payment status enum
- `paymentMethodSchema` - Payment method enum
- `serviceCodeSchema` - Service code enum (OM, MOMO, WIZALL, WAVE)
- `createPaymentSchema` - V1 payment creation
- `createPaymentV2Schema` - V2 payment creation (with IAC support)
- `paymentCalculationSchema` - Payment calculation validation
- `priceBreakdownSchema` - Price breakdown validation
- `paymentSchema` - Payment entity validation

## TypeScript Types

All schemas export corresponding TypeScript types:

```typescript
import type {
  AutoProductSelection,
  MotoProductSelection,
  MultirisqueProductSelection,
  IACAddOn,
  CreateSubscriptionV2,
  CreatePaymentV2,
} from '@cnarsugu/schemas';
```

## Error Messages

All validation errors are in French for user-facing applications:

```typescript
const result = validate(phoneNumberSchema, '123');

if (!result.success) {
  console.log(result.errors);
  // [{ path: '', message: 'Le numéro de téléphone doit contenir au moins 9 chiffres' }]
}
```

## Development

```bash
# Build the package
pnpm build

# Watch mode
pnpm dev

# Type check
pnpm type-check

# Clean build artifacts
pnpm clean
```

## License

Private - CNAR Sugu
