import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AdditionalInfos } from '@cnarsugu/types';

/**
 * Payment method types
 */
export type PaymentMethod = 'MOBILE_MONEY' | 'CREDIT_CARD' | 'PAYPAL';

/**
 * Payment status types
 */
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

/**
 * Payment form data interface
 */
export interface PaymentFormData {
  paymentMethod: PaymentMethod | null;
  recipientNumber: string;
  serviceCode: string;
  amount: string;
  additionalInfos: AdditionalInfos | null;
  callback: string;
}

/**
 * Payment state interface
 */
export interface PaymentState {
  formData: PaymentFormData;
  status: PaymentStatus;
  paymentId: string | null;
  error: string | null;
  isProcessing: boolean;
}

/**
 * Initial state for payment
 */
const initialState: PaymentState = {
  formData: {
    paymentMethod: null,
    recipientNumber: '',
    serviceCode: '',
    amount: '0',
    additionalInfos: null,
    callback: '',
  },
  status: 'PENDING',
  paymentId: null,
  error: null,
  isProcessing: false,
};

/**
 * Payment slice
 * Manages the payment flow state
 */
export const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    /**
     * Update payment form data
     */
    updatePaymentForm: (state, action: PayloadAction<Partial<PaymentFormData>>) => {
      state.formData = {
        ...state.formData,
        ...action.payload,
      };
    },

    /**
     * Set payment method
     */
    setPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.formData.paymentMethod = action.payload;
    },

    /**
     * Set payment amount
     */
    setPaymentAmount: (state, action: PayloadAction<string>) => {
      state.formData.amount = action.payload;
    },

    /**
     * Set additional infos
     */
    setAdditionalInfos: (state, action: PayloadAction<AdditionalInfos>) => {
      state.formData.additionalInfos = action.payload;
    },

    /**
     * Set payment status
     */
    setPaymentStatus: (state, action: PayloadAction<PaymentStatus>) => {
      state.status = action.payload;
    },

    /**
     * Set payment ID
     */
    setPaymentId: (state, action: PayloadAction<string>) => {
      state.paymentId = action.payload;
    },

    /**
     * Set processing state
     */
    setPaymentProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },

    /**
     * Set error
     */
    setPaymentError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    /**
     * Start payment processing
     */
    startPaymentProcessing: (state) => {
      state.isProcessing = true;
      state.status = 'PROCESSING';
      state.error = null;
    },

    /**
     * Payment success
     */
    paymentSuccess: (state, action: PayloadAction<string>) => {
      state.isProcessing = false;
      state.status = 'SUCCESS';
      state.paymentId = action.payload;
      state.error = null;
    },

    /**
     * Payment failed
     */
    paymentFailed: (state, action: PayloadAction<string>) => {
      state.isProcessing = false;
      state.status = 'FAILED';
      state.error = action.payload;
    },

    /**
     * Reset payment form
     */
    resetPaymentForm: (state) => {
      state.formData = initialState.formData;
      state.status = 'PENDING';
      state.paymentId = null;
      state.error = null;
      state.isProcessing = false;
    },
  },
});

/**
 * Export actions
 */
export const {
  updatePaymentForm,
  setPaymentMethod,
  setPaymentAmount,
  setAdditionalInfos,
  setPaymentStatus,
  setPaymentId,
  setPaymentProcessing,
  setPaymentError,
  startPaymentProcessing,
  paymentSuccess,
  paymentFailed,
  resetPaymentForm,
} = paymentSlice.actions;

/**
 * Export reducer
 */
export default paymentSlice.reducer;
