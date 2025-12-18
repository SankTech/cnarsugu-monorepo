import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

/**
 * Base selector for enrollment state
 */
const selectEnrollmentState = (state: RootState) => state.enrollment;

/**
 * Select enrollment form data
 */
export const selectEnrollmentForm = createSelector(
  [selectEnrollmentState],
  (state) => state.formData
);

/**
 * Select current enrollment step
 */
export const selectEnrollmentStep = createSelector(
  [selectEnrollmentState],
  (state) => state.currentStep
);

/**
 * Select enrollment submitting state
 */
export const selectIsEnrollmentSubmitting = createSelector(
  [selectEnrollmentState],
  (state) => state.isSubmitting
);

/**
 * Select enrollment error
 */
export const selectEnrollmentError = createSelector(
  [selectEnrollmentState],
  (state) => state.error
);

/**
 * Check if enrollment form is valid (basic validation)
 */
export const selectIsEnrollmentFormValid = createSelector(
  [selectEnrollmentForm],
  (formData) => {
    return (
      formData.name.trim() !== '' &&
      formData.surname.trim() !== '' &&
      formData.phoneNumber.trim() !== ''
    );
  }
);
