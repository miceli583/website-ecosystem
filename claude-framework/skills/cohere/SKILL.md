---
name: cohere
description: Deep coherence check - verify code patterns match the unified framework
allowed-tools: Read, Grep, Glob, Bash, AskUserQuestion
---

# Cohere - Pattern Coherence Check

Deep analysis to verify that actual code matches the patterns documented in FRAMEWORK.md. Goes beyond structural checks (`/validate`) to examine code quality and consistency.

## Purpose

`/validate` asks: "Do the right files exist?"
`/cohere` asks: "Does the code follow the right patterns?"

This catches:

- Framework pattern violations
- Inconsistent coding styles
- Missing best practices
- Drift from documented standards

## When to Use

- Before major releases (quality gate)
- After onboarding new code/features
- Periodic health checks
- When something "feels off" about code quality
- Before `/sync-to-global` (ensure pattern is actually good)

## Coherence Checks

### 1. Import Consistency

```bash
# Check for inconsistent import aliases
grep -rn "from ['\"]\.\./" src/ --include="*.ts" --include="*.tsx" | head -20
grep -rn "from ['\"]~/" src/ --include="*.ts" --include="*.tsx" | head -5
```

**Expected:** All imports use `~/` alias, not relative `../../../`
**Report:** Count of relative vs alias imports, files with violations

### 2. Error Handling Pattern

```bash
# Check for raw Error throws instead of createError
grep -rn "throw new Error" src/ --include="*.ts" --include="*.tsx"
grep -rn "throw new TRPCError" src/ --include="*.ts" --include="*.tsx"
grep -rn "createError\." src/ --include="*.ts" --include="*.tsx"
```

**Expected:** Uses `createError.notFound()`, `createError.unauthorized()`, etc.
**Report:** Instances of raw throws vs pattern usage

### 3. tRPC Router Patterns

Check routers follow framework patterns:

```typescript
// GOOD - Framework pattern
export const exampleRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.db.query...
      if (!item) throw createError.notFound("Item", input.id);
      return item;
    }),
});

// BAD - Missing validation, raw error
export const exampleRouter = createTRPCRouter({
  getById: protectedProcedure
    .query(async ({ ctx, input }) => {
      const item = await ctx.db.query...
      if (!item) throw new Error("Not found");
      return item;
    }),
});
```

**Checks:**

- All inputs have Zod validation
- Procedures use `protectedProcedure` or `publicProcedure` explicitly
- Error handling uses `createError` factories
- Async operations have proper error boundaries

### 4. Database Query Patterns

```bash
# Check for raw SQL vs Drizzle patterns
grep -rn "\.execute(" src/ --include="*.ts"
grep -rn "db\.query\." src/ --include="*.ts"
grep -rn "db\.select\(\)" src/ --include="*.ts"
```

**Expected:** Uses Drizzle query builder, not raw SQL
**Report:** Query pattern distribution

### 5. Component Patterns

```bash
# Check for proper "use client" directives
grep -rn "^\"use client\"" src/components/ --include="*.tsx" | wc -l
grep -rn "useState\|useEffect" src/components/ --include="*.tsx" | head -10
```

**Expected:** Components with hooks have "use client"
**Report:** Client components properly marked

### 6. Naming Conventions

```bash
# Check file naming (should be kebab-case or camelCase, not mixed)
find src -name "*_*" -type f  # Snake case files
find src -name "*.tsx" -type f | xargs basename -a | sort | uniq
```

**Expected:** Consistent naming (kebab-case for files, PascalCase for components)
**Report:** Naming convention violations

### 7. Environment Variable Usage

```bash
# Check for process.env direct access vs env.js
grep -rn "process\.env\." src/ --include="*.ts" --include="*.tsx"
grep -rn "env\." src/ --include="*.ts" --include="*.tsx" | grep -v "process.env"
```

**Expected:** Uses validated `env.VARIABLE`, not raw `process.env.VARIABLE`
**Report:** Unvalidated env access instances

### 8. Authentication Patterns

```bash
# Check for consistent auth usage
grep -rn "getServerSession\|getUser\|createServerClient" src/ --include="*.ts"
```

**Expected:** Consistent auth helper usage across server code
**Report:** Auth pattern consistency

### 9. API Response Patterns

```bash
# Check for consistent response patterns in API routes
grep -rn "NextResponse\.json" src/app/api/ --include="*.ts" -A 2
```

**Expected:** Consistent success/error response structure
**Report:** Response pattern variations

### 10. Type Safety

```bash
# Check for type assertions and any usage
grep -rn "as any\|: any" src/ --include="*.ts" --include="*.tsx"
grep -rn "// @ts-ignore\|// @ts-expect-error" src/ --include="*.ts" --include="*.tsx"
```

**Expected:** Minimal `any` usage, no ignored errors without justification
**Report:** Type safety violations

### 11. Brand Coherence

If the project's CLAUDE.md contains a `## Brand Reference` section, run a lightweight brand check:

```bash
# Check for off-brand Tailwind color classes in scan scope
grep -rn "(off-brand patterns from Brand Reference)" (scan scope directories)
```

**Expected:** No off-brand color classes in scan scope (excluding exceptions)
**Report:** Count of brand violations with file:line references

This is a subset of what `/brand audit` does — just enough to surface brand drift during a general coherence check. For a full brand audit, recommend `/brand audit`.

## Output Format

```
## Coherence Report - <project-name>

### Summary
| Check | Status | Issues |
|-------|--------|--------|
| Import consistency | PASS | 0 |
| Error handling | WARN | 3 violations |
| tRPC patterns | PASS | 0 |
| Database patterns | PASS | 0 |
| Component patterns | WARN | 2 missing "use client" |
| Naming conventions | PASS | 0 |
| Env usage | FAIL | 5 raw process.env |
| Auth patterns | PASS | 0 |
| Response patterns | PASS | 0 |
| Type safety | WARN | 2 `as any` casts |

### Overall: 7/10 checks passing

---

### Issues Detail

#### Error Handling (3 violations)
- `src/server/api/routers/posts.ts:45` - Uses `throw new Error("Not found")` instead of `createError.notFound()`
- `src/lib/api.ts:23` - Raw Error throw
- `src/lib/api.ts:67` - Raw Error throw

**Fix:** Import `createError` from `~/lib/errors` and use typed factories.

#### Component Patterns (2 issues)
- `src/components/Dashboard.tsx` - Uses useState but missing "use client"
- `src/components/Settings.tsx` - Uses useEffect but missing "use client"

**Fix:** Add `"use client"` directive at top of file.

#### Environment Usage (5 issues)
- `src/lib/api.ts:12` - `process.env.API_KEY`
- ...

**Fix:** Add variables to `src/env.js` and import from there.

---

### Recommendations

1. **High Priority:** Fix environment variable usage - security risk
2. **Medium:** Add error handling pattern to remaining files
3. **Low:** Add "use client" directives

### Quick Fixes

Would you like me to fix any of these issues? [Select which]
- [ ] Add "use client" to components with hooks
- [ ] Replace raw Error throws with createError
- [ ] Migrate process.env to env.js
```

## Interactive Mode

After presenting the report, offer to fix issues:

```
I found 10 issues across 3 categories. Would you like me to:

1. Fix all automatically (will show diff before applying)
2. Fix specific category only
3. Show me the code changes without applying
4. Skip - I'll fix manually
```

## Severity Levels

| Level | Meaning                     | Action            |
| ----- | --------------------------- | ----------------- |
| PASS  | Follows framework pattern   | None needed       |
| INFO  | Minor deviation, acceptable | Consider aligning |
| WARN  | Pattern violation           | Should fix        |
| FAIL  | Critical violation          | Must fix          |

## Relationship to Other Skills

| Skill             | Scope                                  |
| ----------------- | -------------------------------------- |
| `/validate`       | Structure - do files exist?            |
| `/cohere`         | Patterns - does code follow standards? |
| `/align`          | Action - add missing components        |
| `/sync-to-global` | Evolution - promote good patterns      |

**Workflow:**

1. `/validate` - Check structure
2. `/cohere` - Check patterns
3. `/align` or manual fixes - Address issues
4. If you found a better pattern → `/sync-to-global`

## Configuration

Optionally skip checks by adding to project's CLAUDE.md:

```markdown
## Cohere Overrides

- Skip: naming-conventions (intentionally using snake_case for API)
- Skip: env-validation (using different env solution)
```

## Examples

**Quick check:**

```
/cohere
```

**Specific check:**

```
/cohere error-handling
/cohere imports
/cohere types
```

**Auto-fix mode:**

```
/cohere --fix
```
