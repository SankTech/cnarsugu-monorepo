import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

/**
 * Base selector for product selection state
 */
const selectProductSelectionState = (state: RootState) => state.productSelection;

/**
 * Select the current product type
 */
export const selectProductType = createSelector(
  [selectProductSelectionState],
  (state) => state.selectedProductType
);

/**
 * Select Auto product selection
 */
export const selectAutoSelection = createSelector(
  [selectProductSelectionState],
  (state) => state.autoSelection
);

/**
 * Select Moto product selection
 */
export const selectMotoSelection = createSelector(
  [selectProductSelectionState],
  (state) => state.motoSelection
);

/**
 * Select Multirisk product selection
 */
export const selectMultirisqueSelection = createSelector(
  [selectProductSelectionState],
  (state) => state.multirisqueSelection
);

/**
 * Select IAC add-on
 */
export const selectIACAddOn = createSelector(
  [selectProductSelectionState],
  (state) => state.iacAddOn
);

/**
 * Calculate total price including IAC if selected
 */
export const selectTotalPrice = createSelector(
  [selectProductSelectionState],
  (state) => {
    let basePrice = 0;
    
    // Get base price from selected product
    if (state.autoSelection) {
      basePrice = state.autoSelection.price;
    } else if (state.motoSelection) {
      basePrice = state.motoSelection.price;
    } else if (state.multirisqueSelection) {
      basePrice = state.multirisqueSelection.price;
    }
    
    // Add IAC price if selected
    const iacPrice = state.iacAddOn?.selected ? state.iacAddOn.price : 0;
    
    return basePrice + iacPrice;
  }
);

/**
 * Check if any product is selected
 */
export const selectHasProductSelection = createSelector(
  [selectProductSelectionState],
  (state) => 
    state.autoSelection !== null ||
    state.motoSelection !== null ||
    state.multirisqueSelection !== null
);

/**
 * Get current product selection details
 */
export const selectCurrentProductDetails = createSelector(
  [selectProductSelectionState],
  (state) => {
    if (state.autoSelection) {
      return {
        type: 'AUTO' as const,
        details: state.autoSelection,
      };
    }
    if (state.motoSelection) {
      return {
        type: 'MOTO' as const,
        details: state.motoSelection,
      };
    }
    if (state.multirisqueSelection) {
      return {
        type: 'MULTIRISK_PRO' as const,
        details: state.multirisqueSelection,
      };
    }
    return null;
  }
);
