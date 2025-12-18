import { useCallback } from 'react';
import {
  useAppDispatch,
  useAppSelector,
  setProductType,
  setIACAddOn,
  toggleIACAddOn,
  clearProductSelection,
  selectProductType,
  selectIACAddOn,
  selectTotalPrice,
  selectHasProductSelection,
  selectCurrentProductDetails,
} from '@cnarsugu/store';
import type { ProductType } from '@cnarsugu/types';

/**
 * Hook for managing general product selection state
 * Provides access to product type, IAC add-on, and total pricing
 * 
 * @returns Object containing product selection state and actions
 * 
 * @example
 * ```tsx
 * const {
 *   productType,
 *   iacAddOn,
 *   totalPrice,
 *   hasSelection,
 *   currentProduct,
 *   setProduct,
 *   addIAC,
 *   toggleIAC,
 *   clearAll,
 * } = useProductSelection();
 * 
 * // Set product type
 * setProduct('AUTO');
 * 
 * // Add IAC add-on
 * addIAC({
 *   selected: true,
 *   price: 5000,
 *   deathCapital: 5000000,
 *   disabilityCapital: 5000000,
 *   treatmentCapital: 500000,
 * });
 * 
 * // Get total price (base + IAC)
 * console.log(totalPrice); // e.g., 50000
 * ```
 */
export function useProductSelection() {
  const dispatch = useAppDispatch();
  const productType = useAppSelector(selectProductType);
  const iacAddOn = useAppSelector(selectIACAddOn);
  const totalPrice = useAppSelector(selectTotalPrice);
  const hasSelection = useAppSelector(selectHasProductSelection);
  const currentProduct = useAppSelector(selectCurrentProductDetails);

  /**
   * Set the current product type
   */
  const setProduct = useCallback(
    (type: ProductType) => {
      dispatch(setProductType(type));
    },
    [dispatch]
  );

  /**
   * Add IAC add-on
   */
  const addIAC = useCallback(
    (iac: {
      selected: boolean;
      price: number;
      deathCapital: number;
      disabilityCapital: number;
      treatmentCapital: number;
    }) => {
      dispatch(setIACAddOn(iac));
    },
    [dispatch]
  );

  /**
   * Toggle IAC add-on selection
   */
  const toggleIAC = useCallback(() => {
    dispatch(toggleIACAddOn());
  }, [dispatch]);

  /**
   * Clear all product selections
   */
  const clearAll = useCallback(() => {
    dispatch(clearProductSelection());
  }, [dispatch]);

  return {
    productType,
    iacAddOn,
    totalPrice,
    hasSelection,
    currentProduct,
    setProduct,
    addIAC,
    toggleIAC,
    clearAll,
    isIACSelected: iacAddOn?.selected ?? false,
  };
}
