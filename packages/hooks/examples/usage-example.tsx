/**
 * Usage examples for @cnarsugu/hooks
 * These examples demonstrate how to use the hooks in React components
 */

import React from 'react';
import {
  useAppDispatch,
  useAppSelector,
  useAutoSelection,
  useMotoSelection,
  useMultirisqueSelection,
  useProductSelection,
} from '@cnarsugu/hooks';

/**
 * Example 1: Using Redux hooks directly
 */
export function DirectReduxExample() {
  const dispatch = useAppDispatch();
  const productType = useAppSelector((state) => state.productSelection.selectedProductType);

  return (
    <div>
      <h2>Current Product Type: {productType || 'None'}</h2>
    </div>
  );
}

/**
 * Example 2: Using Auto selection hook
 */
export function AutoSelectionExample() {
  const { autoSelection, selectAuto, toggleIAC, isSelected, hasIAC } = useAutoSelection();

  const handleSelectTiers = () => {
    selectAuto({
      cvRange: { min: 2, max: 4 },
      formula: 'TIERS',
      price: 45000,
      coverages: ['RC', 'Defense'],
    });
  };

  const handleSelectEssentielle = () => {
    selectAuto({
      cvRange: { min: 2, max: 4 },
      formula: 'ESSENTIELLE',
      price: 55000,
      coverages: ['RC', 'Defense', 'Vol', 'Incendie'],
    });
  };

  return (
    <div>
      <h2>Auto Prestige Selection</h2>
      <button onClick={handleSelectTiers}>Select Tiers</button>
      <button onClick={handleSelectEssentielle}>Select Essentielle</button>
      
      {isSelected && (
        <div>
          <p>Selected Formula: {autoSelection?.formula}</p>
          <p>Price: {autoSelection?.price} FCFA</p>
          <button onClick={() => toggleIAC(!hasIAC)}>
            {hasIAC ? 'Remove IAC' : 'Add IAC'}
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Example 3: Using Moto selection hook
 */
export function MotoSelectionExample() {
  const { motoSelection, selectMoto, isSelected, includesIAC, canUpgradeToEssentielle } = useMotoSelection();

  const handleSelectTiers = () => {
    selectMoto({
      category: 'DJAKARTA',
      formula: 'TIERS',
      price: 35000,
      coverages: ['RC', 'Defense'],
      includesIac: false,
    });
  };

  const handleUpgradeToEssentielle = () => {
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
      <h2>Moto Selection</h2>
      <button onClick={handleSelectTiers}>Select Tiers</button>
      
      {isSelected && (
        <div>
          <p>Selected Formula: {motoSelection?.formula}</p>
          <p>Category: {motoSelection?.category}</p>
          <p>Price: {motoSelection?.price} FCFA</p>
          {includesIAC && <p>✓ IAC Included</p>}
          
          {canUpgradeToEssentielle && (
            <button onClick={handleUpgradeToEssentielle}>
              Upgrade to Essentielle (includes IAC)
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Example 4: Using Multirisk selection hook
 */
export function MultirisqueSelectionExample() {
  const { multirisqueSelection, selectMultirisk, isSelected, businessType } = useMultirisqueSelection();

  const handleSelectHotelPackage = () => {
    selectMultirisk({
      packageCode: 'HOTEL_STANDARD',
      name: 'Hôtels & Restaurants',
      businessType: 'HOTEL',
      price: 150000,
      coverageDetails: {
        incendie: { limit: 50000000, franchise: 100000 },
        vol: { limit: 10000000, franchise: 50000 },
        degatsDeseaux: { limit: 5000000, franchise: 50000 },
        brisDeGlace: { limit: 2000000, franchise: 0 },
        rc: { limit: 100000000, franchise: 0 },
      },
    });
  };

  return (
    <div>
      <h2>Multirisk Pro Selection</h2>
      <button onClick={handleSelectHotelPackage}>Select Hotel Package</button>
      
      {isSelected && (
        <div>
          <p>Package: {multirisqueSelection?.name}</p>
          <p>Business Type: {businessType}</p>
          <p>Price: {multirisqueSelection?.price} FCFA</p>
        </div>
      )}
    </div>
  );
}

/**
 * Example 5: Using general product selection hook
 */
export function ProductSelectionExample() {
  const {
    productType,
    totalPrice,
    hasSelection,
    currentProduct,
    addIAC,
    isIACSelected,
    clearAll,
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
      <h2>Product Selection Summary</h2>
      
      {hasSelection ? (
        <div>
          <p>Product Type: {productType}</p>
          <p>Total Price: {totalPrice} FCFA</p>
          
          {currentProduct && (
            <div>
              <h3>Selected Product Details:</h3>
              <pre>{JSON.stringify(currentProduct, null, 2)}</pre>
            </div>
          )}
          
          {!isIACSelected && productType !== 'MULTIRISK_PRO' && (
            <button onClick={handleAddIAC}>Add IAC (+5,000 FCFA)</button>
          )}
          
          <button onClick={clearAll}>Clear All Selections</button>
        </div>
      ) : (
        <p>No product selected</p>
      )}
    </div>
  );
}

/**
 * Example 6: Complete checkout flow
 */
export function CheckoutFlowExample() {
  const { autoSelection } = useAutoSelection();
  const { motoSelection } = useMotoSelection();
  const { multirisqueSelection } = useMultirisqueSelection();
  const { totalPrice, iacAddOn, isIACSelected } = useProductSelection();

  return (
    <div>
      <h2>Checkout Summary</h2>
      
      {autoSelection && (
        <div>
          <h3>Auto Prestige</h3>
          <p>Formula: {autoSelection.formula}</p>
          <p>CV Range: {autoSelection.cvRange.min}-{autoSelection.cvRange.max}</p>
          <p>Price: {autoSelection.price} FCFA</p>
        </div>
      )}
      
      {motoSelection && (
        <div>
          <h3>Moto</h3>
          <p>Category: {motoSelection.category}</p>
          <p>Formula: {motoSelection.formula}</p>
          <p>Price: {motoSelection.price} FCFA</p>
        </div>
      )}
      
      {multirisqueSelection && (
        <div>
          <h3>Multirisk Pro</h3>
          <p>Package: {multirisqueSelection.name}</p>
          <p>Price: {multirisqueSelection.price} FCFA</p>
        </div>
      )}
      
      {isIACSelected && iacAddOn && (
        <div>
          <h3>IAC Add-on</h3>
          <p>Price: {iacAddOn.price} FCFA</p>
          <p>Death Capital: {iacAddOn.deathCapital} FCFA</p>
          <p>Disability Capital: {iacAddOn.disabilityCapital} FCFA</p>
        </div>
      )}
      
      <div>
        <h3>Total: {totalPrice} FCFA</h3>
      </div>
    </div>
  );
}
