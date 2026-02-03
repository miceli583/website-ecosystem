# Website Ecosystem Project

## Overview
Multi-domain Next.js app serving matthewmiceli.com, miraclemind.dev, and miraclemind.live from a single codebase.

## Quick Commands
```bash
npm run dev              # Start dev server
npm run build            # Build (use SKIP_ENV_VALIDATION=1 if needed)
npm run typecheck        # Type check
npm run db:push          # Push schema to database
bash scripts/install-hooks.sh  # Install git hooks (once after clone)
```

## Architecture
- **Framework**: Next.js 16, React 19, TypeScript
- **Database**: Supabase PostgreSQL via Drizzle ORM
- **Auth**: Supabase Auth
- **API**: tRPC with TanStack Query

## Key Paths
| Path | Purpose |
|------|---------|
| `src/app/` | Next.js App Router pages |
| `src/app/admin/` | Protected admin routes |
| `src/components/pages/` | Domain-specific homepage components |
| `src/server/api/routers/` | tRPC routers |
| `src/server/db/schema.ts` | Database schema |
| `src/lib/domains.ts` | Multi-domain configuration |

## Domain Routing
Middleware detects hostname and serves appropriate content:
- `matthewmiceli.com` → Portfolio
- `miraclemind.dev` → Company site (BANYAN product)
- `miraclemind.live` → Legacy redirect

## Current Status
See `STATUS.md` for feature status and `TODO.md` for tracked work.
