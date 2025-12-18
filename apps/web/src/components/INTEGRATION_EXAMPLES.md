# Component Integration Examples

This document provides practical examples of how to use the web components together in real-world scenarios.

## Example 1: Auto Prestige Page with Components

```tsx
'use client';

import { useState } from 'react';
import { useGetAllAutoPricingQuery, useGetIACProductQuery } from '@cnarsugu/store';
import { CV_RANGES } from '@cnarsugu/utils';
import { AutoPricingComparison, IACCrossSellModal } from '@/components/products';
import { Select, Label, Spinner, Alert } from '@/components/ui';

export default function AutoPrestigePage() {
  const [selectedCVRange, setSelectedCVRange] = useState(CV_RANGES[1]);
  const [showIACModal, setShowIACModal] = useState(false);
  
  const { data: allPricing, isLoading, error } = useGetAllAutoPricingQuery();
  const { data: iacProduct } = useGetIACProductQuery();

  const handleSubscribe = (formula, pricing) => {
    if (formula === 'TIERS' && iacProduct) {
      setShowIACModal(true);
    } else {
      // Proceed to enrollment
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* CV Range Selector */}
      <div className="mb-8">
        <Label htmlFor="cv-range">Puissance du véhicule (CV)</Label>
        <Select
          id="cv-range"
          value={`${selectedCVRange.min}-${selectedCVRange.max}`}
          onChange={(e) => {
            const [min, max] = e.target.value.split('-').map(Number);
            const range = CV_RANGES.find((r) => r.min === min && r.max === max);
            if (range) setSelectedCVRange(range);
          }}
        >
          {CV_RANGES.map((range) => (
            <option key={`${range.min}-${range.max}`} value={`${range.min}-${range.max}`}>
              {range.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="error">
          Une erreur est survenue lors du chargement des formules.
        </Alert>
      )}

      {/* Pricing Comparison */}
      {!isLoading && !error && (
        <AutoPricingComparison
          allPricing={allPricing}
          selectedCVRange={selectedCVRange}
          onSubscribe={handleSubscribe}
        />
      )}

      {/* IAC Cross-sell Modal */}
      <IACCrossSellModal
        isOpen={showIACModal}
        onClose={() => setShowIACModal(false)}
        onAddIAC={() => {
          // Add IAC and proceed
          setShowIACModal(false);
        }}
        iacPrice={iacProduct?.price || 5000}
        deathCapital={iacProduct?.deathCapital}
        disabilityCapital={iacProduct?.disabilityCapital}
        treatmentCapital={iacProduct?.treatmentCapital}
      />
    </div>
  );
}
```

## Example 2: Moto Page with Category Selector

```tsx
'use client';

import { useState } from 'react';
import { useGetAllMotoPricingQuery } from '@cnarsugu/store';
import { MotoCategorySelector } from '@/components/products';
import { Card, CardHeader, CardTitle, CardContent, Button, Spinner } from '@/components/ui';

export default function MotoPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { data: allPricing, isLoading } = useGetAllMotoPricingQuery();

  const filteredPricing = allPricing?.filter(
    (p) => p.category === selectedCategory
  );

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Category Selection */}
      <MotoCategorySelector
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Formula Display */}
      {!isLoading && selectedCategory && filteredPricing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPricing.map((pricing) => (
            <Card key={pricing.id}>
              <CardHeader>
                <CardTitle>{pricing.formulaType}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary mb-4">
                  {pricing.price12m} FCFA
                </p>
                <Button variant="primary" className="w-full">
                  Souscrire
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Example 3: Multirisk Pro with Package Cards

```tsx
'use client';

import { useGetMultirisquePackagesQuery } from '@cnarsugu/store';
import { MultirisquePackageCard } from '@/components/products';
import { Alert, AlertTitle, AlertDescription, Spinner } from '@/components/ui';

export default function MultirisqueProPage() {
  const { data: packages, isLoading, error } = useGetMultirisquePackagesQuery();

  const handleSubscribe = (pkg) => {
    console.log('Subscribing to:', pkg.name);
    // Navigate to enrollment
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Multirisque Professionnelle</h1>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="error">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            Impossible de charger les formules. Veuillez réessayer.
          </AlertDescription>
        </Alert>
      )}

      {/* Package Grid */}
      {!isLoading && !error && packages && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((pkg) => (
              <MultirisquePackageCard
                key={pkg.id}
                pkg={pkg}
                onSubscribe={() => handleSubscribe(pkg)}
              />
            ))}
        </div>
      )}
    </div>
  );
}
```

## Example 4: Form with UI Components

```tsx
'use client';

import { useState } from 'react';
import { Input, Label, Select, Button, Alert, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

export default function EnrollmentForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    clientType: 'INDIVIDUAL',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Informations personnelles</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <Label htmlFor="fullName">Nom complet</Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Jean Dupont"
              required
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="jean.dupont@example.com"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+237 6XX XX XX XX"
              required
            />
          </div>

          {/* Client Type */}
          <div>
            <Label htmlFor="clientType">Type de client</Label>
            <Select
              id="clientType"
              value={formData.clientType}
              onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
            >
              <option value="INDIVIDUAL">Particulier</option>
              <option value="BUSINESS">Entreprise</option>
            </Select>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="error">
              {error}
            </Alert>
          )}

          {/* Submit Button */}
          <Button type="submit" variant="primary" className="w-full">
            Continuer
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

## Example 5: Coverage Information with Tooltips

```tsx
'use client';

import { CoverageTooltip, CoverageInfoIcon } from '@/components/products';
import { Badge } from '@/components/ui';

export default function CoverageList() {
  const coverages = [
    {
      name: 'Responsabilité Civile',
      description: 'Couvre les dommages causés aux tiers',
      included: true,
    },
    {
      name: 'Bris de glace',
      description: 'Remplacement des vitres et pare-brise',
      included: true,
    },
    {
      name: 'Vol',
      description: 'Indemnisation en cas de vol du véhicule',
      included: false,
    },
  ];

  return (
    <div className="space-y-3">
      {coverages.map((coverage, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className={coverage.included ? 'text-green-600' : 'text-gray-400'}>
              {coverage.included ? '✓' : '○'}
            </span>
            <span className="font-medium">{coverage.name}</span>
            <CoverageInfoIcon
              title={coverage.name}
              description={coverage.description}
            />
          </div>
          {coverage.included && (
            <Badge variant="success">Inclus</Badge>
          )}
        </div>
      ))}
    </div>
  );
}
```

## Example 6: Loading and Error States

```tsx
'use client';

import { Spinner, Alert, AlertTitle, AlertDescription, Button } from '@/components/ui';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Spinner size="lg" />
      <p className="mt-4 text-gray-600">Chargement des données...</p>
    </div>
  );
}

export function ErrorState({ onRetry }) {
  return (
    <Alert variant="error">
      <AlertTitle>Erreur de chargement</AlertTitle>
      <AlertDescription>
        Une erreur est survenue lors du chargement des données.
      </AlertDescription>
      <Button onClick={onRetry} variant="outline" className="mt-4">
        Réessayer
      </Button>
    </Alert>
  );
}

export function EmptyState() {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <div className="text-6xl mb-4">📦</div>
      <h3 className="text-xl font-semibold mb-2">Aucun résultat</h3>
      <p className="text-gray-600">
        Aucune donnée disponible pour le moment.
      </p>
    </div>
  );
}
```

## Best Practices

### 1. Component Composition

Combine small components to build complex UIs:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <Badge variant="success">New</Badge>
  </CardHeader>
  <CardContent>
    <Input />
    <Button>Submit</Button>
  </CardContent>
</Card>
```

### 2. Conditional Rendering

Use components conditionally based on state:

```tsx
{isLoading && <Spinner />}
{error && <Alert variant="error">{error}</Alert>}
{data && <DataDisplay data={data} />}
```

### 3. Custom Styling

Extend component styles with className:

```tsx
<Button className="mt-4 w-full" variant="primary">
  Custom Button
</Button>
```

### 4. Accessibility

Always include proper labels and ARIA attributes:

```tsx
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" aria-required="true" />
```

### 5. Type Safety

Use TypeScript for type-safe component usage:

```tsx
import type { AutoPricing, CVRange } from '@cnarsugu/types';

const handleSubscribe = (formula: AutoFormulaType, pricing: AutoPricing) => {
  // Type-safe implementation
};
```

## Testing Examples

### Unit Test Example

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByText('Primary');
    expect(button).toHaveClass('bg-primary');
  });
});
```

### Integration Test Example

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MotoCategorySelector } from '@/components/products';

describe('MotoCategorySelector', () => {
  it('selects category on click', () => {
    const onSelect = jest.fn();
    render(
      <MotoCategorySelector
        selectedCategory={null}
        onSelectCategory={onSelect}
      />
    );

    const djakartaCard = screen.getByText('Djakarta');
    fireEvent.click(djakartaCard);

    expect(onSelect).toHaveBeenCalledWith('DJAKARTA');
  });
});
```

## Conclusion

These examples demonstrate how to effectively use the web components in various scenarios. The components are designed to be:

- **Composable:** Combine multiple components to build complex UIs
- **Flexible:** Customize with props and className
- **Type-safe:** Full TypeScript support
- **Accessible:** Built-in accessibility features
- **Consistent:** Follow design system patterns

For more details, refer to the main README.md in the components directory.
