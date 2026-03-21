# Audit Sweep

Run a comprehensive quality sweep across the entire project: audit, report, fix, and commit.

## Purpose

Combines multiple audit skills into a single automated pipeline. Runs all audits in parallel, consolidates findings into a prioritized fix list, executes fixes systematically, then commits the result.

## When to Use

- Before a release or deployment
- Periodic quality maintenance (weekly/monthly)
- After a large feature branch merge
- When the user says "audit", "quality sweep", "full check", or "audit sweep"

## Pipeline

### Phase 1: Parallel Audits (read-only)

Launch all 6 audits simultaneously as background agents:

| Audit          | Skill         | What it checks                                                          |
| -------------- | ------------- | ----------------------------------------------------------------------- |
| **Align**      | `/align`      | Tech stack completeness and version alignment                           |
| **Tidy**       | `/tidy`       | Doc freshness, TODO drift, git hygiene, dead code, dependency health    |
| **Validate**   | `/validate`   | Standards compliance (docs, structure, config, env, code quality)       |
| **Cohere**     | `/cohere`     | Pattern coherence against unified framework (API, DB, auth, components) |
| **Responsive** | `/responsive` | Mobile breakpoints, overflow, touch targets, fixed dimensions           |
| **A11y**       | `/a11y`       | ARIA labels, form labels, modals, semantic HTML, keyboard nav           |

Each agent should:

1. Read relevant files (never modify)
2. Report findings with file paths and line numbers
3. Categorize by severity: Critical / Warning / Info
4. Return a structured summary

### Phase 2: Consolidate Findings

After all agents complete, merge results into a single prioritized report:

```
## Audit Sweep Results

### Grades
| Audit      | Grade | Critical | Warning | Info |
|------------|-------|----------|---------|------|
| Align      | A     | 0        | 0       | 0    |
| Tidy       | A-    | 0        | 1       | 0    |
| ...        | ...   | ...      | ...     | ...  |

### Top Priority Fixes
1. [Critical] Description — file:line
2. [Critical] Description — file:line
3. [Warning] Description — file:line
...
```

Present this report to the user and ask: **"Fix all of these? Or select specific items?"**

### Phase 3: Systematic Fixes

Group fixes by type and parallelize independent batches:

**Batch strategy:**

- Group fixes that touch the same file together (avoid merge conflicts between agents)
- Independent file groups can run as parallel agents
- Each agent gets a specific list of files and exact changes to make

**Suggested batches:**

1. **Quick wins** (direct edits): Single-line fixes like missing attributes, env vars, meta tags
2. **A11y batch**: aria-labels, modal ARIA, form labels, semantic fixes
3. **Cohere batch**: Error handling patterns, naming consistency, import cleanup
4. **Responsive batch**: Overflow fixes, dimension scaling, touch targets
5. **Console/cleanup batch**: Log removal, dead code, unused imports

**Rules for fix agents:**

- Read each file before editing
- Only change what's specified — no drive-by refactors
- Preserve existing formatting and style
- Run type check after completing all edits

### Phase 4: Verify & Commit

1. Run `tsc --noEmit` to verify no type errors
2. Show the user a summary of all changes
3. Stage all modified files
4. Commit with message format:

```
Quality sweep: <comma-separated categories>

- <bullet for each major change>

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

## Optional Add-ons

Based on Phase 1 findings, suggest additional skills if relevant:

| Finding                  | Suggest                           |
| ------------------------ | --------------------------------- |
| TODO.md drift detected   | Run `/sync-todos` first           |
| ROADMAP.md 100% complete | Run `/close-roadmap`              |
| Brand violations found   | Run `/brand audit`                |
| Inventory drift detected | Run `/inventory`                  |
| Unstaged changes present | Commit or stash before proceeding |

## Configuration

The user can customize which audits to include:

```
/audit-sweep                    # All 6 audits
/audit-sweep a11y responsive    # Only specific audits
/audit-sweep --report-only      # Audit but don't fix
/audit-sweep --no-commit        # Fix but don't commit
```

## Context Management

This skill involves many file reads and edits. To avoid context exhaustion:

- Phase 1 agents run in background (don't consume main context)
- Phase 3 fix agents also run in background where possible
- If more than 20 files need fixing, split into two commits
- Checkpoint with `/smart-compact` if context exceeds 60%

## Output

After completion, display:

```
## Audit Sweep Complete

### Before → After
| Audit      | Before | After |
|------------|--------|-------|
| Align      | A      | A     |
| Responsive | B-     | B+    |
| A11y       | B-     | B+    |
| ...        | ...    | ...   |

### Changes
- X files modified
- Y issues fixed (Z critical, W warning)
- Commit: <hash> <message>

### Remaining (deferred)
- [ ] Item that needs manual review
- [ ] Item too large for this sweep
```
