---
name: inventory
description: Audit ecosystem routes and technology inventory against actual codebase
allowed-tools: Read, Glob, Grep, Bash, Write, Edit, AskUserQuestion
---

# Inventory - Ecosystem & Technology Audit

Scan the codebase to detect drift between the actual routes/dependencies and the documented inventory pages. Surfaces missing entries, stale statuses, and removed items.

**Philosophy:** The ecosystem map and technology inventory are living documents. This skill keeps them honest by comparing documentation against reality.

## When to Use

| Trigger                                 | Action                        |
| --------------------------------------- | ----------------------------- |
| After adding new routes or pages        | Run `/inventory routes`       |
| After adding/removing npm packages      | Run `/inventory tools`        |
| After changing env vars or integrations | Run `/inventory tools`        |
| Periodic project check (weekly/monthly) | Run `/inventory` (full audit) |
| Called from `/tidy` or `/validate`      | Quick drift check only        |

## Modes

### Full Audit (default)

Runs both route and tool audits. Use: `/inventory`

### Routes Only

Audits ecosystem map against filesystem. Use: `/inventory routes`

### Tools Only

Audits technology inventory against package.json, env vars, and imports. Use: `/inventory tools`

### Quick Check (called from other skills)

Lightweight drift detection — counts only, no detailed report. Returns `[PASS]`, `[WARN]`, or `[INFO]` indicators.

## Steps

### Step 1 — Locate Inventory Files

Look for the project's inventory pages. These are not required — if they don't exist, suggest creating them.

```
Ecosystem map:  src/app/admin/ecosystem/page.tsx  (or similar)
Technology inventory: src/app/admin/tooling/page.tsx (or similar)
Database inventory: src/app/admin/tooling/database/page.tsx (or similar)
```

If neither exists, inform the user and offer to scaffold them. Skip to Step 5.

### Step 2 — Route Audit

**2a. Discover actual routes:**

```bash
find src/app -name "page.tsx" | sort
```

**2b. Extract documented routes:**
Read the ecosystem map file and extract all `path:` values from the route array.

**2c. Compare:**

| Check                                     | How                                        | Severity                         |
| ----------------------------------------- | ------------------------------------------ | -------------------------------- |
| Route exists in filesystem but not in map | Compare file paths → route paths           | `[WARN]` — missing from map      |
| Route in map but no filesystem match      | Check if page.tsx exists for the path      | `[WARN]` — ghost entry           |
| Status says "dev" but feature is working  | Cross-ref with STATUS.md                   | `[INFO]` — stale status          |
| Redirect routes have no `redirectTo`      | Check for `redirect()` calls in page files | `[INFO]` — undocumented redirect |

**2d. Check for new redirects:**

```bash
# Page-level redirects
grep -r "redirect(" src/app --include="*.tsx" -l

# Middleware redirects (scan for new patterns)
grep "NextResponse.redirect" src/middleware.ts
```

### Step 3 — Technology Audit

**3a. Extract documented tools:**
Read the tooling page and extract all service `name` values from the services array.

**3b. Check package.json:**
Read `package.json` and compare dependencies + devDependencies against documented tools.

| Check                                 | How                                               | Severity                                               |
| ------------------------------------- | ------------------------------------------------- | ------------------------------------------------------ |
| Dependency not in inventory           | New package in package.json                       | `[WARN]` — undocumented tool                           |
| Inventory tool not in package.json    | Service listed but no matching dep                | `[INFO]` — may be external service (OK) or removed dep |
| Version mismatch                      | Compare inventory `version` field to package.json | `[INFO]` — version drift                               |
| Env var referenced but not documented | Grep for `process.env.` patterns                  | `[WARN]` — undocumented env var                        |

**3c. Check for new env vars:**

```bash
grep -roh "process\.env\.\w\+" src/ | sort -u
```

Compare against documented `envVars` arrays in the inventory.

### Step 4 — Database Audit (if database page exists)

**4a. Extract documented tables:**
Read the database page and extract all table `name` values.

**4b. Extract actual tables from schema:**
Read the Drizzle schema file (typically `src/server/db/schema.ts`) and extract all `pgTable()` or `sqliteTable()` calls.

**4c. Compare:**

| Check                                | How                                         | Severity                        |
| ------------------------------------ | ------------------------------------------- | ------------------------------- |
| Table in schema but not in inventory | New table added                             | `[WARN]` — missing from DB page |
| Table in inventory but not in schema | Table removed or renamed                    | `[WARN]` — ghost entry          |
| Column count mismatch                | Count columns in schema vs documented count | `[INFO]` — stale column count   |

### Step 5 — Generate Report

```
## Inventory Audit Report

### Routes
- [PASS] 151/151 routes documented
- [WARN] 3 new routes not in ecosystem map:
  - /admin/new-feature
  - /portal/[slug]/demos/new-demo
  - /api/new-endpoint
- [INFO] 1 status correction: /admin/feature should be "live" not "dev"

### Technology
- [PASS] 47/47 tools documented
- [WARN] 2 new dependencies not in inventory:
  - date-fns@4.1.0 (added to package.json)
  - @upstash/redis@1.34.0 (added to package.json)
- [INFO] 3 version updates:
  - React: documented 19.0.0, actual 19.1.0

### Database
- [PASS] 22/22 tables documented
- [WARN] 1 new table: notification_preferences (not in DB page)

---

**Summary:** 6 items need attention (3 warnings, 3 info)
```

### Step 6 — Offer Fixes

Use AskUserQuestion:

- **"Fix all automatically"** — update inventory pages with new entries, correct versions/statuses
- **"Fix one section at a time"** — walk through routes, then tools, then database
- **"Just report, don't fix"** — output the report only
- **"Update audit date only"** — just stamp the "Last audited" comment

When fixing:

- New routes: add to `ECOSYSTEM_ROUTES` with sensible defaults (status: "live", domain/access inferred from path)
- New tools: add to `SERVICES` with name, version from package.json, category best-guess
- New tables: add to appropriate `TABLE_GROUPS` domain
- Always ask before removing entries (may be intentionally deprecated)

## Quick Check Mode (for /tidy and /validate)

When called from another skill, skip the detailed report and return a compact summary:

```
### Inventory
- [PASS] Ecosystem map: 151 routes documented, 151 actual
- [WARN] Technology inventory: 47 documented, 49 actual (2 new deps)
- [PASS] Database: 22 tables documented, 22 actual
```

Only flag warnings and info — skip passes if everything is clean.

## Integration with Other Skills

| Skill       | Integration       | What runs                                                   |
| ----------- | ----------------- | ----------------------------------------------------------- |
| `/tidy`     | Calls quick check | Route count + tool count + table count comparison           |
| `/validate` | Calls quick check | Same as tidy, included in standards report                  |
| `/handoff`  | Mentions drift    | If routes or deps changed this session, note in summary     |
| `/push`     | Optional gate     | Warn if `package.json` changed but inventory wasn't updated |

## Scaffold Mode

If inventory pages don't exist in the project, offer to create them:

1. **Ecosystem map** — scan `src/app` for all `page.tsx` files, generate route array with inferred domain/access/status
2. **Technology inventory** — scan `package.json`, generate service array with categories
3. **Database page** — scan schema file, generate table groups with column counts and FK references

This makes `/inventory` useful for new projects adopting the framework, not just existing ones.

## Tone

- Factual and efficient — "3 new routes found" not "Your ecosystem map is incomplete!"
- Treat missing entries as normal drift, not failures
- Fixes are offered, never forced
