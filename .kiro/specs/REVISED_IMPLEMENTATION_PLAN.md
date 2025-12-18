# Revised Implementation Plan
# CNAR Sugu: Platform Enhancement + New Insurance Products

## Overview

This plan **extends the existing codebase** rather than rebuilding from scratch:
- **Backend:** Add API v2 with versioning, enhance existing modules
- **Mobile:** Extend existing React Native app with new product screens
- **Web:** Add Next.js app alongside existing React Native Web
- **Shared:** Create monorepo structure with shared packages

**Duration:** 8-10 weeks
**Approach:** Incremental enhancement with backward compatibility

## Phase 1: Backend Enhancement & API Versioning (Week 1-2)

### API Versioning Setup

- [x] 1. Implement API versioning in NestJS




  - Add @nestjs/versioning package
  - Configure VERSION_NEUTRAL for existing endpoints
  - Set up v1 and v2 routing
  - Update main.ts with versioning config
  - _Requirements: products 5.1, web-modernization 8.1_

```typescript
// cnarSuguApi/src/main.ts
app.enableVersioning({
  type: VersioningType.URI,
  defaultVersion: '1',
});
```

### Database Schema Updates

- [x] 2. Create new product pricing tables





  - Create migration: pricing_matrix_auto
  - Create migration: moto_pricing  
  - Create migration: static_packages_pro
  - Create migration: iac_product
  - Create migration: coverage_definitions
  - Add indexes for performance
  - _Requirements: products 5.1-5.6_

- [x] 2.1 Enhance existing Subscription entity


  - Add product_type ENUM field (AUTO, MOTO, MULTIRISK_PRO, IAC, LEGACY)
  - Add product_details JSONB field for flexible data
  - Add cv_range field for Auto products
  - Add moto_category field for Moto products
  - Maintain backward compatibility with existing subscriptions
  - _Requirements: products 10.2_

- [x] 2.2 Create data migration scripts


  - Script to import Auto Prestige CSV data
  - Script to import Moto CSV data
  - Script to import Multirisk Pro packages with JSON
  - Script to import IAC product
  - Script to import coverage definitions
  - Validation script to verify data integrity
  - _Requirements: products 9.1-9.5_

### New Pricing Module (API v2)

- [x] 3. Create Pricing module




  - Create cnarSuguApi/src/modules/pricing/
  - Create pricing.module.ts
  - Create pricing.controller.ts with @Version('2')
  - Create pricing.service.ts
  - Create DTOs and entities
  - _Requirements: products 5.1_

- [x] 3.1 Implement pricing entities

  - Create entities/auto-pricing.entity.ts
  - Create entities/moto-pricing.entity.ts
  - Create entities/multirisk-package.entity.ts
  - Create entities/iac-product.entity.ts
  - Create entities/coverage-definition.entity.ts
  - _Requirements: products 5.1_

- [x] 3.2 Implement pricing service methods

  - getAutoPricing(cvMin, cvMax): AutoPricing[]
  - getAllAutoPricing(): AutoPricing[]
  - getMotoPricing(category): MotoPricing[]
  - getAllMotoPricing(): MotoPricing[]
  - getMultirisquePackages(): MultirisquePackage[]
  - getMultirisquePackage(code): MultirisquePackage
  - getIACProduct(): IACProduct
  - getCoverageDefinitions(): CoverageDefinition[]
  - _Requirements: products 1.1-4.2_

- [x] 3.3 Implement pricing controller endpoints

  - GET /api/v2/pricing/auto?cvMin=2&cvMax=4
  - GET /api/v2/pricing/auto/all
  - GET /api/v2/pricing/moto?category=DJAKARTA
  - GET /api/v2/pricing/moto/all
  - GET /api/v2/pricing/multirisk-pro
  - GET /api/v2/pricing/multirisk-pro/:packageCode
  - GET /api/v2/pricing/iac
  - GET /api/v2/pricing/coverage-definitions
  - Add Swagger documentation for all endpoints
  - _Requirements: products 1.1-4.2_

### Enhance Existing Modules

- [x] 4. Enhance Insurance module



  - Keep existing v1 endpoints unchanged
  - Add v2 endpoints with enhanced product categorization
  - Add product_type filter to GET /api/v2/insurance
  - Enhance insurance.service.ts with product type logic
  - _Requirements: web-modernization 5.1_

- [x] 4.1 Enhance Subscription module





  - Keep existing v1 endpoints unchanged
  - Add v2 endpoints with product-specific validation
  - Update subscription.service.ts to handle new product types
  - Add validation for product_details based on product_type
  - Enhance file upload handling for product-specific documents
  - _Requirements: products 10.2, web-modernization 3.1-3.5_

- [x] 4.2 Enhance Payment module





  - Keep existing v1 endpoints unchanged
  - Add support for IAC add-on pricing
  - Update payment calculation logic
  - _Requirements: products 4.1-4.3, web-modernization 4.1-4.4_

### Business Logic Enhancements
- [x] 5. Implement pricing calculation service




- [ ] 5. Implement pricing calculation service

  - Create shared/pricing-calculator.service.ts
  - Implement Auto formula price calculation
  - Implement Moto category price lookup
  - Implement IAC add-on logic
  - Implement total price calculation with add-ons
  - Add unit tests for calculations
  - _Requirements: products 1.1-4.3_

- [x] 5.1 Implement cross-sell logic service


  - Create shared/cross-sell.service.ts
  - Implement IAC eligibility check (Auto Tiers, Moto Tiers)
  - Implement upgrade suggestions (Moto Tiers → Essentielle)
  - Calculate upgrade pricing
  - _Requirements: products 4.1-4.3, 7.5_

- [ ]* 5.2 Write integration tests for new endpoints
  - Test pricing endpoints with various parameters
  - Test subscription creation with new product types
  - Test error handling and validation
  - _Requirements: web-modernization 11.3_

- [x] 6. Checkpoint - Backend v2 complete




  - Ensure all tests pass, ask the user if questions arise.
  - Verify v1 endpoints still work (backward compatibility)
  - Verify v2 endpoints return correct data

## Phase 2: Shared Packages Setup (Week 2-3)

### Monorepo Structure

- [x] 7. Initialize monorepo alongside existing apps



  - Create root-level packages/ directory
  - Create turbo.json (configure to work with existing apps)
  - Create pnpm-workspace.yaml
  - Update root package.json with workspace config
  - Keep existing cnarsugu-front and cnarSuguApi as-is
  - _Requirements: web-modernization 12.2, 12.4_

### Shared Packages



- [x] 8. Create packages/types

  - Set up TypeScript configuration
  - Define base types (Insurance, Subscription, Payment)
  - **ADD:** Define new product types (Auto, Moto, Multirisk, IAC)
  - **ADD:** Define pricing structures
  - Export all types from index.ts
  - _Requirements: web-modernization 10.1, products 5.1_

- [x] 9. Create packages/schemas




  - Set up Zod validation
  - Port existing validation logic
  - **ADD:** Auto insurance schemas (CV range, formula selection)
  - **ADD:** Moto insurance schemas (category, formula)
  - **ADD:** Multirisk schemas (package selection)
  - **ADD:** IAC schemas




  - _Requirements: web-modernization 5.3, products 8.1_





- [ ] 9.1 Write property test for validation consistency


  - Test that same input produces same result across platforms
  - _Requirements: web-modernization 5.3_

- [x] 10. Create packages/store (Redux Toolkit)


  - Set up Redux Toolkit with RTK Query
  - Create baseApi pointing to backend v2
  - Create pricingApi with all pricing endpoints
  - Create slices for product selection
  - Export store configuration
  - _Requirements: web-modernization 5.1, 5.4_

- [x] 10.1 Create Redux slices




  - productSelectionSlice (Auto/Moto/Multirisk/IAC)
  - Keep existing enrollment and payment slices compatible
  - _Requirements: products 1.1-4.1_

- [x] 11. Create packages/hooks




  - Create useAppDispatch and useAppSelector
  - Create product-specific hooks (useAutoSelection, useMotoSelection)
  - _Requirements: web-modernization 5.1_
- [x] 12. Create packages/utils


  - Port existing utility functions
  - Add CV_RANGES constant
  - Add MOTO_CATEGORIES constant
  - Add BUSINESS_TYPES constant
  - Add pricing formatters
  - _Requirements: web-modernization 5.1, products 8.1_

- [x] 13. Checkpoint - Shared packages complete




  - Ensure all packages build successfully
  - Verify types are correctly exported

## Phase 3: Extend React Native Mobile App (Week 3-5)

### Dependencies Update

- [x] 14. Update mobile app dependencies



  - Update React Native to 0.74+ (test thoroughly!)
  - Update Expo to 51+
  - Update React Navigation to 6+
  - Install Redux Toolkit and React Redux
  - Install NativeWind for styling
  - **REMOVE:** easy-peasy (migrate state to Redux)
  - Link shared packages from monorepo
  - _Requirements: web-modernization 7.1, 7.2, 7.3_

- [x] 14.1 Migrate existing state to Redux
  - Port easy-peasy stores to Redux slices
  - Update all useStoreState calls to useAppSelector
  - Update all useStoreActions calls to useAppDispatch
  - Test existing flows still work
  - _Requirements: web-modernization 7.3_

### New Product Screens

- [x] 15. Enhance HomeScreen




  - Keep existing insurance product display
  - **ADD:** "Nouveaux Produits" section
  - **ADD:** Cards for Auto, Moto, Multirisk Pro, IAC
  - Use FlashList for performance
  - Fetch pricing data on mount
  - _Requirements: products 1.1, web-modernization 2.1_

- [x] 16. Create AutoPrestigeScreen


  - Create src/screens/products/AutoPrestigeScreen.tsx
  - Implement CV range selector (dropdown or picker)
  - Fetch pricing with useGetAutoPricingQuery
  - Display formula cards (swipeable with react-native-snap-carousel)
  - Show coverage details in collapsible accordion
  - Implement formula selection
  - Navigate to enrollment with selected data
  - _Requirements: products 1.1-1.7_

- [x] 16.1 Implement IAC cross-sell for Auto
  - Show bottom sheet after Tiers selection
  - Display IAC benefits and +5,000 FCFA price
  - "Ajouter" and "Non merci" buttons
  - Dispatch toggleAutoIAC action
  - _Requirements: products 4.1-4.3, 7.5_

- [x] 17. Create MotoScreen



  - Create src/screens/products/MotoScreen.tsx
  - Implement category selector (3 cards: Djakarta, Grosse Cylindrée, Moto Taxi)
  - Fetch pricing with useGetMotoPricingQuery
  - Display Tiers and Essentielle options
  - Show IAC inclusion badge on Essentielle
  - Implement upgrade modal for Tiers → Essentielle
  - _Requirements: products 2.1-2.5, 7.5_

- [x] 18. Create MultirisqueProScreen


  - Create src/screens/products/MultirisqueProScreen.tsx
  - Fetch packages with useGetMultirisquePackagesQuery
  - Display 4 business package cards in grid
  - Show price prominently on each card
  - Implement package detail modal with coverage accordion
  - Handle long franchise text with collapsible sections
  - "Souscrire" button navigates to enrollment
  - _Requirements: products 3.1-3.7, 7.2-7.4_

- [x] 19. Create IACScreen



  - Create src/screens/products/IACScreen.tsx
  - Fetch IAC product with useGetIACProductQuery
  - Display coverage details (death, disability, treatment)
  - Show price prominently
  - Direct purchase flow
  - _Requirements: products 4.5_

### Update Existing Screens
-

- [x] 20. Enhance EnrollmentScreen


  - Keep existing form logic
  - **ADD:** Conditional fields based on product_type
  - **ADD:** CV range display for Auto
  - **ADD:** Category display for Moto
  - **ADD:** Package name display for Multirisk
  - Update validation to use shared schemas
  - Store product_details in Redux
  - _Requirements: web-modernization 3.1-3.5, products 1.1_

- [x] 21. Enhance PaymentScreen





  - Keep existing payment method selection
  - **ADD:** Product summary section at top
  - **ADD:** Show selected formula/package
  - **ADD:** Show IAC as separate line item if added
  - Calculate total from Redux productSelection state
  - _Requirements: web-modernization 4.1-4.4, products 12.1-12.6_

- [x] 22. Enhance ConfirmationScreen



  - Keep existing confirmation logic
  - **ADD:** Product-specific confirmation details
  - **ADD:** Coverage summary for selected product
  - _Requirements: web-modernization 4.5_

### UI Components

- [x] 23. Create product-specific components



  - components/products/CVRangeSelector.js
  - components/products/FormulaCard.js
  - components/products/CoverageAccordion.js
  - components/products/MotoCategoryCard.js
  - components/products/MultirisquePackageCard.js
  - components/products/IACCrossSellBottomSheet.js
  - components/products/CoverageTooltip.js
  - _Requirements: products 6.1-6.5, 7.1-7.5, 8.2_

- [x] 24. Checkpoint - Mobile app enhanced



  - Ensure all existing flows still work
  - Ensure new product flows work end-to-end
  - Test on iOS and Android

## Phase 4: Create Next.js Web Application (Week 5-7)

### Setup

- [x] 25. Create Next.js app in monorepo





  - Create apps/web directory
  - Initialize with create-next-app
  - Configure TypeScript strict mode
  - Set up Tailwind CSS + shadcn/ui
  - Link shared packages
  - Configure Redux Provider
  - _Requirements: web-modernization 6.1, 10.1_

- [x] 25.1 Configure Next.js optimizations


  - Set up next.config.js with image optimization
  - Configure ISR for product pages
  - Set up environment variables
  - _Requirements: web-modernization 6.3, 6.5_

### Product Pages

- [x] 26. Create home page




  - Create app/page.tsx
  - Display hero section
  - **ADD:** "Nos Produits" section with existing products
  - **ADD:** "Nouveaux Produits" section with Auto, Moto, Multirisk, IAC
  - Server-side render for SEO
  - _Requirements: web-modernization 1.1, products 1.1_

- [x] 27. Create Auto Prestige page



  - Create app/auto-prestige/page.tsx
  - Implement CV range selector (dropdown)
  - Fetch pricing with useGetAutoPricingQuery
  - Display comparison table (4 columns: Tiers, Essentielle, Étendue, Confort)
  - Show coverage checkmarks and price progression
  - Highlight differences between formulas
  - "Souscrire" button for each formula
  - _Requirements: products 1.1-1.7, 6.1-6.5_

- [x] 27.1 Implement IAC cross-sell modal
  - Show modal after Tiers selection
  - Display benefits and +5,000 FCFA
  - "Ajouter" and "Continuer sans IAC" buttons
  - _Requirements: products 4.1-4.3_

- [x] 28. Create Moto page



  - Create app/moto/page.tsx
  - Display 3 category cards with images
  - Fetch pricing with useGetMotoPricingQuery
  - Show Tiers and Essentielle side-by-side
  - Highlight IAC inclusion in Essentielle
  - _Requirements: products 2.1-2.5_

- [x] 29. Create Multirisk Pro page




  - Create app/multirisk-pro/page.tsx
  - Display 4 business package cards in grid
  - Show price prominently
  - "Voir détails" expands coverage information
  - "Souscrire" button
  - _Requirements: products 3.1-3.7_

- [x] 30. Create IAC page




  - Create app/iac/page.tsx
  - Display coverage details
  - Show price
  - Direct purchase CTA
  - _Requirements: products 4.5_

### Enrollment & Checkout

- [x] 31. Create enrollment page



  - Create app/enrollment/page.tsx
  - Implement client type selection
  - Dynamic form with React Hook Form + Zod
  - Product-specific fields
  - Validation with shared schemas
  - _Requirements: web-modernization 3.1-3.5_

- [x] 32. Create payment page





  - Create app/payment/page.tsx
  - Display payment method selection
  - Show product summary
  - Show IAC line item if added
  - Calculate total
  - _Requirements: web-modernization 4.1-4.4_

- [x] 33. Create confirmation page




  - Create app/confirmation/page.tsx
  - Product-specific confirmation
  - Download receipt
  - _Requirements: web-modernization 4.5_

### UI Components

- [x] 34. Create web components



  - components/products/AutoPricingComparison.tsx
  - components/products/MotoCategorySelector.tsx
  - components/products/MultirisquePackageCard.tsx
  - components/products/IACCrossSellModal.tsx
  - components/products/CoverageTooltip.tsx
  - components/ui/* (shadcn/ui components)
  - _Requirements: products 6.1-6.5, 8.2_

- [x] 35. Checkpoint - Web app complete



  - Test all product flows
  - Test responsive design
  - Test SEO with Lighthouse

## Phase 5: Testing & Quality Assurance (Week 7-8)

### Backend Tests
-

- [x] 36. Write unit tests for pricing service



  - Test pricing calculations
  - Test CV range matching
  - Test cross-sell logic
  - _Requirements: web-modernization 11.1_

- [ ]* 37. Write integration tests for API v2
  - Test all pricing endpoints
  - Test subscription creation with new products
  - Test backward compatibility with v1
  - _Requirements: web-modernization 11.3_

### Frontend Tests

- [ ]* 38. Write unit tests for Redux slices
  - Test productSelection slice
  - Test pricing calculations
  - _Requirements: web-modernization 11.1_

- [ ]* 39. Write component tests
  - Test product selection components
  - Test form validation
  - _Requirements: web-modernization 11.2_

### E2E Tests

- [ ]* 40. Write E2E tests for web
  - Test complete Auto flow
  - Test Moto with IAC upgrade
  - Test Multirisk Pro purchase
  - _Requirements: web-modernization 11.4_

- [ ]* 41. Write E2E tests for mobile
  - Test product selection flows
  - Test cross-sell interactions
  - _Requirements: web-modernization 11.4_

- [ ] 42. Final checkpoint - All tests passing
  - Ensure all tests pass, ask the user if questions arise.

## Phase 6: Analytics & Deployment (Week 8-10)

### Analytics

- [ ] 43. Implement product analytics


  - Extend existing statistics module
  - Track product selections
  - Track formula choices
  - Track IAC cross-sell conversions
  - _Requirements: products 10.1-10.5_

### Admin Features

- [ ] 44. Enhance admin panel
  - Add product management section
  - Add pricing management
  - Add analytics dashboard
  - _Requirements: products 11.1-11.5_

### Documentation

- [ ] 45. Create documentation
  - Document API v2 endpoints
  - Document new product flows
  - Update deployment guides
  - _Requirements: web-modernization 40_

### Deployment

- [ ] 46. Deploy to staging
  - Deploy backend with migrations
  - Deploy web app to Vercel
  - Deploy mobile app to TestFlight/Internal Testing
  - Run smoke tests
  - _Requirements: web-modernization 42_

- [ ] 47. Production deployment
  - Run database migrations
  - Deploy backend (ensure v1 still works)
  - Deploy web app
  - Submit mobile app updates
  - Monitor performance
  - _Requirements: web-modernization 43-44_

## Summary

**Total Tasks:** 47 (36 required, 11 optional tests)
**Duration:** 8-10 weeks with 2-3 developers

### Key Differences from Original Plan:
1. ✅ API versioning (v1 unchanged, v2 for new products)
2. ✅ Extends existing React Native app (not rebuild)
3. ✅ Adds Next.js alongside existing React Native Web
4. ✅ Maintains backward compatibility
5. ✅ Enhances existing business logic
6. ✅ Incremental rollout possible

### Backward Compatibility:
- All existing v1 API endpoints remain unchanged
- Existing mobile app flows continue to work
- New products are additive, not replacing
- Database migrations are non-breaking
- Gradual migration path for users
