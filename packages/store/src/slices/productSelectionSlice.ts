import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductType } from '@cnarsugu/types';
import type {
  AutoProductSelection,
  MotoProductSelection,
  MultirisqueProductSelection,
  IACAddOn,
  CVRange,
  AutoFormulaType,
  MotoCategory,
  MotoFormulaType,
  BusinessType,
  CoverageDetails,
} from '@cnarsugu/types';

/**
 * Product selection state interface
 */
export interface ProductSelectionState {
  selectedProductType: ProductType | null;
  autoSelection: AutoProductSelection | null;
  motoSelection: MotoProductSelection | null;
  multirisqueSelection: MultirisqueProductSelection | null;
  iacAddOn: IACAddOn | null;
}

/**
 * Initial state for product selection
 */
const initialState: ProductSelectionState = {
  selectedProductType: null,
  autoSelection: null,
  motoSelection: null,
  multirisqueSelection: null,
  iacAddOn: null,
};

/**
 * Product selection slice
 * Manages the state of selected insurance products across the application
 */
export const productSelectionSlice = createSlice({
  name: 'productSelection',
  initialState,
  reducers: {
    /**
     * Set the selected product type
     */
    setProductType: (state, action: PayloadAction<ProductType>) => {
      state.selectedProductType = action.payload;
    },

    /**
     * Set Auto product selection
     */
    setAutoSelection: (
      state,
      action: PayloadAction<{
        cvRange: CVRange;
        formula: AutoFormulaType;
        price: number;
        coverages: string[];
        addIac?: boolean;
      }>
    ) => {
      state.selectedProductType = ProductType.AUTO;
      state.autoSelection = action.payload;
    },

    /**
     * Update Auto IAC add-on
     */
    toggleAutoIAC: (state, action: PayloadAction<boolean>) => {
      if (state.autoSelection) {
        state.autoSelection.addIac = action.payload;
      }
    },

    /**
     * Set Moto product selection
     */
    setMotoSelection: (
      state,
      action: PayloadAction<{
        category: MotoCategory;
        formula: MotoFormulaType;
        price: number;
        coverages: string[];
        includesIac: boolean;
      }>
    ) => {
      state.selectedProductType = ProductType.MOTO;
      state.motoSelection = action.payload;
    },

    /**
     * Set Multirisk Pro product selection
     */
    setMultirisqueSelection: (
      state,
      action: PayloadAction<{
        packageCode: string;
        name: string;
        businessType: BusinessType;
        price: number;
        coverageDetails: CoverageDetails;
      }>
    ) => {
      state.selectedProductType = ProductType.MULTIRISK_PRO;
      state.multirisqueSelection = action.payload;
    },

    /**
     * Set IAC add-on
     */
    setIACAddOn: (
      state,
      action: PayloadAction<{
        selected: boolean;
        price: number;
        deathCapital: number;
        disabilityCapital: number;
        treatmentCapital: number;
      }>
    ) => {
      state.iacAddOn = action.payload;
    },

    /**
     * Toggle IAC add-on selection
     */
    toggleIACAddOn: (state) => {
      if (state.iacAddOn) {
        state.iacAddOn.selected = !state.iacAddOn.selected;
      }
    },

    /**
     * Clear all product selections
     */
    clearProductSelection: (state) => {
      state.selectedProductType = null;
      state.autoSelection = null;
      state.motoSelection = null;
      state.multirisqueSelection = null;
      state.iacAddOn = null;
    },

    /**
     * Clear specific product selection
     */
    clearAutoSelection: (state) => {
      state.autoSelection = null;
      if (state.selectedProductType === ProductType.AUTO) {
        state.selectedProductType = null;
      }
    },

    clearMotoSelection: (state) => {
      state.motoSelection = null;
      if (state.selectedProductType === ProductType.MOTO) {
        state.selectedProductType = null;
      }
    },

    clearMultirisqueSelection: (state) => {
      state.multirisqueSelection = null;
      if (state.selectedProductType === ProductType.MULTIRISK_PRO) {
        state.selectedProductType = null;
      }
    },
  },
});

/**
 * Export actions
 */
export const {
  setProductType,
  setAutoSelection,
  toggleAutoIAC,
  setMotoSelection,
  setMultirisqueSelection,
  setIACAddOn,
  toggleIACAddOn,
  clearProductSelection,
  clearAutoSelection,
  clearMotoSelection,
  clearMultirisqueSelection,
} = productSelectionSlice.actions;

/**
 * Export reducer
 */
export default productSelectionSlice.reducer;
