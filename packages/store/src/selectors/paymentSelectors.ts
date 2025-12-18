import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

/**
 * Base selector for payment state
 */
const selectPaymentState = (state: RootState) => state.payment;

/**
 * Select payment form data
 */
export const selectPaymentForm = createSelector(
  [selectPaymentState],
  (state) => state.formData
);

/**
 * Select payment status
 */
export const selectPaymentStatus = createSelector(
  [selectPaymentState],
  (state) => state.status
);

/**
 * Select payment ID
 */
export const selectPaymentId = createSelector(
  [selectPaymentState],
  (state) => state.paymentId
);

/**
 * Select payment processing state
 */
export const selectIsPaymentProcessing = createSelector(
  [selectPaymentState],
  (state) => state.isProcessing
);

/**
 * Select payment error
 */
export const selectPaymentError = createSelector(
  [selectPaymentState],
  (state) => state.error
);

/**
 * Check if payment is successful
 */
export const selectIsPaymentSuccessful = createSelector(
  [selectPaymentStatus],
  (status) => status === 'SUCCESS'
);

/**
 * Check if payment has failed
 */
export const selectHasPaymentFailed = createSelector(
  [selectPaymentStatus],
  (status) => status === 'FAILED'
);
