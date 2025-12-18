/**
 * Example usage of @cnarsugu/store package
 * This file demonstrates how to use the store in a React application
 */

import React from 'react';
import { Provider } from 'react-redux';
import {
  store,
  useAppDispatch,
  useAppSelector,
  useGetAutoPricingQuery,
  setAutoSelection,
  selectAutoSelection,
  selectTotalPrice,
  selectHasProductSelection,
} from '@cnarsugu/store';

// ============================================================================
// App Setup with Provider
// ============================================================================

export function App() {
  return (
    <Provider store={store}>
      <AutoPricingExample />
    </Provider>
  );
}

// ============================================================================
// Example Component: Auto Pricing Selection
// ============================================================================

function AutoPricingExample() {
  const dispatch = useAppDispatch();
  const autoSelection = useAppSelector(selectAutoSelection);
  const totalPrice = useAppSelector(selectTotalPrice);
  const hasSelection = useAppSelector(selectHasProductSelection);

  // Fetch Auto pricing data using RTK Query
  const { data: pricingData, isLoading, error } = useGetAutoPricingQuery({
    cvMin: 2,
    cvMax: 4,
  });

  const handleSelectFormula = (pricing: any) => {
    dispatch(
      setAutoSelection({
        cvRange: { min: 2, max: 4, label: '2-4 CV' },
        formula: pricing.formulaType,
        price: pricing.price12m,
        coverages: pricing.coverages,
      })
    );
  };

  if (isLoading) {
    return <div>Loading pricing data...</div>;
  }

  if (error) {
    return <div>Error loading pricing data</div>;
  }

  return (
    <div>
      <h1>Auto Prestige - Select Your Formula</h1>

      {/* Display available formulas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {pricingData?.map((pricing) => (
          <div
            key={pricing.id}
            style={{
              border: '1px solid #ccc',
              padding: '1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor:
                autoSelection?.formula === pricing.formulaType ? '#e3f2fd' : 'white',
            }}
            onClick={() => handleSelectFormula(pricing)}
          >
            <h3>{pricing.formulaType}</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {pricing.price12m.toLocaleString()} FCFA
            </p>
            <ul>
              {pricing.coverages.map((coverage, idx) => (
                <li key={idx}>{coverage}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Display selection summary */}
      {hasSelection && (
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5' }}>
          <h2>Your Selection</h2>
          <p>
            <strong>Formula:</strong> {autoSelection?.formula}
          </p>
          <p>
            <strong>CV Range:</strong> {autoSelection?.cvRange.label}
          </p>
          <p>
            <strong>Total Price:</strong> {totalPrice.toLocaleString()} FCFA
          </p>
          <button
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Continue to Enrollment
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Example Component: Moto Pricing Selection
// ============================================================================

function MotoPricingExample() {
  const dispatch = useAppDispatch();
  const { data: pricingData, isLoading } = useGetMotoPricingQuery({
    category: 'DJAKARTA',
  });

  // Similar implementation for Moto...
  return <div>Moto Pricing Example</div>;
}

// ============================================================================
// Example Component: Enrollment Form
// ============================================================================

function EnrollmentExample() {
  const dispatch = useAppDispatch();
  const enrollmentForm = useAppSelector((state) => state.enrollment.formData);
  const currentStep = useAppSelector((state) => state.enrollment.currentStep);

  // Form implementation...
  return <div>Enrollment Form Example</div>;
}

// ============================================================================
// Example Component: Payment Flow
// ============================================================================

function PaymentExample() {
  const dispatch = useAppDispatch();
  const paymentForm = useAppSelector((state) => state.payment.formData);
  const totalPrice = useAppSelector(selectTotalPrice);

  // Payment implementation...
  return <div>Payment Flow Example</div>;
}

export default App;
