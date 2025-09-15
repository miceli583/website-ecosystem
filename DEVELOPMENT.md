# Development Guide

This guide covers the development workflow, code quality standards, and best practices for the Website Ecosystem project.

## 🚀 Getting Started

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd website-ecosystem

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Validate environment setup
npm run env:validate

# Start development server
npm run dev
```

## 🔄 Development Workflow

### 1. Daily Development

```bash
# Start the development server with Turbo
npm run dev

# Access different domains locally:
# - http://localhost:3000?domain=matthew  (Personal portfolio)
# - http://localhost:3000?domain=live    (MiracleMind Live)
# - http://localhost:3000?domain=dev     (MiracleMind Dev)
```

### 2. Code Quality Checks

Our project enforces strict code quality standards. Here's the recommended workflow:

#### Before Making Changes

```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm install
```

#### During Development

```bash
# Format code as you work (optional but recommended)
npm run format

# Check for lint issues
npm run lint

# Fix auto-fixable lint issues
npm run lint:fix
```

#### Before Committing

**CRITICAL: Always run these checks before committing code:**

```bash
# 1. Format all code with Prettier
npm run format

# 2. Auto-fix lint issues
npm run lint:fix

# 3. Check for remaining lint errors
npm run lint

# 4. Verify TypeScript compilation
npm run typecheck

# 5. Ensure production build works
npm run build
```

#### One-Line Quality Check

```bash
# Run all quality checks in sequence
npm run format && npm run lint:fix && npm run lint && npm run typecheck && npm run build
```

### 3. Git Workflow

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat: add new feature description"

# Push to GitHub (only after quality checks pass)
git push origin main
```

## 📋 Code Quality Standards

### Prettier Configuration

- **Automatic formatting** for consistent code style
- **Tailwind CSS plugin** for class sorting
- **Pre-configured** settings in `.prettierrc`

### ESLint Rules

- **TypeScript-specific** linting rules
- **Next.js best practices** enforcement
- **React hooks** validation
- **Import/export** organization

### TypeScript Checks

- **Strict mode** enabled
- **No implicit any** allowed
- **Unused variables** detection
- **Missing return types** warnings

## 🛠️ Available Scripts

### Development Scripts

```bash
npm run dev              # Start development server with Turbo
npm run build            # Create production build
npm run start            # Start production server
npm run preview          # Build and start production server
```

### Code Quality Scripts

```bash
npm run format           # Format all files with Prettier
npm run format:check     # Check if files are formatted correctly
npm run lint             # Run ESLint on all files
npm run lint:fix         # Auto-fix ESLint errors where possible
npm run typecheck        # Run TypeScript compiler checks
```

### Database Scripts

```bash
npm run db:generate      # Generate migrations from schema changes
npm run db:migrate       # Apply pending migrations to database
npm run db:push          # Push schema directly (development only)
npm run db:studio        # Open Drizzle Studio database GUI
```

### Environment Scripts

```bash
npm run env:validate     # Validate all environment variables
npm run env:setup        # Interactive environment setup wizard
```

## 🏗️ Project Architecture

### File Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── admin/          # Admin dashboard
│   ├── playground/     # UI component playground
│   └── layout.tsx      # Root layout
├── components/
│   ├── domain-layout.tsx    # Multi-domain routing
│   ├── playground/          # Playground components
│   ├── ui/                  # Reusable UI components
│   └── pages/               # Domain-specific components
├── lib/
│   ├── domains.ts           # Domain configuration
│   ├── utils.ts             # Utility functions
│   └── validations/         # Zod schemas
├── server/
│   ├── api/                 # tRPC API routes
│   └── db/                  # Database configuration
└── styles/                  # Global CSS and Tailwind
```

### Domain Configuration

The project supports multiple domains through a configuration system:

```typescript
// lib/domains.ts
export const DOMAINS = {
  MATTHEW_MICELI: "matthewmiceli.com",
  MIRACLE_MIND_LIVE: "miraclemind.live",
  MIRACLE_MIND_DEV: "miraclemind.dev",
};
```

## 🚫 Common Pitfalls

### Avoid These Mistakes

1. **Skipping Quality Checks**

   ```bash
   # ❌ DON'T: Push without running checks
   git add . && git commit -m "fix" && git push

   # ✅ DO: Always run quality checks first
   npm run format && npm run lint && npm run typecheck && npm run build && git add . && git commit -m "fix: descriptive message" && git push
   ```

2. **Ignoring TypeScript Errors**

   ```bash
   # ❌ DON'T: Ignore TypeScript errors
   npm run build # Has type errors but still pushes

   # ✅ DO: Fix all TypeScript errors
   npm run typecheck # Fix all errors before building
   npm run build
   ```

3. **Inconsistent Formatting**

   ```bash
   # ❌ DON'T: Manual formatting
   # Manually spacing and organizing code

   # ✅ DO: Use Prettier
   npm run format # Automatic consistent formatting
   ```

## 🎯 Best Practices

### Code Organization

- **Group related components** in the same directory
- **Use TypeScript interfaces** for all props and data structures
- **Export components** using named exports when possible
- **Keep components small** and focused on single responsibility

### Styling Guidelines

- **Use Tailwind CSS** for all styling
- **Follow the design system** defined in `tailwind.config.ts`
- **Use CSS variables** for theme colors
- **Prefer Tailwind utilities** over custom CSS

### Database Best Practices

- **Always generate migrations** for schema changes
- **Test migrations** in development before production
- **Use Drizzle Studio** to inspect database state
- **Keep migrations atomic** and reversible

### Git Commit Messages

Follow conventional commits format:

```
feat: add new user authentication
fix: resolve mobile navigation issue
docs: update API documentation
style: format code with prettier
refactor: improve database query performance
test: add unit tests for user service
```

## 🔧 Troubleshooting

### Common Issues

#### Build Failures

```bash
# Check for TypeScript errors
npm run typecheck

# Check for lint errors
npm run lint

# Clean and rebuild
rm -rf .next node_modules
npm install
npm run build
```

#### Database Issues

```bash
# Reset local database
rm dev.db
npm run db:migrate

# View database state
npm run db:studio
```

#### Environment Problems

```bash
# Validate environment variables
npm run env:validate

# Reset environment setup
npm run env:setup
```

## 🚀 Deployment

The project automatically deploys to Vercel on push to main, but only if all quality checks pass:

1. **Prettier formatting** ✅
2. **ESLint validation** ✅
3. **TypeScript compilation** ✅
4. **Successful build** ✅

If any check fails, the deployment will be blocked until fixed.

## 📞 Getting Help

- Check the [README.md](./README.md) for basic setup
- Review [environment setup](./ENV_SETUP.md) for configuration issues
- See [GitHub setup](./GITHUB_SETUP.md) for CI/CD problems
- Check [database migration](./DATABASE_MIGRATION.md) for database issues
