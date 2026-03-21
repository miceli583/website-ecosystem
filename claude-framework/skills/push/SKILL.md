---
name: push
description: Pre-push safety checks, coherence review, and confirmed push for live projects
allowed-tools: Read, Bash, Glob, Grep, AskUserQuestion
---

# Push - Safe Push Protocol

Pre-push safety checks, coherence review, and confirmed push for live production projects. Goes beyond the automated pre-push hook by adding coherence checks, diff review, and explicit confirmation.

## When to Use

- Before pushing to main/production branches
- After completing a feature or fix session
- When `/handoff` has been run and you're ready to ship

## Phases

### Phase 1: Quality Gate

Run automated checks. Stop immediately on any failure.

```bash
npm run typecheck
```

If passes, continue:

```bash
npm run lint
```

If passes, continue:

```bash
SKIP_ENV_VALIDATION=1 npm run build
```

**On failure:** Report the specific errors clearly. Offer to fix if auto-fixable (lint issues). Do NOT proceed to Phase 2.

### Phase 2: Coherence Check

Only runs if Phase 1 passes completely.

#### 2.1 Working Tree Status

```bash
git status --short
```

- If clean: note as good
- If dirty: WARN with list of uncommitted changes
- Check for untracked source files specifically:

```bash
git ls-files --others --exclude-standard -- '*.ts' '*.tsx' '*.sql'
```

If any found: WARN that new source files are not tracked.

#### 2.2 Documentation Freshness

- Read `STATUS.md`: Check "Last Updated" date. If older than today, WARN.
- Read `TODO.md`: Scan for items that look obviously stale.
- This is informational, not blocking.

#### 2.3 Framework Distribution Check

If `claude-framework/` exists in the project:

```bash
ls claude-framework/FRAMEWORK.md 2>/dev/null
```

If present, compare versions:

```bash
grep 'Version:' ~/.claude/FRAMEWORK.md | head -1
grep 'Version:' claude-framework/FRAMEWORK.md | head -1
```

If versions differ: WARN "Framework distribution is behind canonical (v<old> vs v<new>). Run `/sync-framework` or it will auto-sync on next `/handoff`."

#### 2.3 Push Diff Summary

Detect the upstream reference:

```bash
UPSTREAM=$(git rev-parse --abbrev-ref @{upstream} 2>/dev/null || echo "origin/main")
```

Then gather the diff:

```bash
git log $UPSTREAM..HEAD --oneline
git diff --stat $UPSTREAM..HEAD
git diff --shortstat $UPSTREAM..HEAD
```

If no commits ahead: report "Nothing to push" and stop.

### Phase 3: Confirmation

Present a summary using this format:

```
## Push Summary

**Branch:** <current branch>
**Remote:** <upstream>
**Commits:** X commits

### Commits
- <hash> <message>
- ...

### Impact
- Y files changed
- +Z insertions, -W deletions

### Warnings
- <any warnings from Phase 2, or "None">
```

Then use AskUserQuestion with these options:

1. **Push now** - proceed to Phase 4
2. **Run /handoff first** - update docs before pushing (user should run /handoff, then /push again)
3. **Cancel** - abort, no push

Do NOT push without explicit user confirmation.

### Phase 4: Push

Only after user selects "Push now":

```bash
git push origin HEAD
```

**On success:**

```
Push complete.
  Branch: <branch> -> <remote>/<branch>
  Commits: X pushed
```

**On failure (rejected):**

```
Push rejected. Remote has new commits.
  Run: git pull --rebase origin <branch>
  Then re-run /push
```

## Relationship to Other Skills

| Skill       | Role                                    |
| ----------- | --------------------------------------- |
| `/handoff`  | Update STATUS.md/TODO.md before pushing |
| `/push`     | Quality gate + review + confirmed push  |
| `/validate` | Structural checks (complementary)       |
| `/cohere`   | Pattern checks (complementary, heavier) |

**Recommended session end flow:**

```
/handoff    # Save session state
/push       # Quality gate + push
```

## Notes

- Works from any project with a `package.json`
- The pre-push git hook (`scripts/pre-push.sh`) provides the automated baseline
- This skill provides the comprehensive, interactive experience
- Both coexist: if using this skill, the hook will still run on push but should pass since Phase 1 already verified everything
