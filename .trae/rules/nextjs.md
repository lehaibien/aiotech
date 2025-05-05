---
description: Next.js with TypeScript and Mantine best practices
globs: **/*.tsx, **/*.ts, src/**/*.ts, src/**/*.tsx
---

# Next.js Best Practices

## Project Structure
- Use the App Router directory structure
- Place components in `app` directory for route-specific components
- Place shared components in `components/core` directory
- Place utilities and helpers in `lib` directory
- Place zod schemas in `schemas` directory
- Place types and zod infer types in `types` directory
- Place page level components and hooks in `features` directory
- Place global hooks in `hooks` directory
- Place global constants in `constants` directory
- Use lowercase with dashes for directories (e.g., `components/auth-wizard`)

## Components
- Use Server Components for heavy rendering
- Use Client Components for interactivity
- Mark client components explicitly with 'use client'
- Wrap client components in Suspense with fallback
- Use dynamic loading for non-critical components
- Implement proper error boundaries
- Place static content and interfaces at file start
- Use TypeScript for type safety
- Use Mantine for UI components and styling


## Performance
- Optimize images: Use WebP format, size data, lazy loading
- Minimize use of 'useEffect' and 'setState'
- Favor Server Components (RSC) where possible
- Use dynamic loading for non-critical components
- Implement proper caching strategies

## Data Fetching
- Use Server Components for data fetching when possible
- Implement proper error handling for data fetching
- Use appropriate caching strategies
- Handle loading and error states appropriately

## Routing
- Use the App Router conventions
- Implement proper loading and error states for routes
- Use dynamic routes appropriately
- Handle parallel routes when needed

## Forms and Validation
- Use React Hook Form for form management
- Use Zod for form validation
- Implement proper server-side validation
- Handle form errors appropriately
- Show loading states during form submission

## State Management
- Minimize client-side state
- Use React Context sparingly
- Prefer server state when possible
- Implement proper loading states
