---
name: close-roadmap
description: Archive a completed ROADMAP.md, reconcile TODO.md, bump version
allowed-tools: Read, Write, Edit, Bash, Glob
---

# Close Roadmap

Archive a completed (or substantially complete) ROADMAP.md, clean up TODO.md, and bump the project version. This is the focused roadmap lifecycle skill — a subset of what `/tidy` checks.

**When to use:**

- Manually when you know the roadmap is done
- When `/tidy`, `/handoff`, or `/validate` suggest it

## Steps

### 1. Verify Roadmap State

Read ROADMAP.md and count items:

```bash
ls ROADMAP.md 2>/dev/null
```

- Count `- [ ]` (incomplete) and `- [x]` (complete)
- If < 90% complete, warn the user and list remaining items
- Ask for confirmation before proceeding

**If no ROADMAP.md exists:** Inform user and exit.

### 2. Archive ROADMAP.md

```bash
# Ensure archive directory exists
mkdir -p docs/archive
```

Move ROADMAP.md to archive with date stamp:

```bash
# Archive with date
cp ROADMAP.md docs/archive/ROADMAP-$(date +%Y-%m-%d).md
```

Then either:

- **Delete ROADMAP.md** if the user confirms no new roadmap is needed
- **Reset ROADMAP.md** with a fresh template if the user wants to start a new phase

### 3. Reconcile TODO.md

Read TODO.md and clean up:

- **Remove `[x]` items** — they're done, git has history
- **Remove items that were part of the roadmap** and are now complete
- **Keep items that are organic** (discovered during work, not part of original roadmap)
- **Ensure sections aren't empty** — remove empty section headers

### 4. Update STATUS.md

- **Bump version** (increment minor: 0.4.x → 0.5.0 for roadmap completion)
- **Update "Last Updated" date**
- **Update feature statuses** to reflect roadmap completion
- **Add a recent change entry** noting roadmap completion

### 5. Ask About Next Phase

Prompt the user:

> Roadmap archived. Would you like to:
>
> 1. Start a new ROADMAP.md for the next phase
> 2. Continue with just TODO.md for now
> 3. Do nothing — I'll create a roadmap when needed

If option 1: Create a fresh ROADMAP.md with section headers only.

## Output Format

```
## Roadmap Closed

**Archived to:** docs/archive/ROADMAP-2026-02-02.md
**Items completed:** 18/20 (2 moved to TODO.md as ongoing)
**Version bumped:** 0.4.3 → 0.5.0

### Cleanup Summary
- Removed 12 checked items from TODO.md
- Updated 3 feature statuses in STATUS.md
- 2 incomplete roadmap items preserved in TODO.md

### Next Phase
[User's choice about new roadmap]
```

## Safety

- **Always ask before deleting** ROADMAP.md
- **Always show what will be removed** from TODO.md before doing it
- **Never delete incomplete items** without user confirmation
- **Preserve items that aren't part of the roadmap** in TODO.md
