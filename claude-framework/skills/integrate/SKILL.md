---
name: integrate
description: Merge completed feature branches back into dev
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Integrate Feature Branches

Merge completed worker branches back into the dev branch.

## Prerequisites

- Must be on the dev branch
- Workers should have pushed their feature branches

## Steps

1. **Verify on Dev**

   ```bash
   git branch --show-current
   ```

   If not on dev, switch: `git checkout dev`

2. **Find Ready Branches**

   ```bash
   # List feature branches
   git branch -r | grep 'origin/feature/'

   # Or list local feature branches
   git branch | grep 'feature/'
   ```

3. **Pre-Integration Review**
   For each feature branch:

   ```bash
   # Show what will be merged
   git log --oneline dev..feature/<name>
   git diff --stat dev...feature/<name>
   ```

4. **Present Integration Plan**
   Show user:
   - Branches ready to merge
   - Commit count and file changes per branch
   - Recommended merge order (based on dependencies)
   - Any potential conflicts detected

5. **Execute Merges** (with user confirmation)
   For each approved branch:

   ```bash
   git merge feature/<name> --no-ff -m "Merge feature/<name>: <description>"
   ```

   If conflicts:
   - Show conflicting files
   - Offer to help resolve or abort
   - After resolution, continue merge

6. **Post-Integration**
   - Run quality check: `npm run typecheck && npm run lint`
   - Update STATUS.md and TODO.md if needed
   - Clean up merged branches:
     ```bash
     git branch -d feature/<name>
     git push origin --delete feature/<name>
     ```

7. **Report Results**

## Output Format

```
## Integration Complete

### Merged
- feature/auth (3 commits, 5 files) ✓
- feature/api (7 commits, 12 files) ✓

### Skipped
- feature/ui (not ready — missing tests)

### Quality Check
Typecheck: ✓ | Lint: ✓

### Cleaned Up
- Deleted branch: feature/auth (local + remote)
- Deleted branch: feature/api (local + remote)

### Next Steps
- Push dev to remote: `git push origin dev`
- feature/ui still needs work before integration
```

## Conflict Resolution

When merge conflicts occur:

1. **Show Conflict Details**

   ```bash
   git diff --name-only --diff-filter=U
   ```

2. **Resolution Options**
   - Accept theirs (feature branch version)
   - Accept ours (dev version)
   - Manual merge
   - Abort and defer

3. **After Resolution**
   ```bash
   git add <resolved-files>
   git commit
   ```

## Safety Checks

- Never force push
- Always run quality checks after merge
- Don't delete branches until confirmed merged
- Ask before each merge — don't batch without confirmation
