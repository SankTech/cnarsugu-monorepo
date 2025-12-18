import { useCallback } from 'react';
import {
  useAppDispatch,
  useAppSelector,
  setMotoSelection,
  clearMotoSelection,
  selectMotoSelection,
} from '@cnarsugu/store';
import type { MotoCategory, MotoFormulaType } from '@cnarsugu/types';

/**
 * Hook for managing Moto product selection
 * 
 * @returns Object containing Moto selection state and actions
 * 
 * @example
 * ```tsx
 * const { motoSelection, selectMoto, clearMoto } = useMotoSelection();
 * 
 * // Select a Moto formula
 * selectMoto({
 *   category: 'DJAKARTA',
 *   formula: 'TIERS',
 *   price: 35000,
 *   coverages: ['RC', 'Defense'],
 *   includesIac: false,
 * });
 * 
 * // Upgrade to Essentielle (includes IAC)
 * selectMoto({
 *   category: 'DJAKARTA',
 *   formula: 'ESSENTIELLE',
 *   price: 40000,
 *   coverages: ['RC', 'Defense', 'IAC'],
 *   includesIac: true,
 * });
 * ```
 */
export function useMotoSelection() {
  const dispatch = useAppDispatch();
  const motoSelection = useAppSelector(selectMotoSelection);

  /**
   * Select a Moto formula
   */
  const selectMoto = useCallback(
    (selection: {
      category: MotoCategory;
      formula: MotoFormulaType;
      price: number;
      coverages: string[];
      includesIac: boolean;
    }) => {
      dispatch(setMotoSelection(selection));
    },
    [dispatch]
  );

  /**
   * Clear Moto selection
   */
  const clearMoto = useCallback(() => {
    dispatch(clearMotoSelection());
  }, [dispatch]);

  /**
   * Check if upgrade to Essentielle is available
   */
  const canUpgradeToEssentielle = useCallback(() => {
    return motoSelection?.formula === 'TIERS';
  }, [motoSelection]);

  return {
    motoSelection,
    selectMoto,
    clearMoto,
    isSelected: motoSelection !== null,
    includesIAC: motoSelection?.includesIac ?? false,
    canUpgradeToEssentielle: canUpgradeToEssentielle(),
  };
}
