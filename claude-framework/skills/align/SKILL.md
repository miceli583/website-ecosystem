---
name: align
description: Align an existing project with the unified tech stack and standards
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, AskUserQuestion
---

# Align Existing Project

Incrementally upgrade an existing project to match the unified development framework. Non-destructive - works with what's already there.

## Purpose

Unlike `/seed` (creates new projects) or `/init-standards` (adds docs only), `/align` analyzes an existing codebase and offers to add missing patterns, upgrade configurations, and standardize code to match the framework.

## When to Use

- Existing project missing some unified stack components
- Project needs tRPC, Drizzle, or Supabase auth added
- Want to adopt error handling patterns, SEO setup, etc.
- Upgrading an older project to current standards

## Steps

### 1. Analyze Current Stack

Scan the project to understand what exists:

```bash
# Check package.json for existing dependencies
cat package.json

# Check for existing patterns
ls -la src/server/ src/lib/ src/trpc/ 2>/dev/null
ls -la drizzle.config.* 2>/dev/null

# Check for documentation
ls -la CLAUDE.md STATUS.md TODO.md 2>/dev/null
```

Build a checklist of what's present vs missing.

### 2. Present Gap Analysis

Show the user what's already there and what could be added:

```
## Project Analysis: <project-name>

### Already Present
- [x] Next.js 15+ (detected: 16.1.1)
- [x] TypeScript
- [x] Tailwind CSS
- [ ] tRPC - not found
- [ ] Drizzle ORM - not found
- [x] Supabase client - found
- [ ] Supabase Auth middleware - not found
- [ ] Error handling pattern - not found
- [x] CLAUDE.md - exists
- [ ] TODO.md semantic structure - needs update

### Recommended Additions
1. Add tRPC + TanStack Query (API layer)
2. Add Drizzle ORM (type-safe database)
3. Add error handling pattern (src/lib/errors.ts)
4. Add SEO metadata template
5. Standardize TODO.md structure

Which would you like to add? (select multiple or 'all')
```

### 3. Interactive Selection

Ask user which components to add:

**Core Infrastructure:**

```
Add tRPC + TanStack Query? [y/N]
  - Creates src/server/api/ structure
  - Adds src/trpc/ client setup
  - Installs @trpc/*, @tanstack/react-query

Add Drizzle ORM? [y/N]
  - Creates src/server/db/ structure
  - Adds drizzle.config.ts
  - Installs drizzle-orm, drizzle-kit

Add/Update Supabase Auth? [y/N]
  - Creates src/lib/supabase/ helpers
  - Adds middleware.ts auth protection
  - Ensures proper cookie handling
```

**Patterns & Utilities:**

```
Add error handling pattern? [y/N]
  - Creates src/lib/errors.ts
  - AppError class, ErrorCodes, createError factories

Add SEO metadata template? [y/N]
  - Updates src/app/layout.tsx with full metadata
  - Adds OpenGraph, Twitter cards, viewport

Add environment validation? [y/N]
  - Creates src/env.js with @t3-oss/env-nextjs
  - Type-safe env vars
```

**Documentation:**

```
Add/Update project documentation? [y/N]
  - Runs /init-standards if docs missing
  - Updates TODO.md to semantic structure if needed
```

### 4. Check for Conflicts

Before adding each component, check for conflicts:

```typescript
// Example: Before adding tRPC
if (existsSync("src/server/api/trpc.ts")) {
  // Ask: "tRPC setup exists. Overwrite, merge, or skip?"
}

if (packageJson.dependencies["@trpc/server"]) {
  // Ask: "tRPC already installed (version X). Upgrade to Y?"
}
```

### 5. Apply Selected Changes

For each selected addition:

**tRPC:**

1. Install dependencies: `npm install @trpc/server @trpc/client @trpc/react-query @tanstack/react-query superjson`
2. Copy from templates:
   - `~/.claude/templates/seed/src/server/api/trpc.ts`
   - `~/.claude/templates/seed/src/server/api/root.ts`
   - `~/.claude/templates/seed/src/server/api/routers/example.ts`
   - `~/.claude/templates/seed/src/trpc/react.tsx`
   - `~/.claude/templates/seed/src/trpc/server.ts`
   - `~/.claude/templates/seed/src/trpc/query-client.ts`
3. Add TRPCReactProvider to layout.tsx (merge with existing providers)
4. Create API route: `src/app/api/trpc/[trpc]/route.ts`

**Drizzle:**

1. Install: `npm install drizzle-orm postgres` + `npm install -D drizzle-kit`
2. Copy templates:
   - `~/.claude/templates/seed/src/server/db/index.ts`
   - `~/.claude/templates/seed/src/server/db/schema.ts` (as starting point)
   - `~/.claude/templates/seed/drizzle.config.ts`
3. Update .env.example with DATABASE_URL
4. Add db scripts to package.json

**Supabase Auth:**

1. Install: `npm install @supabase/ssr @supabase/supabase-js`
2. Copy templates:
   - `~/.claude/templates/seed/src/lib/supabase/client.ts`
   - `~/.claude/templates/seed/src/lib/supabase/server.ts`
   - `~/.claude/templates/seed/src/lib/supabase/middleware.ts`
3. Create/update `src/middleware.ts`
4. Update .env.example with Supabase vars

**Error Handling:**

1. Copy `~/.claude/templates/seed/src/lib/errors.ts`
2. No dependencies needed (uses existing zod, @trpc/server)

**SEO Metadata:**

1. Read existing layout.tsx
2. Merge metadata object with template
3. Add viewport export if missing
4. Preserve existing customizations

**Environment Validation:**

1. Install: `npm install @t3-oss/env-nextjs zod`
2. Copy `~/.claude/templates/seed/src/env.js`
3. Update imports in files that use process.env

### 6. Update Dependencies

After all additions, run:

```bash
npm install
```

Check for peer dependency warnings and resolve.

### 7. Verify Integration

For each added component, verify it works:

```bash
# Type check
npm run typecheck

# If tRPC added, verify server starts
npm run dev &
sleep 5
curl http://localhost:3000/api/trpc/example.hello?input=%7B%22text%22%3A%22test%22%7D
```

### 8. Report Results

```
## Alignment Complete

### Added
- [x] tRPC + TanStack Query
  - src/server/api/ (trpc.ts, root.ts, routers/)
  - src/trpc/ (react.tsx, server.ts, query-client.ts)
  - src/app/api/trpc/[trpc]/route.ts

- [x] Error handling pattern
  - src/lib/errors.ts

- [x] SEO metadata
  - Updated src/app/layout.tsx

### Skipped (already present)
- Supabase client
- Tailwind CSS

### Dependencies Installed
- @trpc/server@11.0.0
- @trpc/client@11.0.0
- @trpc/react-query@11.0.0
- @tanstack/react-query@5.69.0

### Next Steps
1. Run `npm run dev` to verify everything works
2. Review src/server/api/routers/example.ts for CRUD patterns
3. Customize src/server/db/schema.ts for your data model
4. Run `npm run db:push` after configuring DATABASE_URL

### Verification
npm run typecheck  # Should pass
npm run dev        # Should start without errors
```

## Non-Destructive Principles

1. **Never delete existing code** - Only add or merge
2. **Preserve customizations** - When merging (e.g., layout.tsx), keep existing content
3. **Ask before overwriting** - If file exists, always ask
4. **Backup option** - Offer to create .bak files before modifying
5. **Incremental** - User can add one thing at a time

## Difference from Other Skills

| Skill             | Purpose                                          |
| ----------------- | ------------------------------------------------ |
| `/seed`           | Create new project from scratch                  |
| `/init-standards` | Add documentation files only                     |
| `/align`          | Add missing stack components to existing project |
| `/validate`       | Check if project follows standards (read-only)   |

## Edge Cases

- **Monorepo**: Ask which package to align
- **Different React version**: Warn about compatibility
- **Existing but outdated patterns**: Offer to upgrade vs. keep
- **Conflicting patterns**: Show diff, let user decide
- **No package.json**: Error - not a Node.js project
