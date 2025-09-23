# Auto Claims Estimates AI System

## Overview

This is an AI-powered auto insurance claims processing system built to streamline damage assessment workflows. The application enables insurance claims agents to review AI-generated damage analysis and cost estimates through an intuitive web interface. The system processes vehicle damage photos using computer vision, categorizes damage severity, and provides automated repair cost estimates to accelerate the manual claims review process.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React SPA**: Built with React 18 and TypeScript for type safety
- **Component Library**: Uses shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for consistent theming
- **State Management**: TanStack Query for server state management and API caching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express framework
- **Language**: TypeScript with ESM modules
- **Development Server**: Custom Vite integration for SSR-like development experience
- **API Design**: RESTful endpoints with proper error handling and logging middleware
- **Storage Interface**: Abstracted storage layer with in-memory implementation (designed for future database integration)

### Data Architecture
- **Schema Definition**: Centralized schema using Drizzle ORM with PostgreSQL dialect
- **Type Safety**: Shared TypeScript types between client and server
- **Validation**: Zod schemas for runtime validation and type inference
- **Database Migration**: Drizzle Kit for schema migrations and database management
- **Tables**: Claims, damage items, photos, cost breakdowns, audit logs, and users

### Key Features
- **Photo Management**: Upload and categorization system for damage photos with thumbnail generation
- **AI Damage Detection**: Computer vision analysis with confidence scoring and damage highlighting
- **Cost Estimation**: Automated repair cost calculations with breakdown by category
- **Review Interface**: Unified dashboard for claims agents to review and override AI recommendations
- **Audit Trail**: Comprehensive logging of all claim actions and decisions
- **Priority System**: Claim prioritization with status tracking

### Authentication & Authorization
- Session-based authentication infrastructure prepared (using connect-pg-simple for session storage)
- Role-based access control for claims agents and senior adjustors
- Secure API endpoints with proper middleware chain

## External Dependencies

### Database & Storage
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL
- **Drizzle ORM**: Type-safe database queries and schema management
- **Session Store**: PostgreSQL-based session storage for authentication

### UI & Styling
- **shadcn/ui**: Comprehensive component library built on Radix UI
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Radix UI**: Headless UI primitives for accessibility and behavior
- **Lucide Icons**: Icon library for consistent iconography

### Development & Build Tools
- **Vite**: Fast build tool with HMR and development server
- **TypeScript**: Static type checking across the entire codebase
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer

### API Integration Points
- **Computer Vision Service**: Ready for integration with damage analysis APIs
- **Pricing Databases**: Prepared for Mitchell Database, OEM pricing, and local market data
- **Photo Storage**: Infrastructure for cloud-based image storage and CDN delivery
- **Notification System**: Framework for email and SMS claim updates

### Monitoring & Analytics
- **Error Tracking**: Replit runtime error overlay for development
- **Performance**: Built-in Vite plugins for development monitoring
- **Audit Logging**: Comprehensive action tracking for compliance and debugging