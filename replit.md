# CycleConnect - Group Cycling Ride Platform

## Overview

CycleConnect is a full-stack web application designed to help cyclists discover and organize group rides. The platform allows users to create cycling events, find rides in their area, join existing groups, and connect with other cycling enthusiasts. The application features an interactive map interface, filtering capabilities, and comprehensive ride management functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## Core Development Principles

The following software design principles guide all development decisions in this project:

### 1. Separation of Concerns (SoC)
Break programs into distinct parts, each addressing a separate concern.
- **Implementation**: Component structure (JSX), behavior (TypeScript), and presentation (CSS) are properly separated
- **Practice**: React components focus on logic and markup while styling is handled separately
- **Result**: Clear boundaries between different aspects of functionality

### 2. Single Responsibility Principle (SRP)
Each module, class, or function should have only one reason to change.
- **Implementation**: Components have single, well-defined purposes (e.g., `UserProfile` only displays user information)
- **Practice**: Create separate services or utility files for data fetching, authentication, and other concerns
- **Result**: Highly cohesive, focused code that's easier to maintain and test

### 3. Loose Coupling & High Cohesion
Modules should be as independent as possible while elements within a module work closely together.
- **Implementation**: Components are self-contained and communicate via props rather than internal state access
- **Practice**: Avoid tight dependencies between components; use interfaces and abstraction layers
- **Result**: More maintainable and flexible codebase with easier testing and modification

### 4. Don't Repeat Yourself (DRY)
Reduce code duplication by identifying and refactoring repeated patterns.
- **Implementation**: Common functionality extracted into reusable components, hooks, and utility functions
- **Practice**: Button styles, data fetching functions, and validation helpers are centralized
- **Result**: Easier maintenance and consistent behavior across the application

### 5. YAGNI ("You Aren't Gonna Need It")
Avoid over-engineering by implementing only explicitly needed functionality.
- **Implementation**: Focus on current requirements without adding unnecessary complexity
- **Practice**: Don't add architectural patterns or features until they're actually required
- **Result**: Cleaner, simpler codebase that's easier to understand and maintain

## System Architecture

### Frontend Architecture
The client-side is built with **React** using TypeScript and follows a component-based architecture. The UI leverages **Tailwind CSS** for styling with a comprehensive design system including custom CSS variables for theming. The application uses **shadcn/ui** components for consistent, accessible UI elements throughout the platform.

**Key frontend decisions:**
- **React Query (@tanstack/react-query)**: Handles server state management, caching, and data fetching with automatic refetching and error handling
- **Wouter**: Lightweight client-side routing solution instead of React Router for minimal bundle size
- **React Hook Form**: Form state management with Zod validation for type-safe form handling
- **Responsive Design**: Mobile-first approach with dedicated mobile navigation and adaptive layouts
- **Utils Organization**: Major functions extracted into organized utility modules within `client/src/utils/` for better maintainability and reusability

### Backend Architecture
The server is built with **Express.js** following a RESTful API pattern. The architecture separates concerns with dedicated route handlers, storage abstraction, and middleware for logging and error handling.

**Key backend decisions:**
- **Storage Abstraction**: Interface-based storage layer allows switching between in-memory (development) and database implementations
- **Validation**: Uses Zod schemas shared between client and server for consistent data validation
- **Development Setup**: Integrated Vite development server with HMR for seamless full-stack development

### Data Layer
The application uses **Drizzle ORM** with PostgreSQL for data persistence. The schema defines rides and participants with proper relationships and constraints.

**Database design decisions:**
- **UUID Primary Keys**: Uses PostgreSQL's `gen_random_uuid()` for globally unique identifiers
- **Flexible Location Data**: Stores both human-readable addresses and precise coordinates for mapping
- **Recurring Rides**: Built-in support for weekly, monthly, and custom recurring ride patterns
- **Participant Management**: Separate table for ride participants with join timestamps

### State Management
The application employs a hybrid state management approach:
- **Server State**: React Query handles all API data, caching, and synchronization
- **UI State**: React's built-in state management for component-specific state
- **Form State**: React Hook Form manages complex form interactions and validation

### Authentication & Security
Currently implements a simplified authentication system with placeholder user data. The architecture is prepared for full authentication integration with user sessions and role-based access control.

### Code Organization & Maintainability
**Utils Architecture**: The project demonstrates adherence to core design principles through modular utility organization:

**Separation of Concerns Applied**:
- **dateHelpers.ts**: Date formatting and manipulation functions (temporal concerns)
- **rideHelpers.ts**: Ride-specific logic including difficulty styling and data formatting (domain logic)
- **filterHelpers.ts**: Search and filtering logic with type-safe interfaces (search/filter concerns)
- **locationHelpers.ts**: Geolocation and distance calculation utilities (location services)
- **mapHelpers.ts**: Leaflet map integration and marker management (mapping concerns)
- **shareHelpers.ts**: Web Share API with clipboard fallback support (sharing functionality)

**Single Responsibility Principle**: Each utility module handles exactly one domain of functionality, making them focused and maintainable.

**DRY Implementation**: Common functions are extracted into reusable utilities that multiple components can import and use.

**Loose Coupling**: Components import specific utilities without tight dependencies, allowing for easy swapping or modification of implementations.

This architecture promotes code reusability, easier testing, and better maintainability by separating concerns into focused, single-purpose modules.

## External Dependencies

### Database & ORM
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL
- **Drizzle ORM**: Type-safe SQL query builder with automatic migrations
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Maps & Geocoding
- **Leaflet**: Interactive mapping library loaded dynamically from CDN
- **OpenStreetMap**: Map tiles and geocoding services via Nominatim API
- **Geolocation API**: Browser-based user location detection

### UI & Styling
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library with consistent iconography
- **date-fns**: Date manipulation and formatting utilities

### Development Tools
- **Vite**: Build tool and development server with HMR support
- **TypeScript**: Type safety across the entire application stack
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Integration**: Development environment optimizations for Replit platform

### Form & Validation
- **Zod**: Schema validation shared between client and server
- **React Hook Form**: Performance-optimized form state management
- **@hookform/resolvers**: Integration layer for Zod validation with React Hook Form

## Additional Documentation

- **DEVELOPMENT_GUIDE.md**: Comprehensive guide covering core design principles with practical examples and implementation guidelines for maintainable code development
- **CODE_REVIEW_REPORT.md**: Detailed code review report assessing adherence to established principles, with recommendations for future development