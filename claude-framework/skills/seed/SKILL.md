---
name: seed
description: Scaffold a new project with the unified tech stack
allowed-tools: Read, Write, Edit, Bash, Glob, AskUserQuestion
---

# Seed New Project

Interactively scaffold a new project based on the unified tech stack (Next.js, tRPC, Drizzle, Supabase, shadcn/ui).

## Overview

Creates a brand-agnostic, fully-configured project with:

- Next.js 16 + React 19 + TypeScript
- tRPC 11 + TanStack Query
- Drizzle ORM + Supabase (PostgreSQL)
- Supabase Auth
- Tailwind CSS 4 + shadcn/ui
- Unified documentation standards
- Optional features (shaders, multi-domain, etc.)

## Steps

### 1. Interactive Configuration

Ask the user for project details:

**Required:**

```
Project name? (e.g., "my-awesome-app")
Project description? (one sentence)
Author name? (for metadata/credits)
Target directory? (default: ../<project-name>)
```

**SEO/Metadata (optional but recommended):**

```
Production URL? (e.g., "https://myapp.com" - for OpenGraph/SEO, can set later)
Twitter handle? (e.g., "@myhandle" - optional, for Twitter cards)
```

**Tech Options:**

```
Include GLSL shader support? [y/N]
Include multi-domain routing? [y/N]
Include example tRPC routers? [Y/n]
Include example database schema? [Y/n]
```

**Auth Options:**

```
Auth type?
  1. Email/password only (default)
  2. Email/password + OAuth (Google, GitHub)
  3. Magic links only
  4. No auth (public app)
```

**UI Options:**

```
Include full shadcn/ui component library? [Y/n]
Include example pages (landing, dashboard, settings)? [Y/n]
Dark mode support? [Y/n]
```

**Documentation:**

```
Create ROADMAP.md for phased development? [y/N]
```

### 2. Validate Target Directory

```bash
# Check if directory exists
if [ -d "<target>" ]; then
  echo "Directory exists. Overwrite? [y/N]"
fi

# Check parent directory exists
ls -la "$(dirname <target>)"
```

### 3. Create Project Structure

```
<project-name>/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── trpc/[trpc]/route.ts
│   │   ├── (auth)/           # If auth enabled
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── callback/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   └── ui/               # shadcn/ui components
│   ├── lib/
│   │   ├── supabase/         # If auth enabled
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   └── utils.ts
│   ├── server/
│   │   ├── api/
│   │   │   ├── trpc.ts
│   │   │   ├── root.ts
│   │   │   └── routers/
│   │   │       └── example.ts
│   │   └── db/
│   │       ├── index.ts
│   │       └── schema.ts
│   ├── trpc/
│   │   ├── react.tsx
│   │   ├── server.ts
│   │   └── query-client.ts
│   ├── middleware.ts         # If auth or multi-domain
│   └── env.js
├── public/
│   └── brand/                # Empty, ready for assets
├── shaders/                  # If shader support enabled
│   └── example.glsl
├── drizzle/
├── docs/
│   └── archive/
├── .env.example
├── .gitignore
├── CLAUDE.md
├── STATUS.md
├── TODO.md
├── ROADMAP.md                # If requested
├── README.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── drizzle.config.ts
├── next.config.js
├── components.json           # shadcn/ui config
└── eslint.config.mjs
```

### 4. Generate Core Files

**package.json:**

- Name and description from user input
- All standard dependencies
- Standard scripts (dev, build, db:push, db:studio, typecheck)

**CLAUDE.md:**

- Project-specific instructions
- Quick commands
- Key paths
- Generated based on selected options

**.env.example:**

```bash
# Database
DATABASE_URL="postgresql://..."

# Supabase (if auth enabled)
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# App
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NODE_ENV="development"
```

**README.md:**

```markdown
# <Project Name>

<Description>

## Getting Started

1. Copy `.env.example` to `.env` and fill in values
2. `npm install`
3. `npm run db:push` (if using database)
4. `npm run dev`

## Tech Stack

- Next.js 16 + React 19
- tRPC + TanStack Query
- Drizzle ORM + Supabase
- Tailwind CSS + shadcn/ui

## Documentation

- [STATUS.md](./STATUS.md) - Current feature status
- [TODO.md](./TODO.md) - Tracked work items
- [CLAUDE.md](./CLAUDE.md) - AI assistant context
```

### 5. Conditional Features

**If multi-domain enabled:**

- Add `src/lib/domains.ts` with domain configuration template
- Add domain detection to middleware
- Add example domain configs (localhost variants for dev)

**If shaders enabled:**

- Add `shaders/` directory with example GLSL files
- Add `src/components/shaders/shadertoy-renderer.tsx`
- Add WebGL types to tsconfig

**If OAuth enabled:**

- Add OAuth provider configuration
- Add callback route handlers
- Update .env.example with OAuth secrets

### 6. Initialize Git

```bash
cd <target>
git init
git add -A
git commit -m "Initial scaffold from seed

Tech stack:
- Next.js 16 + React 19 + TypeScript
- tRPC 11 + Drizzle ORM + Supabase
- Tailwind CSS 4 + shadcn/ui

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### 7. Brand Setup (Optional)

After scaffolding, ask:

```
Set up brand guidelines for this project? [y/N]
```

If yes, suggest running `/brand init` to interactively define a color palette, typography, and scan scope. This adds a `## Brand Reference` section to the project's CLAUDE.md.

If no, note in the report: "Run `/brand init` later to set up brand guidelines."

### 8. Report Results

```
## Project Scaffolded

**Location:** <absolute-path>
**Name:** <project-name>

### Included Features
- [x] Next.js 16 + React 19 + TypeScript
- [x] tRPC 11 + TanStack Query
- [x] Drizzle ORM + Supabase
- [x] Tailwind CSS 4 + shadcn/ui
- [x] Documentation standards (CLAUDE.md, STATUS.md, TODO.md)
- [x/blank] GLSL shader support
- [x/blank] Multi-domain routing
- [x/blank] OAuth providers
- [x/blank] ROADMAP.md

### Next Steps

1. cd <path>
2. Copy .env.example to .env and configure:
   - Create Supabase project at https://supabase.com
   - Add DATABASE_URL
   - Add Supabase keys
3. npm install
4. npm run db:push
5. npm run dev

### Available Commands

npm run dev        # Start development server
npm run build      # Production build
npm run db:push    # Push schema to database
npm run db:studio  # Open Drizzle Studio
npm run typecheck  # Type check without building
```

## Source Templates

Templates are stored in `~/.claude/templates/seed/` and include:

- Configuration files (package.json, tsconfig, etc.)
- Server code (tRPC, Drizzle schema)
- Client code (providers, utilities)
- Documentation templates (CLAUDE.md, STATUS.md, TODO.md, README.md)

## Template Placeholders

Replace these when scaffolding:

| Placeholder               | Source                | Used In                        |
| ------------------------- | --------------------- | ------------------------------ |
| `{{PROJECT_NAME}}`        | User input (required) | package.json, layout.tsx, docs |
| `{{PROJECT_DESCRIPTION}}` | User input (required) | package.json, layout.tsx, docs |
| `{{AUTHOR_NAME}}`         | User input (required) | layout.tsx metadata            |
| `{{BASE_URL}}`            | User input or default | layout.tsx OpenGraph/SEO       |
| `{{DATE}}`                | Auto-generated        | STATUS.md                      |

## SEO Out of the Box

The scaffold includes production-ready metadata:

- OpenGraph tags (Facebook, LinkedIn sharing)
- Twitter cards (summary_large_image)
- Robots directives
- Viewport configuration
- Favicon setup (add files to public/)

## Notes

- Generated projects are completely standalone
- No symlinks or references to source templates
- All brand assets directories are empty (ready for new branding)
- Database schema is minimal example (users, items tables)
- tRPC routers have example CRUD operations
- No T3/create-t3-app branding - brand agnostic
