# Design Document - Insurance Products Update

## Overview

This design document outlines the technical implementation for adding new insurance products to the CNAR Sugu platform. The solution integrates with the modernized Next.js web application and updated React Native mobile app, leveraging the shared Redux Toolkit store and RTK Query API layer. The design focuses on flexible pricing models, clear product presentation, and seamless cross-sell opportunities.

## Architecture Integration

The insurance products feature integrates with the existing monorepo architecture:

```
packages/
├── store/
│   ├── api/
│   │   ├── insuranceApi.ts          # Extended with new endpoints
│   │   ├── pricingApi.ts            # NEW: Pricing queries
│   │   └── productsApi.ts           # NEW: Product catalog
│   └── slices/
│       ├── insuranceSlice.ts        # Extended with new product types
│       └── pricingSlice.ts          # NEW: Pricing calculations
├── types/
│   ├── products.ts                  # NEW: Product type definitions
│   └── pricing.ts                   # NEW: Pricing structures
└── schemas/
    ├── autoInsurance.ts             # NEW: Auto validation
    ├── motoInsurance.ts             # NEW: Moto validation
    └── multirisqueInsurance.ts      # NEW: Multirisk validation
```

## Data Models

### Database Schema

#### Table: pricing_matrix_auto

Stores Auto Prestige pricing based on CV ranges and formulas.

```sql
CREATE TABLE pricing_matrix_auto (
  id SERIAL PRIMARY KEY,
  cv_min INTEGER NOT NULL,
  cv_max INTEGER NOT NULL,
  formula_type VARCHAR(20) NOT NULL, -- 'TIERS', 'ESSENTIELLE', 'ETENDUE', 'CONFORT'
  price_12m INTEGER NOT NULL, -- Price in FCFA
  coverages JSONB NOT NULL, -- Array of coverage codes
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_cv_formula UNIQUE (cv_min, cv_max, formula_type)
);

-- Sample data
INSERT INTO pricing_matrix_auto (cv_min, cv_max, formula_type, price_12m, coverages) VALUES
(1, 1, 'TIERS', 34308, '["RC", "DR", "CEDEAO", "ASSISTANCE"]'),
(1, 1, 'ESSENTIELLE', 44308, '["RC", "DR", "CEDEAO", "ASSISTANCE", "IC"]'),
(2, 4, 'TIERS', 40144, '["RC", "DR", "CEDEAO", "ASSISTANCE"]'),
(2, 4, 'ESSENTIELLE', 50144, '["RC", "DR", "CEDEAO", "ASSISTANCE", "IC"]'),
(2, 4, 'ETENDUE', 60144, '["RC", "DR", "CEDEAO", "ASSISTANCE", "IC", "VAM"]'),
(2, 4, 'CONFORT', 65144, '["RC", "DR", "CEDEAO", "ASSISTANCE", "IC", "VAM", "BDG"]');
```

#### Table: moto_pricing

Stores Moto insurance pricing by category.

```sql
CREATE TABLE moto_pricing (
  id SERIAL PRIMARY KEY,
  category VARCHAR(20) NOT NULL, -- 'DJAKARTA', 'GROSSE_CYLINDREE', 'MOTO_TAXI'
  formula_type VARCHAR(20) NOT NULL, -- 'TIERS', 'ESSENTIELLE'
  price_12m INTEGER NOT NULL,
  includes_iac BOOLEAN DEFAULT FALSE,
  coverages JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_category_formula UNIQUE (category, formula_type)
);

-- Sample data
INSERT INTO moto_pricing (category, formula_type, price_12m, includes_iac, coverages) VALUES
('DJAKARTA', 'TIERS', 7500, FALSE, '["RC", "DR"]'),
('DJAKARTA', 'ESSENTIELLE', 10000, TRUE, '["RC", "DR", "IAC"]'),
('GROSSE_CYLINDREE', 'TIERS', 35000, FALSE, '["RC", "DR"]'),
('GROSSE_CYLINDREE', 'ESSENTIELLE', 37500, TRUE, '["RC", "DR", "IAC"]'),
('MOTO_TAXI', 'TIERS', 25000, FALSE, '["RC", "DR"]'),
('MOTO_TAXI', 'ESSENTIELLE', 27500, TRUE, '["RC", "DR", "IAC"]');
```

#### Table: static_packages_pro

Stores Multirisk Professional fixed-price packages.

```sql
CREATE TABLE static_packages_pro (
  id SERIAL PRIMARY KEY,
  package_code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  business_type VARCHAR(50) NOT NULL, -- 'BOUTIQUE', 'RESTAURANT', 'HOTEL', 'BAR_CLUB'
  price_ttc INTEGER NOT NULL,
  coverage_details JSONB NOT NULL, -- Detailed coverage structure
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO static_packages_pro (package_code, name, business_type, price_ttc, coverage_details, display_order) VALUES
('MR_BOUTIQUE', 'Multirisque Boutique', 'BOUTIQUE', 50000, '{
  "chapters": [
    {
      "name": "Incendie",
      "items": [
        {"description": "Bâtiments, Risques locatifs, Installations", "capital": 36000000, "franchise": "Néant"},
        {"description": "Stocks de marchandises", "capital": 5000000, "franchise": "Néant"},
        {"description": "Recours des Voisins & Tiers", "capital": 20000000, "franchise": "Néant"}
      ]
    },
    {
      "name": "Dommages Électriques",
      "items": [
        {"description": "Appareils électriques", "capital": 500000, "franchise": "10% du sinistre"}
      ]
    },
    {
      "name": "Dégâts des Eaux",
      "items": [
        {"description": "Limitation par sinistre", "capital": 250000, "franchise": "50 000"}
      ]
    },
    {
      "name": "Bris de Glaces",
      "items": [
        {"description": "Dommages directs", "capital": 500000, "franchise": "10% du sinistre"}
      ]
    },
    {
      "name": "Vol",
      "items": [
        {"description": "Matériels, Stocks, Equipements", "capital": 2000000, "franchise": "10% (Min 100 000)"}
      ]
    },
    {
      "name": "Responsabilité Civile",
      "items": [
        {"description": "Exploitation (Dommages corporels)", "capital": 1000000, "franchise": "Néant"}
      ]
    }
  ]
}', 1);
```

#### Table: iac_product

Stores Individual Accident Coverage product details.

```sql
CREATE TABLE iac_product (
  id SERIAL PRIMARY KEY,
  price INTEGER NOT NULL DEFAULT 5000,
  death_capital INTEGER NOT NULL DEFAULT 500000,
  disability_capital INTEGER NOT NULL DEFAULT 500000,
  treatment_capital INTEGER NOT NULL DEFAULT 120000,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO iac_product (price, death_capital, disability_capital, treatment_capital, description) VALUES
(5000, 500000, 500000, 120000, 'Paiement d''une indemnité contractuelle à la suite d''accidents corporels subis par l''assuré tant au cours de sa vie professionnelle que privée.');
```

#### Table: coverage_definitions

Stores coverage code definitions for tooltips and explanations.

```sql
CREATE TABLE coverage_definitions (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO coverage_definitions (code, name, description) VALUES
('RC', 'Responsabilité Civile', 'Couvre les dommages causés à des tiers'),
('DR', 'Défense et Recours', 'Prise en charge des frais de défense juridique'),
('CEDEAO', 'Carte CEDEAO', 'Couverture dans les pays de la CEDEAO'),
('ASSISTANCE', 'Assistance+', 'Services d''assistance routière'),
('IC', 'Incendie', 'Dommages causés par le feu'),
('VAM', 'Vol à Main Armée', 'Protection contre le vol avec violence'),
('BDG', 'Bris de Glace', 'Remplacement des vitres et pare-brise'),
('IAC', 'Individuel Accident Corporel', 'Protection personnelle du conducteur');
```

### TypeScript Types

```typescript
// packages/types/src/products.ts

export type ProductType = 'AUTO' | 'MOTO' | 'MULTIRISK_PRO' | 'IAC';

export type AutoFormulaType = 'TIERS' | 'ESSENTIELLE' | 'ETENDUE' | 'CONFORT';
export type MotoFormulaType = 'TIERS' | 'ESSENTIELLE';
export type MotoCategory = 'DJAKARTA' | 'GROSSE_CYLINDREE' | 'MOTO_TAXI';
export type BusinessType = 'BOUTIQUE' | 'RESTAURANT' | 'HOTEL' | 'BAR_CLUB';

export interface CVRange {
  min: number;
  max: number;
  label: string; // e.g., "2 à 4 CV"
}

export interface AutoPricing {
  id: number;
  cvMin: number;
  cvMax: number;
  formulaType: AutoFormulaType;
  price12m: number;
  coverages: string[];
}

export interface MotoPricing {
  id: number;
  category: MotoCategory;
  formulaType: MotoFormulaType;
  price12m: number;
  includesIac: boolean;
  coverages: string[];
}

export interface CoverageItem {
  description: string;
  capital: number;
  franchise: string;
}

export interface CoverageChapter {
  name: string;
  items: CoverageItem[];
}

export interface MultirisquePackage {
  id: number;
  packageCode: string;
  name: string;
  businessType: BusinessType;
  priceTtc: number;
  coverageDetails: {
    chapters: CoverageChapter[];
  };
  displayOrder: number;
  active: boolean;
}

export interface IACProduct {
  id: number;
  price: number;
  deathCapital: number;
  disabilityCapital: number;
  treatmentCapital: number;
  description: string;
  active: boolean;
}

export interface CoverageDefinition {
  code: string;
  name: string;
  description: string;
}

// Selection state
export interface AutoSelection {
  cvRange: CVRange;
  formula: AutoFormulaType;
  pricing: AutoPricing;
  addIac: boolean;
}

export interface MotoSelection {
  category: MotoCategory;
  formula: MotoFormulaType;
  pricing: MotoPricing;
}

export interface MultirisqueSelection {
  package: MultirisquePackage;
}

export interface IACSelection {
  product: IACProduct;
  isAddon: boolean; // true if added to Auto/Moto, false if standalone
}
```

## Components and Interfaces

### RTK Query API Endpoints

```typescript
// packages/store/src/api/pricingApi.ts
import { baseApi } from './baseApi';
import type { AutoPricing, MotoPricing, MultirisquePackage, IACProduct } from '@cnarsugu/types';

export const pricingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Auto Prestige pricing
    getAutoPricing: builder.query<AutoPricing[], { cvMin: number; cvMax: number }>({
      query: ({ cvMin, cvMax }) => `/pricing/auto?cvMin=${cvMin}&cvMax=${cvMax}`,
      providesTags: ['Pricing'],
    }),
    
    getAllAutoPricing: builder.query<AutoPricing[], void>({
      query: () => '/pricing/auto/all',
      providesTags: ['Pricing'],
      keepUnusedDataFor: 600, // 10 minutes cache
    }),
    
    // Moto pricing
    getMotoPricing: builder.query<MotoPricing[], { category: string }>({
      query: ({ category }) => `/pricing/moto?category=${category}`,
      providesTags: ['Pricing'],
    }),
    
    getAllMotoPricing: builder.query<MotoPricing[], void>({
      query: () => '/pricing/moto/all',
      providesTags: ['Pricing'],
      keepUnusedDataFor: 600,
    }),
    
    // Multirisk Pro packages
    getMultirisquePackages: builder.query<MultirisquePackage[], void>({
      query: () => '/pricing/multirisk-pro',
      providesTags: ['Pricing'],
      keepUnusedDataFor: 600,
    }),
    
    getMultirisquePackage: builder.query<MultirisquePackage, string>({
      query: (packageCode) => `/pricing/multirisk-pro/${packageCode}`,
      providesTags: (result, error, packageCode) => [
        { type: 'Pricing', id: packageCode },
      ],
    }),
    
    // IAC product
    getIACProduct: builder.query<IACProduct, void>({
      query: () => '/pricing/iac',
      providesTags: ['Pricing'],
      keepUnusedDataFor: 600,
    }),
    
    // Coverage definitions
    getCoverageDefinitions: builder.query<CoverageDefinition[], void>({
      query: () => '/pricing/coverage-definitions',
      providesTags: ['Pricing'],
      keepUnusedDataFor: 3600, // 1 hour cache
    }),
  }),
});

export const {
  useGetAutoPricingQuery,
  useGetAllAutoPricingQuery,
  useGetMotoPricingQuery,
  useGetAllMotoPricingQuery,
  useGetMultirisquePackagesQuery,
  useGetMultirisquePackageQuery,
  useGetIACProductQuery,
  useGetCoverageDefinitionsQuery,
} = pricingApi;
```

### Redux Slices

```typescript
// packages/store/src/slices/productSelectionSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  ProductType,
  AutoSelection,
  MotoSelection,
  MultirisqueSelection,
  IACSelection,
} from '@cnarsugu/types';

interface ProductSelectionState {
  currentProduct: ProductType | null;
  autoSelection: AutoSelection | null;
  motoSelection: MotoSelection | null;
  multirisqueSelection: MultirisqueSelection | null;
  iacSelection: IACSelection | null;
  totalPrice: number;
}

const initialState: ProductSelectionState = {
  currentProduct: null,
  autoSelection: null,
  motoSelection: null,
  multirisqueSelection: null,
  iacSelection: null,
  totalPrice: 0,
};

const productSelectionSlice = createSlice({
  name: 'productSelection',
  initialState,
  reducers: {
    setCurrentProduct: (state, action: PayloadAction<ProductType>) => {
      state.currentProduct = action.payload;
    },
    
    setAutoSelection: (state, action: PayloadAction<AutoSelection>) => {
      state.autoSelection = action.payload;
      state.currentProduct = 'AUTO';
      state.totalPrice = action.payload.pricing.price12m + 
        (action.payload.addIac ? 5000 : 0);
    },
    
    setMotoSelection: (state, action: PayloadAction<MotoSelection>) => {
      state.motoSelection = action.payload;
      state.currentProduct = 'MOTO';
      state.totalPrice = action.payload.pricing.price12m;
    },
    
    setMultirisqueSelection: (state, action: PayloadAction<MultirisqueSelection>) => {
      state.multirisqueSelection = action.payload;
      state.currentProduct = 'MULTIRISK_PRO';
      state.totalPrice = action.payload.package.priceTtc;
    },
    
    setIACSelection: (state, action: PayloadAction<IACSelection>) => {
      state.iacSelection = action.payload;
      if (!action.payload.isAddon) {
        state.currentProduct = 'IAC';
        state.totalPrice = action.payload.product.price;
      }
    },
    
    toggleAutoIAC: (state) => {
      if (state.autoSelection) {
        state.autoSelection.addIac = !state.autoSelection.addIac;
        state.totalPrice = state.autoSelection.pricing.price12m + 
          (state.autoSelection.addIac ? 5000 : 0);
      }
    },
    
    clearSelection: (state) => {
      return initialState;
    },
  },
});

export const {
  setCurrentProduct,
  setAutoSelection,
  setMotoSelection,
  setMultirisqueSelection,
  setIACSelection,
  toggleAutoIAC,
  clearSelection,
} = productSelectionSlice.actions;

export default productSelectionSlice.reducer;
```

### Validation Schemas

```typescript
// packages/schemas/src/autoInsurance.ts
import { z } from 'zod';

export const cvRangeSchema = z.object({
  min: z.number().int().min(1),
  max: z.number().int().min(1),
  label: z.string(),
});

export const autoFormulaSchema = z.enum(['TIERS', 'ESSENTIELLE', 'ETENDUE', 'CONFORT']);

export const autoSelectionSchema = z.object({
  cvRange: cvRangeSchema,
  formula: autoFormulaSchema,
  addIac: z.boolean().default(false),
});

export type AutoSelectionData = z.infer<typeof autoSelectionSchema>;

// packages/schemas/src/motoInsurance.ts
export const motoCategorySchema = z.enum(['DJAKARTA', 'GROSSE_CYLINDREE', 'MOTO_TAXI']);
export const motoFormulaSchema = z.enum(['TIERS', 'ESSENTIELLE']);

export const motoSelectionSchema = z.object({
  category: motoCategorySchema,
  formula: motoFormulaSchema,
});

export type MotoSelectionData = z.infer<typeof motoSelectionSchema>;

// packages/schemas/src/multirisqueInsurance.ts
export const businessTypeSchema = z.enum(['BOUTIQUE', 'RESTAURANT', 'HOTEL', 'BAR_CLUB']);

export const multirisqueSelectionSchema = z.object({
  packageCode: z.string().min(1),
  businessType: businessTypeSchema,
});

export type MultirisqueSelectionData = z.infer<typeof multirisqueSelectionSchema>;
```

## UI Components

### Web Components

```typescript
// apps/web/src/components/products/AutoPricingComparison.tsx
interface AutoPricingComparisonProps {
  cvRange: CVRange;
  pricingOptions: AutoPricing[];
  onSelectFormula: (formula: AutoFormulaType) => void;
}

// Displays side-by-side comparison table for Auto formulas
// Shows checkmarks for included coverages
// Highlights price differences

// apps/web/src/components/products/MotoCategorySelector.tsx
interface MotoCategorySelectorProps {
  onSelectCategory: (category: MotoCategory) => void;
}

// Displays 3 category cards: Djakarta, Grosse Cylindrée, Moto Taxi
// Shows representative images and descriptions

// apps/web/src/components/products/MultirisquePackageCard.tsx
interface MultirisquePackageCardProps {
  package: MultirisquePackage;
  onSelect: () => void;
}

// Displays business package with price prominently
// Shows key coverage highlights
// "Souscrire" button

// apps/web/src/components/products/IACCrossSellModal.tsx
interface IACCrossSellModalProps {
  basePrice: number;
  onAccept: () => void;
  onDecline: () => void;
}

// Modal popup offering IAC add-on
// Shows benefits and price increase
```

### Mobile Components

```typescript
// apps/mobile/src/components/products/AutoFormulaCards.tsx
// Swipeable cards for Auto formulas
// Each card shows formula name, price, and key coverages

// apps/mobile/src/components/products/CoverageAccordion.tsx
interface CoverageAccordionProps {
  chapters: CoverageChapter[];
}

// Collapsible accordion for detailed coverage information
// Handles long franchise text gracefully

// apps/mobile/src/components/products/IACUpgradeBottomSheet.tsx
// Bottom sheet offering IAC upgrade for Moto Tiers
// Shows comparison: Tiers vs Essentielle with IAC
```

## Backend API Endpoints

### Pricing Endpoints

```typescript
// GET /api/pricing/auto?cvMin=2&cvMax=4
// Returns: AutoPricing[] for the specified CV range

// GET /api/pricing/auto/all
// Returns: AutoPricing[] for all CV ranges and formulas

// GET /api/pricing/moto?category=DJAKARTA
// Returns: MotoPricing[] for the specified category

// GET /api/pricing/moto/all
// Returns: MotoPricing[] for all categories

// GET /api/pricing/multirisk-pro
// Returns: MultirisquePackage[] - all active packages

// GET /api/pricing/multirisk-pro/:packageCode
// Returns: MultirisquePackage - specific package details

// GET /api/pricing/iac
// Returns: IACProduct - current IAC product

// GET /api/pricing/coverage-definitions
// Returns: CoverageDefinition[] - all coverage explanations
```

### NestJS Implementation

```typescript
// cnarSuguApi/src/modules/pricing/pricing.controller.ts
@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get('auto')
  async getAutoPricing(@Query('cvMin') cvMin: number, @Query('cvMax') cvMax: number) {
    return this.pricingService.getAutoPricing(cvMin, cvMax);
  }

  @Get('auto/all')
  async getAllAutoPricing() {
    return this.pricingService.getAllAutoPricing();
  }

  @Get('moto')
  async getMotoPricing(@Query('category') category: string) {
    return this.pricingService.getMotoPricing(category);
  }

  @Get('multirisk-pro')
  async getMultirisquePackages() {
    return this.pricingService.getMultirisquePackages();
  }

  @Get('multirisk-pro/:packageCode')
  async getMultirisquePackage(@Param('packageCode') packageCode: string) {
    return this.pricingService.getMultirisquePackage(packageCode);
  }

  @Get('iac')
  async getIACProduct() {
    return this.pricingService.getIACProduct();
  }

  @Get('coverage-definitions')
  async getCoverageDefinitions() {
    return this.pricingService.getCoverageDefinitions();
  }
}
```

## Error Handling

All pricing queries should handle:
- Missing data (CV range not found, package not active)
- Invalid parameters (negative CV, unknown category)
- Database connection errors

Return user-friendly French error messages:
- "Désolé, nous n'avons pas trouvé de tarif pour cette puissance fiscale."
- "Cette catégorie de moto n'est pas disponible."
- "Ce package professionnel n'est plus disponible."

## Testing Strategy

### Unit Tests
- Pricing calculation logic
- CV range matching
- Formula comparison logic
- IAC cross-sell eligibility

### Integration Tests
- API endpoints with mocked database
- Redux slice state updates
- RTK Query cache behavior

### E2E Tests
- Complete Auto selection flow (CV → Formula → IAC → Checkout)
- Moto category selection with IAC upgrade
- Multirisk Pro package selection
- IAC standalone purchase

## Performance Considerations

- Cache pricing data aggressively (10-60 minutes)
- Preload all pricing on app initialization
- Use optimistic updates for selection changes
- Lazy load coverage details for Multirisk packages
- Compress JSON coverage data in database

## Migration Strategy

1. Create new database tables
2. Import CSV data via migration scripts
3. Deploy API endpoints
4. Update Redux store with new slices
5. Deploy web UI components
6. Deploy mobile UI components
7. Enable new products in production
