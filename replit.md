# Aditi Avenues Real Estate Platform

## Overview
This is a modern React-based real estate website for Aditi Avenues, a property development company in Hyderabad. The application uses a full-stack TypeScript architecture with Express.js backend, React frontend, and PostgreSQL database with Drizzle ORM.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: TailwindCSS with custom design system and CSS variables
- **State Management**: TanStack Query for server state management
- **Routing**: React Router DOM for client-side navigation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: In-memory storage (currently using MemStorage class)

### Design System
- **Color Scheme**: Professional blue theme with gold accents
- **Typography**: System fonts with careful hierarchy
- **Components**: Comprehensive UI component library with consistent styling
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

## Key Components

### Database Schema
- **Users Table**: Basic user management with username/password authentication
- **Schema Location**: `shared/schema.ts` using Drizzle schema definitions
- **Migrations**: Handled via Drizzle Kit with migrations stored in `./migrations`

### Frontend Pages
- **Home (Index)**: Hero section with featured projects and company highlights
- **About**: Company information, team members, and values
- **Projects**: Detailed project listings with filtering and status information
- **Amenities**: Showcase of property amenities with categorization
- **Gallery**: Image gallery with filtering by category and project
- **Contact**: Contact form and company information

### UI Components
- **Layout Components**: Header with navigation, Footer with company info
- **Reusable UI**: Cards, buttons, forms, modals, and other interactive elements
- **Icons**: Lucide React for consistent iconography

## Data Flow

### Client-Side Flow
1. React Router handles navigation between pages
2. TanStack Query manages API calls and caching
3. Form submissions use React Hook Form with Zod validation
4. UI state managed through React hooks and context

### Server-Side Flow
1. Express middleware handles request logging and error handling
2. Route handlers process API requests (currently minimal implementation)
3. Storage interface abstracts database operations
4. Database queries executed through Drizzle ORM

### Asset Management
- Static assets served from client/public directory
- Images referenced through asset imports
- Vite handles asset optimization and bundling

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL provider
- **Connection**: WebSocket-based connection for serverless compatibility

### UI Framework
- **Radix UI**: Headless components for accessibility and functionality
- **TailwindCSS**: Utility-first CSS framework
- **Lucide Icons**: Icon library for consistent visual elements

### Development Tools
- **Replit Integration**: Development environment with runtime error overlay
- **TypeScript**: Type safety across the entire stack
- **ESBuild**: Fast production builds for server code

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: ESBuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **Development**: Hot reloading with Vite dev server
- **Production**: Static file serving with Express
- **Database**: Environment variable-based connection string

### Hosting Considerations
- Server code runs on Node.js runtime
- Static assets served efficiently
- Database hosted on Neon serverless platform
- Ready for deployment on platforms like Replit, Vercel, or traditional hosting

### Key Architectural Decisions

**Full-Stack TypeScript**: Chosen for type safety and developer experience across client and server code. This reduces runtime errors and improves maintainability.

**Drizzle ORM**: Selected over traditional ORMs for better TypeScript integration and performance. Provides type-safe database operations with minimal overhead.

**Shadcn/ui Component System**: Offers a comprehensive, accessible component library that can be customized while maintaining consistency. Built on Radix UI for accessibility.

**Neon Serverless Database**: Provides PostgreSQL compatibility with serverless benefits, reducing infrastructure complexity and costs.

**Vite Build System**: Chosen for fast development experience and optimized production builds, replacing traditional webpack-based solutions.

**In-Memory Session Storage**: Currently using memory storage for simplicity, with clear interface for future database integration.

The architecture prioritizes developer experience, type safety, and modern web standards while maintaining flexibility for future enhancements and scaling.