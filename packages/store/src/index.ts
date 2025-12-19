// ============================================================================
// Store Configuration
// ============================================================================
export { store } from './store';
export type { RootState, AppDispatch } from './store';

// ============================================================================
// Hooks
// ============================================================================
export { useAppDispatch, useAppSelector } from './hooks';

// ============================================================================
// API
// ============================================================================
export { baseApi } from './api/baseApi';
export {
  pricingApi,
  // V2 API Hooks
  useGetInsuranceProductsQuery,
  useSearchInsuranceProductsQuery,
  useGetInsuranceProductQuery,
  useGetProductFormulasQuery,
  // Legacy V1 API Hooks
  useGetAutoPricingQuery,
  useGetAllAutoPricingQuery,
  useGetMotoPricingQuery,
  useGetAllMotoPricingQuery,
  useGetMultirisquePackagesQuery,
  useGetMultirisquePackageQuery,
  useGetIACProductQuery,
  useGetCoverageDefinitionsQuery,
} from './api/pricingApi';

// Export V2 API Types
export type {
  InsuranceProduct,
  CoverageFormula,
  PaginatedResult,
  ProductFilters,
  SearchFilters,
} from './api/pricingApi';

export {
  subscriptionApi,
  useCreateSubscriptionV2Mutation,
} from './api/subscriptionApi';

export type {
  CreateSubscriptionRequest,
} from './api/subscriptionApi';

export {
  paymentApi,
  useCreatePaymentV2Mutation,
  useGetIacPriceQuery,
  useGetPaymentMethodsQuery,
} from './api/paymentApi';

export type {
  CreatePaymentV2Request,
  IacPriceResponse,
} from './api/paymentApi';

export {
  infoApi,
  useGetTermsAndConditionsQuery,
} from './api/infoApi';

export type {
  TermsAndConditions,
} from './api/infoApi';

// ============================================================================
// Slices
// ============================================================================
export {
  productSelectionSlice,
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
} from './slices/productSelectionSlice';
export type { ProductSelectionState } from './slices/productSelectionSlice';

export {
  enrollmentSlice,
  updateEnrollmentForm,
  setClientType,
  setEnrollmentStep,
  nextEnrollmentStep,
  previousEnrollmentStep,
  setEnrollmentSubmitting,
  setEnrollmentError,
  resetEnrollmentForm,
} from './slices/enrollmentSlice';
export type { EnrollmentState, EnrollmentFormData, ClientType } from './slices/enrollmentSlice';

export {
  paymentSlice,
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
} from './slices/paymentSlice';
export type { PaymentState, PaymentFormData, PaymentMethod, PaymentStatus } from './slices/paymentSlice';

// ============================================================================
// Selectors
// ============================================================================
export {
  selectProductType,
  selectAutoSelection,
  selectMotoSelection,
  selectMultirisqueSelection,
  selectIACAddOn,
  selectTotalPrice,
  selectHasProductSelection,
  selectCurrentProductDetails,
} from './selectors/productSelectors';

export {
  selectEnrollmentForm,
  selectEnrollmentStep,
  selectIsEnrollmentSubmitting,
  selectEnrollmentError,
  selectIsEnrollmentFormValid,
} from './selectors/enrollmentSelectors';

export {
  selectPaymentForm,
  selectPaymentStatus,
  selectPaymentId,
  selectIsPaymentProcessing,
  selectPaymentError,
  selectIsPaymentSuccessful,
  selectHasPaymentFailed,
} from './selectors/paymentSelectors';
