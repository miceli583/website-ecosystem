---
name: tidy
description: Project hygiene check - stale docs, completed roadmaps, TODO drift, doc cleanup
allowed-tools: Read, Glob, Grep, Bash
---

# Tidy - Project Hygiene Check

General-purpose cleanup skill that detects stale documentation, completed roadmaps, TODO drift, and doc bloat. Can be run standalone or is called as part of `/handoff` and `/validate`.

**Philosophy:** Surface issues, suggest fixes, never auto-modify without asking.

## What This Checks

1. **Roadmap lifecycle** - Is ROADMAP.md fully complete? Stale? Out of sync with TODO.md?
2. **TODO.md hygiene** - Completed items lingering? Over 100 lines? Checked items that should be removed?
3. **STATUS.md drift** - Last updated date stale? Feature status outdated? Over 100 lines?
4. **Doc bloat** - Files in docs/ that could be archived? Superseded docs still active?
5. **Checked-off items** - `[x]` items in TODO.md or ROADMAP.md that should be cleaned up

## Steps

### 1. Check ROADMAP.md Lifecycle

If ROADMAP.md exists:

```bash
# Check if roadmap exists
ls ROADMAP.md 2>/dev/null
```

Read ROADMAP.md and analyze:

- **Count total items** (lines matching `- [ ]` or `- [x]`)
- **Count completed items** (lines matching `- [x]`)
- **Calculate completion percentage**

| Completion | Status         | Action                                   |
| ---------- | -------------- | ---------------------------------------- |
| 100%       | Fully complete | Suggest `/close-roadmap` to archive      |
| 75-99%     | Nearly done    | Note remaining items, suggest cleanup    |
| < 75%      | Active         | No action needed                         |
| 0% (stale) | Stale          | Suggest review — roadmap may be outdated |

Also check:

- Are roadmap items reflected in TODO.md? (items should flow down)
- Are there TODO.md items not in the roadmap? (scope creep or organic work)

### 2. Check TODO.md Hygiene

```bash
# Line count
wc -l TODO.md 2>/dev/null

# Count checked items
grep -c '\- \[x\]' TODO.md 2>/dev/null
```

| Issue                   | Detection                    | Suggestion                                   |
| ----------------------- | ---------------------------- | -------------------------------------------- |
| Checked items lingering | `[x]` items present          | Remove or archive completed items            |
| Over 100 lines          | `wc -l > 100`                | Prune completed items, move details to docs/ |
| Empty sections          | Section header with no items | Remove empty sections                        |

### 3. Check STATUS.md Drift

Read STATUS.md and check:

- **Last Updated date** — more than 7 days old? Flag as potentially stale
- **Line count** — over 100 lines? Suggest trimming
- **Recent Changes table** — more than 5 entries? Suggest trimming to last 5

### 4. Check docs/ for Archivable Content

```bash
# List docs
ls docs/*.md 2>/dev/null

# Check for archive directory
ls docs/archive/ 2>/dev/null
```

Flag docs that may be archivable:

- Files not modified in 30+ days (check git log)
- Files that reference completed features or old sessions
- Session notes or planning docs from past work

### 5. Brand Reference Freshness

If CLAUDE.md contains a `## Brand Reference` section:

- Check if `### Scan Scope` directories still exist in the project
- Flag if scan scope references directories that have been renamed or removed
- Note as `[WARN]` if brand reference exists but has no `### Exceptions` (common source of false positives in `/brand audit`)

If no brand reference exists, skip this check silently.

### 6. Inventory Drift (Optional)

If the project has inventory pages (ecosystem map, tooling/technology, database), run a quick drift check:

```bash
# Count actual routes
find src/app -name "page.tsx" | wc -l

# Count documented routes (extract from ecosystem page)
grep -c "path:" src/app/admin/ecosystem/page.tsx 2>/dev/null

# Count actual dependencies
jq '.dependencies + .devDependencies | length' package.json 2>/dev/null
```

Compare counts against the documented inventories:

| Check                 | Detection                                   | Severity                               |
| --------------------- | ------------------------------------------- | -------------------------------------- |
| Route count mismatch  | Actual page.tsx count ≠ ecosystem map count | `[WARN]` — suggest `/inventory routes` |
| New deps not tracked  | package.json deps > inventory entries       | `[INFO]` — suggest `/inventory tools`  |
| Schema tables changed | pgTable count in schema.ts ≠ DB page count  | `[WARN]` — suggest `/inventory`        |

If no inventory pages exist, skip silently. This check is lightweight — for a full audit, suggest `/inventory`.

### 7. Cross-Reference Check

Compare across files:

- Items marked done in ROADMAP.md but still open in TODO.md
- Items in TODO.md with file:line references that no longer exist
- Features in STATUS.md marked "Working" that have open bugs in TODO.md

## Output Format

```
## Project Hygiene Check

### Roadmap
- [PASS] ROADMAP.md is 60% complete (12/20 items) — active, no action needed
  OR
- [WARN] ROADMAP.md is 100% complete — consider running /close-roadmap to archive
  OR
- [INFO] No ROADMAP.md found — not needed for this project

### TODO.md
- [PASS] 45 lines, within limit
- [WARN] 8 checked items could be removed
- [PASS] All sections have content

### STATUS.md
- [PASS] Updated 2 days ago
- [PASS] 48 lines, within limit
- [WARN] Recent changes table has 7 entries — trim to 5

### Documentation
- [INFO] docs/old-plan.md last modified 45 days ago — consider archiving
- [PASS] No stale docs found

### Inventory
- [PASS] Ecosystem map: 151 routes documented, 151 actual
- [WARN] Technology inventory: 47 documented, 49 actual — run `/inventory tools`
  OR
- [INFO] No inventory pages found — skip

### Cross-References
- [WARN] TODO.md has "Fix auth bug" but STATUS.md shows Auth as "Working"
- [PASS] No orphaned file:line references

---

## Summary

**Overall:** Mostly Clean

**Suggested Actions:**
1. Remove 8 checked items from TODO.md
2. Trim recent changes table in STATUS.md to 5 entries

Run these fixes? (y/n)
```

## Integration with Other Skills

This skill is designed to be called from other skills:

| Caller      | What it runs                 | When                              |
| ----------- | ---------------------------- | --------------------------------- |
| `/handoff`  | Roadmap check + TODO hygiene | At session end, after updates     |
| `/validate` | Full tidy check              | During standards validation       |
| `/resume`   | Roadmap status only          | At session start, surface to user |

When called from another skill, output is abbreviated (no full header, just findings).

## Standalone Usage

**User:** `/tidy`

- Run full hygiene check
- Present findings
- Offer to fix issues (with confirmation)

**User:** `/tidy --fix`

- Run full check AND auto-fix safe items:
  - Remove `[x]` items from TODO.md
  - Trim STATUS.md recent changes to last 5
- Still ask before: archiving ROADMAP.md, deleting docs

## Tone

- Informational, not judgmental
- "Consider archiving..." not "You must clean up..."
- If everything is clean, say so briefly and move on
- Don't nag about minor issues
