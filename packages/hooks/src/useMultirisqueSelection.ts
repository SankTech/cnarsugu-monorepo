import { useCallback } from 'react';
import {
  useAppDispatch,
  useAppSelector,
  setMultirisqueSelection,
  clearMultirisqueSelection,
  selectMultirisqueSelection,
} from '@cnarsugu/store';
import type { BusinessType, CoverageDetails } from '@cnarsugu/types';

/**
 * Hook for managing Multirisk Pro product selection
 * 
 * @returns Object containing Multirisk selection state and actions
 * 
 * @example
 * ```tsx
 * const { multirisqueSelection, selectMultirisk, clearMultirisk } = useMultirisqueSelection();
 * 
 * // Select a Multirisk Pro package
 * selectMultirisk({
 *   packageCode: 'HOTEL_STANDARD',
 *   name: 'Hôtels & Restaurants',
 *   businessType: 'HOTEL',
 *   price: 150000,
 *   coverageDetails: {
 *     incendie: { limit: 50000000, franchise: 100000 },
 *     vol: { limit: 10000000, franchise: 50000 },
 *     // ... other coverages
 *   },
 * });
 * ```
 */
export function useMultirisqueSelection() {
  const dispatch = useAppDispatch();
  const multirisqueSelection = useAppSelector(selectMultirisqueSelection);

  /**
   * Select a Multirisk Pro package
   */
  const selectMultirisk = useCallback(
    (selection: {
      packageCode: string;
      name: string;
      businessType: BusinessType;
      price: number;
      coverageDetails: CoverageDetails;
    }) => {
      dispatch(setMultirisqueSelection(selection));
    },
    [dispatch]
  );

  /**
   * Clear Multirisk selection
   */
  const clearMultirisk = useCallback(() => {
    dispatch(clearMultirisqueSelection());
  }, [dispatch]);

  return {
    multirisqueSelection,
    selectMultirisk,
    clearMultirisk,
    isSelected: multirisqueSelection !== null,
    businessType: multirisqueSelection?.businessType,
    packageCode: multirisqueSelection?.packageCode,
  };
}
