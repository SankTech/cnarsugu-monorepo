# Requirements Document - Insurance Products Update

## Introduction

This document outlines the requirements for updating the CNAR Sugu insurance platform with new product offerings and pricing structures. The update introduces four distinct product verticals: Auto Prestige (matrix-based pricing), Moto (category-based), Multirisk Pro (fixed B2B packages), and Individual Accident Coverage (IAC). This feature will be implemented on both web and mobile platforms.

## Glossary

- **CV (Chevaux Fiscaux)**: Fiscal horsepower rating for vehicles
- **RC (Responsabilité Civile)**: Civil liability coverage
- **DR (Défense et Recours)**: Legal defense and recourse
- **CEDEAO**: ECOWAS (Economic Community of West African States) coverage
- **IC (Incendie)**: Fire coverage
- **VAM (Vol à Main Armée)**: Armed robbery coverage
- **BDG (Bris de Glace)**: Glass breakage coverage
- **IAC (Individuel Accident Corporel)**: Individual bodily accident coverage
- **Franchise**: Deductible amount
- **Capital Assuré**: Insured capital/coverage limit
- **FCFA**: West African CFA franc currency
- **Formule**: Insurance package/formula
- **Multirisque**: Multi-risk comprehensive coverage
- **Djakarta**: Small motorcycle (< 2CV)
- **MTPV (Moto Taxi Public Vehicle)**: Motorcycle taxi for public transport

## Requirements

### Requirement 1

**User Story:** As a private vehicle owner, I want to select my vehicle's fiscal power and see available insurance packages with clear pricing, so that I can choose the coverage that fits my needs and budget.

#### Acceptance Criteria

1. WHEN a user selects the Auto Prestige product THEN the system SHALL display a CV selection interface with options: 1 CV, 2-4 CV, 5-7 CV, 8-10 CV, 11-16 CV, 17+ CV
2. WHEN a user selects a CV range THEN the system SHALL display four formula options (Tiers, Essentielle, Étendue, Confort) with their respective prices
3. WHEN displaying formula options THEN the system SHALL show included coverages for each formula (RC, DR, CEDEAO, Assistance+, IC, VAM, BDG)
4. WHEN a user views the Tiers formula THEN the system SHALL display the base price for the selected CV range
5. WHEN a user views the Essentielle formula THEN the system SHALL display the Tiers price plus approximately 10,000 FCFA with IC coverage added
6. WHEN a user views the Étendue formula THEN the system SHALL display the Tiers price plus approximately 20,000 FCFA with IC and VAM coverage added
7. WHEN a user views the Confort formula THEN the system SHALL display the Tiers price plus 25,000-30,000 FCFA with IC, VAM, and BDG coverage added

### Requirement 2

**User Story:** As a motorcycle owner, I want to select my motorcycle category and see appropriate insurance packages, so that I can insure my vehicle correctly.

#### Acceptance Criteria

1. WHEN a user selects the Moto product THEN the system SHALL display three category options: Djakarta (< 2CV), Grosse Cylindrée (≥ 2CV), Moto Taxi (MTPV)
2. WHEN a user selects Djakarta category THEN the system SHALL display Tiers formula at 7,500 FCFA and Essentielle formula at 10,000 FCFA
3. WHEN a user selects Grosse Cylindrée category THEN the system SHALL display Tiers formula at 35,000 FCFA and Essentielle formula at 37,500 FCFA
4. WHEN a user selects Moto Taxi category THEN the system SHALL display Tiers formula at 25,000 FCFA and Essentielle formula at 27,500 FCFA
5. WHEN displaying Moto Essentielle formula THEN the system SHALL indicate that IAC coverage is included

### Requirement 3

**User Story:** As a business owner, I want to see fixed-price professional insurance packages tailored to my business type, so that I can quickly insure my commercial property.

#### Acceptance Criteria

1. WHEN a user accesses the Multirisk Pro section THEN the system SHALL display four business package options: Boutiques, Restaurants, Bars & Clubs, Hotels & Apartments
2. WHEN displaying the Boutiques package THEN the system SHALL show the price of 50,000 FCFA and capital coverage up to 36M FCFA
3. WHEN displaying the Restaurants package THEN the system SHALL show the price of 80,000 FCFA and capital coverage up to 27M FCFA
4. WHEN displaying the Hotels & Apartments package THEN the system SHALL show the price of 155,000 FCFA and capital coverage up to 75M FCFA
5. WHEN displaying the Bars & Clubs package THEN the system SHALL show the price of 200,000 FCFA and capital coverage up to 40M FCFA
6. WHEN a user views package details THEN the system SHALL display coverage chapters (Incendie, Dommages Électriques, Dégâts des Eaux, Bris de Glaces, Vol, RC)
7. WHEN displaying coverage details THEN the system SHALL show the capital insured and franchise (deductible) for each coverage type

### Requirement 4

**User Story:** As a user purchasing Auto or Moto insurance, I want to be offered Individual Accident Coverage as an add-on, so that I can protect myself against bodily injuries.

#### Acceptance Criteria

1. WHEN a user completes Auto or Moto Tiers formula selection THEN the system SHALL offer IAC as an optional add-on for 5,000 FCFA
2. WHEN displaying IAC offer THEN the system SHALL show coverage details: 500,000 FCFA for death/disability, 120,000 FCFA for treatment
3. WHEN a user accepts IAC add-on THEN the system SHALL add 5,000 FCFA to the total premium
4. WHEN a user purchases Moto Essentielle formula THEN the system SHALL include IAC automatically without additional charge
5. WHEN a user accesses IAC as standalone product THEN the system SHALL allow direct purchase at 5,000 FCFA

### Requirement 5

**User Story:** As a system administrator, I want the pricing data stored in a structured database, so that prices can be updated without code changes.

#### Acceptance Criteria

1. WHEN the system initializes THEN the database SHALL contain a pricing_matrix_auto table with columns: id, cv_min, cv_max, formula_type, price_12m
2. WHEN the system initializes THEN the database SHALL contain a static_packages_pro table with columns: id, package_code, name, price_ttc, json_coverage_details
3. WHEN the system initializes THEN the database SHALL contain a moto_pricing table with columns: id, category, formula_type, price_12m, includes_iac
4. WHEN the system initializes THEN the database SHALL contain an iac_product table with columns: id, price, death_capital, treatment_capital
5. WHEN querying Auto pricing THEN the system SHALL retrieve prices based on CV range and formula type from pricing_matrix_auto
6. WHEN querying Multirisk Pro packages THEN the system SHALL retrieve package details including JSON coverage data from static_packages_pro

### Requirement 6

**User Story:** As a web user, I want to see a comparison table for Auto insurance formulas, so that I can easily understand the differences between coverage levels.

#### Acceptance Criteria

1. WHEN a user selects a CV range on web THEN the system SHALL display a side-by-side comparison table with four columns (Tiers, Essentielle, Étendue, Confort)
2. WHEN displaying the comparison table THEN the system SHALL show checkmarks for included coverages in each formula
3. WHEN displaying the comparison table THEN the system SHALL highlight the price for each formula
4. WHEN displaying the comparison table THEN the system SHALL show progressive coverage additions (IC in Essentielle, VAM in Étendue, BDG in Confort)
5. WHEN a user selects a formula from the comparison table THEN the system SHALL proceed to the enrollment flow with the selected formula

### Requirement 7

**User Story:** As a mobile user, I want to view detailed coverage information without cluttering the screen, so that I can understand my insurance package on a small device.

#### Acceptance Criteria

1. WHEN a user views Multirisk Pro packages on mobile THEN the system SHALL display package cards with price and business type prominently
2. WHEN a user taps on a package card THEN the system SHALL expand an accordion view showing detailed coverage information
3. WHEN displaying franchise information on mobile THEN the system SHALL format long text (e.g., "10% du sinistre Mini 100,000") in a readable collapsible format
4. WHEN a user views Auto formulas on mobile THEN the system SHALL display formulas as swipeable cards instead of a comparison table
5. WHEN a user completes Moto Tiers selection on mobile THEN the system SHALL display a modal popup offering IAC upgrade to Essentielle for +2,500 FCFA

### Requirement 8

**User Story:** As a user, I want the system to use consistent terminology across all interfaces, so that I am not confused by different naming conventions.

#### Acceptance Criteria

1. WHEN displaying Auto insurance formulas THEN the system SHALL use the terms "Tiers", "Essentielle", "Étendue", "Confort" consistently
2. WHEN displaying coverage abbreviations THEN the system SHALL provide tooltips or legends explaining RC, DR, IC, VAM, BDG, IAC
3. WHEN displaying Moto categories THEN the system SHALL use "Djakarta (< 2CV)", "Grosse Cylindrée (≥ 2CV)", "Moto Taxi (MTPV)"
4. WHEN displaying Multirisk Pro packages THEN the system SHALL use business type names: "Boutiques", "Restaurants", "Bars & Clubs", "Hotels & Apartments"
5. WHEN displaying prices THEN the system SHALL always show amounts in FCFA with proper formatting (e.g., "50,000 FCFA" or "50 000 FCFA")

### Requirement 9

**User Story:** As a developer, I want clear data migration scripts for the new pricing structure, so that I can populate the database accurately.

#### Acceptance Criteria

1. WHEN executing data migration THEN the system SHALL import all Auto Prestige pricing data from CSV to pricing_matrix_auto table
2. WHEN executing data migration THEN the system SHALL import all Moto pricing data from CSV to moto_pricing table
3. WHEN executing data migration THEN the system SHALL import all Multirisk Pro package data with JSON coverage details to static_packages_pro table
4. WHEN executing data migration THEN the system SHALL import IAC product data to iac_product table
5. WHEN migration completes THEN the system SHALL validate that all required price points are present and no data is missing

### Requirement 10

**User Story:** As a business analyst, I want to track which products and formulas are most popular, so that I can optimize our offerings.

#### Acceptance Criteria

1. WHEN a user selects a product type THEN the system SHALL log the selection with timestamp and user session
2. WHEN a user completes a purchase THEN the system SHALL record the product type, formula, CV range (if Auto), category (if Moto), and final price
3. WHEN a user adds IAC as an add-on THEN the system SHALL record the cross-sell conversion
4. WHEN a user abandons the flow THEN the system SHALL record the last step completed
5. WHEN generating reports THEN the system SHALL provide analytics on product popularity, average premium, and conversion rates by product type

### Requirement 11

**User Story:** As a customer service representative, I want to access detailed coverage information for each package, so that I can answer customer questions accurately.

#### Acceptance Criteria

1. WHEN accessing the admin panel THEN the system SHALL provide a searchable database of all products and formulas
2. WHEN viewing a Multirisk Pro package THEN the system SHALL display all coverage chapters with capitals and franchises
3. WHEN viewing an Auto formula THEN the system SHALL display all included coverages with their definitions
4. WHEN viewing pricing THEN the system SHALL show both the base price and any add-on costs (like IAC)
5. WHEN a customer asks about coverage limits THEN the system SHALL provide quick access to capital insured amounts and deductibles

### Requirement 12

**User Story:** As a user, I want the checkout process to clearly show my selected coverage and total price, so that I can confirm my purchase with confidence.

#### Acceptance Criteria

1. WHEN a user proceeds to checkout THEN the system SHALL display a summary showing product type, formula/package name, and price
2. WHEN displaying Auto checkout THEN the system SHALL show the selected CV range and formula with all included coverages
3. WHEN displaying Moto checkout THEN the system SHALL show the category and formula, indicating if IAC is included
4. WHEN displaying Multirisk Pro checkout THEN the system SHALL show the business type and a link to view full coverage details
5. WHEN IAC is added as an add-on THEN the system SHALL show it as a separate line item with its 5,000 FCFA price
6. WHEN displaying the total THEN the system SHALL show the sum of all selected coverages in FCFA
