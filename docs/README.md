# Website Ecosystem

Multi-domain Next.js application serving three websites from a single codebase.

## Domains

| Domain | Purpose | Audience |
|--------|---------|----------|
| **matthewmiceli.com** | Personal portfolio & playground | Clients, employers, collaborators |
| **miraclemind.dev** | Main company site (BANYAN LifeOS) | Developers, early access users |
| **miraclemind.live** | Legacy (redirects to .dev) | Existing users |

## Tech Stack

**Frontend:** Next.js 15, React 19, TypeScript 5.8, Tailwind CSS 4
**Backend:** tRPC, Drizzle ORM, TanStack Query
**Database:** SQLite (dev) / PostgreSQL via Supabase (prod)
**Auth:** Supabase Auth
**Hosting:** Vercel

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start development server
npm run dev
```

Access locally:
- `http://localhost:3000?domain=matthew` - Matthew's site
- `http://localhost:3000?domain=dev` - MiracleMind Dev
- `http://localhost:3000/admin?domain=dev` - Admin dashboard

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/              # Private admin routes
│   ├── playground/         # Public component demos
│   ├── shaders/            # Public shader showcase
│   ├── templates/          # Public template gallery
│   └── page.tsx            # Multi-domain homepage
├── components/
│   ├── pages/              # Domain-specific pages
│   ├── banyan/             # BANYAN product components
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── domains.ts          # Domain configuration
│   └── supabase/           # Supabase client
├── server/
│   ├── api/                # tRPC routers
│   └── db/                 # Database schema
└── styles/                 # Global CSS
```

## Scripts

```bash
# Development
npm run dev              # Start dev server (Turbo)
npm run build            # Production build
npm run start            # Start production server

# Code Quality
npm run format           # Format with Prettier
npm run lint             # Check lint errors
npm run lint:fix         # Auto-fix lint errors
npm run typecheck        # TypeScript checks
npm run pre-commit       # Run all quality checks

# Database
npm run db:generate      # Generate migrations
npm run db:migrate       # Apply migrations
npm run db:push          # Push schema (dev only)
npm run db:studio        # Open Drizzle Studio GUI
```

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture patterns and design decisions
- [SETUP.md](./SETUP.md) - Environment, database, and auth configuration
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development workflow and best practices
- [INFRASTRUCTURE.md](./INFRASTRUCTURE.md) - Domains, email routing, CI/CD, deployment

## Features

- Multi-domain routing with middleware
- Type-safe API layer with tRPC
- Supabase authentication (email/password, magic links)
- Database migrations with Drizzle ORM
- Environment variable validation
- Dark mode support
- Interactive shader gallery
- Component template library

---

**Version:** 0.1.0 | **Node:** 20.x+ | **Package Manager:** npm
