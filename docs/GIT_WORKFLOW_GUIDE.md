# Git Workflow Guide

## Branch Strategy

```
main (production) ← PRs from dev only (releases)
  └── dev (integration) ← PRs from feature branches
        ├── feature/add-analytics
        ├── fix/portal-login-bug
        └── chore/update-deps
```

## Branch Naming

| Prefix     | Use                                        |
| ---------- | ------------------------------------------ |
| `feature/` | New functionality                          |
| `fix/`     | Bug fixes                                  |
| `chore/`   | Maintenance, deps, docs                    |
| `hotfix/`  | Urgent production fixes (branch from main) |

## Daily Workflow

### 1. Start a new feature

```bash
git checkout dev
git pull origin dev
git checkout -b feature/my-feature
```

### 2. Work and commit

```bash
git add src/app/my-file.tsx
git commit -m "Add feature description"
```

Keep commits small and focused. Write messages that explain **why**, not just what.

### 3. Push your branch

```bash
git push -u origin feature/my-feature
```

### 4. Open a PR

Target `dev` (not `main`). Use the PR template — fill in summary, changes, and testing checklist.

```bash
gh pr create --base dev --title "Add my feature" --body "..."
```

### 5. After review and merge

```bash
git checkout dev
git pull origin dev
git branch -d feature/my-feature
```

## Keeping Your Branch Up to Date

If `dev` has moved ahead while you're working:

```bash
git checkout dev
git pull origin dev
git checkout feature/my-feature
git merge dev
# Resolve any conflicts, then commit
```

## Resolving Merge Conflicts

When git says there are conflicts:

1. Open the conflicting files — look for `<<<<<<<`, `=======`, `>>>>>>>`
2. Choose the correct code (or combine both)
3. Remove the conflict markers
4. `git add <file>` and `git commit`

## Common Commands

| Command                 | What it does                         |
| ----------------------- | ------------------------------------ |
| `git status`            | See what's changed                   |
| `git diff`              | See unstaged changes                 |
| `git log --oneline -10` | Recent commit history                |
| `git stash`             | Temporarily save uncommitted changes |
| `git stash pop`         | Restore stashed changes              |
| `gh pr list`            | List open pull requests              |
| `gh pr view`            | View current branch's PR             |

## Quality Checks

Before pushing, the pre-push hook runs automatically:

- Typecheck (`npm run typecheck`)
- Lint (`npm run lint`)
- Build (`npm run build`)

If any check fails, the push is blocked. Fix the issue and try again.

## Rules

- Never push directly to `main` — always use a PR
- PRs to `main` require 1 approval + CI passing
- PRs to `dev` require CI passing
- Keep PRs focused — one feature/fix per PR
