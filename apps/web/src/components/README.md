# Web Components Documentation

This directory contains reusable React components for the CNAR Sugu web application.

## Directory Structure

```
components/
├── products/          # Product-specific components
│   ├── AutoPricingComparison.tsx
│   ├── MotoCategorySelector.tsx
│   ├── MultirisquePackageCard.tsx
│   ├── IACCrossSellModal.tsx
│   ├── CoverageTooltip.tsx
│   └── index.ts
├── ui/               # Base UI components (shadcn/ui style)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── label.tsx
│   ├── badge.tsx
│   ├── spinner.tsx
│   ├── alert.tsx
│   └── index.ts
└── index.ts          # Main export file
```

## Product Components

### AutoPricingComparison

Displays a comparison table of Auto Prestige insurance formulas (Tiers, Essentielle, Étendue, Confort).

**Props:**
- `allPricing: AutoPricing[] | undefined` - All available auto pricing data
- `selectedCVRange: CVRange` - Currently selected CV range
- `onSubscribe: (formula: AutoFormulaType, pricing: AutoPricing) => void` - Callback when user subscribes

**Usage:**
```tsx
import { AutoPricingComparison } from '@/components/products';

<AutoPricingComparison
  allPricing={pricingData}
  selectedCVRange={cvRange}
  onSubscribe={handleSubscribe}
/>
```

### MotoCategorySelector

Displays category selection cards for motorcycle insurance (Djakarta, Grosse Cylindrée, Moto Taxi).

**Props:**
- `selectedCategory: MotoCategory | null` - Currently selected category
- `onSelectCategory: (category: MotoCategory) => void` - Callback when category is selected

**Usage:**
```tsx
import { MotoCategorySelector } from '@/components/products';

<MotoCategorySelector
  selectedCategory={category}
  onSelectCategory={setCategory}
/>
```

### MultirisquePackageCard

Displays a single Multirisk Professional package card with collapsible coverage details.

**Props:**
- `pkg: MultirisquePackage` - Package data
- `onSubscribe: () => void` - Callback when user subscribes

**Usage:**
```tsx
import { MultirisquePackageCard } from '@/components/products';

{packages.map((pkg) => (
  <MultirisquePackageCard
    key={pkg.id}
    pkg={pkg}
    onSubscribe={() => handleSubscribe(pkg)}
  />
))}
```

### IACCrossSellModal

Modal for cross-selling IAC (Indemnité Accident Corporel) add-on.

**Props:**
- `isOpen: boolean` - Whether modal is visible
- `onClose: () => void` - Callback to close modal
- `onAddIAC: () => void` - Callback when user adds IAC
- `iacPrice: number` - IAC price
- `deathCapital?: number` - Death coverage amount (default: 2,000,000)
- `disabilityCapital?: number` - Disability coverage amount (default: 2,000,000)
- `treatmentCapital?: number` - Treatment coverage amount (default: 500,000)

**Usage:**
```tsx
import { IACCrossSellModal } from '@/components/products';

<IACCrossSellModal
  isOpen={showModal}
  onClose={handleClose}
  onAddIAC={handleAddIAC}
  iacPrice={5000}
/>
```

### CoverageTooltip

Displays a tooltip with coverage information on hover/focus.

**Props:**
- `title: string` - Tooltip title
- `description: string` - Tooltip description
- `children: React.ReactNode` - Trigger element

**Usage:**
```tsx
import { CoverageTooltip, CoverageInfoIcon } from '@/components/products';

// With custom trigger
<CoverageTooltip title="Responsabilité Civile" description="Couvre les dommages...">
  <span>RC</span>
</CoverageTooltip>

// With info icon
<CoverageInfoIcon title="Bris de glace" description="Couvre le remplacement..." />
```

## UI Components

### Button

Versatile button component with multiple variants and sizes.

**Props:**
- `variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'`
- `size?: 'default' | 'sm' | 'lg' | 'icon'`

**Usage:**
```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="lg">Souscrire</Button>
```

### Card

Card container with header, content, and footer sections.

**Components:**
- `Card` - Main container
- `CardHeader` - Header section
- `CardTitle` - Title element
- `CardDescription` - Description element
- `CardContent` - Content section
- `CardFooter` - Footer section

**Usage:**
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';

<Card>
  <CardHeader>
    <CardTitle>Auto Prestige</CardTitle>
    <CardDescription>Protection automobile complète</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Input

Styled text input component.

**Usage:**
```tsx
import { Input } from '@/components/ui';

<Input type="text" placeholder="Nom complet" />
```

### Select

Styled select dropdown component.

**Usage:**
```tsx
import { Select } from '@/components/ui';

<Select>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</Select>
```

### Label

Form label component.

**Usage:**
```tsx
import { Label } from '@/components/ui';

<Label htmlFor="email">Email</Label>
```

### Badge

Small badge component for status indicators.

**Props:**
- `variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'`

**Usage:**
```tsx
import { Badge } from '@/components/ui';

<Badge variant="success">Actif</Badge>
```

### Spinner

Loading spinner component.

**Props:**
- `size?: 'sm' | 'md' | 'lg'`

**Usage:**
```tsx
import { Spinner } from '@/components/ui';

<Spinner size="lg" />
```

### Alert

Alert/notification component.

**Props:**
- `variant?: 'default' | 'success' | 'warning' | 'error' | 'info'`

**Components:**
- `Alert` - Main container
- `AlertTitle` - Title element
- `AlertDescription` - Description element

**Usage:**
```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui';

<Alert variant="success">
  <AlertTitle>Succès</AlertTitle>
  <AlertDescription>Votre souscription a été enregistrée.</AlertDescription>
</Alert>
```

## Styling

All components use Tailwind CSS for styling and follow the design system defined in `tailwind.config.ts`.

### Color Palette

- **Primary:** `#1e40af` (Blue)
- **Secondary:** `#64748b` (Slate)
- **Accent:** `#f59e0b` (Amber)

### Utility Function

The `cn()` utility function from `@/lib/utils` is used to merge Tailwind classes:

```tsx
import { cn } from '@/lib/utils';

<div className={cn('base-class', conditionalClass && 'conditional-class')} />
```

## Best Practices

1. **Import from index files:** Always import from the index files for cleaner imports
   ```tsx
   import { Button, Card } from '@/components/ui';
   import { AutoPricingComparison } from '@/components/products';
   ```

2. **Use TypeScript:** All components are fully typed with TypeScript

3. **Accessibility:** Components include proper ARIA attributes and keyboard navigation

4. **Responsive Design:** All components are mobile-first and responsive

5. **Reusability:** Extract common patterns into reusable components

## Requirements Validation

This implementation satisfies the following requirements:

- **products 6.1-6.5:** Product-specific UI components for Auto, Moto, Multirisk, and IAC
- **products 7.1-7.5:** Cross-sell components and upgrade modals
- **products 8.2:** Coverage tooltips and information displays
- **web-modernization:** Modern React components with TypeScript and Tailwind CSS
