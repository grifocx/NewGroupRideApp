# CycleConnect - Group Cycling Ride Platform

## Overview

CycleConnect is a full-stack web application designed to help cyclists discover and organize group rides. The platform allows users to create cycling events, find rides in their area, join existing groups, and connect with other cycling enthusiasts. The application features an interactive map interface, filtering capabilities, and comprehensive ride management functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

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
**Utils Architecture**: The project follows a modular utility approach with dedicated files for specific functionality:
- **dateHelpers.ts**: Date formatting and manipulation functions
- **rideHelpers.ts**: Ride-specific logic including difficulty styling and data formatting
- **filterHelpers.ts**: Search and filtering logic with type-safe interfaces
- **locationHelpers.ts**: Geolocation and distance calculation utilities
- **mapHelpers.ts**: Leaflet map integration and marker management
- **shareHelpers.ts**: Web Share API with clipboard fallback support

This organization promotes code reusability, easier testing, and better maintainability by separating concerns into focused modules.

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