---
name: sync
description: Sync current branch with latest upstream — pull, merge, and resolve conflicts
allowed-tools: Read, Bash, Glob, Grep, AskUserQuestion
---

# Sync - Branch Synchronization

Pull the latest changes from upstream and merge them into your current branch. Handles the common scenarios: updating dev, syncing a feature branch with dev, and syncing main after a release.

## When to Use

- Before starting work (ensure you have latest changes)
- When a PR says "branch is behind" or has merge conflicts
- User says "sync", "update", "pull latest", "branch is behind"
- After someone else merges into dev

## Arguments

- `/sync` — sync current branch with its natural upstream
- `/sync dev` — explicitly sync with dev
- `/sync main` — explicitly sync with main

## Steps

### Phase 1: Assess Current State

```bash
CURRENT=$(git branch --show-current)
echo "Current branch: $CURRENT"
```

```bash
git status --short
```

- If uncommitted changes: WARN and ask to stash or commit first.

```bash
git fetch origin
```

### Phase 2: Determine Upstream

If the user specified a branch, use that. Otherwise, auto-detect:

| Current branch             | Sync with                                    |
| -------------------------- | -------------------------------------------- |
| `dev`                      | `origin/main` (pull production changes)      |
| `main`                     | `origin/main` (just pull)                    |
| `feature/*`, `fix/*`, etc. | `origin/dev` (get latest integration branch) |

```bash
# Check how far behind we are
git rev-list --count HEAD..origin/<upstream>
git rev-list --count origin/<upstream>..HEAD
```

### Phase 3: Report Status

```
## Sync Status

**Branch:** <current>
**Upstream:** origin/<upstream>
**Behind:** X commits
**Ahead:** Y commits
```

If already up to date (0 behind): "Already up to date. No sync needed." STOP.

### Phase 4: Merge

```bash
git merge origin/<upstream>
```

#### If merge succeeds (no conflicts):

```
## Sync Complete

**Merged:** X commits from origin/<upstream>
**Branch:** <current> is now up to date

No conflicts. Ready to work.
```

#### If merge has conflicts:

```bash
git diff --name-only --diff-filter=U
```

List the conflicting files:

```
## Merge Conflicts

**Conflicting files:**
- `<file1>`
- `<file2>`
```

Then for each conflicting file, read it and show the conflict markers with context. Help the user understand what changed on each side.

Use AskUserQuestion:

1. **Help me resolve** — walk through each conflict
2. **Abort merge** — `git merge --abort` and return to previous state
3. **I'll handle it** — leave conflicts for manual resolution

If "Help me resolve":

- For each conflicting file, read the conflict sections
- Explain what each side changed
- Suggest the resolution (usually keep both, or pick the newer version)
- Apply the fix with Edit tool
- After all resolved:
  ```bash
  git add .
  git commit -m "Merge origin/<upstream> into <current> — resolve conflicts"
  ```

### Phase 5: Post-Sync Check

After successful merge:

```bash
# Quick sanity check
npm run typecheck 2>&1 | tail -5
```

If typecheck fails: WARN that the merge introduced type errors. Offer to investigate.

## Edge Cases

### Diverged branches (both ahead and behind)

This is normal for feature branches. The merge handles it. Just note both counts in the status report.

### Sync dev with main (after a release)

When on `dev` and syncing with `main`:

```bash
git checkout dev
git pull origin dev
git merge origin/main
git push origin dev
```

This pulls any hotfixes from main back into dev.

### Rebase vs merge

We use **merge** (not rebase) to keep history clear and avoid force-push complications. This is deliberate — don't offer to rebase.

## Beginner Context

When the user seems new to git, explain these concepts naturally:

- **Sync / pull** = Getting the latest code that other people have added to the project. Like refreshing a shared document.
- **Behind** = Other people have added code since you last synced. You need their changes.
- **Ahead** = You have code they don't have yet (your work that hasn't been shared via PR).
- **Merge conflict** = You and someone else both changed the same lines of code. Git doesn't know which version to keep, so it asks you to decide. This is normal — not an error.
- **Upstream** = The shared version of the branch on GitHub that everyone syncs from.
- **Fetch** = Checking what's new on GitHub without changing your local code yet.

When merge conflicts happen, be reassuring:

- "This is completely normal when multiple people work on the same project."
- "I can help you resolve this — we just need to decide which changes to keep."
- "Your code is safe — nothing is lost during a conflict."

If the user seems overwhelmed by a conflict, offer: "Want me to look at the conflicting files and suggest the best resolution? I can walk you through it step by step."

## Relationship to Other Skills

| Skill       | Role                                     |
| ----------- | ---------------------------------------- |
| `/checkout` | Create branch (often followed by /sync)  |
| `/sync`     | Keep branch up to date                   |
| `/pr`       | Open PR (may need /sync first if behind) |
| `/release`  | Merge dev → main (uses sync internally)  |
