# Implementation Plan - Insurance Products Update

## Backend Implementation (API)

- [x] 1. Database schema and entities
- [x] 1.1 Create AutoPricing entity with CV range and formula pricing
  - Entity created with proper TypeORM decorators
  - Unique index on cvMin, cvMax, formulaType
  - _Requirements: 1.1, 1.2, 5.1, 5.5_

- [x] 1.2 Create MotoPricing entity with category-based pricing
  - Entity created with category, formula, and IAC inclusion
  - Unique index on category and formulaType
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 5.3_

- [x] 1.3 Create MultirisquePackage entity with JSON coverage details
  - Entity created with JSONB coverage structure
  - Business type and display order fields
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 5.2, 5.6_

- [x] 1.4 Create IACProduct entity for individual accident coverage
  - Entity created with capital amounts and pricing
  - Active flag for product availability
  - _Requirements: 4.1, 4.2, 4.3, 4.5, 5.4_

- [x] 1.5 Create CoverageDefinition entity for tooltips
  - Entity created with code, name, and description
  - Unique index on coverage code
  - _Requirements: 8.2_

- [x] 2. Data migration scripts
- [x] 2.1 Create seed script for Auto Prestige pricing data
  - Script created with all CV ranges and formulas
  - Includes proper coverage arrays
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 9.1, 9.5_

- [x] 2.2 Create seed script for Moto pricing data
  - Script created for all three categories
  - IAC inclusion flags properly set
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 9.2, 9.5_

- [x] 2.3 Create seed script for Multirisk Pro packages
  - Script created with detailed coverage JSON
  - All four business types included
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 9.3, 9.5_

- [x] 2.4 Create seed script for IAC product
  - Script created with capital amounts
  - Description in French included
  - _Requirements: 4.1, 4.2, 4.5, 9.4, 9.5_

- [x] 2.5 Create seed script for coverage definitions
  - Script created with all coverage codes
  - French descriptions for tooltips
  - _Requirements: 8.2, 9.5_

- [x] 2.6 Create master seed runner script
  - Runs all seeds in correct order
  - Handles database connection
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 3. Pricing API endpoints
- [x] 3.1 Implement GET /api/v2/pricing/auto endpoint
  - Query by CV range
  - Returns all formulas for range
  - _Requirements: 1.1, 1.2, 5.5_

- [x] 3.2 Implement GET /api/v2/pricing/auto/all endpoint
  - Returns all Auto pricing data
  - Ordered by CV and formula
  - _Requirements: 1.1, 1.2, 5.5_

- [x] 3.3 Implement GET /api/v2/pricing/moto endpoint
  - Query by category
  - Returns Tiers and Essentielle formulas
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 5.3_

- [x] 3.4 Implement GET /api/v2/pricing/moto/all endpoint
  - Returns all Moto pricing data
  - Ordered by category and formula
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 5.3_

- [x] 3.5 Implement GET /api/v2/pricing/multirisk-pro endpoint
  - Returns all active packages
  - Ordered by display order
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 5.2, 5.6_

- [x] 3.6 Implement GET /api/v2/pricing/multirisk-pro/:packageCode endpoint
  - Returns specific package details
  - Includes full coverage JSON
  - _Requirements: 3.6, 3.7, 5.2, 5.6, 11.2_

- [x] 3.7 Implement GET /api/v2/pricing/iac endpoint
  - Returns active IAC product
  - Includes all capital amounts
  - _Requirements: 4.1, 4.2, 4.5, 5.4_

- [x] 3.8 Implement GET /api/v2/pricing/coverage-definitions endpoint
  - Returns all coverage definitions
  - For tooltip display
  - _Requirements: 8.2, 11.3_

- [ ] 4. Checkpoint - Run migrations and test API endpoints
  - Ensure all tests pass, ask the user if questions arise.

## Shared Packages Implementation

- [ ] 5. TypeScript types package
- [ ] 5.1 Create product type definitions
  - Define ProductType, AutoFormulaType, MotoFormulaType enums
  - Create CVRange, AutoPricing, MotoPricing interfaces
  - Create MultirisquePackage, IACProduct interfaces
  - _Requirements: 1.1, 2.1, 3.1, 4.1_

- [ ] 5.2 Create selection state types
  - Define AutoSelection, MotoSelection interfaces
  - Create MultirisqueSelection, IACSelection interfaces
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 12.1, 12.2, 12.3, 12.4_

- [ ] 6. Validation schemas package
- [ ] 6.1 Create Auto insurance validation schemas
  - Implement cvRangeSchema with Zod
  - Create autoFormulaSchema and autoSelectionSchema
  - _Requirements: 1.1, 1.2_

- [ ] 6.2 Create Moto insurance validation schemas
  - Implement motoCategorySchema with Zod
  - Create motoFormulaSchema and motoSelectionSchema
  - _Requirements: 2.1, 2.2_

- [ ] 6.3 Create Multirisk insurance validation schemas
  - Implement businessTypeSchema with Zod
  - Create multirisqueSelectionSchema
  - _Requirements: 3.1, 3.4_

- [ ] 7. Redux store package
- [ ] 7.1 Create RTK Query pricing API slice
  - Implement useGetAutoPricingQuery hook
  - Implement useGetAllAutoPricingQuery hook
  - Implement useGetMotoPricingQuery hook
  - Implement useGetAllMotoPricingQuery hook
  - Implement useGetMultirisquePackagesQuery hook
  - Implement useGetMultirisquePackageQuery hook
  - Implement useGetIACProductQuery hook
  - Implement useGetCoverageDefinitionsQuery hook
  - Configure caching strategy (10-60 minutes)
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 8.2_

- [ ] 7.2 Create product selection Redux slice
  - Implement setCurrentProduct action
  - Implement setAutoSelection action with IAC toggle
  - Implement setMotoSelection action
  - Implement setMultirisqueSelection action
  - Implement setIACSelection action
  - Implement toggleAutoIAC action
  - Implement clearSelection action
  - Calculate totalPrice in reducers
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 4.3, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

- [ ] 7.3 Configure store with new slices
  - Add pricingApi to store configuration
  - Add productSelectionSlice to store
  - Configure RTK Query middleware
  - _Requirements: All product requirements_

- [ ] 8. Checkpoint - Test shared packages integration
  - Ensure all tests pass, ask the user if questions arise.

## Web Frontend Implementation

- [ ] 9. Auto Prestige product flow
- [ ] 9.1 Create CV range selector component
  - Create AutoCVRangeSelector.tsx component
  - Display 6 CV range cards: 1 CV, 2-4 CV, 5-7 CV, 8-10 CV, 11-16 CV, 17+ CV
  - Use grid layout for responsive design
  - Implement hover effects and selection highlighting
  - Dispatch Redux action on selection
  - Navigate to /auto-prestige/formulas/:cvRange route
  - _Requirements: 1.1, 6.1_

- [ ] 9.2 Create Auto pricing comparison table component
  - Create AutoPricingComparison.tsx component
  - Fetch pricing data using useGetAutoPricingQuery hook
  - Display 4-column table: Tiers, Essentielle, Étendue, Confort
  - Render coverage rows with checkmarks (✓) for included coverages
  - Highlight price row with prominent styling
  - Show progressive coverage additions (IC → VAM → BDG)
  - Implement "Sélectionner" button for each formula
  - Integrate CoverageTooltip component for coverage codes
  - Handle loading and error states
  - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 6.2, 6.3, 6.4, 6.5, 8.2_

- [ ] 9.3 Create IAC cross-sell modal component
  - Create IACCrossSellModal.tsx component
  - Display modal after Tiers formula selection
  - Show IAC benefits: 500,000 FCFA death/disability, 120,000 FCFA treatment
  - Display base price and new total with +5,000 FCFA
  - Implement "Ajouter IAC" and "Non merci" buttons
  - Dispatch toggleAutoIAC action on acceptance
  - Close modal and proceed to enrollment
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 9.4 Integrate Auto flow with existing enrollment
  - Update enrollment screen to accept Auto product data
  - Display selected CV range and formula name
  - Show coverage list from selected formula
  - Display IAC as separate line item if added
  - Pass autoSelection state to subscription creation
  - Update vehicle details form for Auto products
  - _Requirements: 12.1, 12.2, 12.5_

- [ ] 10. Moto product flow
- [ ] 10.1 Create Moto category selector component
  - Create MotoCategorySelector.tsx component
  - Display 3 category cards with images and descriptions:
    - Djakarta (< 2CV) - Small motorcycles
    - Grosse Cylindrée (≥ 2CV) - Large motorcycles
    - Moto Taxi (MTPV) - Commercial motorcycles
  - Use card layout with hover effects
  - Dispatch Redux action on category selection
  - Navigate to /moto/formulas/:category route
  - _Requirements: 2.1_

- [ ] 10.2 Create Moto formula selector component
  - Create MotoFormulaSelector.tsx component
  - Fetch pricing using useGetMotoPricingQuery(category) hook
  - Display 2 formula cards: Tiers and Essentielle
  - Show pricing for selected category (e.g., 7,500 vs 10,000 for Djakarta)
  - Display coverage list for each formula
  - Add IAC badge on Essentielle card: "IAC Inclus"
  - Implement "Sélectionner" button for each formula
  - Handle loading and error states
  - _Requirements: 2.2, 2.3, 2.4, 2.5_

- [ ] 10.3 Create Moto IAC upgrade modal
  - Create MotoIACUpgradeModal.tsx component
  - Display modal after Tiers selection
  - Show side-by-side comparison table:
    - Tiers: Current price, no IAC
    - Essentielle: +2,500 FCFA, IAC included
  - Highlight IAC benefits (500K death/disability, 120K treatment)
  - Implement "Passer à Essentielle" and "Continuer avec Tiers" buttons
  - Update selection to Essentielle if user upgrades
  - _Requirements: 4.1, 4.4, 7.5_

- [ ] 10.4 Integrate Moto flow with enrollment
  - Update enrollment screen to accept Moto product data
  - Display selected category and formula name
  - Show coverage list including IAC if Essentielle
  - Pass motoSelection state to subscription creation
  - Update vehicle details form for Moto products
  - Add motorcycle-specific fields (engine size, etc.)
  - _Requirements: 12.3, 12.5_

- [ ] 11. Multirisk Pro product flow
- [ ] 11.1 Create Multirisk package grid component
  - Create MultirisquePackageGrid.tsx component
  - Fetch packages using useGetMultirisquePackagesQuery hook
  - Display 4 business type cards in 2x2 grid:
    - Boutiques: 50,000 FCFA, up to 36M coverage
    - Restaurants: 75,000 FCFA, up to 27M coverage
    - Hotels & Apartments: 120,000 FCFA, up to 75M coverage
    - Bars & Clubs: 200,000 FCFA, up to 40M coverage
  - Show business icon, name, price prominently
  - Display 3-4 key coverage highlights per card
  - Implement "Voir détails" button to open modal
  - Implement "Souscrire" button to proceed to enrollment
  - Handle loading and error states
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 11.2 Create package details modal component
  - Create MultirisquePackageDetailsModal.tsx component
  - Display package name and total price in header
  - Render coverage chapters as expandable sections:
    - Incendie (Fire coverage)
    - Dommages Électriques (Electrical damage)
    - Dégâts des Eaux (Water damage)
    - Bris de Glaces (Glass breakage)
    - Vol (Theft)
    - Responsabilité Civile (Civil liability)
  - For each chapter, display coverage items with:
    - Description
    - Capital insured (formatted: "36 000 000 FCFA")
    - Franchise/deductible (e.g., "10% du sinistre Mini 100,000")
  - Implement "Souscrire" button in modal footer
  - Add print/download coverage details functionality
  - _Requirements: 3.6, 3.7, 8.5, 11.2_

- [ ] 11.3 Integrate Multirisk flow with enrollment
  - Update enrollment screen to accept Multirisk product data
  - Display selected business type and package name
  - Show total coverage capital prominently
  - Add "Voir les garanties" link to reopen details modal
  - Pass multirisqueSelection state to subscription creation
  - Update business details form for Multirisk products
  - Add business-specific fields (business name, activity type, location)
  - _Requirements: 12.4, 12.5_

- [ ] 12. IAC standalone product
- [ ] 12.1 Create IAC product page
  - Create IACProductPage.tsx component
  - Fetch IAC product using useGetIACProductQuery hook
  - Display hero section with IAC benefits:
    - 500,000 FCFA for death/permanent disability
    - 120,000 FCFA for medical treatment
    - Coverage for professional and private life
  - Show 5,000 FCFA annual pricing prominently
  - Display detailed coverage description in French
  - Add "Qui est couvert?" section explaining coverage scope
  - Implement "Souscrire maintenant" button
  - Navigate directly to enrollment with IAC standalone selection
  - _Requirements: 4.5_

- [ ] 13. Shared web components
- [ ] 13.1 Create coverage tooltip component
  - Create CoverageTooltip.tsx component
  - Fetch definitions using useGetCoverageDefinitionsQuery hook
  - Display tooltip on hover over coverage codes (RC, DR, IC, etc.)
  - Show coverage code, full name, and description
  - Implement with Radix UI Tooltip or similar library
  - Style with consistent design system
  - Cache definitions for performance
  - _Requirements: 8.2_

- [ ] 13.2 Create price display component
  - Create PriceDisplay.tsx component
  - Accept amount in FCFA as prop
  - Format with proper spacing: "50 000 FCFA" or "50,000 FCFA"
  - Handle large numbers (millions): "36 000 000 FCFA"
  - Support different sizes (small, medium, large)
  - Support color variants (primary, secondary, accent)
  - Add optional "à partir de" prefix for starting prices
  - _Requirements: 8.5_

- [ ] 13.3 Update product selection screen
  - Update ProductSelection.tsx component
  - Add 4 new product cards to existing grid:
    - Auto Prestige: Car icon, "À partir de 34,308 FCFA"
    - Moto: Motorcycle icon, "À partir de 7,500 FCFA"
    - Multirisque Pro: Building icon, "À partir de 50,000 FCFA"
    - IAC: Shield icon, "5,000 FCFA"
  - Update routing to new product flows
  - Maintain existing products (Travel, Transport, etc.)
  - Implement consistent card design
  - Add product category badges (Véhicules, Entreprise, Personnel)
  - _Requirements: All product requirements_

- [ ] 14. Checkout and confirmation updates
- [ ] 14.1 Update checkout summary component
  - Update CheckoutSummary.tsx component
  - Display product-specific information:
    - Auto: "Auto Prestige - Formule [Tiers/Essentielle/Étendue/Confort]"
    - Auto: Show CV range (e.g., "2 à 4 CV")
    - Moto: "Moto - Formule [Tiers/Essentielle]"
    - Moto: Show category (e.g., "Djakarta < 2CV")
    - Multirisk: "Multirisque Pro - [Business Type]"
    - IAC: "Individuel Accident Corporel"
  - Display coverage list for selected product
  - Show IAC as separate line item if added:
    - "Individuel Accident Corporel (IAC)" - "5,000 FCFA"
  - Display subtotal and total with PriceDisplay component
  - Add "Modifier" button to return to product selection
  - Show payment method selection
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

- [ ] 14.2 Update confirmation screen
  - Update Confirmation.tsx component
  - Display success message with product details
  - Show subscription summary:
    - Product type and formula/package
    - Coverage details
    - IAC inclusion if applicable
    - Total premium paid
  - Display policy number and effective date
  - Add "Télécharger l'attestation" button
  - Show "Voir mes souscriptions" link
  - Send confirmation email with policy details
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

- [ ] 15. Checkpoint - Test web frontend flows
  - Ensure all tests pass, ask the user if questions arise.

## Mobile Frontend Implementation

- [ ] 16. Auto Prestige mobile flow
- [ ] 16.1 Create CV range selector screen (mobile)
  - Create AutoCVRangeSelectorScreen.js component
  - Display 6 CV ranges as vertical list with cards
  - Use React Native FlatList for performance
  - Show CV range label and representative icon
  - Implement touch feedback with TouchableOpacity
  - Dispatch Redux action on selection
  - Navigate to AutoFormulaScreen with cvRange param
  - Add back button to return to product selection
  - _Requirements: 1.1, 7.4_

- [ ] 16.2 Create Auto formula cards component (mobile)
  - Create AutoFormulaCards.js component
  - Fetch pricing using useGetAutoPricingQuery hook
  - Implement horizontal swipeable cards with react-native-snap-carousel
  - Display 4 formula cards: Tiers, Essentielle, Étendue, Confort
  - Show formula name, price, and coverage list on each card
  - Add checkmarks for included coverages
  - Implement "Sélectionner" button on each card
  - Add pagination dots to indicate current card
  - Handle loading state with skeleton screens
  - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 7.4_

- [ ] 16.3 Create IAC cross-sell bottom sheet (mobile)
  - Create IACCrossSellBottomSheet.js component
  - Display after Tiers formula selection
  - Use react-native-bottom-sheet or similar library
  - Show IAC benefits in mobile-friendly format:
    - Icon with benefit description
    - 500K FCFA death/disability
    - 120K FCFA treatment
  - Display price comparison: Base price vs +5,000 FCFA
  - Implement "Ajouter IAC" and "Non merci" buttons
  - Dispatch toggleAutoIAC action on acceptance
  - Animate sheet dismissal
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 17. Moto mobile flow
- [ ] 17.1 Create Moto category selector screen (mobile)
  - Create MotoCategorySelectorScreen.js component
  - Display 3 category cards vertically:
    - Djakarta (< 2CV) with small motorcycle image
    - Grosse Cylindrée (≥ 2CV) with large motorcycle image
    - Moto Taxi (MTPV) with taxi motorcycle image
  - Optimize images for mobile (use @2x and @3x assets)
  - Show category name, description, and starting price
  - Implement touch feedback with TouchableOpacity
  - Dispatch Redux action on category selection
  - Navigate to MotoFormulaScreen with category param
  - Add back button to return to product selection
  - _Requirements: 2.1, 7.4_

- [ ] 17.2 Create Moto formula selector screen (mobile)
  - Create MotoFormulaScreen.js component
  - Fetch pricing using useGetMotoPricingQuery(category) hook
  - Display 2 formula cards vertically: Tiers and Essentielle
  - Show formula name, price, and coverage list
  - Add "IAC Inclus" badge on Essentielle card
  - Highlight price difference between formulas
  - Implement "Sélectionner" button on each card
  - Show category name in header
  - Handle loading state with skeleton screens
  - _Requirements: 2.2, 2.3, 2.4, 2.5, 7.4_

- [ ] 17.3 Create Moto IAC upgrade bottom sheet (mobile)
  - Create MotoIACUpgradeBottomSheet.js component
  - Display after Tiers selection
  - Use react-native-bottom-sheet library
  - Show comparison table:
    - Tiers: Current price, "Sans IAC"
    - Essentielle: +2,500 FCFA, "Avec IAC"
  - Display IAC benefits with icons
  - Implement "Passer à Essentielle" button (primary)
  - Implement "Continuer avec Tiers" button (secondary)
  - Update selection to Essentielle if user upgrades
  - Animate sheet dismissal
  - _Requirements: 4.1, 4.4, 7.5_

- [ ] 18. Multirisk Pro mobile flow
- [ ] 18.1 Create Multirisk package list screen (mobile)
  - Create MultirisquePackageListScreen.js component
  - Fetch packages using useGetMultirisquePackagesQuery hook
  - Display 4 business packages as vertical cards:
    - Boutiques: 50,000 FCFA
    - Restaurants: 75,000 FCFA
    - Hotels & Apartments: 120,000 FCFA
    - Bars & Clubs: 200,000 FCFA
  - Show business icon, name, and price prominently
  - Display 2-3 key coverage highlights per card
  - Implement "Voir détails" button to expand accordion
  - Implement "Souscrire" button to proceed to enrollment
  - Use ScrollView for vertical scrolling
  - Handle loading state with skeleton screens
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 7.1_

- [ ] 18.2 Create coverage accordion component (mobile)
  - Create CoverageAccordion.js component
  - Implement collapsible sections for coverage chapters
  - Use react-native-collapsible or Animated API
  - Display 6 chapters: Incendie, Dommages Électriques, Dégâts des Eaux, Bris de Glaces, Vol, RC
  - For each chapter, show coverage items:
    - Description (wrap text for long descriptions)
    - Capital insured (formatted with spaces)
    - Franchise (handle long text like "10% du sinistre Mini 100,000")
  - Implement expand/collapse animation
  - Show chevron icon to indicate expandable state
  - Format large numbers for mobile readability
  - Handle text overflow with ellipsis or wrapping
  - _Requirements: 3.6, 3.7, 7.2, 7.3_

- [ ] 19. Mobile shared components
- [ ] 19.1 Create mobile coverage tooltip component
  - Create CoverageTooltipMobile.js component
  - Fetch definitions using useGetCoverageDefinitionsQuery hook
  - Display tooltip on press (not hover) for touch devices
  - Show coverage code, full name, and description in modal
  - Use react-native-modal or bottom sheet for display
  - Implement close button and backdrop dismiss
  - Style with consistent mobile design system
  - Cache definitions for performance
  - _Requirements: 8.2_

- [ ] 19.2 Create mobile price display component
  - Create PriceDisplayMobile.js component
  - Accept amount in FCFA as prop
  - Format with proper spacing: "50 000 FCFA"
  - Handle large numbers: "36 000 000 FCFA"
  - Support different text sizes (small, medium, large)
  - Support color variants (primary, secondary, accent)
  - Optimize font scaling for accessibility
  - _Requirements: 8.5_

- [ ] 19.3 Update mobile product selection screen
  - Update ProductSelectionScreen.js component
  - Add 4 new product cards to existing grid:
    - Auto Prestige: Car icon, "À partir de 34,308 FCFA"
    - Moto: Motorcycle icon, "À partir de 7,500 FCFA"
    - Multirisque Pro: Building icon, "À partir de 50,000 FCFA"
    - IAC: Shield icon, "5,000 FCFA"
  - Update navigation to new product screens
  - Maintain existing products (Travel, Transport, etc.)
  - Implement consistent card design with TouchableOpacity
  - Add product category badges
  - Use FlatList for performance with many products
  - _Requirements: All product requirements_

- [ ] 20. Mobile checkout updates
- [ ] 20.1 Update mobile checkout summary
  - Update CheckoutScreen.js component
  - Display product-specific information:
    - Auto: Show formula and CV range
    - Moto: Show formula and category
    - Multirisk: Show business type
    - IAC: Show standalone or add-on status
  - Display coverage list in collapsible section
  - Show IAC as separate line item if added
  - Display subtotal and total with PriceDisplayMobile
  - Add "Modifier" button to return to product selection
  - Show payment method selection (Mobile Money, Card, etc.)
  - Optimize layout for small screens
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

- [ ] 20.2 Update mobile confirmation screen
  - Update ConfirmationScreen.js component
  - Display success animation
  - Show subscription summary with product details
  - Display policy number and effective date
  - Add "Télécharger l'attestation" button
  - Show "Voir mes souscriptions" link
  - Implement share functionality for policy details
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

- [ ] 21. Checkpoint - Test mobile frontend flows
  - Ensure all tests pass, ask the user if questions arise.

## Analytics and Tracking

- [ ] 22. Product analytics implementation
- [ ] 22.1 Implement product selection tracking
  - Log product type selections with timestamp
  - Track user session information
  - _Requirements: 10.1_

- [ ] 22.2 Implement purchase completion tracking
  - Record product type, formula, CV/category, final price
  - Track IAC cross-sell conversions
  - _Requirements: 10.2, 10.3_

- [ ] 22.3 Implement abandonment tracking
  - Record last completed step
  - Track drop-off points
  - _Requirements: 10.4_

- [ ] 22.4 Create analytics reporting endpoints
  - Product popularity metrics
  - Average premium by product type
  - Conversion rates
  - _Requirements: 10.5_

## Admin Panel Features

- [ ] 23. Admin product management
- [ ] 23.1 Create searchable product database view
  - Display all products and formulas
  - Search by product type, formula, business type
  - _Requirements: 11.1_

- [ ] 23.2 Create Multirisk package detail view
  - Display all coverage chapters
  - Show capitals and franchises
  - _Requirements: 11.2_

- [ ] 23.3 Create Auto formula detail view
  - Display all included coverages
  - Show coverage definitions
  - _Requirements: 11.3_

- [ ] 23.4 Create pricing information view
  - Display base prices and add-on costs
  - Show IAC pricing
  - _Requirements: 11.4_

- [ ] 23.5 Create coverage limits quick reference
  - Display capital insured amounts
  - Show deductibles
  - _Requirements: 11.5_

- [ ] 24. Final checkpoint - End-to-end testing
  - Ensure all tests pass, ask the user if questions arise.
