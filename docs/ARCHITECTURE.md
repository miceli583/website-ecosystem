# Architecture

## Dual-Purpose Pattern: Workshop + Showcase

This codebase implements a dual-purpose architecture where assets exist in both public and private contexts.

### Living Asset Libraries

Assets like shaders, templates, and playground components exist permanently in both contexts:

```
PUBLIC (Portfolio)              PRIVATE (Workshop)
/shaders                        /admin/shaders
/templates                      /admin/templates
/playground                     /admin/playground
```

**Benefits:**
- Safe experimentation without affecting public portfolio
- Continuous improvement in private workspace
- Professional presentation of polished work
- Assets serve dual function as tools AND demonstrations

**Workflow:**
1. Build/experiment in `/admin/shaders`
2. Test and refine privately
3. When ready, add to public `/shaders` showcase
4. Both versions remain active
5. Continue improving in `/admin`

### Dev Preview Pages

Domain homepages have temporary private versions for safe testing:

```
PUBLIC (Live)                   PRIVATE (Dev Preview)
/                               /admin/matthewmiceli
                                /admin/miraclemind-live
                                /admin/miraclemind-dev
```

Same components, different routing context. The `isDevPreview` prop allows components to adjust behavior for dev context.

---

## Multi-Domain Routing

### How It Works

Middleware-based domain detection serves different content based on hostname:

- **Production:** Detects actual domain (matthewmiceli.com, miraclemind.dev)
- **Development:** Uses `?domain=` query parameter for localhost
- **Configuration:** Centralized in `src/lib/domains.ts`

### Domain Configuration

Each domain has:
- Custom navigation
- Brand colors and logos
- Description and tagline
- Theme identifier

### Routing Logic

The middleware (`src/middleware.ts`):
1. Detects hostname
2. Enforces authentication for `/admin/*` routes
3. Redirects `miraclemind.live` to `miraclemind.dev`
4. Restricts admin routes to `miraclemind.dev` domain
5. Controls playground access (matthewmiceli.com only)

---

## Component Organization

```
src/
├── app/
│   ├── page.tsx                    # Multi-domain homepage
│   ├── shaders/                    # Public showcase
│   ├── templates/                  # Public showcase
│   ├── playground/                 # Public demos
│   └── admin/
│       ├── page.tsx                # Dev hub dashboard
│       ├── shaders/                # Development workshop
│       ├── templates/              # Development workspace
│       ├── playground/             # Experimentation lab
│       ├── matthewmiceli/          # Homepage preview
│       ├── miraclemind-live/       # Homepage preview
│       └── miraclemind-dev/        # Homepage preview
├── components/
│   ├── pages/
│   │   ├── matthew-home.tsx        # Reusable homepage
│   │   ├── miraclemind-live-home.tsx
│   │   ├── miraclemind-dev-home.tsx
│   │   └── dev-hub.tsx             # Admin dashboard
│   ├── domain-layout.tsx           # Multi-domain wrapper
│   └── back-button.tsx             # Admin navigation
└── lib/
    └── domains.ts                  # Domain configuration
```

---

## Known Issues

### Landing Page Duplication

**Problem:** 27 nearly-identical files (3 page types x 9 color themes)

```
/admin/dope-ass-landing/      # 9 color variations
/admin/join-community-1/      # 9 color variations
/admin/launch-landing-1/      # 9 color variations
```

Each variation is 99% identical with only theme differences.

**Recommended Fix:** Refactor to dynamic routes with theme configuration:

```typescript
// Current: 27 files
/admin/dope-ass-landing/page.tsx
/admin/dope-ass-landing/emerald/page.tsx
...

// Proposed: 3 files
/admin/dope-ass-landing/[theme]/page.tsx
/admin/join-community-1/[theme]/page.tsx
/admin/launch-landing-1/[theme]/page.tsx
```

With a theme configuration object:

```typescript
// src/lib/landing-themes.ts
export const LANDING_THEMES = {
  golden: {
    name: "DOPE ASS",
    bgColor: "black",
    gradientFrom: "#facf39",
    gradientTo: "#f59e0b",
  },
  emerald: { ... },
  "cosmic-blue": { ... },
} as const;
```

---

## Design Principles

1. **Separation of Concerns** - Public showcase vs private workspace
2. **Component Reusability** - Same components work in both contexts
3. **Safe Development** - Break things privately, showcase publicly
4. **Professional Presentation** - Public routes always show polished work
5. **Flexibility** - Assets serve multiple purposes simultaneously
