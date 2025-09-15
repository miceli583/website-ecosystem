# Website Ecosystem

A multi-domain Next.js application supporting different sites within a single codebase.

## 🌐 Supported Domains

- **matthewmiceli.com** - Personal portfolio and blog
- **miraclemind.live** - Live projects and demos
- **miraclemind.dev** - Development tools and resources

## 🛠️ Tech Stack

- **[Next.js 15](https://nextjs.org)** - React framework with App Router
- **[TypeScript](https://typescriptlang.org)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com)** - Styling with custom design system
- **[tRPC](https://trpc.io)** - Type-safe API layer
- **[Drizzle ORM](https://orm.drizzle.team)** - Database toolkit
- **[Supabase](https://supabase.com)** - Database and auth (when needed)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database URL

# Start development server
npm run dev
```

### Local Development with Domains

Access different domains locally:

- `http://localhost:3000?domain=matthew` - Matthew's site
- `http://localhost:3000?domain=live` - MiracleMind Live
- `http://localhost:3000?domain=dev` - MiracleMind Dev

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── domain-layout.tsx   # Multi-domain layout
│   ├── pages/              # Domain-specific pages
│   └── ui/                 # Shared UI components
├── lib/
│   └── domains.ts          # Domain configuration
├── server/
│   ├── api/                # tRPC routers
│   └── db/                 # Database schema
└── styles/                 # Global styles
```

## 🗄️ Database

- **Development**: SQLite (file-based)
- **Production**: PostgreSQL via Supabase
- **ORM**: Drizzle with automatic migrations

```bash
# Generate migrations
npm run db:generate

# Apply migrations
npm run db:migrate

# View database
npm run db:studio
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Set environment variables:
   ```
   DATABASE_URL=your-production-database-url
   ```
3. Deploy automatically on git push

### Environment Variables

See [`ENV_SETUP.md`](./ENV_SETUP.md) for detailed setup instructions.

## 📚 Documentation

- **[Development Guide](./DEVELOPMENT.md)** - Complete development workflow and best practices
- **[Environment Setup](./ENV_SETUP.md)** - Configure env variables
- **[GitHub Setup](./GITHUB_SETUP.md)** - CI/CD and deployment
- **[Database Migration](./DATABASE_MIGRATION.md)** - Moving to production DB
- **[Supabase Setup](./SUPABASE_SETUP.md)** - Production database setup

## 🔧 Development Workflow

### Daily Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

### Code Quality & Formatting

```bash
# Format code with Prettier
npm run format              # Format all files
npm run format:check        # Check formatting without changing files

# Linting with ESLint
npm run lint                # Check for lint errors
npm run lint:fix            # Auto-fix lint errors where possible

# Type checking
npm run typecheck           # Run TypeScript compiler checks
```

### Pre-Push Quality Checks

**Before pushing code to GitHub, always run these commands in order:**

```bash
# 1. Format code
npm run format

# 2. Fix any linting issues
npm run lint:fix

# 3. Check for remaining lint errors
npm run lint

# 4. Verify TypeScript types
npm run typecheck

# 5. Ensure build succeeds
npm run build
```

### Automated Quality Pipeline

For consistent code quality, we provide convenient scripts:

```bash
# Option 1: Use the pre-commit script (recommended)
npm run pre-commit

# Option 2: One-line quality check
npm run quality-check

# Option 3: Manual commands
npm run format && npm run lint:fix && npm run lint && npm run typecheck && npm run build
```

The `pre-commit` script provides verbose output and guidance, while `quality-check` runs silently.

### Database Commands

```bash
npm run db:generate     # Generate migrations from schema changes
npm run db:migrate      # Apply pending migrations
npm run db:push         # Push schema directly (development only)
npm run db:studio       # Open Drizzle Studio (database GUI)
```

### Environment Commands

```bash
npm run env:validate    # Validate environment variables
npm run env:setup       # Interactive environment setup
```

## 🎯 Features

### Core Features
- ✅ Multi-domain routing
- ✅ Type-safe API with tRPC
- ✅ Responsive design system
- ✅ Database migrations with Drizzle
- ✅ Environment validation
- ✅ Clean architecture (NextAuth.js removed)

### Development Experience
- ✅ **Comprehensive development workflow** with quality checks
- ✅ **Pre-commit scripts** for code quality enforcement
- ✅ **Prettier formatting** with Tailwind CSS plugin
- ✅ **ESLint configuration** with TypeScript rules
- ✅ **Automated build validation** before deployment
- ✅ **Database GUI** with Drizzle Studio

### UI/UX Showcase
- ✅ **Interactive playground** with Svelte-inspired animations
- ✅ **Component templates** for developers, SaaS, and startups
- ✅ **Advanced animations** including text shimmer, morphing buttons, meteor effects
- ✅ **Responsive design system** with dark mode support

### Planned Features
- 🚧 User authentication (planned with Supabase)
- 🚧 Content management system
- 🚧 Analytics integration
- 🚧 CI/CD pipeline automation
