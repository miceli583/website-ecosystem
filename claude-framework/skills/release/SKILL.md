---
name: release
description: Merge dev into main for production deployment — safety checks, PR, version bump
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, AskUserQuestion
---

# Release - Ship to Production

Merge `dev` into `main` to trigger a production deployment. Runs safety checks, creates a PR (or merges directly if allowed), and optionally bumps the version.

## When to Use

- When dev has been tested and is ready for production
- User says "release", "ship it", "deploy", "merge to main", "go live"
- After reviewing changes on the dev preview deployment

## Steps

### Phase 1: Pre-flight Checks

```bash
git fetch origin
CURRENT=$(git branch --show-current)
```

Ensure we're in a clean state:

```bash
git status --short
```

If uncommitted changes: WARN and ask to commit or stash first.

#### 1.1 Compare dev and main

```bash
# What's in dev that's not in main
git log origin/main..origin/dev --oneline
git diff --stat origin/main..origin/dev
git diff --shortstat origin/main..origin/dev
```

If nothing to release (0 commits ahead): "dev and main are identical. Nothing to release." STOP.

#### 1.2 CI Status on dev

```bash
# Check if latest dev commit has passing checks
gh run list --branch dev --limit 3 --json status,conclusion,name,headSha
```

If the latest run failed or is pending: WARN. Ask if they want to proceed anyway.

### Phase 2: Release Summary

```
## Release Summary

**From:** dev → main
**Commits:** X commits
**Files changed:** Y files (+Z/-W lines)

### Changes included:
<list of commits with one-line descriptions>

### Risk assessment:
- Schema/database changes: <yes/no>
- API changes: <yes/no>
- New dependencies: <yes/no>
- Large file count: <yes/no if >20 files>
```

### Phase 3: Version Bump (Optional)

Read current version from STATUS.md and/or package.json:

```bash
grep '"version"' package.json | head -1
```

Use AskUserQuestion:

1. **Patch** (0.1.0 → 0.1.1) — bug fixes, small changes
2. **Minor** (0.1.0 → 0.2.0) — new features, enhancements
3. **Major** (0.1.0 → 1.0.0) — breaking changes
4. **Skip** — don't bump version

If bumping, update:

- `package.json` version field
- `STATUS.md` version field

Commit the version bump to dev first:

```bash
git checkout dev
git pull origin dev
# ... edit files ...
git add package.json STATUS.md
git commit -m "Bump version to <new-version>"
git push origin dev
```

### Phase 4: Create Release PR

```bash
gh pr create \
  --base main \
  --head dev \
  --title "Release <version> to production" \
  --body "$(cat <<'EOF'
## Release

**Version:** <version>

### Changes
<commit list>

### Pre-release checklist
- [x] CI passing on dev
- [x] Preview deployment reviewed
- [x] Version bumped

---
Merging this PR deploys to production via Vercel.
EOF
)"
```

### Phase 5: Confirm and Merge

```
## Ready to Release

**PR:** <url>
**Version:** <version>
**Target:** main (production)

⚠️ Merging this will deploy to production immediately.
```

Use AskUserQuestion:

1. **Merge and deploy** — merge the PR now
2. **Just create the PR** — leave it open for manual merge later
3. **Cancel** — abort the release

If "Merge and deploy":

```bash
gh pr merge <pr-number> --merge --delete-branch=false
```

Note: We do NOT delete the dev branch after merging (it's persistent).

### Phase 6: Post-Release

```bash
# Verify main is updated
git fetch origin
git log origin/main --oneline -3
```

```
## Release Complete

**Version:** <version>
**Branch:** dev merged into main
**Deployment:** Vercel will auto-deploy to production

### Post-release
- Monitor the production deployment in Vercel
- Check for any issues on the live site
- If problems arise: revert via GitHub or deploy a hotfix
```

## Edge Cases

### dev has merge conflicts with main

This can happen if hotfixes went directly to main:

```
dev cannot be cleanly merged into main.

Run `/sync main` while on dev to resolve conflicts first,
then try `/release` again.
```

### No Vercel connection

Skip deployment-related messaging. Just note the merge was completed.

### Branch protection blocks merge

If the PR can't be merged due to required reviews or failing checks:

```
PR created but cannot be auto-merged.
- Required reviews: <count>
- CI status: <passing/failing/pending>

Go to <pr-url> to manage the PR manually.
```

## Beginner Context

When the user seems new to releases, explain these concepts naturally:

- **Release** = Taking all the tested work from `dev` and putting it on the live website (`main`). This is what real users will see.
- **Production** = The live website. Real people use this. Changes here should be tested and reviewed first.
- **Version bump** = Updating the version number to mark a new release. Think of it like software updates on your phone.
  - **Patch** (0.1.0 → 0.1.1) = Small fixes, nothing new
  - **Minor** (0.1.0 → 0.2.0) = New features added
  - **Major** (0.1.0 → 1.0.0) = Big changes that might work differently than before
- **CI passing** = The automated checks on GitHub all show green checkmarks. Means the code is safe to ship.
- **Preview deployment** = A test version of the website that Vercel creates for every branch. You can click around and make sure everything works before going live.

When presenting the release summary, be clear about impact:

- "This will update the live website immediately after merging."
- "If something goes wrong, we can revert (undo) the release."
- "It's good practice to check the live site after releasing to make sure everything looks right."

If the user seems nervous: "Releasing is safe because everything was already tested in dev. The main branch just makes it live."

## Relationship to Other Skills

| Skill      | Role                                   |
| ---------- | -------------------------------------- |
| `/review`  | Review changes before releasing        |
| `/release` | Merge dev → main                       |
| `/sync`    | Resolve conflicts if dev/main diverged |
| `/push`    | Push individual commits (lower level)  |

**Recommended pre-release flow:**

```
/review         # Check what's in dev
/release        # Ship it
```
