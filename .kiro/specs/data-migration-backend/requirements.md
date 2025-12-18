# Requirements Document

## Introduction

This document outlines the requirements for migrating hardcoded insurance product data from the mobile application to the backend API and implementing a comprehensive data seeding service. The goal is to centralize all product data in the backend database, making it available to all platforms (mobile, web, and future platforms) while ensuring data consistency and maintainability.

## Glossary

- **System**: The CNAR SUGU insurance application backend API
- **Mobile_App**: The existing React Native mobile application
- **Hardcoded_Data**: Static data currently embedded in the mobile application code
- **Seeder_Service**: A backend service that populates the database with initial data
- **Product_Data**: Insurance products, coverages, formulas, and related information
- **Platform**: Any client application (mobile, web, desktop) that consumes the API
- **Coverage_Formula**: Specific insurance coverage options with pricing tiers
- **Insurance_Package**: A collection of related insurance products
- **Client_Type**: Classification of customers (Particuliers, Entreprise, Both)

## Requirements

### Requirement 1

**User Story:** As a system administrator, I want all insurance product data centralized in the backend database, so that all platforms can access consistent and up-to-date product information.

#### Acceptance Criteria

1. WHEN the system initializes THEN the System SHALL populate the database with all insurance packages from the mobile app's InsurancePacks array
2. WHEN the system initializes THEN the System SHALL populate the database with all auto insurance coverages from the mobile app's COVERAGES_AUTO array
3. WHEN the system initializes THEN the System SHALL populate the database with all multirisque coverages from the mobile app's COVERAGES_MULTI array
4. WHEN the system initializes THEN the System SHALL populate the database with payment method configurations from the mobile app's PAYMENT_METHOD_DATA array
5. WHEN the system initializes THEN the System SHALL populate the database with terms and conditions content from the mobile app's TERMS_AND_CONDITIONS object

### Requirement 2

**User Story:** As a platform developer, I want to retrieve insurance products through API endpoints, so that I can display consistent product information across all platforms.

#### Acceptance Criteria

1. WHEN a platform requests insurance packages THEN the System SHALL return all available insurance packages with their metadata
2. WHEN a platform requests coverage formulas for a specific product type THEN the System SHALL return filtered coverage options based on the product type
3. WHEN a platform requests payment methods THEN the System SHALL return all available payment methods with their service codes
4. WHEN a platform requests terms and conditions THEN the System SHALL return the current terms and conditions content
5. WHEN a platform requests product details by ID THEN the System SHALL return the complete product information including coverage options and pricing

### Requirement 3

**User Story:** As a system administrator, I want a seeder service that can initialize or refresh product data, so that I can maintain data consistency and deploy updates efficiently.

#### Acceptance Criteria

1. WHEN the seeder service runs THEN the System SHALL check if data already exists before inserting new records
2. WHEN the seeder service encounters existing data THEN the System SHALL update existing records with new information while preserving relationships
3. WHEN the seeder service completes THEN the System SHALL log the number of records created, updated, and any errors encountered
4. WHEN the seeder service fails THEN the System SHALL rollback any partial changes and maintain database integrity
5. WHEN the seeder service runs THEN the System SHALL validate all data before insertion to ensure data quality

### Requirement 4

**User Story:** As a platform developer, I want enhanced insurance entities that support all product types and metadata, so that I can build rich user interfaces with complete product information.

#### Acceptance Criteria

1. WHEN storing insurance products THEN the System SHALL include product type classification (Auto, Moto, Multirisque, IAC, etc.)
2. WHEN storing coverage formulas THEN the System SHALL include CV ranges, formula types, and client type restrictions
3. WHEN storing product metadata THEN the System SHALL include icons, background images, coverage links, and descriptions
4. WHEN storing pricing information THEN the System SHALL support both fixed prices and dynamic pricing formulas
5. WHEN storing coverage details THEN the System SHALL maintain the hierarchical relationship between products and their coverage options

### Requirement 5

**User Story:** As a system administrator, I want the seeder service to handle asset references properly, so that all platforms can access product images and documents consistently.

#### Acceptance Criteria

1. WHEN processing asset references THEN the System SHALL convert local asset paths to accessible URLs
2. WHEN storing coverage documents THEN the System SHALL validate that PDF links are accessible
3. WHEN processing product icons THEN the System SHALL ensure icon references are platform-agnostic
4. WHEN handling background images THEN the System SHALL store image references that work across all platforms
5. WHEN assets are missing THEN the System SHALL log warnings but continue processing other data

### Requirement 6

**User Story:** As a platform developer, I want backward compatibility with existing API endpoints, so that current integrations continue to work while new features are added.

#### Acceptance Criteria

1. WHEN existing endpoints are called THEN the System SHALL continue to return data in the expected format
2. WHEN new product data is added THEN the System SHALL ensure existing client applications receive compatible responses
3. WHEN API versions are updated THEN the System SHALL maintain support for previous API versions
4. WHEN data structure changes THEN the System SHALL provide migration paths for existing integrations
5. WHEN new fields are added THEN the System SHALL make them optional to maintain backward compatibility

### Requirement 7

**User Story:** As a system administrator, I want comprehensive logging and monitoring for the seeder service, so that I can track data migration progress and troubleshoot issues.

#### Acceptance Criteria

1. WHEN the seeder service starts THEN the System SHALL log the beginning of the seeding process with timestamp
2. WHEN processing each data category THEN the System SHALL log progress and any validation errors
3. WHEN the seeder service completes THEN the System SHALL log a summary of all operations performed
4. WHEN errors occur during seeding THEN the System SHALL log detailed error information for debugging
5. WHEN data validation fails THEN the System SHALL log specific validation errors with affected records

### Requirement 8

**User Story:** As a platform developer, I want search and filtering capabilities for insurance products, so that I can implement efficient product discovery features.

#### Acceptance Criteria

1. WHEN searching products by type THEN the System SHALL return products filtered by the specified product type
2. WHEN searching products by client type THEN the System SHALL return products available for the specified client category
3. WHEN searching products by price range THEN the System SHALL return products within the specified price bounds
4. WHEN searching products by coverage features THEN the System SHALL return products that include the specified coverage options
5. WHEN no search criteria match THEN the System SHALL return an empty result set with appropriate status information