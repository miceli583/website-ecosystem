# Unified Development Framework

> **Version:** 1.23.1
> **Last Updated:** 2026-03-21
> **Location:** `~/.claude/FRAMEWORK.md`
> **View from any project:** Run `/framework` or `cat ~/.claude/FRAMEWORK.md`

This document defines the canonical development standards, patterns, and workflows used across all projects. It serves as the single source of truth for development practices.

---

## Table of Contents

1. [Philosophy](#philosophy)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Documentation Standards](#documentation-standards)
5. [Code Conventions](#code-conventions)
6. [Database Patterns](#database-patterns)
7. [API Patterns](#api-patterns)
8. [LLM Integration Patterns](#llm-integration-patterns)
9. [Authentication Patterns](#authentication-patterns)
10. [UI/Component Patterns](#uicomponent-patterns)
11. [Environment Management](#environment-management)
12. [Testing Standards](#testing-standards)
13. [Security Best Practices](#security-best-practices)
14. [Performance Patterns](#performance-patterns)
15. [Git Workflow](#git-workflow)
16. [Session Workflow](#session-workflow)
17. [Long Plan Context Management](#long-plan-context-management)
18. [Multi-Agent Workflow](#multi-agent-workflow)
19. [Framework Distribution](#framework-distribution)
20. [Developer Onboarding](#developer-onboarding)
21. [Codebase Maintenance](#codebase-maintenance)
22. [Tool Arsenal](#tool-arsenal)
23. [Skills Reference](#skills-reference)
24. [Templates](#templates)
25. [Patterns Library](#patterns-library)
26. [Troubleshooting](#troubleshooting)
27. [Changelog](#changelog)

---

## Philosophy

### Core Principles

```
┌─────────────────────────────────────────────────────────────────┐
│                     DEVELOPMENT PHILOSOPHY                       │
├─────────────────────────────────────────────────────────────────┤
│  1. CONSISTENCY > NOVELTY     Use established patterns          │
│  2. SIMPLICITY > CLEVERNESS   Write readable code               │
│  3. DELETE > COMMENT          Git has history                   │
│  4. EDIT > CREATE             Modify existing files             │
│  5. EXPLICIT > IMPLICIT       Clear intentions                  │
│  6. SHIP > PERFECT            Iterate over perfection           │
└─────────────────────────────────────────────────────────────────┘
```

### Decision Framework

When facing architectural decisions:

```
                    ┌─────────────────┐
                    │ New Decision    │
                    └────────┬────────┘
                             │
              ┌──────────────▼──────────────┐
              │ Pattern exists elsewhere?   │
              └──────────────┬──────────────┘
                     YES     │     NO
              ┌──────────────┴──────────────┐
              ▼                             ▼
        ┌───────────┐              ┌─────────────────┐
        │ REUSE IT  │              │ Is it simpler?  │
        └───────────┘              └────────┬────────┘
                                    YES     │     NO
                            ┌───────────────┴───────────────┐
                            ▼                               ▼
                    ┌──────────────┐              ┌─────────────────┐
                    │ IMPLEMENT IT │              │ Find simpler    │
                    └──────────────┘              │ alternative     │
                                                  └─────────────────┘
```

### When to Break Rules

Rules exist to serve you, not constrain you. Break them when:

- Project requirements genuinely differ
- Performance demands it (with measurements)
- Team consensus agrees on alternative
- Document the deviation in CLAUDE.md

---

## Tech Stack

### Core Stack (Recommended)

```
┌─────────────────────────────────────────────────────────────────┐
│                       UNIFIED TECH STACK                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  FRONTEND                        BACKEND                         │
│  ┌─────────────────────┐        ┌─────────────────────┐         │
│  │ Next.js 15-16       │        │ tRPC 11             │         │
│  │ React 19            │◄──────►│ Drizzle ORM         │         │
│  │ TypeScript 5.x      │        │ PostgreSQL          │         │
│  │ Tailwind CSS 4      │        │ Supabase            │         │
│  │ shadcn/ui           │        │ Zod validation      │         │
│  └─────────────────────┘        └─────────────────────┘         │
│           │                              │                       │
│           └──────────────┬───────────────┘                       │
│                          ▼                                       │
│                 ┌─────────────────┐                              │
│                 │ TanStack Query  │                              │
│                 │ Type-safe E2E   │                              │
│                 └─────────────────┘                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Detailed Stack

| Layer          | Technology           | Version | Purpose                           |
| -------------- | -------------------- | ------- | --------------------------------- |
| **Framework**  | Next.js              | 15-16   | Full-stack React framework        |
| **Runtime**    | React                | 19      | UI library with Server Components |
| **Language**   | TypeScript           | 5.x     | Type safety                       |
| **API**        | tRPC                 | 11      | Type-safe RPC                     |
| **State**      | TanStack Query       | 5.x     | Server state management           |
| **Database**   | PostgreSQL           | -       | Via Supabase                      |
| **ORM**        | Drizzle              | 0.41+   | Type-safe database access         |
| **Auth**       | Supabase Auth        | -       | Authentication & sessions         |
| **Styling**    | Tailwind CSS         | 4.x     | Utility-first CSS                 |
| **Components** | shadcn/ui            | -       | Accessible component library      |
| **Validation** | Zod                  | 3.x     | Schema validation                 |
| **Env**        | @t3-oss/env-nextjs   | -       | Environment validation            |
| **Icons**      | Lucide React         | -       | Icon library                      |
| **Utilities**  | clsx, tailwind-merge | -       | Class composition                 |

### Stack Variations

```
FULL STACK (default)
├── Next.js + React + TypeScript
├── tRPC + TanStack Query
├── Drizzle + Supabase (DB + Auth)
├── Tailwind + shadcn/ui
└── Use for: Web apps, dashboards, SaaS

LANDING PAGE (lightweight)
├── Next.js + React + TypeScript
├── Tailwind + shadcn/ui
├── Stripe (if payments)
└── Use for: Marketing sites, simple products

API ONLY (headless)
├── Next.js API routes or tRPC
├── Drizzle + Supabase
└── Use for: Backend services, webhooks

STATIC SITE
├── Next.js (static export)
├── Tailwind
└── Use for: Docs, portfolios, blogs
```

### Package.json Scripts (Standard)

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write .",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:seed": "tsx src/server/db/seed.ts",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test"
  }
}
```

---

## Project Structure

### Standard Directory Layout

```
project-root/
│
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API routes
│   │   │   └── trpc/[trpc]/      # tRPC endpoint
│   │   ├── (auth)/               # Auth route group (no URL segment)
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── callback/
│   │   ├── (dashboard)/          # Protected route group
│   │   │   └── dashboard/
│   │   ├── admin/                # Admin routes
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   └── globals.css           # Global styles
│   │
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── shared/               # Cross-feature components
│   │   ├── layouts/              # Layout components
│   │   └── [feature]/            # Feature-specific components
│   │
│   ├── lib/
│   │   ├── supabase/             # Supabase clients
│   │   │   ├── client.ts         # Browser client
│   │   │   ├── server.ts         # Server client
│   │   │   └── middleware.ts     # Auth middleware helpers
│   │   ├── utils.ts              # Utility functions (cn, formatDate, etc.)
│   │   ├── constants.ts          # App constants
│   │   └── [feature]/            # Feature-specific lib code
│   │
│   ├── server/
│   │   ├── api/
│   │   │   ├── trpc.ts           # tRPC setup & procedures
│   │   │   ├── root.ts           # Root router
│   │   │   └── routers/          # Feature routers
│   │   │       ├── users.ts
│   │   │       └── posts.ts
│   │   └── db/
│   │       ├── index.ts          # DB client
│   │       ├── schema.ts         # Drizzle schema
│   │       └── seed.ts           # Seed script
│   │
│   ├── trpc/
│   │   ├── react.tsx             # React Query + tRPC client
│   │   ├── server.ts             # Server-side tRPC client
│   │   └── query-client.ts       # Query client config
│   │
│   ├── hooks/                    # Custom React hooks
│   │   └── use-[name].ts
│   │
│   ├── types/                    # Shared TypeScript types
│   │   └── index.ts
│   │
│   ├── middleware.ts             # Next.js middleware
│   └── env.js                    # Environment validation
│
├── public/
│   ├── brand/                    # Brand assets (logos, icons)
│   ├── images/                   # Static images
│   └── fonts/                    # Custom fonts
│
├── shaders/                      # GLSL shaders (if enabled)
│   └── example.glsl
│
├── docs/
│   ├── [feature].md              # Feature documentation
│   └── archive/                  # Archived docs
│
├── drizzle/                      # DB migrations
│
├── __tests__/                    # Unit tests
├── e2e/                          # E2E tests
│
├── CLAUDE.md                     # Project instructions (AI)
├── STATUS.md                     # Feature status
├── TODO.md                       # Work tracking
├── ROADMAP.md                    # (Optional) Phased plan
├── README.md                     # Project overview (humans)
├── FRAMEWORK.md                  # → Link to ~/.claude/FRAMEWORK.md
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── drizzle.config.ts
├── next.config.js
├── components.json               # shadcn/ui config
├── vitest.config.ts              # (if testing)
├── playwright.config.ts          # (if e2e)
├── .env.example
├── .env.local                    # (git-ignored)
├── .gitignore
└── eslint.config.mjs
```

### Path Aliases

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["./src/*"]
    }
  }
}
```

**Usage:**

```typescript
// ✅ Good - use path alias
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";

// ❌ Bad - relative imports from deep nesting
import { Button } from "../../../components/ui/button";
```

---

## Documentation Standards

### Required Files

```
┌─────────────────────────────────────────────────────────────────┐
│                    REQUIRED DOCUMENTATION                        │
├─────────────┬───────────────────────────────┬───────────────────┤
│ File        │ Purpose                       │ Max Lines         │
├─────────────┼───────────────────────────────┼───────────────────┤
│ CLAUDE.md   │ Project-specific AI context   │ 100               │
│ STATUS.md   │ Feature status & changes      │ 100               │
│ TODO.md     │ Tracked work items            │ 100               │
│ README.md   │ Project overview (humans)     │ No limit          │
└─────────────┴───────────────────────────────┴───────────────────┘
```

### Optional Files

| File                | When to Use                          |
| ------------------- | ------------------------------------ |
| `ROADMAP.md`        | Phased development (larger projects) |
| `WORKTREES.md`      | Multi-agent coordination             |
| `FRAMEWORK.md`      | Symlink to `~/.claude/FRAMEWORK.md`  |
| `docs/[feature].md` | Complex feature documentation        |
| `docs/archive/`     | Superseded documentation             |

### TODO.md Structure

```markdown
# TODO

## Critical (blocks production)

- [ ] Item blocking deployment `path/to/file.ts:LINE`

## Bugs (broken functionality)

- [ ] Bug description `path/to/file.ts:LINE`

## Tech Debt (code quality)

- [ ] Refactoring needed `path/to/file.ts:LINE`

## Enhancements (nice to have)

- [ ] Feature idea `path/to/file.ts:LINE`
```

**Rules:**

- Include file:line references where applicable
- Move completed items to bottom or delete
- Keep under 100 lines (archive old items)

**Multi-developer task assignment:**

- Use `@name` tags to assign items: `- [ ] @alice Fix login redirect bug`
- Untagged items are available for anyone to pick up
- When claiming a task, add your `@name` tag
- `/handoff` automatically tags new items with the current developer
- `/resume` highlights items tagged with the current developer

### STATUS.md Structure

```markdown
# Project Status

**Version:** X.Y.Z
**Last Updated:** YYYY-MM-DD
**Last Updated By:** Developer Name

## Feature Status

| Feature   | Status  | Notes          |
| --------- | ------- | -------------- |
| Auth      | Working | Email + OAuth  |
| Dashboard | Partial | Missing charts |
| API       | Working | 12 endpoints   |

## Known Limitations

- Limitation 1
- Limitation 2

## Recent Changes

| Date       | Description     | Author |
| ---------- | --------------- | ------ |
| 2026-01-27 | Added feature X | @alice |
| 2026-01-26 | Fixed bug Y     | @bob   |
```

**Multi-developer notes:**

- "Last Updated By" shows who ran the last `/handoff`
- Recent changes table includes author column
- `/resume` uses "Last Updated By" to show if a different developer is continuing

### CLAUDE.md Structure

```markdown
# Project Name

## Overview

One paragraph describing what this project does.

## Quick Commands

\`\`\`bash
npm run dev # Start dev server
npm run build # Build for production
npm run db:push # Push schema to database
\`\`\`

## Tech Stack

- **Framework**: Next.js X
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth

## Key Paths

| Path                    | Purpose         |
| ----------------------- | --------------- |
| src/app/                | Pages           |
| src/server/db/schema.ts | Database schema |

## Project-Specific Notes

<!-- Unique patterns, gotchas, important context -->

## Current Status

See STATUS.md and TODO.md
```

### Inline Comment Conventions

| Tag         | Meaning                        | Priority  |
| ----------- | ------------------------------ | --------- |
| `TODO:`     | Work to be done                | Normal    |
| `FIXME:`    | Broken, needs fixing           | High      |
| `HACK:`     | Temporary workaround           | Tech debt |
| `NOTE:`     | Important context              | Info      |
| `OPTIMIZE:` | Performance improvement needed | Low       |
| `SECURITY:` | Security concern               | High      |

**Format:**

```typescript
// TODO: Add pagination support
// FIXME: Race condition when multiple users edit
// HACK: Workaround for Supabase edge runtime issue
// NOTE: This runs on every request, keep lightweight
```

### Documentation Anti-Bloat Rules

Prevent documentation drift and maintain coherence across projects.

#### Caps and Limits

| Document                   | Rule                | Enforcement                         |
| -------------------------- | ------------------- | ----------------------------------- |
| STATUS.md Recent Changes   | Max 10 entries      | Older changes → `git log --oneline` |
| TODO.md Categories         | Only standard 4     | No custom categories                |
| CLAUDE.md Brand Exceptions | Max 10, grouped     | Consolidate related exceptions      |
| Pattern files              | Max 20 total        | Use category prefixes, consolidate  |
| docs/ feature files        | Archive when stable | 2 weeks post-completion             |

#### STATUS.md Recent Changes Format

```markdown
## Recent Changes (last 10)

| Date   | Commit | Description   |
| ------ | ------ | ------------- |
| Feb 04 | abc123 | Latest change |

...
| Jan 25 | def456 | Oldest shown |

_Older changes: `git log --oneline`_
```

#### docs/ Folder Organization

```
docs/
├── [feature].md           # Active feature docs
├── [feature]-qa.md        # QA checklist (if complex feature)
├── archive/               # Superseded docs
│   ├── [feature]-v1.md    # Old versions
│   └── session-*.md       # Old session notes
└── templates/             # Reusable templates (optional)
```

#### Archive Triggers

| Content Type  | Archive When                            |
| ------------- | --------------------------------------- |
| Design docs   | Feature complete + 2 weeks stable       |
| Session notes | Older than 1 month                      |
| Version docs  | After major version bump                |
| QA checklists | After feature passes QA (keep template) |

#### Single Source of Truth

| Information    | Canonical Location                    | Never Duplicate In          |
| -------------- | ------------------------------------- | --------------------------- |
| Feature status | STATUS.md                             | CLAUDE.md, README           |
| Work items     | TODO.md                               | Inline comments (sync only) |
| Brand colors   | CLAUDE.md `## Brand Reference`        | Component files             |
| Tech stack     | CLAUDE.md                             | README (link instead)       |
| Patterns       | FRAMEWORK.md or `~/.claude/patterns/` | Project CLAUDE.md           |
| Session state  | STATUS.md Recent Changes              | Separate session files      |

#### Cross-Project Coherence Checks

Add to `/validate` and `/tidy`:

- [ ] TODO.md uses only standard 4 categories
- [ ] STATUS.md Recent Changes ≤ 10 rows
- [ ] docs/ files have clear purpose (no orphans)
- [ ] CLAUDE.md doesn't duplicate FRAMEWORK.md content
- [ ] Pattern files use category prefixes

---

## Code Conventions

### TypeScript Best Practices

```typescript
// ✅ Prefer interfaces for object shapes
interface User {
  id: string;
  email: string;
  profile: UserProfile;
}

// ✅ Use type for unions, intersections, utilities
type Status = "pending" | "approved" | "rejected";
type UserWithPosts = User & { posts: Post[] };

// ✅ Explicit return types on exports
export function getUser(id: string): Promise<User | null> {
  // ...
}

// ✅ Use const assertions for literal types
const ROLES = ["admin", "member", "guest"] as const;
type Role = (typeof ROLES)[number]; // "admin" | "member" | "guest"

// ✅ Prefer unknown over any
function parseJSON(text: string): unknown {
  return JSON.parse(text);
}

// ✅ Use satisfies for type checking without widening
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
} satisfies Config;
```

### Naming Conventions

| Type               | Convention           | Example                 |
| ------------------ | -------------------- | ----------------------- |
| Files (components) | PascalCase           | `UserProfile.tsx`       |
| Files (utilities)  | camelCase            | `formatDate.ts`         |
| Files (routes)     | kebab-case           | `user-profile/page.tsx` |
| Components         | PascalCase           | `UserProfile`           |
| Functions          | camelCase            | `getUserById`           |
| Hooks              | camelCase with `use` | `useUserProfile`        |
| Constants          | UPPER_SNAKE          | `MAX_RETRY_COUNT`       |
| Types/Interfaces   | PascalCase           | `UserProfile`           |
| Enums              | PascalCase           | `UserStatus`            |
| Database tables    | snake_case           | `user_profile`          |
| Database columns   | snake_case           | `created_at`            |
| Environment vars   | UPPER_SNAKE          | `DATABASE_URL`          |

### File Organization

```typescript
// ═══════════════════════════════════════════════════════════
// 1. IMPORTS (external → internal → types)
// ═══════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

import type { User } from "~/types";

// ═══════════════════════════════════════════════════════════
// 2. TYPES (component-specific)
// ═══════════════════════════════════════════════════════════
interface UserCardProps {
  user: User;
  onSelect?: (user: User) => void;
}

// ═══════════════════════════════════════════════════════════
// 3. CONSTANTS
// ═══════════════════════════════════════════════════════════
const DEFAULT_AVATAR = "/images/default-avatar.png";

// ═══════════════════════════════════════════════════════════
// 4. COMPONENT
// ═══════════════════════════════════════════════════════════
export function UserCard({ user, onSelect }: UserCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    // ...
  );
}

// ═══════════════════════════════════════════════════════════
// 5. HELPER FUNCTIONS (if needed, prefer extracting to lib/)
// ═══════════════════════════════════════════════════════════
function formatUserName(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}
```

### Error Handling

#### Structured Error Pattern

Create `src/lib/errors.ts` with standardized error handling:

```typescript
// ═══════════════════════════════════════════════════════════
// Base Error Class
// ═══════════════════════════════════════════════════════════
import { TRPCError } from "@trpc/server";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

// ═══════════════════════════════════════════════════════════
// Standard Error Codes
// ═══════════════════════════════════════════════════════════
export const ErrorCodes = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  INVALID_TOKEN: "INVALID_TOKEN",
  VALIDATION_FAILED: "VALIDATION_FAILED",
  NOT_FOUND: "NOT_FOUND",
  DUPLICATE_RESOURCE: "DUPLICATE_RESOURCE",
  DATABASE_ERROR: "DATABASE_ERROR",
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
} as const;

// ═══════════════════════════════════════════════════════════
// Type-safe Error Factories
// ═══════════════════════════════════════════════════════════
export const createError = {
  unauthorized: (message = "Unauthorized") =>
    new AppError(message, ErrorCodes.UNAUTHORIZED, 401),
  forbidden: (message = "Forbidden") =>
    new AppError(message, ErrorCodes.FORBIDDEN, 403),
  notFound: (resource = "Resource", id?: string) =>
    new AppError(
      `${resource}${id ? ` with id "${id}"` : ""} not found`,
      ErrorCodes.NOT_FOUND,
      404
    ),
  validation: (message = "Validation failed") =>
    new AppError(message, ErrorCodes.VALIDATION_FAILED, 400),
  duplicate: (resource = "Resource") =>
    new AppError(
      `${resource} already exists`,
      ErrorCodes.DUPLICATE_RESOURCE,
      409
    ),
  database: (message = "Database operation failed") =>
    new AppError(message, ErrorCodes.DATABASE_ERROR, 500),
  internal: (message = "Internal server error") =>
    new AppError(message, ErrorCodes.INTERNAL_ERROR, 500),
};

// ═══════════════════════════════════════════════════════════
// Error Normalizer (converts any error to TRPCError)
// ═══════════════════════════════════════════════════════════
export function handleError(error: unknown): TRPCError {
  if (error instanceof ZodError) {
    return new TRPCError({
      code: "BAD_REQUEST",
      message: "Validation failed",
      cause: error,
    });
  }
  if (error instanceof AppError) {
    return new TRPCError({
      code: mapStatusToTRPC(error.statusCode),
      message: error.message,
      cause: error,
    });
  }
  if (error instanceof TRPCError) return error;
  console.error("Unhandled error:", error);
  return new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred",
    cause: error,
  });
}

function mapStatusToTRPC(status: number) {
  const map: Record<
    number,
    | "BAD_REQUEST"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "CONFLICT"
    | "TOO_MANY_REQUESTS"
    | "INTERNAL_SERVER_ERROR"
  > = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    409: "CONFLICT",
    429: "TOO_MANY_REQUESTS",
  };
  return map[status] ?? "INTERNAL_SERVER_ERROR";
}
```

#### Usage in tRPC Routers

```typescript
import { createError } from "~/lib/errors";

export const usersRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.id),
      });
      if (!user) throw createError.notFound("User", input.id);
      return user;
    }),
});
```

#### API Routes

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // ... process
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

#### Client-side

```typescript
function UserProfile({ userId }: { userId: string }) {
  const { data, error, isLoading } = api.users.getById.useQuery({ id: userId });

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error.message} />;
  if (!data) return <NotFound />;

  return <Profile user={data} />;
}
```

---

## Database Patterns

### Schema Design

```typescript
// src/server/db/schema.ts
import {
  pgTable,
  pgTableCreator,
  text,
  timestamp,
  uuid,
  boolean,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ═══════════════════════════════════════════════════════════
// TABLE CREATOR (for prefixing)
// ═══════════════════════════════════════════════════════════
const createTable = pgTableCreator((name) => `myapp_${name}`);

// ═══════════════════════════════════════════════════════════
// USERS TABLE
// ═══════════════════════════════════════════════════════════
export const users = createTable(
  "users",
  {
    // Primary key - UUID
    id: uuid("id").primaryKey().defaultRandom(),

    // Core fields
    email: text("email").notNull().unique(),
    fullName: text("full_name"),
    avatarUrl: text("avatar_url"),

    // Status & role
    role: text("role", { enum: ["admin", "member"] })
      .notNull()
      .default("member"),
    status: text("status", { enum: ["active", "suspended"] })
      .notNull()
      .default("active"),

    // Flexible data
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    // Indexes
    emailIdx: index("users_email_idx").on(table.email),
    roleIdx: index("users_role_idx").on(table.role),
  })
);

// ═══════════════════════════════════════════════════════════
// RELATIONS
// ═══════════════════════════════════════════════════════════
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
}));

// ═══════════════════════════════════════════════════════════
// POSTS TABLE (example)
// ═══════════════════════════════════════════════════════════
export const posts = createTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
```

### Common Patterns

```typescript
// ═══════════════════════════════════════════════════════════
// SOFT DELETES
// ═══════════════════════════════════════════════════════════
deletedAt: timestamp("deleted_at", { withTimezone: true }),

// Query non-deleted
const activeUsers = await db.query.users.findMany({
  where: isNull(users.deletedAt),
});

// ═══════════════════════════════════════════════════════════
// AUDIT FIELDS
// ═══════════════════════════════════════════════════════════
createdBy: uuid("created_by").references(() => users.id),
updatedBy: uuid("updated_by").references(() => users.id),

// ═══════════════════════════════════════════════════════════
// OPTIMISTIC LOCKING
// ═══════════════════════════════════════════════════════════
version: integer("version").notNull().default(1),

// ═══════════════════════════════════════════════════════════
// MANY-TO-MANY (junction table)
// ═══════════════════════════════════════════════════════════
export const postTags = createTable("post_tags", {
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  tagId: uuid("tag_id")
    .notNull()
    .references(() => tags.id, { onDelete: "cascade" }),
}, (table) => ({
  pk: primaryKey({ columns: [table.postId, table.tagId] }),
}));
```

---

## API Patterns

### tRPC Router Structure

```typescript
// src/server/api/routers/users.ts
import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "../trpc";
import { users } from "~/server/db/schema";

// ═══════════════════════════════════════════════════════════
// INPUT SCHEMAS (reusable)
// ═══════════════════════════════════════════════════════════
const userIdSchema = z.object({
  id: z.string().uuid(),
});

const updateProfileSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional(),
});

// ═══════════════════════════════════════════════════════════
// ROUTER
// ═══════════════════════════════════════════════════════════
export const usersRouter = createTRPCRouter({
  // ─────────────────────────────────────────────────────────
  // PUBLIC: No auth required
  // ─────────────────────────────────────────────────────────
  getById: publicProcedure.input(userIdSchema).query(async ({ ctx, input }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, input.id),
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user;
  }),

  // ─────────────────────────────────────────────────────────
  // PROTECTED: Requires authentication
  // ─────────────────────────────────────────────────────────
  getMe: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
    });
  }),

  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(users)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(users.id, ctx.user.id))
        .returning();

      return updated;
    }),

  // ─────────────────────────────────────────────────────────
  // ADMIN: Requires admin role
  // ─────────────────────────────────────────────────────────
  list: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.query.users.findMany({
        limit: input.limit,
        offset: input.offset,
        orderBy: (users, { desc }) => [desc(users.createdAt)],
      });
    }),
});
```

### Procedure Types

```typescript
// src/server/api/trpc.ts
import { initTRPC, TRPCError } from "@trpc/server";
import { createClient } from "~/lib/supabase/server";
import { db } from "~/server/db";

// Context
export const createTRPCContext = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { db, user, supabase };
};

const t = initTRPC.context<typeof createTRPCContext>().create();

// ═══════════════════════════════════════════════════════════
// PROCEDURES
// ═══════════════════════════════════════════════════════════

// Public - no auth
export const publicProcedure = t.procedure;

// Protected - requires auth
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: { ...ctx, user: ctx.user },
  });
});

// Admin - requires admin role
export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const profile = await ctx.db.query.users.findFirst({
    where: eq(users.id, ctx.user.id),
  });

  if (profile?.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return next({ ctx });
});
```

### Query Configuration

```typescript
// ═══════════════════════════════════════════════════════════
// src/trpc/query-client.ts - Global Defaults
// ═══════════════════════════════════════════════════════════
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000, // 30 seconds for most data
      },
    },
  });

// ═══════════════════════════════════════════════════════════
// Per-Query Overrides
// ═══════════════════════════════════════════════════════════

// Static data: 5-minute cache
const { data: profile } = api.users.getMe.useQuery(undefined, {
  staleTime: 5 * 60 * 1000,
});

// Conditional query: only fetch when condition met
const { data: adminData } = api.admin.getStats.useQuery(undefined, {
  enabled: isAdmin,
  staleTime: 5 * 60 * 1000,
});

// Dynamic inputs based on role
const { data: resources } = api.resources.list.useQuery(
  { ...(isAdmin ? {} : { isActive: true }) }, // Clients only see active
  { staleTime: 5 * 60 * 1000 }
);
```

### Role-Based Access Control (RBAC)

```typescript
// ═══════════════════════════════════════════════════════════
// Full RBAC Pattern for Multi-Tenant Access
// ═══════════════════════════════════════════════════════════
getResources: protectedProcedure
  .input(z.object({
    slug: z.string(),
    isActive: z.boolean().optional(),
  }))
  .query(async ({ ctx, input }) => {
    // Step 1: Get user's profile with role
    const profile = await ctx.db.query.portalUsers.findFirst({
      where: eq(portalUsers.authUserId, ctx.user.id),
    });

    // Step 2: Verify portal access
    if (!profile || !profile.isActive) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Portal access denied",
      });
    }

    // Step 3: Role-based scope restriction
    if (profile.role === "client" && profile.clientSlug !== input.slug) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You can only access your own resources",
      });
    }

    // Step 4: Dynamic filtering based on role
    const activeFilter = input.isActive ?? (
      profile.role === "client" ? true : undefined  // Clients only see active
    );

    // Step 5: Build and execute query
    const conditions = [eq(resources.clientSlug, input.slug)];
    if (activeFilter !== undefined) {
      conditions.push(eq(resources.isActive, activeFilter));
    }

    return ctx.db.query.resources.findMany({
      where: and(...conditions),
      orderBy: [desc(resources.createdAt)],
    });
  }),
```

### Mutation with Cache Invalidation

```typescript
// ═══════════════════════════════════════════════════════════
// Standard Mutation Pattern
// ═══════════════════════════════════════════════════════════
const utils = api.useUtils();

const updateItem = api.items.update.useMutation({
  onSuccess: (_, variables) => {
    // Context-aware toast messages
    if (variables.isActive === false) {
      toast.success("Item archived");
    } else if (variables.isActive === true) {
      toast.success("Item restored");
    } else {
      toast.success("Item updated");
    }

    // Invalidate affected queries (triggers refetch)
    void utils.items.getAll.invalidate();
    // Don't invalidate unrelated queries
  },
  onError: (error) => {
    toast.error("Failed to update", {
      description: error.message,
    });
  },
});

// Usage with loading state
<button
  onClick={() => updateItem.mutate({ id, title: "New Title" })}
  disabled={updateItem.isPending}
>
  {updateItem.isPending && <Loader2 className="animate-spin" />}
  Save
</button>
```

---

## LLM Integration Patterns

### When to Use What

| Need                  | Solution           | Install                      |
| --------------------- | ------------------ | ---------------------------- |
| Simple chat/streaming | Vercel AI SDK      | `npm i ai @ai-sdk/anthropic` |
| Multi-step agents     | LangGraph          | `pip install langgraph`      |
| Tool calling          | AI SDK + tRPC      | Built-in                     |
| Cross-model routing   | AI SDK multi-model | Built-in                     |

### Vercel AI SDK (Recommended for Next.js)

```typescript
// ═══════════════════════════════════════════════════════════
// src/app/api/chat/route.ts - Streaming Chat
// ═══════════════════════════════════════════════════════════
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4-5-20250929"),
    messages,
    system: "You are a helpful assistant.",
  });

  return result.toDataStreamResponse();
}

// ═══════════════════════════════════════════════════════════
// src/components/Chat.tsx - Client Component
// ═══════════════════════════════════════════════════════════
"use client";
import { useChat } from "ai/react";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>{m.role}: {m.content}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} disabled={isLoading} />
      </form>
    </div>
  );
}
```

### Tool Calling with AI SDK

```typescript
// ═══════════════════════════════════════════════════════════
// src/app/api/agent/route.ts - Agent with Tools
// ═══════════════════════════════════════════════════════════
import { anthropic } from "@ai-sdk/anthropic";
import { generateText, tool } from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = await generateText({
    model: anthropic("claude-sonnet-4-5-20250929"),
    prompt,
    tools: {
      getWeather: tool({
        description: "Get current weather for a location",
        parameters: z.object({
          location: z.string().describe("City name"),
        }),
        execute: async ({ location }) => {
          // Call weather API
          return { temp: 72, condition: "sunny" };
        },
      }),
      searchDatabase: tool({
        description: "Search the database",
        parameters: z.object({
          query: z.string(),
        }),
        execute: async ({ query }) => {
          // Use your tRPC/Drizzle here
          return { results: [] };
        },
      }),
    },
    maxSteps: 5, // Allow multiple tool calls
  });

  return Response.json(result);
}
```

### Structured Output with Zod

```typescript
import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { z } from "zod";

const RecipeSchema = z.object({
  name: z.string(),
  ingredients: z.array(z.string()),
  steps: z.array(z.string()),
  prepTime: z.number(),
});

const { object: recipe } = await generateObject({
  model: anthropic("claude-sonnet-4-5-20250929"),
  schema: RecipeSchema,
  prompt: "Generate a recipe for chocolate chip cookies",
});
// recipe is fully typed!
```

### Multi-Model Routing

```typescript
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

// Route based on task complexity
async function smartGenerate(prompt: string, complexity: "simple" | "complex") {
  const model =
    complexity === "simple"
      ? anthropic("claude-haiku-4-5-20251001") // Fast, cheap
      : anthropic("claude-sonnet-4-5-20250929"); // Powerful

  return generateText({ model, prompt });
}
```

### Environment Variables for LLM

```bash
# .env
ANTHROPIC_API_KEY="sk-ant-..."
OPENAI_API_KEY="sk-..."  # If using OpenAI too
```

### Error Handling for LLM Calls

```typescript
import { APICallError, RetryError } from "ai";

try {
  const result = await generateText({ model, prompt });
} catch (error) {
  if (error instanceof APICallError) {
    // Rate limit, invalid key, etc.
    console.error("API Error:", error.message);
  } else if (error instanceof RetryError) {
    // All retries failed
    console.error("Retry exhausted:", error.message);
  }
  throw error;
}
```

### Cost Optimization Tips

1. **Use Haiku for simple tasks** - 10x cheaper than Sonnet
2. **Cache responses** - Same prompt = same response
3. **Stream when possible** - Better UX, same cost
4. **Set max_tokens** - Prevent runaway responses
5. **Batch operations** - Reduce API call overhead

---

## Authentication Patterns

### Supabase Auth Setup

```typescript
// ═══════════════════════════════════════════════════════════
// src/lib/supabase/client.ts - BROWSER
// ═══════════════════════════════════════════════════════════
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ═══════════════════════════════════════════════════════════
// src/lib/supabase/server.ts - SERVER
// ═══════════════════════════════════════════════════════════
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Component - ignore
          }
        },
      },
    }
  );
}

// ═══════════════════════════════════════════════════════════
// src/lib/supabase/middleware.ts - MIDDLEWARE
// ═══════════════════════════════════════════════════════════
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  await supabase.auth.getUser();
  return response;
}
```

### Middleware Protection

```typescript
// src/middleware.ts
import { updateSession } from "~/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/auth/callback",
  "/auth/forgot-password",
];

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  const { pathname } = request.nextUrl;
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isPublicRoute) {
    return response;
  }

  // Check auth for protected routes
  const supabase = createClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
```

### Auth Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION FLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SIGNUP                          LOGIN                          │
│  ┌──────────────┐               ┌──────────────┐                │
│  │ /signup      │               │ /login       │                │
│  │ email + pass │               │ email + pass │                │
│  └──────┬───────┘               └──────┬───────┘                │
│         │                              │                         │
│         ▼                              ▼                         │
│  ┌──────────────┐               ┌──────────────┐                │
│  │ Verify Email │               │ Supabase Auth│                │
│  │ (optional)   │               │              │                │
│  └──────┬───────┘               └──────┬───────┘                │
│         │                              │                         │
│         └──────────────┬───────────────┘                         │
│                        ▼                                         │
│                 ┌──────────────┐                                 │
│                 │/auth/callback│                                 │
│                 │ Set cookies  │                                 │
│                 └──────┬───────┘                                 │
│                        ▼                                         │
│                 ┌──────────────┐                                 │
│                 │ Check Profile│                                 │
│                 │ Complete?    │                                 │
│                 └──────┬───────┘                                 │
│                  NO    │    YES                                  │
│         ┌──────────────┴──────────────┐                         │
│         ▼                             ▼                          │
│  ┌──────────────┐              ┌──────────────┐                 │
│  │/profile/     │              │ /dashboard   │                 │
│  │complete      │              │              │                 │
│  └──────────────┘              └──────────────┘                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## UI/Component Patterns

### shadcn/ui Configuration

```json
// components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "~/components",
    "utils": "~/lib/utils"
  }
}
```

### cn() Utility

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Component Pattern (CVA)

```typescript
// src/components/ui/button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

### Accessibility Requirements

Every interactive element must be accessible. Follow these patterns:

#### Element-Specific Requirements

| Element Type        | Required Attributes       | Example                                           |
| ------------------- | ------------------------- | ------------------------------------------------- |
| Icon-only buttons   | `aria-label`              | `<button aria-label="Close menu">`                |
| Expandable elements | `aria-expanded`           | `<button aria-expanded={open}>`                   |
| Loading buttons     | `aria-busy`, disable      | `<button aria-busy={loading} disabled={loading}>` |
| Form inputs         | `id` + `<label htmlFor>`  | See example below                                 |
| Error messages      | `role="alert"`            | `<p role="alert">{error}</p>`                     |
| Dialogs             | Focus trap, Escape closes | Use Radix/shadcn Dialog                           |

#### Keyboard Navigation

```typescript
// ═══════════════════════════════════════════════════════════
// Escape Key Handler (for dialogs, menus, modals)
// ═══════════════════════════════════════════════════════════
useEffect(() => {
  function handleEscape(e: KeyboardEvent) {
    if (e.key === "Escape") {
      onClose();
    }
  }

  if (open) {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }
}, [open, onClose]);
```

#### Click-Outside Handler

```typescript
// ═══════════════════════════════════════════════════════════
// Click Outside Detection (for dropdowns, menus)
// ═══════════════════════════════════════════════════════════
const menuRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  }

  if (open) {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }
}, [open]);
```

#### Form Accessibility

```typescript
// ✅ Accessible form pattern
<div className="space-y-2">
  <label htmlFor="email" className="text-sm font-medium">
    Email
  </label>
  <input
    id="email"
    type="email"
    aria-describedby={error ? "email-error" : undefined}
    aria-invalid={!!error}
    className={cn(error && "border-red-500")}
  />
  {error && (
    <p id="email-error" role="alert" className="text-sm text-red-500">
      {error}
    </p>
  )}
</div>
```

#### Loading States

```typescript
// ✅ Accessible loading button
<button
  onClick={handleSubmit}
  disabled={isPending}
  aria-busy={isPending}
  className="flex items-center gap-2"
>
  {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
  {isPending ? "Saving..." : "Save"}
</button>
```

#### Accessibility Checklist

Add to `/a11y` and `/validate` skills:

- [ ] All icon-only buttons have `aria-label`
- [ ] Expandable elements have `aria-expanded`
- [ ] Forms use `<label htmlFor>` pattern
- [ ] Error messages have `role="alert"`
- [ ] Dialogs close on Escape key
- [ ] Focus is managed (trapped in dialogs, restored on close)
- [ ] Interactive elements are keyboard accessible
- [ ] Color contrast meets WCAG 2.1 AA (4.5:1 for text)
- [ ] Loading states indicated to screen readers

---

## Environment Management

### Environment Validation

```typescript
// src/env.js
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    NEXT_PUBLIC_BASE_URL: z.string().url().optional(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
```

### .env.example Template

```bash
# ═══════════════════════════════════════════════════════════
# DATABASE
# ═══════════════════════════════════════════════════════════
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

# ═══════════════════════════════════════════════════════════
# SUPABASE
# ═══════════════════════════════════════════════════════════
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# ═══════════════════════════════════════════════════════════
# APPLICATION
# ═══════════════════════════════════════════════════════════
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NODE_ENV="development"

# ═══════════════════════════════════════════════════════════
# OPTIONAL: Skip validation during Docker builds
# ═══════════════════════════════════════════════════════════
# SKIP_ENV_VALIDATION=1
```

---

## Testing Standards

### Test Structure

```
src/
├── __tests__/              # Unit tests (mirror src/ structure)
│   ├── lib/
│   │   └── utils.test.ts
│   └── components/
│       └── Button.test.tsx
├── e2e/                    # E2E tests
│   ├── auth.spec.ts
│   └── dashboard.spec.ts
```

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/__tests__/setup.ts"],
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/__tests__/setup.ts"],
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
```

---

## Security Best Practices

### Input Validation

```typescript
// Always validate with Zod
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  name: z.string().min(1).max(100).trim(),
});

// Sanitize HTML if needed
import DOMPurify from "isomorphic-dompurify";
const cleanHtml = DOMPurify.sanitize(userInput);
```

### Security Headers

```javascript
// next.config.js
const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

module.exports = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};
```

### Environment Security

```bash
# NEVER commit these:
.env
.env.local
.env.production

# ALWAYS commit:
.env.example  # Template without values
```

---

## Performance Patterns

### React Server Components

```typescript
// ✅ Server Component (default) - no "use client"
async function UserList() {
  const users = await db.query.users.findMany();
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

// ✅ Client Component - only when needed
"use client";
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### Data Fetching

```typescript
// ✅ Parallel fetching
const [users, posts] = await Promise.all([
  db.query.users.findMany(),
  db.query.posts.findMany(),
]);

// ✅ Prefetch in server component
import { api } from "~/trpc/server";

async function Page() {
  // This data is available immediately on client
  const users = await api.users.list();
  return <UserList initialData={users} />;
}
```

---

## Git Workflow

### Commit Messages

```
<type>(<scope>): <description>

[optional body]

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types:**
| Type | Purpose |
|------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `refactor` | Code restructuring |
| `test` | Tests |
| `chore` | Maintenance |
| `perf` | Performance |
| `style` | Formatting |

### Branch Naming

```
feature/<short-name>    # New features
fix/<issue-or-name>     # Bug fixes
refactor/<area>         # Refactoring
docs/<topic>            # Documentation
```

### Collaborative Branching Strategy (Optional)

> This section applies to multi-developer projects. Solo projects can push directly to main without branch protection, PRs, or CI. Run `/collab-setup` to add this infrastructure when you're ready.

For multi-developer projects, use a two-tier branching model:

```
main (production — protected, auto-deploys via Vercel)
 └── dev (integration branch — PRs merge here first)
      ├── feature/calendar     (developer A)
      ├── fix/crm-search       (developer B)
      └── refactor/api-errors  (developer A)
```

**Branch protection:**

- `main`: Requires PR + approval + CI passing. No direct push. No force push.
- `dev`: Requires CI passing. No force push.
- Admin/owner can bypass in emergencies.

**Flow:**

1. `/checkout` — create feature branch from `dev`
2. Work, commit, iterate
3. `/pr` — push branch and open PR targeting `dev`
4. Reviewer runs `/review` — code review with quality checks
5. Merge PR into `dev` — Vercel creates preview deployment
6. `/release` — merge `dev` → `main` for production

**GitHub Actions CI** runs on every PR:

- Format check, lint, typecheck, production build
- Configured in `.github/workflows/ci.yml`

### Git Commands

```bash
# Start feature (or use /checkout)
git checkout dev
git pull origin dev
git checkout -b feature/user-auth

# Commit with co-author
git commit -m "feat(auth): add login page

Co-Authored-By: Claude <noreply@anthropic.com>"

# Sync with latest dev (or use /sync)
git fetch origin
git merge origin/dev

# Open PR (or use /pr)
git push -u origin feature/user-auth
gh pr create --base dev --title "Add login page"
```

### Push Protocol

Two complementary guardrails protect live projects from broken pushes:

**1. Git hooks via Husky + lint-staged (automated)**

- **Husky** manages git hooks — auto-installs via `npm install` (prepare script)
- **Pre-commit**: `lint-staged` runs Prettier + ESLint on **changed files only** (fast)
- **Pre-push**: `scripts/pre-push.sh` runs full quality gate (typecheck, lint, build)
- Bypass with `git push --no-verify` (use sparingly)
- Install: automatic via `npm install` — no manual hook setup needed

**Standard lint-staged config (package.json):**

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["prettier --write", "eslint --fix"],
    "*.{js,jsx}": ["prettier --write", "eslint --fix"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

**2. `/push` skill (interactive, recommended)**

- Phase 1: Quality gate (typecheck, lint, build)
- Phase 2: Coherence (uncommitted changes, doc freshness, diff review)
- Phase 3: Confirmation (explicit approval before pushing)
- Phase 4: Push with result reporting

**Recommended workflow (solo):**

```
/handoff          # Save session state
/push             # Quality gate + review + push
```

**Recommended workflow (collaborative):**

```
/handoff          # Save session state
/pr               # Push + open pull request
```

### Collaboration Skills

| Skill       | Purpose                                  | When              |
| ----------- | ---------------------------------------- | ----------------- |
| `/checkout` | Create/switch feature branch from dev    | Starting work     |
| `/pr`       | Push branch + open pull request          | Done with feature |
| `/review`   | Review a PR with quality checks          | PR needs review   |
| `/sync`     | Pull latest upstream into current branch | Branch is behind  |
| `/release`  | Merge dev → main for production          | Ready to ship     |

**Adding to a project:**
Run `/collab-setup` to automate all of the following, or do manually:

1. Create `dev` branch from `main`
2. Set up GitHub Actions CI: `.github/workflows/ci.yml`
3. Set up branch protection on `main` (PR + CI + approval) and `dev` (CI)
4. Add `.github/pull_request_template.md` and `CODEOWNERS`
5. Add `CONTRIBUTING.md` and `docs/GIT_WORKFLOW_GUIDE.md`
6. Add Husky + lint-staged (pre-commit: format/lint changed files, pre-push: full quality gate)
7. Add `.github/dependabot.yml` (monthly grouped version bumps + security updates)
8. Enable Dependabot alerts + security updates in GitHub Settings
9. Optionally add framework distribution (`claude-framework/` + `scripts/setup-claude.sh`)
10. Set up `direnv` with `.envrc` for per-project GitHub account switching

---

## Session Workflow

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      SESSION WORKFLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ SESSION START                                             │   │
│  │                                                           │   │
│  │  1. Run /resume                                           │   │
│  │  2. Read STATUS.md, TODO.md                               │   │
│  │  3. Review recent changes                                 │   │
│  │  4. Understand current state                              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ WORKING                                                   │   │
│  │                                                           │   │
│  │  • Make changes                                           │   │
│  │  • Update inline TODOs                                    │   │
│  │  • Commit frequently                                      │   │
│  │  • Run /sync-todos periodically                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ SESSION END                                               │   │
│  │                                                           │   │
│  │  1. Run /handoff                                          │   │
│  │  2. STATUS.md updated                                     │   │
│  │  3. TODO.md updated                                       │   │
│  │  4. Session summary generated                             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Commands Quick Reference

| When             | Command           | Purpose                   |
| ---------------- | ----------------- | ------------------------- |
| Session start    | `/resume`         | Load project state        |
| During work      | `/sync-todos`     | Sync inline comments      |
| Quick check      | `/snapshot`       | Read-only status snapshot |
| Session end      | `/handoff`        | Save session state        |
| Periodic cleanup | `/tidy`           | Check project hygiene     |
| Roadmap complete | `/close-roadmap`  | Archive and reconcile     |
| New project      | `/init-standards` | Add doc standards         |
| Fresh scaffold   | `/seed`           | Create new project        |

---

## Long Plan Context Management

When executing plans that involve many files or multiple phases, context window exhaustion can crash the session before work is completed. Follow these protocols to prevent this.

### Context Budget Estimation

Before starting a large plan, estimate the context cost:

| Operation               | Approximate Token Cost |
| ----------------------- | ---------------------- |
| Each file read          | ~500-2000 tokens       |
| Each file write/edit    | ~200-500 tokens        |
| Each tool call response | ~100-1000 tokens       |
| Working memory reserve  | 30% of context window  |

**Rule:** If estimated work exceeds 60% of the context window, segment the plan before starting.

### Mandatory Checkpoints

For plans with 5+ implementation steps:

1. **After every 3 completed steps**: Run `/smart-compact` to capture state
2. **Before any phase transition**: Document completed work and next steps in STATUS.md
3. **At 50% estimated completion**: Evaluate remaining context and compact if needed

```
┌──────────────────────────────────────────────────────────┐
│  Step 1 → Step 2 → Step 3 → [CHECKPOINT: /smart-compact]│
│  Step 4 → Step 5 → Step 6 → [CHECKPOINT: /smart-compact]│
│  ...                                                     │
│  Phase complete → [UPDATE STATUS.md before next phase]   │
└──────────────────────────────────────────────────────────┘
```

### Plan Segmentation

When a plan is too large for a single session:

1. Break into independent phases that can survive a context reset
2. Each phase should have clear inputs, outputs, and success criteria
3. Document phase boundaries in the plan with `## Phase N: [name]`
4. After each phase, update STATUS.md with what's done and what's next
5. Use TODO.md inline markers (e.g., `PHASE:2 - ...`) for cross-session tracking

**Example plan structure:**

```markdown
## Phase 1: Database schema and migrations

- Inputs: PRD requirements
- Outputs: schema.ts updated, migrations applied
- Success: `npm run db:push` succeeds

## Phase 2: API layer (tRPC routers)

- Inputs: Phase 1 schema
- Outputs: New routers with CRUD operations
- Success: TypeScript compiles clean

## Phase 3: UI pages and components

- Inputs: Phase 2 API endpoints
- Outputs: Working pages with data fetching
- Success: Pages render with real data
```

### Recovery Protocol

If a session crashes mid-plan:

1. `/resume` will reload STATUS.md and TODO.md to recover state
2. Check `git status` for uncommitted work from the crashed session
3. Re-read the plan document if it was saved to `docs/`
4. Continue from the last documented checkpoint

### Anti-Patterns

| Do NOT                                           | Why                                | Do Instead                           |
| ------------------------------------------------ | ---------------------------------- | ------------------------------------ |
| Read large files (>500 lines) without targeting  | Consumes context budget fast       | Use targeted reads with offset/limit |
| Hold all file contents in context simultaneously | Context fills up, no room for work | Read, act, move on                   |
| Skip compaction warnings                         | Imminent context exhaustion        | Run `/smart-compact` immediately     |
| Attempt "one more thing" at >70% context         | Risks crash and lost progress      | Compact first, then continue         |
| Start a 10+ step plan without segmentation       | Will exceed context window         | Break into phases of 3-5 steps       |

---

## Multi-Agent Workflow (Optional)

> This section is optional. Most projects work fine with single-session development. Add multi-agent support when you need to parallelize large features across multiple Claude sessions.
>
> **Setup:** Run `/collab-setup` to add the collaboration infrastructure (CI, branch protection, PR templates) before using parallel workflows.

### Architecture Overview

Workers run in **separate terminal sessions** on the same repo, each on their own feature branch. Every worker has full access to all project files, node_modules, .env, and build tooling.

```
┌─────────────────────────────────────────────────────────────────┐
│               MULTI-AGENT ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Terminal 1 (Integrator)     Terminal 2         Terminal 3       │
│  ├── project repo            ├── same repo      ├── same repo   │
│  ├── dev branch              ├── feature/auth   ├── feature/api │
│  └── plans & merges          └── focused work   └── focused work│
│                                                                  │
│  COORDINATION: Git branches (no extra files needed)             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Workflow Steps

```
1. PLAN (Integrator)
   └─→ Discuss tasks with user
   └─→ Identify parallelizable work
   └─→ Assign file ownership to avoid conflicts

2. SPAWN (Integrator — /spawn)
   └─→ Creates feature branches from dev
   └─→ Assigns ports (3001, 3002, ...)
   └─→ Generates worker prompts

3. WORK (Workers — separate terminals)
   └─→ User opens new terminal, cd to project
   └─→ git checkout feature/<name>
   └─→ Starts Claude session, pastes worker prompt
   └─→ Worker runs /claim to confirm setup
   └─→ Works on task, commits frequently

4. COMPLETE (Workers)
   └─→ Commit all changes
   └─→ Push branch: git push origin feature/<name>
   └─→ Signal done to integrator

5. INTEGRATE (Integrator — /integrate)
   └─→ Reviews each feature branch
   └─→ Merges into dev (--no-ff)
   └─→ Resolves conflicts, runs quality checks
   └─→ Cleans up merged branches
```

### When to Use

| Approach           | When to Use                    | Pros                 | Cons                  |
| ------------------ | ------------------------------ | -------------------- | --------------------- |
| **Single session** | Most tasks                     | Simple, full context | Sequential            |
| **Multi-agent**    | Large features, parallelizable | Faster, focused      | Coordination overhead |
| **Hybrid**         | Mixed work                     | Flexible             | Requires judgment     |

### Key Principles

- **Full repo access**: Every worker can read any file for context — they just modify their owned files
- **No coordination files**: Git branches are the source of truth, no WORKTREES.md or .worktree-context needed
- **Port separation**: Each worker runs its dev server on a unique port (3001, 3002, ...) to avoid conflicts
- **Push before done**: Workers must push their branch — the integrator merges pushed commits, not local state

---

## Framework Distribution

### Architecture

The framework lives in two places per developer:

```
┌─────────────────────────────────────────────────┐
│ ~/.claude/ (global — loaded by Claude Code)      │
│  ├── CLAUDE.md        Global instructions        │
│  ├── FRAMEWORK.md     This document              │
│  ├── MULTIAGENT.md    Multi-agent protocol       │
│  ├── settings.json    Claude Code settings       │
│  ├── skills/          34 skill directories       │
│  ├── patterns/        18 reference patterns      │
│  └── .framework-manifest  Install tracking       │
└─────────────────────────────────────────────────┘
         ▲ setup-claude.sh installs from ▼
┌─────────────────────────────────────────────────┐
│ project/claude-framework/ (repo — distribution)  │
│  ├── manifest.json    Categories & versions      │
│  ├── CLAUDE.md        Mirror of global           │
│  ├── FRAMEWORK.md     Mirror of global           │
│  ├── MULTIAGENT.md    Mirror of global           │
│  ├── skills/          Mirror of global           │
│  └── patterns/        Mirror of global           │
└─────────────────────────────────────────────────┘
```

### Roles

| Role                | Who          | Responsibilities                                                    |
| ------------------- | ------------ | ------------------------------------------------------------------- |
| **Framework Owner** | Project lead | Updates `~/.claude/`, runs `/sync-framework` to push to repo        |
| **Developer**       | Team member  | Runs `setup-claude.sh` to install, runs `--update` for new versions |
| **Contributor**     | Anyone       | Can suggest changes via `/sync-to-global` (requires owner approval) |

### Sync Flows

**Owner → Repo (automatic):**
`/handoff`, `/push`, `/release` auto-run `/sync-framework`.
Copies `~/.claude/` → `claude-framework/` → committed to git.

**Repo → Developer (manual):**
Developer pulls latest → runs `./scripts/setup-claude.sh --update`.
Copies `claude-framework/` → `~/.claude/` (merge-based, preserves custom skills).

**Developer → Owner (collaborative):**
Developer suggests pattern/improvement → `/sync-to-global` or PR discussion.
Owner evaluates and incorporates into global framework.

### Skill Categories & Adoption Tiers

| Tier            | Categories                 | Who Should Install              |
| --------------- | -------------------------- | ------------------------------- |
| **Essential**   | Session, Collaboration     | Every developer                 |
| **Recommended** | + Quality                  | Most developers                 |
| **Advanced**    | + Multi-Agent (optional)   | Power users doing parallel work |
| **Maintainer**  | + Project Setup, Utilities | Framework owner only            |

### Installation Presets

| Preset   | Skills                       | Command                                       |
| -------- | ---------------------------- | --------------------------------------------- |
| Minimal  | 11 (essential)               | `./scripts/setup-claude.sh --preset=minimal`  |
| Standard | 22 (essential + recommended) | `./scripts/setup-claude.sh --preset=standard` |
| Full     | 36 (all)                     | `./scripts/setup-claude.sh --preset=full`     |

### Version Management

- `manifest.json` tracks the framework version
- `.framework-manifest` tracks what each dev installed (version, preset, skills, timestamp)
- `--update` re-installs the same preset with the latest version
- Version bumps follow semver: patch (fixes), minor (new skills/patterns), major (breaking changes)

---

## Developer Onboarding

### Prerequisites

- **Node.js 20** (not 24 — drizzle-kit bug)
- **GitHub CLI** (`gh`)
- **Claude Code CLI** (`claude`)
- **direnv** (`brew install direnv`) — auto-switches GitHub accounts per project via `.envrc`

### Quick Start (5 minutes)

```bash
# 1. Clone the repo
git clone https://github.com/newearthcollectiveteam/web-eco.git
cd web-eco

# 2. Install Claude framework (choose Standard preset)
./scripts/setup-claude.sh --preset=standard

# 3. Set up environment
cp .env.example .env   # Fill in credentials (ask project lead)

# 4. Install dependencies and run
npm install
npm run dev            # Visit http://localhost:3000
```

### Full Onboarding (run /onboarding)

The `/onboarding` skill walks through 8 phases interactively:

1. **Orientation** — what will happen
2. **GitHub & Git** — auth, remote URL, identity
3. **Node & Dependencies** — version, install, hooks
4. **Environment Variables** — `.env` setup with guidance
5. **Claude Framework** — preset selection (see Framework Distribution)
6. **Verification** — typecheck, lint, build, dev server smoke test
7. **First Branch** — create a feature branch to start working
8. **Summary** — quick reference card

### Day 1 Checklist

- [ ] GitHub access (added to org)
- [ ] Clone repo, run setup
- [ ] Claude framework installed (Standard preset recommended)
- [ ] `.env` configured with Supabase credentials
- [ ] Dev server runs locally
- [ ] First feature branch created
- [ ] Read `CLAUDE.md` (project-specific instructions)
- [ ] Read `CONTRIBUTING.md` (team workflow)

### Ongoing: Session Discipline

Every developer session follows:

```
/resume → work → /handoff
```

This keeps `STATUS.md` and `TODO.md` current for the whole team.

---

## Codebase Maintenance

### Routine Maintenance Schedule

| Frequency         | Action                       | Skill                      | Who           |
| ----------------- | ---------------------------- | -------------------------- | ------------- |
| Every session end | Update STATUS.md + TODO.md   | `/handoff`                 | Every dev     |
| Weekly            | Project hygiene check        | `/tidy`                    | Rotating      |
| Weekly            | Sync TODO comments from code | `/sync-todos`              | Rotating      |
| Before release    | Quality validation           | `/validate` + `/cohere`    | Release owner |
| Before release    | Accessibility check          | `/a11y`                    | Release owner |
| Monthly           | Full quality sweep           | `/audit-sweep`             | Lead          |
| Monthly           | Dependency review            | Dependabot PRs             | Lead          |
| Quarterly         | Framework version update     | `setup-claude.sh --update` | All devs      |

### Dependency Management

**Dependabot configuration (`.github/dependabot.yml`):**

- **Security vulnerabilities**: Enable Dependabot alerts + security updates in GitHub Settings (auto-PRs for CVEs)
- **Version bumps**: Monthly schedule, grouped into single PRs (minor/patch together, majors separate)
- **Commit prefix**: `chore(deps):` for npm, `chore(ci):` for GitHub Actions
- **Target branch**: `dev` (not `main`)

**Review policy:**

- **Patch bumps:** review CI, merge if green
- **Minor bumps:** review changelog, test locally, merge
- **Major bumps** (e.g., zod 3→4): create a feature branch, test thoroughly, may need code changes
- Never merge dependency PRs during a release freeze

### Quality Gates

Every PR must pass:

1. Prettier formatting
2. ESLint (no warnings)
3. TypeScript compilation (strict mode)
4. Next.js production build

Additional gates before release:

5. `/validate` (standards compliance)
6. `/cohere` (pattern coherence)
7. Manual smoke test of affected features

### Code Health Indicators

Monitor these in `/tidy` and `/scorecard`:

- TODO.md item count (target: <30 items)
- STATUS.md freshness (updated within last 2 sessions)
- Inline TODO/FIXME count (decreasing trend)
- TypeScript strict mode compliance
- Bundle size trends

### Recovery Procedures

**Broken build:**

1. Check CI logs for the failing step
2. If typecheck: fix type errors (don't use `@ts-ignore`)
3. If lint: run `npm run lint:fix`
4. If build: check for runtime imports in server code

**Stale documentation:**

1. Run `/tidy` to identify drift
2. Update STATUS.md with current state
3. Reconcile TODO.md with actual progress
4. Archive completed roadmaps with `/close-roadmap`

**Framework out of sync:**

1. Owner: run `/sync-framework` to push latest to repo
2. Devs: `git pull && ./scripts/setup-claude.sh --update`

---

## Tool Arsenal

### Development Tools

| Tool               | Purpose                                         | Install                              |
| ------------------ | ----------------------------------------------- | ------------------------------------ |
| **Node.js**        | Runtime                                         | `nvm install 20`                     |
| **pnpm**           | Package manager                                 | `npm i -g pnpm`                      |
| **Turbopack**      | Fast bundler                                    | Built into Next.js                   |
| **Drizzle Studio** | DB viewer                                       | `npm run db:studio`                  |
| **Supabase CLI**   | Local dev                                       | `brew install supabase/tap/supabase` |
| **direnv**         | Per-project env vars (GitHub account switching) | `brew install direnv`                |
| **Husky**          | Git hook management                             | `npm install --save-dev husky`       |
| **lint-staged**    | Run linters on staged files only                | `npm install --save-dev lint-staged` |

### VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "mikestead.dotenv"
  ]
}
```

### CLI Commands

```bash
# Project setup
npx create-next-app@latest --typescript
npx shadcn@latest init
npx drizzle-kit push

# Development
npm run dev           # Start dev server
npm run typecheck     # Check types
npm run lint          # Lint code
npm run db:studio     # Open DB viewer

# Database
npm run db:push       # Push schema
npm run db:generate   # Generate migration
npm run db:migrate    # Run migrations

# Testing
npm run test          # Run tests
npm run test:ui       # Test UI
npm run test:e2e      # E2E tests
```

---

## Skills Reference

Skills are organized by category and adoption tier. See [Framework Distribution](#framework-distribution) for how presets map to categories.

### Essential Tier — Every Developer

**Session** (5 skills) — Session lifecycle: start, work, end

| Skill            | Purpose                                   |
| ---------------- | ----------------------------------------- |
| `/init-session`  | Load project context (architecture, docs) |
| `/resume`        | Full resume (context + session state)     |
| `/handoff`       | Save session state at session end         |
| `/smart-compact` | Interactive context capture before reset  |
| `/snapshot`      | Quick read-only status snapshot           |

**Collaboration** (6 skills) — Git workflow for team development (add via `/collab-setup`)

| Skill       | Purpose                                 |
| ----------- | --------------------------------------- |
| `/checkout` | Create/switch feature branch from dev   |
| `/pr`       | Push branch + open pull request         |
| `/review`   | Review a PR with quality checks         |
| `/sync`     | Pull latest upstream, resolve conflicts |
| `/release`  | Merge dev → main for production         |
| `/push`     | Quality gate + review + confirmed push  |

### Recommended Tier — Most Developers

**Quality** (11 skills) — Code quality, auditing, and hygiene

| Skill          | Purpose                                        |
| -------------- | ---------------------------------------------- |
| `/validate`    | Double-check project follows standards         |
| `/cohere`      | Deep pattern coherence check                   |
| `/tidy`        | Project hygiene (stale docs, roadmap)          |
| `/brand`       | Brand lifecycle (init/extract/audit/whitelist) |
| `/a11y`        | Accessibility audit for pages/components       |
| `/responsive`  | Mobile responsiveness audit                    |
| `/qa`          | Generate QA checklists for features            |
| `/scorecard`   | Quality scorecard with category breakdown      |
| `/audit-sweep` | Full quality sweep: audit, fix, commit         |
| `/sync-todos`  | Sync inline comments to TODO.md                |
| `/inventory`   | Audit routes and technology inventory          |

### Advanced Tier — Power Users

**Multi-Agent** (3 skills) — Parallel branch coordination (optional)

| Skill        | Purpose                                    |
| ------------ | ------------------------------------------ |
| `/spawn`     | Create feature branches and worker prompts |
| `/claim`     | Claim branch assignment in worker session  |
| `/integrate` | Merge completed feature branches into dev  |

### Maintainer Tier — Framework Owner

**Project Setup** (4 skills) — Scaffolding and initialization

| Skill             | Purpose                                              |
| ----------------- | ---------------------------------------------------- |
| `/init-standards` | Add CLAUDE.md, STATUS.md, TODO.md                    |
| `/seed`           | Scaffold new project                                 |
| `/align`          | Add missing stack to existing project                |
| `/onboarding`     | Full developer onboarding                            |
| `/collab-setup`   | Turn single-dev project into multi-dev collaborative |

**Utilities** (6 skills) — Framework maintenance and discovery

| Skill             | Purpose                                       |
| ----------------- | --------------------------------------------- |
| `/discover`       | Dynamic search, analyze, install MCPs         |
| `/framework`      | View this framework document                  |
| `/close-roadmap`  | Archive completed roadmap, cleanup            |
| `/sync-framework` | Sync framework to project distribution        |
| `/sync-to-global` | Promote patterns to global config             |
| `/sync-all`       | Bidirectional framework sync (crash recovery) |

**Total: 36 skills across 6 categories**

---

## Templates

All templates located in `~/.claude/templates/`:

| Template     | Purpose                       |
| ------------ | ----------------------------- |
| `CLAUDE.md`  | Project instructions template |
| `STATUS.md`  | Feature status template       |
| `TODO.md`    | Work tracking template        |
| `ROADMAP.md` | Phased development template   |

---

## Patterns Library

Optional reference patterns in `~/.claude/patterns/`. Pull from these when relevant — not auto-included in projects. Max 20 patterns (consolidate if exceeding).

### Pattern Categories

| Prefix     | Category         | Description                     |
| ---------- | ---------------- | ------------------------------- |
| `ui-`      | UI components    | Reusable component patterns     |
| `state-`   | State management | React state patterns            |
| `api-`     | API/backend      | tRPC, external service patterns |
| `routing-` | Navigation       | Routing and middleware patterns |
| `billing-` | Payments         | Stripe, payment integration     |
| `auth-`    | Authentication   | Auth and role patterns          |
| `crm-`     | CRM/contacts     | Contact management patterns     |

### Available Patterns

| Pattern                               | Use Case                                                                       |
| ------------------------------------- | ------------------------------------------------------------------------------ |
| `ui-action-menu.md`                   | Declarative admin action menus with variant support                            |
| `ui-toast.md`                         | Sonner-based toast notifications for mutations                                 |
| `ui-kanban-dnd.md`                    | Drag-and-drop kanban board with @dnd-kit + optimistic updates                  |
| `ui-admin-dashboard-shell.md`         | Admin layout with sidebar, header, standalone page detection                   |
| `ui-inline-editable.md`               | Click-to-edit fields for inline renaming                                       |
| `ui-markdown-toolbar.md`              | Markdown formatting toolbar for textareas with lightweight renderer            |
| `ui-icon-color-mapping.md`            | Data-driven icon/color resolution from database strings                        |
| `state-session-scoped.md`             | Tab filter state that persists across navigation                               |
| `state-dynamic-enums.md`              | DB-stored enums with color, icon, and sort order (runtime categories)          |
| `api-external-linking.md`             | Link internal records with external service IDs (Stripe)                       |
| `api-bearer-token-integration.md`     | Typed REST API wrapper with bearer token auth                                  |
| `api-smart-categorization.md`         | Two-tier categorization: DB-learned history + regex rules                      |
| `auth-role-hierarchy.md`              | Multi-layer role enforcement: middleware → procedure → query scope             |
| `crm-pipeline-management.md`          | Status-based pipeline with promotion/demotion, upsert dedup, activity timeline |
| `finance-multi-source-aggregation.md` | Combine Stripe + bank data into unified P&L, dashboards, and tax reports       |
| `routing-multi-domain.md`             | Multi-domain routing with rewrites, redirects, analytics, cookie merging       |
| `sharing-public-token.md`             | Token-based public sharing with OG metadata and custom slugs                   |

**How to use:**

1. Check if pattern applies to your use case
2. Read the pattern file: `cat ~/.claude/patterns/<name>.md`
3. Adapt to your project (patterns are starting points, not copy-paste)
4. See `~/.claude/patterns/README.md` for full index

---

## Troubleshooting

### Common Issues

| Issue                   | Solution                                        |
| ----------------------- | ----------------------------------------------- |
| "Module not found"      | Check path alias in tsconfig.json               |
| tRPC type errors        | Restart TS server, check router exports         |
| Supabase auth issues    | Check cookies, verify env vars                  |
| Drizzle migration fails | Run `db:push` instead of `db:migrate` for dev   |
| Build fails on Vercel   | Check `SKIP_ENV_VALIDATION` or add all env vars |

### Debug Commands

```bash
# Check TypeScript
npx tsc --noEmit

# Check env vars
node -e "console.log(process.env.DATABASE_URL)"

# Test DB connection
npx drizzle-kit studio

# Clear Next.js cache
rm -rf .next
```

---

## Changelog

### v1.23.1 (2026-03-21)

- Enhanced `/tidy` cross-reference check: full coherence enforcement between ROADMAP ↔ TODO ↔ STATUS
- Checks: phase completion flow, version coherence, stale file:line refs, bug/status conflicts

### v1.23.0 (2026-03-21)

- Added Husky + lint-staged as standard git hook tooling (replaces manual install-hooks.sh)
- Added Dependabot config standard: monthly grouped version bumps, `chore(deps):` prefix, security updates
- Added direnv as standard tool for per-project GitHub account switching
- Expanded `/collab-setup` checklist: Husky, lint-staged, Dependabot, direnv, Git workflow guide
- Added direnv, Husky, lint-staged to Tool Arsenal and Developer Onboarding prerequisites

### v1.22.0 (2026-03-19)

- Rewrote multi-agent workflow: feature branches instead of worktrees (workers get full repo access)
- Marked multi-agent as optional in framework (not all projects need it)
- Updated `/spawn` — creates feature branches, generates terminal-based worker prompts
- Updated `/claim` — simplified for feature branch workflow
- Updated `/integrate` — merges feature branches into dev
- Updated `MULTIAGENT.md` — removed worktree-specific coordination files
- Added `/collab-setup` — converts single-dev project to multi-dev (CI, branch protection, PR templates)
- Added `/sync-all` — bidirectional framework sync for crash recovery
- Total skills: 36

### v1.21.0 (2026-03-19)

- Added `manifest.json` — source of truth for framework categories, skill tiers, and installation presets
- Rewrote `setup-claude.sh` — safe, selective, merge-based installer with backup, presets, --update, --restore
- Added Framework Distribution section — documents how the framework travels between machines (architecture, roles, sync flows, version management)
- Added Developer Onboarding section — quick start, full /onboarding walkthrough, day 1 checklist, session discipline
- Added Codebase Maintenance section — routine schedule, dependency management, quality gates, code health indicators, recovery procedures
- Reorganized Skills Reference by category and adoption tier (essential → recommended → advanced → maintainer)
- Updated `/onboarding` Phase 5 — replaced misleading A/B/C options with honest preset-based choices
- Updated `/sync-framework` — includes manifest.json in sync, validates skills against manifest
- Updated CONTRIBUTING.md — references preset-based setup script
- Total skills: 34

### v1.20.0 (2026-03-17)

- Added 6 collaboration skills: `/checkout`, `/pr`, `/review`, `/sync`, `/release`, `/sync-framework`
- Added collaborative branching strategy to Git Workflow section (two-tier: dev → main)
- Added GitHub Actions CI, PR templates, CODEOWNERS, branch protection documentation
- Added collaboration skills table to Git Workflow section
- Added beginner context sections to all collaboration skills (plain-language jargon definitions)
- Updated `/handoff` and `/resume` for multi-developer support (developer tracking, @owner tags, team activity)
- Updated TODO.md format: `@name` tags for task assignment
- Updated STATUS.md format: author column in recent changes, "Last Updated By" field
- Integrated `/sync-framework` into `/handoff`, `/push`, and `/release` for automatic framework distribution sync
- Total skills: 33

### v1.19.0 (2026-03-16)

- Added pattern: `ui-kanban-dnd.md` — drag-and-drop kanban board with @dnd-kit, optimistic updates, multi-view
- Added pattern: `state-dynamic-enums.md` — DB-stored enums with color/icon/sortOrder for runtime categories
- Added pattern: `ui-admin-dashboard-shell.md` — admin layout with sidebar context and standalone page detection
- Added pattern: `ui-inline-editable.md` — click-to-edit fields for inline renaming
- Added pattern: `ui-markdown-toolbar.md` — markdown formatting toolbar for textareas with lightweight renderer
- Added pattern: `ui-icon-color-mapping.md` — data-driven icon/color resolution from database strings
- Updated pattern: `routing-multi-domain.md` — added non-blocking analytics, cookie merging, rewrite vs redirect, public embed exceptions
- Updated pattern: `crm-pipeline-management.md` — added upsert service, multi-source tracking, GDPR consent, activity timeline
- Total patterns: 17

### v1.18.0 (2026-02-11)

- Added `/audit-sweep` skill — full quality sweep pipeline (parallel audits, prioritized fixes, commit)
- Total skills: 25

### v1.17.0 (2026-02-11)

- Added pattern: `auth-role-hierarchy.md` — multi-layer role enforcement (middleware → procedure → query scope)
- Added pattern: `crm-pipeline-management.md` — status-based pipeline with promotion/demotion and multi-source enrichment
- Added pattern: `finance-multi-source-aggregation.md` — combine payment processor + bank into unified P&L and tax reports
- Total patterns: 12

### v1.16.0 (2026-02-11)

- Updated LLM model IDs: Sonnet `claude-sonnet-4-5-20250929`, Haiku `claude-haiku-4-5-20251001`
- Added pattern: `api-bearer-token-integration.md` — typed REST API wrapper with bearer token auth
- Added pattern: `api-smart-categorization.md` — two-tier categorization engine (DB history + regex rules)
- Total patterns: 9

### v1.15.0 (2026-02-09)

- Added Long Plan Context Management section (context budget estimation, mandatory checkpoints, plan segmentation, recovery protocol, anti-patterns)
- Prevents session crashes from large implementation plans exceeding the context window

### v1.14.0 (2026-02-04)

- Added Documentation Anti-Bloat Rules section (STATUS.md caps, archive triggers, single source of truth)
- Added Accessibility Requirements section with checklist and patterns
- Enhanced API Patterns: Query configuration defaults, RBAC pattern, cache invalidation
- Added 4 new pattern files: `ui-action-menu`, `ui-toast`, `state-session-scoped`, `api-external-linking`
- Reorganized patterns with category prefixes (`ui-`, `state-`, `api-`, `routing-`, `billing-`)
- Added `/a11y` skill for accessibility auditing
- Added `/qa` skill for QA checklist generation
- Added `/scorecard` skill for quality scorecards
- Updated Patterns Library section with full index and category table
- Total skills: 24

### v1.13.0 (2026-02-03)

- Refactored `/brand` from project-specific to abstract framework skill
- `/brand` now supports 4 modes: init, extract, audit, whitelist
- Brand config lives in project CLAUDE.md (`## Brand Reference`), skill defines the process
- Added brand integration hooks to `/seed`, `/validate`, `/cohere`, `/init-standards`, `/tidy`
- Total skills: 21

### v1.12.0 (2026-02-03)

- Added `/brand` skill for Miracle Mind brand consistency auditing (gold/black theme)
- Added staging template system (`StagingCard` component + `staging-templates.ts`)
- Fixed `serial` → `integer` on FK columns across clientProjects, clientResources, clientUpdates, clientAgreements
- Total skills: 21

### v1.11.1 (2026-02-03)

- Added `/snapshot` skill for quick read-only session status (done, in progress, next)
- Total skills: 20

### v1.11.0 (2026-02-03)

- Added `/push` skill for pre-push quality gate, coherence check, and confirmed push
- Added Push Protocol section to Git Workflow (pre-push hook + `/push` skill)
- Added `scripts/pre-push.sh` and `scripts/install-hooks.sh` patterns
- Total skills: 19

### v1.10.0 (2026-02-02)

- Added `/tidy` skill for project hygiene checks (stale docs, completed roadmaps, TODO drift)
- Added `/close-roadmap` skill for archiving completed roadmaps and reconciling docs
- Integrated hygiene checks into `/handoff` (quick scan at session end)
- Integrated hygiene checks into `/validate` (full scan during standards check)
- Enhanced `/resume` to surface roadmap completion status at session start
- Renamed "Code Quality" category to "Code Quality & Hygiene"
- Total skills: 18

### v1.9.0 (2026-02-01)

- Added Patterns Library section for optional reference patterns
- Added `multi-domain-routing` pattern (serve multiple domains from single codebase)
- Patterns are stored in `~/.claude/patterns/` and pulled when needed

### v1.8.0 (2026-01-28)

- Added `/init-session` skill for loading project context (architecture, docs, codebase orientation)
- Enhanced `/resume` to include full project context, not just session state
- `/resume` now combines init-session + session continuity

### v1.7.0 (2026-01-27)

- Rewrote `/discover` as dynamic search agent (was static documentation)
- `/discover` now: analyzes project, searches live sources, offers auto-install
- Installed MCP servers: supabase, memory, stripe
- Fixed skill count: 15 total
- All documentation cross-references updated

### v1.6.0 (2026-01-27)

- Added LLM Integration Patterns section (Vercel AI SDK, tool calling, streaming)
- Added Claude Dev Memory tools to /discover (persistent context across sessions)
- Added Building LLM Apps category with Vercel AI SDK + LangGraph patterns
- Framework now covers full AI app development lifecycle

### v1.5.0 (2026-01-27)

- Added `/discover` skill for external skill & MCP server discovery
- Added intuitive trigger system for skill invocation
- Added external tool awareness (Stripe, Neo4j, Graphiti, SVG, etc.)
- Added MCP ecosystem documentation and resources
- Total skills: 15

### v1.4.0 (2026-01-27)

- Added `/cohere` skill for deep pattern coherence checking
- Fixed critical gap: added tRPC API route handler to seed templates
- Renamed "Code Maintenance" to "Code Quality" category
- Total skills: 15

### v1.3.0 (2026-01-27)

- Added `/align` skill for upgrading existing projects to unified stack
- Enhanced `/seed` with full SEO metadata (OpenGraph, Twitter cards, viewport)
- Added template placeholders: {{AUTHOR_NAME}}, {{BASE_URL}}
- Removed T3/create-t3-app branding remnants
- Total skills: 14

### v1.2.0 (2026-01-27)

- Added structured error handling pattern (AppError, ErrorCodes, createError factories)
- Synced from website-ecosystem project

### v1.1.0 (2026-01-27)

- Added `/smart-compact` skill for interactive context preservation before /compact
- Added `/validate` skill for double-checking project standards compliance
- Enhanced `/sync-to-global` with auto-add to FRAMEWORK.md and interactive pattern questions
- Total skills: 13

### v1.0.0 (2026-01-27)

- Initial framework documentation
- Unified tech stack definition
- Documentation standards (CLAUDE.md, STATUS.md, TODO.md)
- Code conventions and patterns
- Database and API patterns (Drizzle, tRPC)
- Authentication patterns (Supabase)
- UI/Component patterns (shadcn/ui)
- Environment management
- Testing standards
- Security best practices
- Performance patterns
- Git workflow
- Session workflow (/resume, /handoff)
- Multi-agent workflow (/spawn, /claim, /integrate)
- Tool arsenal
- Complete skills reference

---

## Contributing to This Framework

To update this framework:

1. Identify an improvement while working in any project
2. Run `/sync-to-global`
3. Select "Documentation standard" → "FRAMEWORK.md"
4. Describe the change
5. Framework updates for all projects

**Canonical Location:** `~/.claude/FRAMEWORK.md`

**View from any project:**

- Run `/framework`
- Or: `cat ~/.claude/FRAMEWORK.md`
- Or: Check `FRAMEWORK.md` symlink in project root
