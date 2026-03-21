---
name: checkout
description: Create or switch to a feature branch from dev with proper naming and tracking
allowed-tools: Read, Bash, Glob, Grep, AskUserQuestion
---

# Checkout - Smart Branch Creation

Create a properly named feature branch from `dev`, or switch to an existing branch. Ensures you're always branching from the latest `dev`.

## When to Use

- Starting new work on a feature, fix, or refactor
- User says "checkout", "start working on", "create a branch for", "new feature"
- Beginning of a focused work session

## Arguments

The user may provide:

- A branch name: `/checkout calendar-integration`
- A description: `/checkout add Google Calendar sync`
- Nothing: `/checkout` (will ask what they're working on)

## Steps

### Phase 1: Understand Intent

If the user provided a name or description, infer the branch name. If not, use AskUserQuestion:

> What are you working on? (Brief description — I'll create a branch name from this)

### Phase 2: Determine Branch Type

Classify the work and choose a prefix:

| Type              | Prefix      | Example                        |
| ----------------- | ----------- | ------------------------------ |
| New feature       | `feature/`  | `feature/calendar-integration` |
| Bug fix           | `fix/`      | `fix/crm-search-crash`         |
| Refactor          | `refactor/` | `refactor/api-error-handling`  |
| Documentation     | `docs/`     | `docs/api-reference`           |
| Chore / tech debt | `chore/`    | `chore/remove-dead-deps`       |

**Naming rules:**

- Lowercase, kebab-case
- Short but descriptive (3-5 words max)
- No special characters except hyphens

If the classification is ambiguous, pick the most likely one — don't ask the user to classify.

### Phase 3: Check Current State

```bash
git status --short
```

- If there are uncommitted changes: WARN the user and ask if they want to stash them, commit them, or abort.
- If clean: proceed.

```bash
git branch -a | head -20
```

Check if the branch already exists locally or on remote.

- If it exists locally: ask if they want to switch to it or create a new one with a different name.
- If it exists on remote only: check it out and track it.
- If it doesn't exist: create it (Phase 4).

### Phase 4: Create Branch

```bash
# Ensure dev is up to date
git checkout dev
git pull origin dev

# Create and switch to new branch
git checkout -b <branch-name>
```

### Phase 5: Confirm

Output:

```
## Branch Ready

**Branch:** <branch-name>
**Based on:** dev (up to date)
**Status:** Clean working tree

Ready to work. When done:
- `/handoff` to save session state
- `/pr` to open a pull request
```

## Edge Cases

### No `dev` branch exists

Fall back to `main`:

```bash
git checkout main
git pull origin main
git checkout -b <branch-name>
```

Note in output: "Branched from `main` (no `dev` branch found)."

### User wants to checkout an existing branch

If the argument exactly matches an existing branch:

```bash
git checkout <branch-name>
git pull origin <branch-name> 2>/dev/null || true
```

### User is already on the target branch

Just confirm: "You're already on `<branch-name>`. Working tree is clean."

## Beginner Context

When the user seems new to git or development, explain these concepts naturally in your responses:

- **Branch** = A separate workspace for your code. Think of it like a copy where you can make changes without affecting anyone else's work.
- **Dev branch** = The shared "work in progress" area. Everyone's finished features get combined here first before going live.
- **Feature branch** = Your personal workspace branching off dev. Only you work here.
- **Uncommitted changes** = Code you've written but haven't saved to git yet. Like an unsaved document.
- **Stash** = Temporarily setting aside your unsaved changes so you can switch branches safely.
- **Kebab-case** = Words separated by hyphens, like `my-new-feature`.

When asking the user what they're working on, keep the prompt casual:

> "What are you going to work on? Just describe it in a few words and I'll set everything up."

If the user seems confused at any point, offer to explain what's happening and why.

## Relationship to Other Skills

| Skill       | Role                               |
| ----------- | ---------------------------------- |
| `/checkout` | Start work — create/switch branch  |
| `/handoff`  | End work — save session state      |
| `/pr`       | Ship work — open pull request      |
| `/sync`     | Update branch with latest upstream |

**Typical flow:**

```
/checkout feature/thing → work → /handoff → /pr
```
