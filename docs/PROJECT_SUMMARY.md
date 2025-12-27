# Project Summary

**Last Updated:** December 25, 2024

## Overview

**Website Ecosystem** is a multi-domain Next.js application that serves three distinct websites from a single, unified codebase. This approach provides code reuse, shared components, and centralized development while maintaining separate brand identities.

## Supported Domains

| Domain                | Purpose                         | Target Audience                             |
| --------------------- | ------------------------------- | ------------------------------------------- |
| **matthewmiceli.com** | Personal portfolio and blog     | Potential clients, employers, collaborators |
| **miraclemind.live**  | Live projects and demos         | Users, clients, showcase visitors           |
| **miraclemind.dev**   | Development tools and resources | Developers, technical audience              |

## Tech Stack

### Frontend Layer

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript 5.8 (strict mode enabled)
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4 with PostCSS
- **Icons:** Lucide React
- **Theming:** next-themes (dark mode support)

### Backend & Data Layer

- **API Layer:** tRPC (type-safe APIs)
- **ORM:** Drizzle ORM
- **Database (Development):** SQLite/LibSQL (file-based)
- **Database (Production):** PostgreSQL via Supabase
- **Auth Provider:** Supabase Auth
- **Data Fetching:** TanStack Query

### Development Tools

- **Linting:** ESLint with TypeScript rules
- **Formatting:** Prettier with Tailwind CSS plugin
- **Type Checking:** TypeScript compiler
- **Database Migrations:** Drizzle Kit
- **Environment Validation:** Zod with @t3-oss/env-nextjs
- **Package Manager:** npm 11.5.1

## Architecture

### Dual-Purpose Pattern

The codebase implements a **Workshop + Showcase** architecture with two distinct content strategies:

#### 1. Living Asset Libraries

Permanent public AND private versions of creative assets:

```
PUBLIC (Showcase)          PRIVATE (Workshop)
/shaders                   /admin/shaders
/templates                 /admin/templates
/playground                /admin/playground
```

**Benefits:**

- Safe experimentation without affecting public portfolio
- Continuous improvement in private workspace
- Professional presentation of polished work
- Assets serve dual function as tools AND demonstrations

#### 2. Dev Preview Pages

Temporary private testing for domain homepages:

```
PUBLIC (Live)              PRIVATE (Dev Preview)
/                          /admin/matthewmiceli
                           /admin/miraclemind-live
                           /admin/miraclemind-dev
```

**Benefits:**

- Risk-free testing before deployment
- Component reusability across contexts
- Quick iteration cycle
- Shared codebase ensures consistency

### Multi-Domain Routing

The application uses middleware-based domain detection to serve different content based on the hostname:

- **Production:** Detects actual domain (matthewmiceli.com, miraclemind.live, etc.)
- **Development:** Uses `?domain=` query parameter for local testing
- **Configuration:** Centralized in `src/lib/domains.ts`

## Project Structure

```
website-ecosystem/
├── docs/                          # Project documentation
│   ├── ARCHITECTURE_NOTES.md      # Detailed architecture patterns
│   ├── DEVELOPMENT.md             # Development workflow guide
│   ├── ENV_SETUP.md               # Environment configuration
│   ├── AUTH_SETUP.md              # Authentication setup
│   ├── DATABASE_MIGRATION.md      # Database migration guide
│   ├── SUPABASE_SETUP.md          # Supabase configuration
│   ├── GITHUB_SETUP.md            # CI/CD setup
│   └── DOMAIN_EMAIL_ROUTING.md    # Email routing setup
├── public/
│   └── brand/                     # Brand assets (logos, icons)
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── admin/                 # Private admin/dev routes
│   │   ├── playground/            # Public playground demos
│   │   ├── shaders/               # Public shader showcase
│   │   ├── templates/             # Public template gallery
│   │   ├── api/                   # API routes
│   │   └── page.tsx               # Multi-domain homepage
│   ├── components/
│   │   ├── pages/                 # Domain-specific page components
│   │   ├── playground/            # Playground components
│   │   ├── shaders/               # Shader components
│   │   ├── ui/                    # Reusable UI components
│   │   └── domain-layout.tsx      # Multi-domain layout wrapper
│   ├── lib/
│   │   ├── domains.ts             # Domain configuration
│   │   └── supabase/              # Supabase client setup
│   ├── server/
│   │   ├── api/                   # tRPC routers
│   │   └── db/                    # Database schema & client
│   ├── styles/
│   │   └── globals.css            # Global styles & CSS variables
│   ├── hooks/                     # Custom React hooks
│   ├── trpc/                      # tRPC client setup
│   └── env.js                     # Environment validation
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI pipeline
├── scripts/                       # Setup and utility scripts
├── README.md                      # Quick start guide
├── package.json                   # Dependencies & scripts
├── tsconfig.json                  # TypeScript configuration
├── next.config.js                 # Next.js configuration
├── postcss.config.js              # PostCSS configuration
├── drizzle.config.ts              # Drizzle ORM configuration
└── .env.example                   # Environment variables template
```

## Key Features

### Implemented ✅

- Multi-domain routing with middleware
- Type-safe API layer with tRPC
- Responsive design system with Tailwind CSS
- Database migrations with Drizzle ORM
- Environment variable validation
- Comprehensive development workflow
- Pre-commit quality checks
- Prettier code formatting
- ESLint with TypeScript rules
- Automated build validation
- Database GUI with Drizzle Studio
- Interactive playground with animations
- Component template library
- Shader showcase gallery
- Dark mode support

### Planned 🚧

- User authentication with Supabase
- Content management system
- Analytics integration
- CI/CD pipeline automation
- Email routing for multi-domain setup

## Development Workflow

### Daily Commands

```bash
npm run dev          # Start development server with Turbo
npm run build        # Build for production
npm run start        # Start production server
```

### Code Quality

```bash
npm run format       # Format code with Prettier
npm run lint         # Check for lint errors
npm run lint:fix     # Auto-fix lint errors
npm run typecheck    # Run TypeScript checks
```

### Database

```bash
npm run db:generate  # Generate migrations from schema
npm run db:migrate   # Apply pending migrations
npm run db:push      # Push schema directly (dev only)
npm run db:studio    # Open Drizzle Studio GUI
```

### Quality Pipeline

```bash
npm run pre-commit   # Full quality check before commit
npm run quality-check # Silent quality check
```

## Local Development

### Accessing Different Domains

```bash
# Matthew's site
http://localhost:3000?domain=matthew

# MiracleMind Live
http://localhost:3000?domain=live

# MiracleMind Dev
http://localhost:3000?domain=dev
```

### Admin/Dev Routes

```bash
# Admin dashboard
http://localhost:3000/admin

# Dev previews
http://localhost:3000/admin/matthewmiceli
http://localhost:3000/admin/miraclemind-live
http://localhost:3000/admin/miraclemind-dev

# Asset workshops
http://localhost:3000/admin/shaders
http://localhost:3000/admin/templates
http://localhost:3000/admin/playground
```

## Environment Configuration

### Required Variables

```env
# Supabase (Required for auth)
NEXT_PUBLIC_SUPABASE_URL="your-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Database (Development)
DATABASE_URL="file:./db.sqlite"

# Database (Production)
DATABASE_URL="postgresql://postgres.xxx:[password]@pooler.supabase.com:6543/postgres"
```

See [`docs/ENV_SETUP.md`](./ENV_SETUP.md) for detailed setup instructions.

## Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Configure environment variables
3. Deploy automatically on git push

### Environment Variables for Production

- `DATABASE_URL` - Production PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## Brand Assets

Brand files are located in `public/brand/`:

- **Logos:** `miracle-mind-logo-{black,white,color}.svg`
- **Icons:** `miracle-mind-orbit-star-v3*.svg`
- **Metadata:** `metadata.md` (colors, fonts)
- **Archive:** `Old symbols/` (previous iterations)

### Brand Colors

- Primary: `#facf39` (Golden)
- Secondary: `#393e46` (Dark Gray)

### Brand Fonts

- Wordmark: Airwaves Regular
- Slogan: Bourton Bold

## Documentation

For detailed information, see the [`docs/`](./docs/) directory:

- [ARCHITECTURE_NOTES.md](./docs/ARCHITECTURE_NOTES.md) - In-depth architecture documentation
- [DEVELOPMENT.md](./docs/DEVELOPMENT.md) - Complete development guide
- [ENV_SETUP.md](./docs/ENV_SETUP.md) - Environment setup
- [AUTH_SETUP.md](./docs/AUTH_SETUP.md) - Authentication configuration
- [DATABASE_MIGRATION.md](./docs/DATABASE_MIGRATION.md) - Database migration guide
- [SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md) - Supabase setup
- [GITHUB_SETUP.md](./docs/GITHUB_SETUP.md) - CI/CD configuration
- [DOMAIN_EMAIL_ROUTING.md](./docs/DOMAIN_EMAIL_ROUTING.md) - Email routing setup

## Contributing

Before pushing code:

1. Run `npm run format` to format code
2. Run `npm run lint:fix` to fix lint errors
3. Run `npm run lint` to check for remaining errors
4. Run `npm run typecheck` to verify types
5. Run `npm run build` to ensure build succeeds

Or simply run `npm run pre-commit` to execute all checks at once.

## License

Private project - All rights reserved

---

**Project Initialized:** T3 Stack v7.39.3
**Current Version:** 0.1.0
**Node Version:** 20.x+
**Package Manager:** npm 11.5.1
