# Architecture Notes

## Dual-Purpose Architecture: Workshop + Showcase

### Overview

This codebase implements a sophisticated **dual-purpose architecture** with two distinct content strategies:

1. **Living Asset Libraries** (Shaders, Templates, Playground)
   - Permanent public AND private versions
   - Private = Development workshop
   - Public = Portfolio showcase

2. **Dev Preview Pages** (Domain homepages)
   - Temporary private testing versions
   - Eventually replace public versions

---

## Living Asset Libraries: Workshop + Showcase Pattern

### The Pattern

Assets like Shaders, Templates, and Playground exist in **both contexts permanently**:

```
PUBLIC ROUTES (Portfolio/Showcase):
/shaders          -> Gallery showcasing finished shader work
/templates        -> Curated template designs for visitors
/playground       -> Interactive component demos for clients

PRIVATE ROUTES (Development Workshop):
/admin/shaders    -> Active workspace for developing/testing shaders
/admin/templates  -> Build and refine template designs
/admin/playground -> Experiment with new components
```

### Key Benefits

1. **Safe Experimentation**: Break things in `/admin` without affecting public portfolio
2. **Continuous Improvement**: Iterate on assets privately before updating showcase
3. **Professional Presentation**: Public routes show polished, curated work
4. **Living Portfolio**: Showcase stays updated as workshop produces new assets
5. **Dual Function**: Assets serve as both tools and demonstrations

### Asset Flow

```
1. Build/experiment in /admin/shaders
2. Test and refine
3. When ready, add to public /shaders showcase
4. Both versions remain active
5. Continue improving in /admin
6. Update public showcase when desired
```

### Example: Shaders

**Private Workshop** (`/admin/shaders`):

- All 8+ shader experiments
- Development versions with debug controls
- Raw, unpolished variations
- Testing ground for new effects

**Public Showcase** (`/shaders`):

- Curated selection of best shaders
- Polished presentations
- Client-ready demonstrations
- Professional portfolio piece

---

## Dev Preview Pages: Test Before Live

### The Pattern

Domain homepages have **temporary private versions** for safe testing:

```
PUBLIC (Production):
/                 -> Multi-domain homepage (matthewmiceli.com, miraclemind.live, etc.)

PRIVATE (Dev Preview):
/admin/matthewmiceli      -> Test matthewmiceli.com changes before deployment
/admin/miraclemind-live   -> Test miraclemind.live changes before deployment
/admin/miraclemind-dev    -> Test miraclemind.dev changes before deployment
```

### Key Benefits

1. **Risk-Free Testing**: Preview changes without affecting live site
2. **Component Reusability**: Same components used in both contexts
3. **Quick Iteration**: Test → Fix → Deploy cycle
4. **Shared Codebase**: Changes to component automatically affect both

### Example: MatthewHomePage

**Public Usage** (`src/app/page.tsx:42`):

```tsx
return <MatthewHomePage />;
```

**Private/Dev Usage** (`src/app/admin/matthewmiceli/page.tsx:27`):

```tsx
<MatthewHomePage isDevPreview={true} domainParam={domainParam} />
```

Same component, different routing context. The `isDevPreview` prop allows component to adjust behavior for dev context (e.g., links point to `/admin` routes instead of public routes).

---

## Landing Pages: Marketing Assets

### Current State

Marketing landing pages exist only in `/admin` (not yet public):

```
/admin/dope-ass-landing/      -> Epic countdown landing page (9 color variations)
/admin/join-community-1/      -> Community waitlist page (9 color variations)
/admin/launch-landing-1/      -> Event launch page (9 color variations)
```

These are **pure marketing pages** being developed for future campaigns/launches.

### ⚠️ Known Issue: Code Duplication

**Problem**: 27 nearly-identical files (3 page types × 9 color themes)

Each theme variation is 99% identical with only these differences:

- Background color
- Header/footer colors
- Heading text
- Description text

**Impact**:

- Bug fixes require updating 27 files
- New features need to be copied across all variations
- Easy to create inconsistencies
- Larger bundle size

### Recommended Refactoring

Consolidate to dynamic routes with theme configuration:

```typescript
// Current (27 files):
/admin/dope-ass-landing/page.tsx
/admin/dope-ass-landing/emerald/page.tsx
/admin/dope-ass-landing/cosmic-blue/page.tsx
... (24 more files)

// Proposed (3 files):
/admin/dope-ass-landing/[theme]/page.tsx
/admin/join-community-1/[theme]/page.tsx
/admin/launch-landing-1/[theme]/page.tsx
```

**Implementation**:

```typescript
// src/lib/landing-themes.ts
export const LANDING_THEMES = {
  golden: {
    name: "DOPE ASS",
    description: "Something absolutely incredible is about to drop.",
    bgColor: "black",
    headerBg: undefined,
    gradientFrom: "#facf39",
    gradientTo: "#f59e0b",
  },
  emerald: {
    name: "EMERALD",
    description: "Pure emerald brilliance, radiant and regenerative.",
    bgColor: "#059669",
    headerBg: "#059669",
    gradientFrom: "#facf39",
    gradientTo: "#f59e0b",
  },
  "cosmic-blue": {
    name: "COSMIC BLUE",
    description: "Journey through the cosmic expanse of infinite blue.",
    bgColor: "#0891b2",
    headerBg: "#0891b2",
    gradientFrom: "#facf39",
    gradientTo: "#f59e0b",
  },
  // ... 6 more themes
} as const;

// src/app/admin/dope-ass-landing/[theme]/page.tsx
export default function DopeAssLandingPage({
  params
}: {
  params: { theme: string }
}) {
  const theme = LANDING_THEMES[params.theme] || LANDING_THEMES.golden;

  return (
    <DomainLayout
      headerClassName={theme.headerBg ? `bg-[${theme.headerBg}]` : undefined}
      // ... use theme config throughout
    >
      {/* Component using theme.name, theme.description, etc. */}
    </DomainLayout>
  );
}
```

**Benefits**:

- 27 files → 3 files
- Single source of truth per template
- Theme changes update all variations instantly
- Bug fixes apply everywhere automatically
- Easy to add new themes (just add to config object)

**When to Refactor**:

- Before adding new features to landing pages
- When adding more theme variations
- When performance optimization needed
- Before these pages go public

---

## Architecture Summary

### This is NOT Duplication ✅

1. **Shaders** - Public showcase + Private workshop (permanent dual-purpose)
2. **Templates** - Public gallery + Private workspace (permanent dual-purpose)
3. **Playground** - Public demos + Private experiments (permanent dual-purpose)
4. **Homepage Previews** - Public live + Private testing (intentional separation)

### This IS Duplication ⚠️

1. **Landing Page Themes** - 27 files with 99% identical code (needs refactoring)

---

## Domain Configuration

See `src/lib/domains.ts` for multi-domain setup:

- Hostname-based routing logic
- Per-domain branding (colors, logos, navigation)
- Localhost development with `?domain=` parameter
- Three domains: matthewmiceli.com, miraclemind.live, miraclemind.dev

## Component Organization

```
src/
├── app/
│   ├── page.tsx                    # Public: Multi-domain homepage
│   ├── shaders/                    # Public: Shader showcase gallery
│   ├── templates/                  # Public: Template showcase gallery
│   ├── playground/                 # Public: Component demos gallery
│   ├── admin/
│   │   ├── page.tsx                # Private: Dev hub/dashboard
│   │   ├── shaders/                # Private: Shader development workshop
│   │   ├── templates/              # Private: Template development workspace
│   │   ├── playground/             # Private: Component experimentation lab
│   │   ├── matthewmiceli/          # Private: Homepage dev preview
│   │   ├── miraclemind-live/       # Private: Homepage dev preview
│   │   ├── miraclemind-dev/        # Private: Homepage dev preview
│   │   ├── dope-ass-landing/       # Private: Marketing pages (needs refactor)
│   │   ├── join-community-1/       # Private: Marketing pages (needs refactor)
│   │   └── launch-landing-1/       # Private: Marketing pages (needs refactor)
├── components/
│   ├── pages/
│   │   ├── matthew-home.tsx        # Reusable homepage component
│   │   ├── miraclemind-live-home.tsx
│   │   ├── miraclemind-dev-home.tsx
│   │   └── dev-hub.tsx             # Admin dashboard
│   ├── domain-layout.tsx           # Multi-domain layout wrapper
│   └── back-button.tsx             # Admin navigation helper
├── lib/
│   └── domains.ts                  # Domain configuration & routing
```

---

## Design Principles

1. **Separation of Concerns**: Public showcase vs private workspace
2. **Component Reusability**: Same components work in both contexts
3. **Safe Development**: Break things privately, showcase publicly
4. **Professional Presentation**: Public routes always show polished work
5. **Flexibility**: Assets can serve multiple purposes simultaneously

---

**Last Updated**: 2025-11-10
**Documented By**: Code Review - Claude
**Architecture Pattern**: Workshop + Showcase (Dual-Purpose Living Assets)
