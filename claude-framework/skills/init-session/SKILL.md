---
name: init-session
description: Load project context - architecture, docs, and codebase orientation
allowed-tools: Read, Bash, Glob
---

# Initialize Session Context

Load project context to understand the codebase. This is the "what is this project?" step, separate from "where did we leave off?" (which is `/resume`).

Use this when:

- Starting fresh on a project you haven't seen before
- Need to re-orient after a long break
- Want full context without session history

## Steps

### 1. Load Project Identity

```bash
# Get project name and location
basename $(pwd)
pwd
```

### 2. Read CLAUDE.md

Read the project's CLAUDE.md for:

- Project overview/description
- Tech stack and architecture
- Quick commands
- Key paths
- Project-specific notes or gotchas

If CLAUDE.md doesn't exist, note this and suggest `/init-standards`.

### 3. Scan Tech Stack

```bash
# Check package.json for dependencies and scripts
cat package.json | head -60
```

Extract:

- Framework (Next.js version, React version)
- Key dependencies (tRPC, Drizzle, Supabase, etc.)
- Available scripts (dev, build, test, db:push, etc.)

### 4. Map Project Structure

```bash
# Get high-level directory structure
ls -la src/ 2>/dev/null
ls -la app/ 2>/dev/null  # Some projects use app/ directly
```

Note key directories:

- Where pages/routes live
- Where API/server code lives
- Where components live
- Where database schema lives

### 5. Check Available Documentation

```bash
# List any docs
ls -la docs/*.md 2>/dev/null
ls -la *.md 2>/dev/null
```

Note available documentation files for deeper dives.

### 6. Check Database Schema (if applicable)

If Drizzle/Prisma detected:

```bash
# Find schema file
ls -la src/server/db/schema.ts prisma/schema.prisma drizzle/schema.ts 2>/dev/null
```

Optionally read schema to understand data model.

### 7. Present Context Summary

````
## Project Context

**Project:** <name>
**Path:** <path>

### Overview
<from CLAUDE.md or inferred>

### Tech Stack
- **Framework:** Next.js X, React X
- **Database:** Supabase/PostgreSQL via Drizzle
- **Auth:** Supabase Auth
- **API:** tRPC
- **Styling:** Tailwind + shadcn/ui

### Quick Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run db:push  # Push schema changes
````

### Key Paths

| Path                    | Purpose         |
| ----------------------- | --------------- |
| src/app/                | Pages/routes    |
| src/server/api/         | tRPC routers    |
| src/server/db/schema.ts | Database schema |
| src/components/         | UI components   |

### Available Docs

- README.md
- STATUS.md
- TODO.md
- docs/feature-x.md

### Ready to Work

Project context loaded. Run `/resume` to also see session history, or start working.

```

## When to Use

| Scenario | Use |
|----------|-----|
| First time on project | `/init-session` |
| Returning after long break | `/init-session` then `/resume` |
| Quick continuation | `/resume` (includes init-session) |
| Just need to check architecture | `/init-session` |

## Relationship to /resume

- `/init-session` = "What is this project?"
- `/resume` = `/init-session` + "Where did we leave off?"

The `/resume` skill calls init-session logic internally, then adds session continuity on top.
```
