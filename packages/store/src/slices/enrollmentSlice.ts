import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ProductType, ProductDetails } from '@cnarsugu/types';

/**
 * Client type for enrollment
 */
export type ClientType = 'INDIVIDUAL' | 'BUSINESS';

/**
 * Enrollment form data interface
 */
export interface EnrollmentFormData {
  clientType: ClientType;
  name: string;
  surname: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  businessName?: string;
  businessType?: string;
  productType?: ProductType;
  productDetails?: ProductDetails;
  coverage?: string;
  insurance?: string;
  extraData?: string;
  files?: string[];
}

/**
 * Enrollment state interface
 */
export interface EnrollmentState {
  formData: EnrollmentFormData;
  currentStep: number;
  isSubmitting: boolean;
  error: string | null;
}

/**
 * Initial state for enrollment
 */
const initialState: EnrollmentState = {
  formData: {
    clientType: 'INDIVIDUAL',
    name: '',
    surname: '',
    phoneNumber: '',
  },
  currentStep: 1,
  isSubmitting: false,
  error: null,
};

/**
 * Enrollment slice
 * Manages the enrollment/subscription flow state
 */
export const enrollmentSlice = createSlice({
  name: 'enrollment',
  initialState,
  reducers: {
    /**
     * Update enrollment form data
     */
    updateEnrollmentForm: (state, action: PayloadAction<Partial<EnrollmentFormData>>) => {
      state.formData = {
        ...state.formData,
        ...action.payload,
      };
    },

    /**
     * Set client type
     */
    setClientType: (state, action: PayloadAction<ClientType>) => {
      state.formData.clientType = action.payload;
    },

    /**
     * Set current step
     */
    setEnrollmentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },

    /**
     * Go to next step
     */
    nextEnrollmentStep: (state) => {
      state.currentStep += 1;
    },

    /**
     * Go to previous step
     */
    previousEnrollmentStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },

    /**
     * Set submitting state
     */
    setEnrollmentSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },

    /**
     * Set error
     */
    setEnrollmentError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    /**
     * Reset enrollment form
     */
    resetEnrollmentForm: (state) => {
      state.formData = initialState.formData;
      state.currentStep = 1;
      state.isSubmitting = false;
      state.error = null;
    },
  },
});

/**
 * Export actions
 */
export const {
  updateEnrollmentForm,
  setClientType,
  setEnrollmentStep,
  nextEnrollmentStep,
  previousEnrollmentStep,
  setEnrollmentSubmitting,
  setEnrollmentError,
  resetEnrollmentForm,
} = enrollmentSlice.actions;

/**
 * Export reducer
 */
export default enrollmentSlice.reducer;
