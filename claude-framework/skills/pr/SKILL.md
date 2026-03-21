---
name: pr
description: Create a pull request from current branch — push, fill template, target dev or main
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, AskUserQuestion
---

# PR - Create Pull Request

Push the current branch and open a pull request on GitHub. Automatically targets `dev` (or `main` for hotfix branches). Fills in the PR template with a summary of changes.

## When to Use

- After completing work on a feature branch
- User says "open a PR", "create a pull request", "ready for review"
- After `/handoff` when work is ready for review

## Arguments

Optional:

- `/pr` — auto-detect everything
- `/pr hotfix` — target `main` instead of `dev`
- `/pr "Title of the PR"` — use provided title

## Steps

### Phase 1: Validate State

```bash
git branch --show-current
```

**Guard rails:**

- If on `main`: STOP. "You're on main. Create a feature branch first (`/checkout`)."
- If on `dev`: STOP. "You're on dev. Create a feature branch first (`/checkout`)."

```bash
git status --short
```

- If there are uncommitted changes: WARN and ask if they want to commit first or proceed without them.

### Phase 2: Determine Base Branch

Default logic:

- If branch starts with `fix/` and user said "hotfix": target `main`
- Otherwise: target `dev`
- If `dev` doesn't exist on remote: fall back to `main`

```bash
git ls-remote --heads origin dev | head -1
```

### Phase 3: Gather Changes

```bash
# What's being proposed
BASE_BRANCH=dev  # or main
git log origin/$BASE_BRANCH..HEAD --oneline
git diff --stat origin/$BASE_BRANCH..HEAD
```

If no commits ahead of base: STOP. "No changes to create a PR for. Your branch is up to date with `<base>`."

### Phase 4: Generate PR Content

**Title:** Derive from branch name and commit messages.

- `feature/calendar-integration` → "Add calendar integration"
- `fix/crm-search-crash` → "Fix CRM search crash"
- Keep under 70 characters
- If user provided a title in args, use that instead

**Body:** Use the project's PR template format:

```markdown
## What does this PR do?

<1-3 sentence summary derived from commits and diff>

## Type of change

- [x] <auto-detected type based on branch prefix>

## How to test

<inferred from the changes — which pages/features to check>

## Checklist

- [x] I've tested this locally
- [x] No TypeScript errors (`npm run typecheck`)
- [x] No lint errors (`npm run lint`)
- [x] Build succeeds (`npm run build`)
- [ ] I've updated STATUS.md / TODO.md if relevant
```

### Phase 5: Confirm with User

Present the PR summary:

```
## Pull Request Preview

**Branch:** <current> → <base>
**Title:** <title>
**Commits:** X commits, Y files changed

### Summary
<the body text>
```

Use AskUserQuestion:

1. **Create PR** — push and open
2. **Edit title** — change the title
3. **Cancel** — abort

### Phase 6: Push and Create

```bash
# Push branch with tracking
git push -u origin HEAD
```

```bash
# Create the PR
gh pr create --base <base-branch> --title "<title>" --body "$(cat <<'EOF'
<body content>
EOF
)"
```

### Phase 7: Report

```
## PR Created

**URL:** <pr-url>
**Branch:** <current> → <base>
**Title:** <title>
**Status:** Waiting for CI checks

The PR is now visible on GitHub. CI will run automatically.
```

If the project is connected to Vercel, note: "A preview deployment will be available shortly in the PR comments."

## Edge Cases

### PR already exists for this branch

```bash
gh pr list --head <branch-name> --json number,title,url
```

If a PR exists: show its URL and ask if they want to update it or view it.

### Push fails (rejected)

```
Push rejected — remote has new commits.
Run `/sync` to update your branch, then try `/pr` again.
```

### No GitHub CLI

If `gh` is not installed:

```
GitHub CLI (gh) not found. Install it:
  brew install gh
  gh auth login

Or create the PR manually at:
  https://github.com/<owner>/<repo>/compare/<base>...<branch>
```

## Beginner Context

When the user seems new to git or development, explain these concepts naturally in your responses:

- **Pull Request (PR)** = A way to propose your changes to the team. You're saying "here's what I built — please review it before we add it to the project."
- **Base branch** = Where your changes will go (usually `dev`). Think of it as the destination.
- **CI checks** = Automated tests that run on GitHub to make sure your code doesn't break anything. Takes a few minutes — you'll see green checkmarks or red X's on the PR.
- **Merge** = Combining your changes into the base branch after approval.
- **Diff** = A comparison showing what you changed — green lines are additions, red lines are removals.
- **Hotfix** = An urgent fix that goes directly to production (`main`) instead of through `dev`.

When presenting the PR preview, use encouraging language:

- "Your changes are ready to share with the team!"
- "CI checks will run automatically — you don't need to do anything."
- "Once approved, your code will be part of the project."

If the user's first PR, add: "After creating the PR, you'll get a link. The project lead will review your code and either approve it or leave suggestions. This is normal and helpful — it's how teams keep code quality high."

## Relationship to Other Skills

| Skill       | Role                                         |
| ----------- | -------------------------------------------- |
| `/checkout` | Create the branch                            |
| `/handoff`  | Save session state before PR                 |
| `/pr`       | Open the pull request                        |
| `/review`   | Review someone else's PR                     |
| `/push`     | Push without opening a PR (direct push flow) |

**Recommended flow:**

```
/handoff    # Document what was done
/pr         # Push and open PR
```
