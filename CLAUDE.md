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

| Path                      | Purpose                             |
| ------------------------- | ----------------------------------- |
| `src/app/`                | Next.js App Router pages            |
| `src/app/admin/`          | Protected admin routes              |
| `src/components/pages/`   | Domain-specific homepage components |
| `src/server/api/routers/` | tRPC routers                        |
| `src/server/db/schema.ts` | Database schema                     |
| `src/lib/domains.ts`      | Multi-domain configuration          |

## Domain Routing

Middleware detects hostname and serves appropriate content:

- `matthewmiceli.com` → Portfolio
- `miraclemind.dev` → Company site (BANYAN product)
- `miraclemind.live` → Legacy redirect

## Brand Reference

### Palette

| Token                | Value                                                                           | Usage                                |
| -------------------- | ------------------------------------------------------------------------------- | ------------------------------------ |
| Primary Gold         | `#D4AF37`                                                                       | Accents, icons, active states, hover |
| Light Gold           | `#F6E6C1`                                                                       | Gradient start, light accents        |
| Gold Gradient        | `linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)`                             | Buttons, headings, CTAs              |
| Gold Border          | `rgba(212, 175, 55, 0.2)`                                                       | Card borders, dividers               |
| Gold Border Emphasis | `rgba(212, 175, 55, 0.3)` to `0.4`                                              | Info banners, active states          |
| Gold Icon BG         | `linear-gradient(135deg, rgba(246,230,193,0.1) 0%, rgba(212,175,55,0.15) 100%)` | Icon containers                      |
| Card BG              | `bg-white/5`                                                                    | Dark cards                           |
| Card Hover           | `bg-white/10`                                                                   | Card hover state                     |
| Page BG              | `bg-black`                                                                      | Root background                      |
| Divider              | `linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)`     | Section dividers                     |

### Typography

| Element     | Font                             | Weight | Extra                                       |
| ----------- | -------------------------------- | ------ | ------------------------------------------- |
| Page titles | Quattrocento Sans, serif         | bold   | `letterSpacing: 0.08em`, gold gradient fill |
| Subtitles   | Barlow, sans-serif               | 300    | —                                           |
| Body text   | Geist, -apple-system, sans-serif | normal | —                                           |

### Off-brand Patterns

- Tailwind `yellow-*` classes (should use exact `#D4AF37`)
- Tailwind `blue-*` classes (unless neutral gray-blue in borders)
- Tailwind `teal-*`, `cyan-*`, `green-*` classes (unless in slide badges)
- Tailwind `orange-*`, `purple-*`, `indigo-*` classes
- Tailwind `amber-*` outside of slide badge context
- `border-gray-800` on black backgrounds (blue tint — use gold rgba border)
- Hex colors not in approved palette (excluding standard grays)
- `fontFamily` values not referencing Quattrocento Sans, Barlow, or Geist

### Exceptions

- `src/app/portal/**/slides/` — multi-color badges (amber, emerald, sky, rose, violet, fuchsia, teal) for slide type differentiation
- `src/app/portal/**/frontend/` — client demo implementations use client branding
- `src/app/portal/**/presentation/` — slide content uses its own styling
- `text-red-500`, `text-red-400`, `bg-red-500/10` — error/danger states
- `green-*` classes (`text-green-*`, `bg-green-*`) — success states (e.g., active status, confirmation)
- `amber-*` classes (`text-amber-*`, `bg-amber-*`) — warning/pending states (e.g., pending badges)
- `src/lib/staging-templates.ts` — palette definition file itself

### Scan Scope

- **Include**: `src/app/portal/`, `src/components/portal/`, `src/app/admin/login/`
- **Skip**: `node_modules/`, `.next/`, `src/lib/staging-templates.ts`

## Shared Configs (Single Source of Truth)

Before hardcoding labels, options, or config — check these shared modules first. Never duplicate across files.

| File                       | Purpose                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------- |
| `src/lib/permissions.ts`   | Company roles (`COMPANY_ROLES`), nav visibility (`NAV_VISIBILITY`), access helpers  |
| `src/lib/source-labels.ts` | CRM source options and labels (`SOURCE_OPTIONS`, `SOURCE_LABELS`, `getSourceLabel`) |
| `src/server/db/schema.ts`  | All table definitions, relations, and type exports                                  |
| `form_registry` table      | Dynamic form metadata (names, URLs) — used by leads page                            |

### UI Pattern Standards

| Pattern                       | Standard                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------- |
| Select chevron                | `pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500` |
| Select padding (with chevron) | `appearance-none ... pr-9 pl-3`                                                       |
| Team member picker            | Use `TeamMemberPicker` component (in `crm/contacts/page.tsx`) — searchable, reusable  |
| Role selector                 | Use `RoleSelect` component (in `organization/page.tsx`) — multi-select checkboxes     |

### Adding New Shared Data

1. Check if a shared config already exists in `src/lib/`
2. If data appears in 2+ files, extract to `src/lib/<topic>.ts`
3. If data changes at runtime, use a DB table (like `form_registry`)
4. Update this section when adding new shared configs

## Current Status

See `STATUS.md` for feature status and `TODO.md` for tracked work.
