# Combined Implementation Plan
# CNAR Sugu Platform Modernization + Insurance Products Update

This plan combines the platform modernization (Next.js web + React Native mobile with Redux Toolkit) and the new insurance products implementation (Auto Prestige, Moto, Multirisk Pro, IAC).

## Overview

**Total Duration:** 10-12 weeks
**Approach:** Parallel development where possible, with platform foundation first

## Phase 1: Monorepo Foundation & Core Packages (Week 1-2)

### Platform Setup

- [ ] 1. Initialize monorepo with Turborepo
  - Create turbo.json and pnpm-workspace.yaml
  - Set up root package.json
  - Configure build pipeline
  - _Requirements: web-modernization 5.1, 12.2_

- [ ] 2. Create shared TypeScript types package
  - Set up packages/types
  - Define base Insurance, Coverage, Subscription, Payment types
  - **ADD:** Define new product types (Auto, Moto, Multirisk, IAC)
  - **ADD:** Define pricing structures (AutoPricing, MotoPricing, etc.)
  - _Requirements: web-modernization 5.1, products 5.1_

- [ ] 3. Create validation schemas package
  - Set up packages/schemas with Zod
  - Implement enrollment schemas (individual, enterprise)
  - Implement payment schema
  - **ADD:** Implement autoInsurance, motoInsurance, multirisqueInsurance schemas
  - _Requirements: web-modernization 5.3, products 8.1_

- [ ]* 3.1 Write property test for validation consistency
  - Test cross-platform validation
  - _Requirements: web-modernization 5.3_


### Redux Store & API Setup

- [ ] 4. Create Redux store package with RTK Query
  - Set up packages/store
  - Create baseApi with fetchBaseQuery
  - Configure auth headers and error handling
  - **ADD:** Add 'Pricing' tag type for cache invalidation
  - _Requirements: web-modernization 5.1, 8.1_

- [ ] 4.1 Implement core RTK Query API endpoints
  - Create insuranceApi (existing products)
  - Create subscriptionApi
  - Create paymentApi
  - **ADD:** Create pricingApi (Auto, Moto, Multirisk, IAC endpoints)
  - _Requirements: web-modernization 5.1, products 5.1_

- [ ] 4.2 Implement error handling for RTK Query
  - Add custom error handling in baseQuery
  - Transform API errors to French user-friendly messages
  - Add retry logic with exponential backoff
  - _Requirements: web-modernization 5.5, 8.4_

- [ ]* 4.3 Write property tests for API layer
  - Test HTTPS enforcement
  - Test error message safety
  - Test caching behavior
  - _Requirements: web-modernization 8.1, 8.4, 6.4_

- [ ] 5. Create Redux slices
  - Create insuranceSlice (selectedInsurance, selectedCoverage)
  - Create enrollmentSlice (enrollmentData, currentStep)
  - Create paymentSlice (paymentId, paymentStatus)
  - **ADD:** Create productSelectionSlice (Auto/Moto/Multirisk/IAC selections)
  - _Requirements: web-modernization 5.4, products 1.1-4.1_

- [ ]* 5.1 Write unit tests for Redux slices
  - Test reducers and actions
  - _Requirements: web-modernization 11.1_

- [ ] 6. Create shared hooks package
  - Create useAppDispatch and useAppSelector
  - _Requirements: web-modernization 5.1_

- [ ] 7. Create utilities package
  - Implement format utilities (formatPrice, formatPhone)
  - Implement sanitization utilities
  - Implement constants (PAYMENT_METHODS, CLIENT_TYPES)
  - **ADD:** Add CV_RANGES, MOTO_CATEGORIES, BUSINESS_TYPES constants
  - _Requirements: web-modernization 5.1, products 8.1_

- [ ] 8. Checkpoint - Shared packages complete
  - Ensure all tests pass, ask the user if questions arise.

## Phase 2: Backend API Updates (Week 2-3)

### Database Schema

- [ ] 9. Create new database tables for products
  - Create pricing_matrix_auto table
  - Create moto_pricing table
  - Create static_packages_pro table
  - Create iac_product table
  - Create coverage_definitions table
  - _Requirements: products 5.1-5.6_

- [ ] 9.1 Create data migration scripts
  - Import Auto Prestige pricing from CSV
  - Import Moto pricing from CSV
  - Import Multirisk Pro packages with JSON coverage
  - Import IAC product data
  - Import coverage definitions
  - _Requirements: products 9.1-9.4_

- [ ] 9.2 Validate migrated data
  - Verify all price points present
  - Verify JSON structure correctness
  - Test queries for each product type
  - _Requirements: products 9.5_

### NestJS API Implementation

- [ ] 10. Create Pricing module in NestJS
  - Create pricing.module.ts
  - Create pricing.controller.ts
  - Create pricing.service.ts
  - Create pricing entities (AutoPricing, MotoPricing, etc.)
  - _Requirements: products 5.1_

- [ ] 10.1 Implement pricing endpoints
  - GET /api/pricing/auto (with CV query params)
  - GET /api/pricing/auto/all
  - GET /api/pricing/moto (with category query)
  - GET /api/pricing/moto/all
  - GET /api/pricing/multirisk-pro
  - GET /api/pricing/multirisk-pro/:packageCode
  - GET /api/pricing/iac
  - GET /api/pricing/coverage-definitions
  - _Requirements: products 1.1-4.2_

- [ ]* 10.2 Write integration tests for pricing endpoints
  - Test Auto pricing queries
  - Test Moto pricing queries
  - Test Multirisk package retrieval
  - Test error handling
  - _Requirements: web-modernization 11.3_

- [ ] 11. Update Subscription entity
  - Add product_type field (AUTO, MOTO, MULTIRISK_PRO, IAC)
  - Add product_details JSONB field
  - Update subscription creation logic
  - _Requirements: products 10.2_

- [ ] 12. Checkpoint - Backend API complete
  - Ensure all tests pass, ask the user if questions arise.

## Phase 3: Next.js Web Application (Week 3-6)

### Core Setup

- [ ] 13. Initialize Next.js application
  - Create apps/web with Next.js 14+
  - Configure TypeScript strict mode
  - Set up Tailwind CSS + shadcn/ui
  - Install Redux Provider
  - _Requirements: web-modernization 6.1, 10.1_

- [ ] 13.1 Configure Next.js optimizations
  - Set up image optimization
  - Configure ISR
  - _Requirements: web-modernization 6.3, 6.5_

### Product Pages

- [ ] 14. Implement home page
  - Create app/page.tsx
  - Set up Redux Provider in layout
  - Display existing insurance products
  - **ADD:** Add "Nos Nouveaux Produits" section
  - **ADD:** Display Auto, Moto, Multirisk Pro, IAC cards
  - _Requirements: web-modernization 1.1, products 1.1_

- [ ] 15. Implement Auto Prestige page
  - Create app/auto-prestige/page.tsx
  - Implement CV range selector
  - Fetch pricing with useGetAutoPricingQuery
  - Display comparison table (Tiers, Essentielle, Étendue, Confort)
  - Show coverage checkmarks and price differences
  - Implement formula selection
  - _Requirements: products 1.1-1.7, 6.1-6.5_

- [ ] 15.1 Implement IAC cross-sell for Auto
  - Add IAC offer modal after formula selection
  - Show benefits and +5,000 FCFA price
  - Dispatch toggleAutoIAC action
  - _Requirements: products 4.1-4.3_

- [ ] 16. Implement Moto page
  - Create app/moto/page.tsx
  - Implement category selector (Djakarta, Grosse Cylindrée, Moto Taxi)
  - Fetch pricing with useGetMotoPricingQuery
  - Display Tiers and Essentielle options
  - Show IAC inclusion in Essentielle
  - _Requirements: products 2.1-2.5_

- [ ] 17. Implement Multirisk Pro page
  - Create app/multirisk-pro/page.tsx
  - Fetch packages with useGetMultirisquePackagesQuery
  - Display 4 business package cards
  - Show price prominently
  - Implement package detail modal with coverage chapters
  - _Requirements: products 3.1-3.7_

- [ ] 18. Implement IAC standalone page
  - Create app/iac/page.tsx
  - Fetch IAC product with useGetIACProductQuery
  - Display coverage details
  - Direct purchase flow
  - _Requirements: products 4.5_

### Enrollment & Checkout

- [ ] 19. Update enrollment form
  - Extend existing enrollment form
  - Add product-specific fields (CV, category, package)
  - Validate based on product type
  - _Requirements: web-modernization 3.1-3.5, products 1.1_

- [ ] 20. Update payment page
  - Extend existing payment page
  - Display product summary with selected options
  - Show IAC as separate line item if added
  - Calculate total price from Redux state
  - _Requirements: web-modernization 4.1-4.4, products 12.1-12.6_

- [ ] 21. Update confirmation page
  - Display product-specific confirmation details
  - Show coverage summary
  - _Requirements: web-modernization 4.5_

### UI Components

- [ ] 22. Create product-specific components
  - AutoPricingComparison component
  - MotoCategorySelector component
  - MultirisquePackageCard component
  - IACCrossSellModal component
  - CoverageTooltip component
  - _Requirements: products 6.1-6.5, 8.2_

- [ ] 23. Checkpoint - Web app complete
  - Ensure all tests pass, ask the user if questions arise.

## Phase 4: React Native Mobile App (Week 6-9)

### Core Updates

- [ ] 24. Update React Native dependencies
  - Update to React Native 0.74+
  - Update Expo to 51+
  - Update React Navigation to 6+
  - Install NativeWind
  - _Requirements: web-modernization 7.1, 7.2_

- [ ] 25. Set up Redux in mobile app
  - Configure Redux Provider in App.tsx
  - Set up navigation with Redux integration
  - _Requirements: web-modernization 7.3_

### Product Screens

- [ ] 26. Implement HomeScreen
  - Update existing HomeScreen
  - Use useGetInsurancesQuery
  - **ADD:** Add "Nouveaux Produits" section
  - **ADD:** Display Auto, Moto, Multirisk, IAC cards
  - Use FlashList for performance
  - _Requirements: web-modernization 2.1, products 1.1_

- [ ] 27. Implement Auto Prestige screen
  - Create AutoPrestigeScreen.tsx
  - Implement CV range selector
  - Display formula cards (swipeable)
  - Show coverage details in accordion
  - Implement IAC cross-sell bottom sheet
  - _Requirements: products 1.1-1.7, 4.1-4.3, 7.1-7.5_

- [ ] 28. Implement Moto screen
  - Create MotoScreen.tsx
  - Implement category selector
  - Display Tiers/Essentielle cards
  - Show IAC upgrade modal for Tiers selection
  - _Requirements: products 2.1-2.5, 7.5_

- [ ] 29. Implement Multirisk Pro screen
  - Create MultirisqueProScreen.tsx
  - Display business package cards
  - Implement collapsible coverage accordion
  - Handle long franchise text gracefully
  - _Requirements: products 3.1-3.7, 7.2-7.4_

- [ ] 30. Implement IAC screen
  - Create IACScreen.tsx
  - Display coverage details
  - Standalone purchase flow
  - _Requirements: products 4.5_

### Enrollment & Checkout

- [ ] 31. Update EnrollmentScreen
  - Extend with product-specific fields
  - Add conditional validation
  - _Requirements: web-modernization 3.1-3.5_

- [ ] 32. Update PaymentScreen
  - Display product summary
  - Show IAC as line item
  - Calculate total from Redux
  - _Requirements: web-modernization 4.1-4.4_

- [ ] 33. Update ConfirmationScreen
  - Product-specific confirmation
  - _Requirements: web-modernization 4.5_

- [ ] 34. Checkpoint - Mobile app complete
  - Ensure all tests pass, ask the user if questions arise.

## Phase 5: Testing & Quality Assurance (Week 9-10)

### Unit & Integration Tests

- [ ]* 35. Write unit tests for product logic
  - Test pricing calculations
  - Test CV range matching
  - Test IAC cross-sell logic
  - _Requirements: web-modernization 11.1_

- [ ]* 36. Write integration tests
  - Test API endpoints with MSW
  - Test Redux state updates
  - Test form validation
  - _Requirements: web-modernization 11.3_

### Property-Based Tests

- [ ]* 37. Write property tests for products
  - Test pricing consistency across CV ranges
  - Test formula progression (Tiers < Essentielle < Étendue < Confort)
  - Test IAC add-on calculations
  - _Requirements: web-modernization 11.1_

### E2E Tests

- [ ]* 38. Write E2E tests for web
  - Test complete Auto selection flow
  - Test Moto with IAC upgrade
  - Test Multirisk Pro purchase
  - Test IAC standalone
  - _Requirements: web-modernization 11.4_

- [ ]* 39. Write E2E tests for mobile
  - Test product selection flows
  - Test cross-sell interactions
  - _Requirements: web-modernization 11.4_

- [ ] 40. Final checkpoint - All tests passing
  - Ensure all tests pass, ask the user if questions arise.

## Phase 6: Analytics & Admin Features (Week 10-11)

### Analytics

- [ ] 41. Implement product analytics
  - Track product selections
  - Track formula choices
  - Track IAC cross-sell conversions
  - Track abandonment points
  - _Requirements: products 10.1-10.5_

### Admin Features

- [ ] 42. Create admin panel for products
  - View all products and pricing
  - Search coverage details
  - View analytics dashboard
  - _Requirements: products 11.1-11.5_

## Phase 7: Documentation & Deployment (Week 11-12)

### Documentation

- [ ] 43. Create documentation
  - Document new product APIs
  - Document pricing structure
  - Create user guides
  - Document admin features
  - _Requirements: web-modernization 40_

### Deployment

- [ ] 44. Deploy to staging
  - Deploy backend with new tables
  - Deploy web app
  - Deploy mobile app to TestFlight/Internal Testing
  - Run smoke tests
  - _Requirements: web-modernization 42_

- [ ] 45. Production deployment
  - Deploy backend
  - Deploy web app
  - Submit mobile app updates
  - Monitor performance
  - _Requirements: web-modernization 43-44_

## Summary

**Platform Modernization Tasks:** 1-8, 13-23, 24-34, 40, 43-45
**New Products Tasks:** 9-12, 15-18, 27-30, 35-39, 41-42
**Shared/Integrated Tasks:** 2-7, 14, 19-21, 26, 31-33

**Total Tasks:** 45 (28 required, 17 optional tests)
**Estimated Duration:** 10-12 weeks with 2-3 developers

## Key Integration Points

1. **Shared Types:** Product types extend existing Insurance types
2. **Redux Store:** productSelectionSlice works alongside insuranceSlice
3. **API Layer:** pricingApi extends baseApi with new endpoints
4. **UI Components:** New product components follow existing design system
5. **Enrollment Flow:** Extended to handle product-specific data
6. **Analytics:** Integrated with existing tracking system
