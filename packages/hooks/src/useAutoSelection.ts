import { useCallback } from 'react';
import {
  useAppDispatch,
  useAppSelector,
  setAutoSelection,
  toggleAutoIAC,
  clearAutoSelection,
  selectAutoSelection,
} from '@cnarsugu/store';
import type { CVRange, AutoFormulaType } from '@cnarsugu/types';

/**
 * Hook for managing Auto Prestige product selection
 * 
 * @returns Object containing Auto selection state and actions
 * 
 * @example
 * ```tsx
 * const { autoSelection, selectAuto, toggleIAC, clearAuto } = useAutoSelection();
 * 
 * // Select an Auto formula
 * selectAuto({
 *   cvRange: { min: 2, max: 4 },
 *   formula: 'TIERS',
 *   price: 45000,
 *   coverages: ['RC', 'Defense'],
 * });
 * 
 * // Toggle IAC add-on
 * toggleIAC(true);
 * ```
 */
export function useAutoSelection() {
  const dispatch = useAppDispatch();
  const autoSelection = useAppSelector(selectAutoSelection);

  /**
   * Select an Auto Prestige formula
   */
  const selectAuto = useCallback(
    (selection: {
      cvRange: CVRange;
      formula: AutoFormulaType;
      price: number;
      coverages: string[];
      addIac?: boolean;
    }) => {
      dispatch(setAutoSelection(selection));
    },
    [dispatch]
  );

  /**
   * Toggle IAC add-on for Auto
   */
  const toggleIAC = useCallback(
    (add: boolean) => {
      dispatch(toggleAutoIAC(add));
    },
    [dispatch]
  );

  /**
   * Clear Auto selection
   */
  const clearAuto = useCallback(() => {
    dispatch(clearAutoSelection());
  }, [dispatch]);

  return {
    autoSelection,
    selectAuto,
    toggleIAC,
    clearAuto,
    isSelected: autoSelection !== null,
    hasIAC: autoSelection?.addIac ?? false,
  };
}
