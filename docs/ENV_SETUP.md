# Environment Variables Setup Guide

## Overview

This project uses strict environment variable validation to prevent runtime errors. The setup is minimal and focused on database connectivity.

## Required Environment Variables

### Database

- **DATABASE_URL**: Database connection string
  - Development: `file:./db.sqlite` (SQLite)
  - Production: PostgreSQL connection string (Supabase recommended)

### Optional (Supabase Integration)

- **NEXT_PUBLIC_SUPABASE_URL**: Supabase project URL
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Supabase anonymous key

_Note: Authentication will be handled by Supabase Auth when implementing login functionality_

## Setup Instructions

### 1. Local Development

```bash
# Copy example file
cp .env.example .env

# Fill in required values:
# - DATABASE_URL (use default SQLite for development)
# - Add Supabase credentials when implementing auth/production features
```

### 2. Supabase Setup (for production)

For production deployment and authentication:

1. Create project at https://supabase.com
2. Get your project URL and anon key from Settings > API
3. Configure authentication providers in Supabase dashboard

### 3. Production Deployment (Vercel)

Add these environment variables in Vercel dashboard:

```
DATABASE_URL=<supabase-postgres-url>
# Optional for Supabase integration:
# NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
# NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
```

### 4. CI/CD (GitHub Actions)

Required for build validation:

```yaml
env:
  SKIP_ENV_VALIDATION: "true"
  DATABASE_URL: "file:./db.sqlite"
```

## Authentication Setup

The application is prepared for Supabase Auth integration:

1. **No Active Auth**: Currently no login functionality is implemented
2. **Supabase Ready**: Prepared for Supabase Auth when user features are needed
3. **Comprehensive Auth**: Supabase provides OAuth, email/password, magic links, and more
4. **Database Integrated**: Supabase handles user tables and authentication automatically

Authentication will be implemented with Supabase when user login features are required.

## Troubleshooting

### Build Errors

If you see "Invalid environment variables" errors:

1. **Development**: Ensure `.env` file exists with all required variables
2. **Production**: Check all variables are set in deployment platform
3. **CI/CD**: Use `SKIP_ENV_VALIDATION=true` for build-only environments

### Missing Variables

The error will show exactly which variables are missing. Common issues:

- Empty strings are treated as undefined
- DATABASE_URL required for all environments
- Supabase credentials only needed when implementing auth or using Supabase features

### Quick Fix Commands

```bash
# Generate auth secret
npx auth secret

# Validate current environment
npm run build

# Skip validation for Docker/CI
SKIP_ENV_VALIDATION=1 npm run build
```

## Environment Validation Flow

The app uses `@t3-oss/env-nextjs` for runtime validation:

1. Validates on app startup
2. Ensures type safety
3. Prevents deployment with missing variables
4. Can be skipped with `SKIP_ENV_VALIDATION=1`
