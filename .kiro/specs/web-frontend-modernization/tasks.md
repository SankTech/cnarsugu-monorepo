# Implementation Plan

## Phase 1: Monorepo Foundation & Shared Packages

- [x] 1. Initialize monorepo structure





  - Create Turborepo configuration with pnpm workspaces
  - Set up root package.json with workspace definitions
  - Configure TypeScript base config for all packages
  - Set up ESLint and Prettier shared configs
  - _Requirements: 5.1, 5.2, 12.2, 12.4_

- [ ]* 1.1 Configure CI/CD pipeline
  - Set up GitHub Actions for automated testing
  - Configure build and deploy workflows
  - Add code quality checks
  - _Requirements: 11.1_

- [ ] 2. Create shared TypeScript types package
  - Set up packages/types with TypeScript configuration
  - Define Insurance, Coverage, Subscription, Payment interfaces
  - Define Client and User types
  - Export all types from index.ts
  - _Requirements: 5.1, 10.1, 10.2_

- [ ]* 2.1 Write unit tests for type guards
  - Create type guard functions for runtime validation
  - Test type narrowing logic
  - _Requirements: 11.1_

- [ ] 3. Create validation schemas package
  - Set up packages/schemas with Zod
  - Implement individualEnrollmentSchema
  - Implement enterpriseEnrollmentSchema
  - Implement paymentSchema
  - Implement contactSchema
  - _Requirements: 5.3, 7.5_

- [ ]* 3.1 Write property test for validation consistency
  - **Property 12: Cross-platform validation consistency**
  - **Validates: Requirements 5.3**
  - Test that same input produces same validation result across platforms
  - Use fast-check to generate random valid/invalid inputs
  - _Requirements: 5.3_

- [ ]* 3.2 Write unit tests for validation schemas
  - Test valid data passes validation
  - Test invalid data fails with correct error messages
  - Test edge cases (empty strings, special characters)
  - _Requirements: 11.1_

- [ ] 4. Create Redux store package with RTK Query
  - Set up packages/store with Redux Toolkit
  - Create baseApi with fetchBaseQuery
  - Configure base URL and auth headers
  - Set up tag types for cache invalidation
  - _Requirements: 5.1, 8.1_

- [ ] 4.1 Implement RTK Query API endpoints
  - Create insuranceApi with getInsurances and getCoverages endpoints
  - Create subscriptionApi with createSubscription endpoint
  - Create paymentApi with createPayment and getPaymentStatus endpoints
  - Configure caching with keepUnusedDataFor
  - _Requirements: 5.1, 6.4_

- [ ] 4.2 Implement error handling for RTK Query
  - Add custom error handling in baseQuery
  - Transform API errors to user-friendly messages
  - Add retry logic with exponential backoff
  - _Requirements: 5.5, 8.4_

- [ ]* 4.3 Write property test for HTTPS enforcement
  - **Property 15: HTTPS protocol enforcement**
  - **Validates: Requirements 8.1**
  - Test that all API requests use HTTPS in production
  - _Requirements: 8.1_

- [ ]* 4.4 Write property test for error message safety
  - **Property 18: Error message safety**
  - **Validates: Requirements 8.4**
  - Test that error messages never contain stack traces or internal details
  - _Requirements: 8.4_

- [ ]* 4.5 Write property test for caching behavior
  - **Property 14: Data caching behavior**
  - **Validates: Requirements 6.4**
  - Test that repeated requests return cached data
  - _Requirements: 6.4_

- [ ]* 4.6 Write integration tests for RTK Query endpoints
  - Mock API responses with MSW
  - Test successful data fetching
  - Test error handling
  - Test cache invalidation
  - _Requirements: 11.3_

- [ ] 5. Create Redux slices for application state
  - Create insuranceSlice (selectedInsurance, selectedCoverage)
  - Create enrollmentSlice (enrollmentData, currentStep)
  - Create paymentSlice (paymentId, paymentStatus)
  - Export actions and reducers
  - _Requirements: 5.4, 7.3_

- [ ] 5.1 Configure Redux store
  - Set up store with configureStore
  - Add all reducers (slices + RTK Query)
  - Configure middleware
  - Set up listeners for refetchOnFocus/refetchOnReconnect
  - Export RootState and AppDispatch types
  - _Requirements: 5.4, 10.1_

- [ ]* 5.2 Write unit tests for Redux slices
  - Test reducers with different actions
  - Test state updates
  - Test state clearing
  - _Requirements: 11.1_

- [ ] 6. Create shared hooks package
  - Set up packages/hooks
  - Create useAppDispatch hook with typed dispatch
  - Create useAppSelector hook with typed selector
  - Export all hooks from index
  - _Requirements: 5.1, 10.1_

- [ ] 7. Create utilities package
  - Set up packages/utils
  - Implement format utilities (formatPrice, formatPhone, formatDate)
  - Implement sanitization utilities (sanitizeInput, sanitizePhoneNumber)
  - Implement constants (PAYMENT_METHODS, CLIENT_TYPES)
  - _Requirements: 5.1, 8.3_

- [ ]* 7.1 Write property test for input sanitization
  - **Property 17: Input sanitization**
  - **Validates: Requirements 8.3**
  - Test that dangerous characters are sanitized
  - _Requirements: 8.3_

- [ ]* 7.2 Write unit tests for utility functions
  - Test formatting functions with various inputs
  - Test edge cases (null, undefined, empty strings)
  - _Requirements: 11.1_

- [ ] 8. Checkpoint - Ensure all shared packages build and tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 2: Next.js Web Application

- [ ] 9. Initialize Next.js application
  - Create apps/web with Next.js 14+ (App Router)
  - Configure TypeScript with strict mode
  - Set up Tailwind CSS with custom theme
  - Install and configure shadcn/ui components
  - Configure environment variables
  - _Requirements: 6.1, 6.2, 10.1_

- [ ] 9.1 Configure Next.js optimizations
  - Set up next.config.js with image optimization
  - Configure bundle analyzer
  - Set up ISR for dynamic pages
  - _Requirements: 6.3, 6.5, 12.3_

- [ ]* 9.2 Write property test for SSR verification
  - **Property 3: Server-side rendering verification**
  - **Validates: Requirements 1.3**
  - Test that pages contain pre-rendered HTML
  - _Requirements: 1.3_

- [ ] 10. Implement home page with insurance products
  - Create app/page.tsx with product grid
  - Set up Redux Provider in app layout
  - Fetch insurances using useGetInsurancesQuery hook
  - Display insurance cards with icons and descriptions
  - Implement loading and error states from RTK Query
  - Add animations with Framer Motion
  - _Requirements: 1.1, 2.5_

- [ ]* 10.1 Write property test for product loading performance
  - **Property 1: Product loading performance**
  - **Validates: Requirements 1.1**
  - Test that products load within 2 seconds
  - _Requirements: 1.1_

- [ ]* 10.2 Write property test for loading state display
  - **Property 6: Loading and error state display**
  - **Validates: Requirements 2.5**
  - Test that loading indicators appear during fetch
  - Test that error messages appear on fetch failure
  - _Requirements: 2.5_

- [ ] 11. Implement coverage selection page
  - Create app/coverage/[insuranceId]/page.tsx
  - Fetch coverages using useGetCoveragesQuery hook
  - Display coverage cards with details and pricing
  - Dispatch setSelectedCoverage action on selection
  - Implement coverage selection and navigation
  - Add responsive layout for mobile/tablet/desktop
  - _Requirements: 1.2, 1.5_

- [ ]* 11.1 Write property test for coverage navigation
  - **Property 2: Coverage navigation consistency**
  - **Validates: Requirements 1.2**
  - Test that selecting insurance navigates to correct coverages
  - _Requirements: 1.2_

- [ ]* 11.2 Write property test for responsive layout
  - **Property 4: Responsive layout adaptation**
  - **Validates: Requirements 1.5**
  - Test layout at different viewport sizes
  - _Requirements: 1.5_

- [ ] 12. Implement enrollment form page
  - Create app/enrollment/page.tsx
  - Implement client type selection (Individual/Enterprise)
  - Create dynamic form with React Hook Form + Zod
  - Implement conditional fields based on client type
  - Add form validation with error messages
  - Dispatch updateEnrollmentData action to store form data
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ]* 12.1 Write property test for form validation
  - **Property 5: Form validation feedback**
  - **Validates: Requirements 2.4, 3.4**
  - Test that invalid inputs show errors
  - Test that valid inputs don't show errors
  - _Requirements: 2.4, 3.4_

- [ ]* 12.2 Write property test for enrollment data persistence
  - **Property 8: Enrollment data persistence**
  - **Validates: Requirements 3.5**
  - Test that form data is stored in state
  - _Requirements: 3.5_

- [ ]* 12.3 Write unit tests for enrollment form
  - Test individual form rendering
  - Test enterprise form rendering
  - Test form submission
  - _Requirements: 11.2_

- [ ] 13. Implement payment page
  - Create app/payment/page.tsx
  - Display payment method selection
  - Implement phone number input for mobile money
  - Use useCreatePaymentMutation hook for payment
  - Handle payment initiation and response
  - Dispatch setPaymentId action to store payment ID
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ]* 13.1 Write property test for payment method phone input
  - **Property 9: Payment method phone input**
  - **Validates: Requirements 4.2**
  - Test that mobile money methods show phone input
  - _Requirements: 4.2_

- [ ]* 13.2 Write property test for payment API integration
  - **Property 10: Payment API integration**
  - **Validates: Requirements 4.3, 4.4**
  - Test that payment submission calls API and receives payment ID
  - _Requirements: 4.3, 4.4_

- [ ]* 13.3 Write integration test for payment flow
  - Mock payment API
  - Test successful payment
  - Test payment errors
  - _Requirements: 11.3_

- [ ] 14. Implement confirmation page
  - Create app/confirmation/page.tsx
  - Use useCreateSubscriptionMutation to create subscription
  - Get enrollment data and payment ID from Redux state
  - Display success message and subscription details
  - Add download receipt functionality
  - Dispatch clearEnrollmentData and clearPayment actions
  - _Requirements: 4.5_

- [ ]* 14.1 Write property test for payment completion flow
  - **Property 11: Payment completion flow**
  - **Validates: Requirements 4.5**
  - Test that successful payment updates status and navigates
  - _Requirements: 4.5_

- [ ] 15. Implement shared UI components
  - Create Button component with variants
  - Create Input component with validation states
  - Create Card component
  - Create Modal/Dialog component
  - Create LoadingSpinner component
  - Create ErrorMessage component
  - _Requirements: 9.1, 9.2, 9.4_

- [ ]* 15.1 Write component tests for UI components
  - Test button variants and interactions
  - Test input validation states
  - Test modal open/close
  - _Requirements: 11.2_

- [ ] 16. Implement progress indicator for multi-step flow
  - Create ProgressSteps component
  - Show current step (Enrollment → Payment → Confirmation)
  - Add to enrollment, payment, and confirmation pages
  - _Requirements: 9.3_

- [ ]* 16.1 Write property test for progress indication
  - **Property 20: Multi-step progress indication**
  - **Validates: Requirements 9.3**
  - Test that progress indicator shows current step
  - _Requirements: 9.3_

- [ ] 17. Implement secure token storage for web
  - Configure API client to use httpOnly cookies
  - Implement token refresh logic
  - Add authentication interceptor
  - _Requirements: 8.2_

- [ ]* 17.1 Write property test for secure token storage
  - **Property 16: Secure token storage**
  - **Validates: Requirements 8.2**
  - Test that tokens are stored in httpOnly cookies
  - _Requirements: 8.2_

- [ ] 18. Add error boundaries and error handling
  - Create global error boundary
  - Implement error toast notifications
  - Add retry buttons for failed requests
  - Ensure user-friendly error messages in French
  - _Requirements: 9.4_

- [ ]* 18.1 Write property test for user-friendly errors
  - **Property 21: User-friendly error messages**
  - **Validates: Requirements 9.4**
  - Test that errors are in French without technical jargon
  - _Requirements: 9.4_

- [ ] 19. Checkpoint - Ensure web app builds and all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 20. Write E2E tests for critical flows
  - Set up Playwright
  - Test complete subscription flow (browse → enroll → pay → confirm)
  - Test error scenarios
  - Test responsive behavior
  - _Requirements: 11.4_

## Phase 3: React Native Mobile Application Update

- [ ] 21. Update React Native and dependencies
  - Update to React Native 0.74+
  - Update Expo to 51+
  - Update React Navigation to 6+
  - Install NativeWind for styling
  - Configure TypeScript
  - _Requirements: 7.1, 7.2, 7.4_

- [ ] 21.1 Configure new React Native architecture
  - Enable new architecture in app.json
  - Update native modules if needed
  - Test app builds on iOS and Android
  - _Requirements: 7.1_

- [ ] 22. Set up navigation structure
  - Configure React Navigation with TypeScript
  - Define navigation types (RootStackParamList)
  - Create stack navigator with screens
  - Implement navigation transitions
  - _Requirements: 7.2_

- [ ] 23. Implement HomeScreen with insurance products
  - Create src/screens/HomeScreen.tsx
  - Set up Redux Provider in App.tsx
  - Use useGetInsurancesQuery hook to fetch products
  - Display products in FlashList for performance
  - Implement loading and error states from RTK Query
  - Add pull-to-refresh with refetch
  - _Requirements: 2.1, 2.3, 2.5_

- [ ]* 23.1 Write property test for loading state display (mobile)
  - **Property 6: Loading and error state display**
  - **Validates: Requirements 2.5**
  - Test loading indicators and error messages
  - _Requirements: 2.5_

- [ ] 24. Implement CoverageScreen
  - Create src/screens/CoverageScreen.tsx
  - Use useGetCoveragesQuery hook to fetch coverages
  - Display coverages for selected insurance
  - Dispatch setSelectedCoverage action on selection
  - Add navigation to enrollment
  - Style with NativeWind
  - _Requirements: 1.2, 3.1_

- [ ]* 24.1 Write property test for coverage navigation (mobile)
  - **Property 7: Coverage selection navigation**
  - **Validates: Requirements 3.1**
  - Test that coverage selection navigates to enrollment
  - _Requirements: 3.1_

- [ ] 25. Implement EnrollmentScreen
  - Create src/screens/EnrollmentScreen.tsx
  - Implement client type selection
  - Create form with React Hook Form + Zod
  - Add conditional fields based on client type
  - Implement native keyboard handling
  - Add validation feedback
  - Dispatch updateEnrollmentData action to store form data
  - _Requirements: 3.2, 3.3, 3.4, 3.5, 2.4_

- [ ]* 25.1 Write property test for form validation (mobile)
  - **Property 5: Form validation feedback**
  - **Validates: Requirements 2.4, 3.4**
  - Test validation on mobile platform
  - _Requirements: 2.4, 3.4_

- [ ]* 25.2 Write unit tests for EnrollmentScreen
  - Test form rendering
  - Test validation
  - Test navigation
  - _Requirements: 11.2_

- [ ] 26. Implement PaymentScreen
  - Create src/screens/PaymentScreen.tsx
  - Display payment method selection
  - Implement phone number input
  - Use useCreatePaymentMutation hook for payment
  - Handle payment response
  - Dispatch setPaymentId action to store payment ID
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ]* 26.1 Write property test for payment integration (mobile)
  - **Property 10: Payment API integration**
  - **Validates: Requirements 4.3, 4.4**
  - Test payment flow on mobile
  - _Requirements: 4.3, 4.4_

- [ ] 27. Implement ConfirmationScreen
  - Create src/screens/ConfirmationScreen.tsx
  - Use useCreateSubscriptionMutation to create subscription
  - Get enrollment data and payment ID from Redux state
  - Display success animation
  - Show subscription details
  - Add share/download receipt functionality
  - Dispatch clearEnrollmentData and clearPayment actions
  - _Requirements: 4.5_

- [ ] 28. Implement secure token storage for mobile
  - Install expo-secure-store
  - Implement token storage functions
  - Configure API client to use secure storage
  - Add authentication interceptor
  - _Requirements: 8.2_

- [ ]* 28.1 Write property test for secure storage (mobile)
  - **Property 16: Secure token storage**
  - **Validates: Requirements 8.2**
  - Test that tokens are stored in Keychain/Keystore
  - _Requirements: 8.2_

- [ ] 29. Implement shared mobile components
  - Create Button component
  - Create Input component
  - Create Card component
  - Create LoadingSpinner component
  - Create ErrorMessage component
  - Style with NativeWind
  - _Requirements: 9.1, 9.2_

- [ ]* 29.1 Write component tests for mobile components
  - Test component rendering
  - Test interactions
  - _Requirements: 11.2_

- [ ] 30. Add error handling and retry logic
  - Implement error boundaries
  - Add toast notifications
  - Implement retry buttons
  - Ensure French error messages
  - _Requirements: 9.4_

- [ ] 31. Checkpoint - Ensure mobile app builds and tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 32. Write E2E tests for mobile
  - Set up Detox
  - Test complete subscription flow
  - Test error scenarios
  - _Requirements: 11.4_

## Phase 4: Cross-Platform Testing & Validation

- [ ]* 33. Write property test for cross-platform validation consistency
  - **Property 12: Cross-platform validation consistency**
  - **Validates: Requirements 5.3**
  - Test that validation works identically on web and mobile
  - _Requirements: 5.3_

- [ ]* 34. Write property test for cross-platform error handling
  - **Property 13: Cross-platform error handling consistency**
  - **Validates: Requirements 5.5**
  - Test that errors are handled consistently
  - _Requirements: 5.5_

- [ ]* 35. Write property test for API response validation
  - **Property 22: API response validation**
  - **Validates: Requirements 10.2**
  - Test that invalid API responses are caught
  - _Requirements: 10.2_

- [ ]* 36. Write property test for sensitive data encryption
  - **Property 19: Sensitive data encryption**
  - **Validates: Requirements 8.5**
  - Test that sensitive data is encrypted before storage
  - _Requirements: 8.5_

- [ ]* 37. Performance testing
  - **Property 23: Development build performance**
  - **Validates: Requirements 12.5**
  - Measure and optimize build times
  - Test that builds complete under 30 seconds
  - _Requirements: 12.5_

- [ ]* 38. Run full test suite
  - Run all unit tests
  - Run all property tests
  - Run all integration tests
  - Run all E2E tests
  - Generate coverage reports
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 39. Final checkpoint - All tests passing
  - Ensure all tests pass, ask the user if questions arise.

## Phase 5: Documentation & Deployment

- [ ] 40. Create documentation
  - Write README for monorepo
  - Document shared packages
  - Create developer setup guide
  - Document deployment process
  - Add API integration guide

- [ ] 41. Set up deployment pipelines
  - Configure Vercel for web app
  - Configure EAS Build for mobile app
  - Set up environment variables
  - Configure preview deployments
  - _Requirements: 6.5_

- [ ] 42. Deploy to staging
  - Deploy web app to staging
  - Build and distribute mobile app to TestFlight/Internal Testing
  - Perform smoke tests
  - Gather feedback

- [ ] 43. Production deployment
  - Deploy web app to production
  - Submit mobile app to App Store and Play Store
  - Monitor performance and errors
  - Set up analytics

- [ ] 44. Post-deployment monitoring
  - Monitor web app performance
  - Monitor mobile app crash reports
  - Track user feedback
  - Plan iteration improvements
