# Requirements Document

## Introduction

This document outlines the requirements for modernizing the CNAR Sugu insurance platform by separating the web frontend from React Native Web to a dedicated Next.js application, while simultaneously updating the mobile application to use modern React Native practices. The goal is to create an enterprise-grade, performant, and maintainable multi-platform insurance subscription system.

## Glossary

- **WebApp**: The Next.js web application for desktop and tablet users
- **MobileApp**: The React Native mobile application for iOS and Android
- **API**: The existing NestJS backend service
- **Insurance Product**: A specific insurance offering (Auto, Multirisque, Travel, etc.)
- **Coverage**: A specific insurance plan within a product category
- **Subscription**: A user's enrollment in an insurance coverage with payment
- **Mobile Money**: Payment services including Orange Money, Moov Money, Wave, and TouchPoint
- **Client**: A user subscribing to insurance (individual or enterprise)

## Requirements

### Requirement 1

**User Story:** As a web user, I want to browse and select insurance products on a modern, fast-loading website, so that I can easily understand my insurance options.

#### Acceptance Criteria

1. WHEN a user visits the WebApp homepage THEN the system SHALL display all available insurance products with descriptions and icons within 2 seconds
2. WHEN a user selects an insurance product THEN the system SHALL navigate to the coverage selection page and display available coverage options
3. WHEN the WebApp loads any page THEN the system SHALL render server-side content for SEO optimization
4. WHEN a user interacts with the interface THEN the system SHALL provide smooth transitions and animations
5. WHEN a user views the site on different screen sizes THEN the system SHALL adapt the layout responsively

### Requirement 2

**User Story:** As a mobile user, I want to use an updated native mobile app with modern UI patterns, so that I have a smooth and intuitive experience.

#### Acceptance Criteria

1. WHEN a user opens the MobileApp THEN the system SHALL display the insurance products using modern React Native components
2. WHEN a user navigates between screens THEN the system SHALL use optimized navigation with proper transitions
3. WHEN the MobileApp renders lists THEN the system SHALL use virtualized lists for performance
4. WHEN a user interacts with forms THEN the system SHALL provide native keyboard handling and validation feedback
5. WHEN the MobileApp loads data THEN the system SHALL display loading states and handle errors gracefully

### Requirement 3

**User Story:** As a client, I want to enroll in insurance coverage by providing my personal or company information, so that I can complete my subscription.

#### Acceptance Criteria

1. WHEN a client selects a coverage plan THEN the system SHALL navigate to the enrollment form
2. WHEN a client is an individual THEN the system SHALL collect name, surname, phone number, and optional activity field
3. WHEN a client is an enterprise THEN the system SHALL collect company name, address, owner name, and activity
4. WHEN a client submits incomplete information THEN the system SHALL prevent submission and display validation errors
5. WHEN a client completes the enrollment form THEN the system SHALL store the information and proceed to payment

### Requirement 4

**User Story:** As a client, I want to pay for my insurance subscription using mobile money services, so that I can complete my purchase conveniently.

#### Acceptance Criteria

1. WHEN a client reaches the payment screen THEN the system SHALL display available payment methods (Orange Money, Moov Money, Wave, TouchPoint)
2. WHEN a client selects a mobile money payment method THEN the system SHALL prompt for the phone number
3. WHEN a client submits payment information THEN the system SHALL initiate the payment transaction with the API
4. WHEN the payment is initiated THEN the system SHALL receive a payment ID and store it with the subscription
5. WHEN the payment transaction completes THEN the system SHALL update the payment status and display confirmation

### Requirement 5

**User Story:** As a developer, I want the WebApp and MobileApp to share common business logic and API integration, so that we maintain consistency and reduce duplication.

#### Acceptance Criteria

1. WHEN either application makes an API request THEN the system SHALL use shared TypeScript API client functions
2. WHEN either application handles payment data THEN the system SHALL use shared payment processing logic
3. WHEN either application validates form data THEN the system SHALL use shared validation schemas
4. WHEN either application manages state THEN the system SHALL use consistent state management patterns
5. WHEN either application handles errors THEN the system SHALL use shared error handling utilities

### Requirement 6

**User Story:** As a developer, I want the WebApp to use modern Next.js features, so that we achieve optimal performance and developer experience.

#### Acceptance Criteria

1. WHEN the WebApp builds THEN the system SHALL use Next.js App Router for routing
2. WHEN the WebApp renders pages THEN the system SHALL use React Server Components where appropriate
3. WHEN the WebApp loads images THEN the system SHALL use Next.js Image component for optimization
4. WHEN the WebApp fetches data THEN the system SHALL implement proper caching strategies
5. WHEN the WebApp deploys THEN the system SHALL support incremental static regeneration for dynamic content

### Requirement 7

**User Story:** As a developer, I want the MobileApp to use modern React Native architecture, so that we have better performance and maintainability.

#### Acceptance Criteria

1. WHEN the MobileApp initializes THEN the system SHALL use React Native 0.74 or later with new architecture enabled
2. WHEN the MobileApp navigates THEN the system SHALL use React Navigation 6+ with TypeScript types
3. WHEN the MobileApp manages state THEN the system SHALL use Zustand or TanStack Query for state management
4. WHEN the MobileApp styles components THEN the system SHALL use a consistent design system (NativeWind or Tamagui)
5. WHEN the MobileApp handles forms THEN the system SHALL use React Hook Form with Zod validation

### Requirement 8

**User Story:** As a system administrator, I want both applications to communicate with the existing API securely, so that user data remains protected.

#### Acceptance Criteria

1. WHEN either application makes an API request THEN the system SHALL use HTTPS protocol
2. WHEN either application authenticates THEN the system SHALL store tokens securely (httpOnly cookies for web, secure storage for mobile)
3. WHEN either application sends sensitive data THEN the system SHALL validate and sanitize inputs
4. WHEN the API returns errors THEN the system SHALL handle them gracefully without exposing internal details
5. WHEN either application stores user data locally THEN the system SHALL encrypt sensitive information

### Requirement 9

**User Story:** As a product owner, I want the WebApp to have improved UI/UX with modern design patterns, so that users have a premium experience.

#### Acceptance Criteria

1. WHEN a user views any page THEN the system SHALL use a consistent design system with proper spacing and typography
2. WHEN a user interacts with elements THEN the system SHALL provide visual feedback (hover states, loading indicators)
3. WHEN a user navigates THEN the system SHALL show progress indicators for multi-step flows
4. WHEN a user encounters errors THEN the system SHALL display user-friendly error messages with recovery options
5. WHEN a user completes actions THEN the system SHALL provide confirmation feedback with animations

### Requirement 10

**User Story:** As a developer, I want comprehensive TypeScript types across both applications, so that we catch errors at compile time and improve code quality.

#### Acceptance Criteria

1. WHEN code is written THEN the system SHALL enforce strict TypeScript configuration
2. WHEN API responses are received THEN the system SHALL validate them against TypeScript interfaces
3. WHEN components are created THEN the system SHALL define proper prop types
4. WHEN state is managed THEN the system SHALL use typed state management solutions
5. WHEN the code builds THEN the system SHALL have zero TypeScript errors

### Requirement 11

**User Story:** As a developer, I want automated testing infrastructure, so that we can ensure code quality and prevent regressions.

#### Acceptance Criteria

1. WHEN code is committed THEN the system SHALL run unit tests for business logic
2. WHEN components are created THEN the system SHALL have component tests using React Testing Library
3. WHEN API integration is implemented THEN the system SHALL have integration tests with mocked responses
4. WHEN critical user flows exist THEN the system SHALL have end-to-end tests using Playwright (web) or Detox (mobile)
5. WHEN tests run THEN the system SHALL generate coverage reports with minimum 70% coverage for critical paths

### Requirement 12

**User Story:** As a developer, I want the project to use modern build tools and package management, so that we have fast builds and reliable dependencies.

#### Acceptance Criteria

1. WHEN the WebApp builds THEN the system SHALL use Turbopack or optimized Webpack configuration
2. WHEN dependencies are installed THEN the system SHALL use pnpm or yarn with workspace support
3. WHEN code is bundled THEN the system SHALL implement code splitting and tree shaking
4. WHEN the project structure is organized THEN the system SHALL use a monorepo structure with shared packages
5. WHEN builds run THEN the system SHALL complete in under 30 seconds for development mode
