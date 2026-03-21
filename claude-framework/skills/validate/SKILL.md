---
name: validate
description: Double-check that a project follows unified development standards
allowed-tools: Read, Glob, Grep, Bash
---

# Validate Project Standards

A friendly "double-check" to verify a project follows the unified development standards. This is a helpful sanity check, not strict enforcement. Claude adapts to each project's needs - these are guidelines, not rules.

**Philosophy:** Helpful suggestions, not gatekeeping. Every project is unique.

## What This Checks

1. **Required files exist** - CLAUDE.md, STATUS.md, TODO.md
2. **TODO.md structure** - Semantic categories (Critical/Bugs/Tech Debt/Enhancements)
3. **STATUS.md length** - Under 100 lines (keeps it scannable)
4. **CLAUDE.md sections** - Overview, Quick Commands, Tech Stack, Key Paths
5. **Stale inline TODOs** (optional) - TODOs in code not tracked in TODO.md
6. **Project hygiene** (from /tidy) - Roadmap lifecycle, checked items, doc staleness

## Steps

### 1. Check Required Files

```bash
# Check for required documentation files
ls -la CLAUDE.md STATUS.md TODO.md 2>/dev/null
```

For each file:

- Present: Note as passing
- Missing: Note as suggestion (not error)

### 2. Validate TODO.md Structure

If TODO.md exists, read it and check for semantic sections:

```
## Critical (blocks production)
## Bugs (broken functionality)
## Tech Debt (code quality)
## Enhancements (nice to have)
```

**Flexible matching:**

- Section headers don't need to be exact
- "## Critical" or "## Critical (blocks production)" both work
- "## Bugs" or "## Broken" or "## Fixes Needed" all count
- The intent matters more than exact wording

### 3. Check STATUS.md Length

```bash
wc -l STATUS.md
```

- Under 100 lines: Good
- 100-150 lines: Suggestion to trim
- Over 150 lines: Recommend moving details to docs/

### 4. Validate CLAUDE.md Sections

Read CLAUDE.md and look for key sections:

| Section        | Look For                                        | Required? |
| -------------- | ----------------------------------------------- | --------- |
| Overview       | `## Overview` or project description at top     | Helpful   |
| Quick Commands | `## Quick Commands` or code block with npm/yarn | Helpful   |
| Tech Stack     | `## Tech Stack` or `## Architecture`            | Helpful   |
| Key Paths      | `## Key Paths` or table with paths              | Helpful   |

**Note:** Exact headers aren't required. Look for the intent/content.

### 5. Check for Stale TODOs (Optional Deep Check)

Only run if user requests deep validation or project is small:

```bash
# Find inline TODOs in source code
grep -rn "TODO:" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | head -20
```

Cross-reference with TODO.md:

- Inline TODOs not in TODO.md: Suggest running `/sync-todos`
- Items in TODO.md with file:line refs that don't exist: Note as potentially stale

### 6. Brand Reference Check

If CLAUDE.md contains a `## Brand Reference` section, validate its structure:

| Subsection         | Look For                           | Required?       |
| ------------------ | ---------------------------------- | --------------- |
| Palette            | `### Palette` with color table     | If brand exists |
| Typography         | `### Typography` with font table   | If brand exists |
| Off-brand Patterns | `### Off-brand Patterns` with list | Helpful         |
| Exceptions         | `### Exceptions` with list         | Helpful         |
| Scan Scope         | `### Scan Scope` with include/skip | Helpful         |

If `## Brand Reference` is incomplete (missing subsections), suggest running `/brand init` to fill in gaps.

If no `## Brand Reference` exists, note as `[INFO]`: "No brand guidelines defined. Run `/brand init` if this project has a visual identity."

### 7. Project Hygiene (from /tidy)

Run the hygiene checks from `/tidy` as part of validation:

- **ROADMAP.md lifecycle**: If exists, check completion %. If 100%, suggest `/close-roadmap`.
- **TODO.md checked items**: Count `[x]` items. If > 0, suggest removing.
- **STATUS.md staleness**: Check "Last Updated" date. If > 7 days old, flag.
- **docs/ archivability**: Check for docs not modified in 30+ days via `git log`.

Include findings in the output under a "### Project Hygiene" section, using the same `[PASS]`/`[WARN]`/`[INFO]` indicators.

## Output Format

```
## Project Standards Check

### Files
- [PASS] CLAUDE.md exists
- [PASS] STATUS.md exists (42 lines)
- [WARN] TODO.md missing - consider adding for work tracking

### Structure
- [PASS] TODO.md has semantic categories
- [PASS] STATUS.md under 100 lines

### CLAUDE.md Content
- [PASS] Has overview section
- [PASS] Has quick commands
- [WARN] Missing "Key Paths" section - helpful for navigation

### Inline TODOs (optional check)
- Found 5 inline TODOs
- 3 tracked in TODO.md
- 2 not tracked - run /sync-todos to capture

---

## Summary

**Status:** Mostly Good

**Suggestions:**
1. Add TODO.md for work tracking (quick win)
2. Add "Key Paths" table to CLAUDE.md

**Note:** These are suggestions to improve project discoverability.
Your project works fine without them - use what helps you.
```

## Status Indicators

| Indicator | Meaning                    |
| --------- | -------------------------- |
| `[PASS]`  | Meets standard             |
| `[WARN]`  | Suggestion for improvement |
| `[INFO]`  | Informational note         |

**No `[FAIL]` status** - this is a double-check, not enforcement.

## When to Skip Checks

Some projects legitimately differ:

- **Solo projects**: May not need STATUS.md
- **Simple scripts**: May only need README.md
- **Established projects**: May have different conventions

If the user says "this project is intentionally minimal" or similar, acknowledge it and skip irrelevant checks.

## Example Usage

**User:** "run /validate"

**Claude:**

1. Runs through checks
2. Reports findings with pass/warn
3. Offers helpful suggestions
4. Asks if user wants to fix any warnings (don't auto-fix)

**User:** "run /validate --deep"

**Claude:**

1. Runs all checks including inline TODO scan
2. Cross-references inline TODOs with TODO.md
3. Reports potential stale items

## Tone Guidelines

- Be helpful, not judgmental
- "You might want to..." not "You must..."
- "Consider adding..." not "Missing required..."
- Acknowledge that standards serve the developer, not the other way around
- If everything passes, celebrate briefly and move on
