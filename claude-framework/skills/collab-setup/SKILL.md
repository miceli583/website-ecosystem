---
name: collab-setup
description: Turn a single-developer project into a multi-developer collaborative project
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, AskUserQuestion
---

# Collaborative Setup

Convert a single-developer project into a multi-developer collaborative project by adding branch protection, CI, PR templates, contributor docs, and framework distribution.

## When to Use

- "Add collaboration" / "set up for team" / "multi-dev" / "onboard developers"
- When a project needs to support multiple contributors
- When you want PR-based workflow with CI checks

## Prerequisites

- Project must be a git repo with a remote on GitHub
- Project should already have CLAUDE.md, STATUS.md, TODO.md (run `/init-standards` first if not)

## Steps

### Phase 1: Assess Current State

Check what already exists:

```bash
# GitHub remote
git remote -v

# Existing branches
git branch -a

# Existing CI/protection
ls .github/workflows/ 2>/dev/null
ls .github/pull_request_template.md 2>/dev/null
ls CONTRIBUTING.md 2>/dev/null
ls CODEOWNERS 2>/dev/null
```

Report what's missing and what will be added.

### Phase 2: Create Dev Branch (if needed)

```bash
# Check if dev branch exists
git branch -a | grep dev

# If not, create from main
git checkout -b dev
git push origin dev
```

### Phase 3: Add CI Workflow

Create `.github/workflows/ci.yml` if missing:

```yaml
name: Quality Checks
on:
  pull_request:
    branches: [main, dev]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run format:check
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run build
```

Adapt the steps based on what scripts exist in package.json.

### Phase 4: Add PR Template

Create `.github/pull_request_template.md` if missing:

```markdown
## Summary

<!-- What does this PR do? -->

## Changes

<!-- List key changes -->

## Testing

- [ ] Ran locally
- [ ] Types pass
- [ ] Lint passes
- [ ] Build succeeds

## Notes

<!-- Anything reviewers should know -->
```

### Phase 5: Add CODEOWNERS

Create `CODEOWNERS` if missing. Ask the user:

```
Who should be the default code reviewer?
(GitHub username or team, e.g., @username or @org/team)
```

```
# Default reviewers
* @<owner>
```

### Phase 6: Add CONTRIBUTING.md

Create `CONTRIBUTING.md` if missing with:

- How to set up the dev environment
- Branch naming conventions (`feature/`, `fix/`, `chore/`)
- PR workflow (branch from dev, target dev, PRs to main for releases)
- Code quality expectations (format, lint, typecheck must pass)
- How to install the Claude framework (if `claude-framework/` exists)

### Phase 7: Set Up Branch Protection

```bash
# Protect main: require PR + CI + approval
gh api repos/<owner>/<repo>/branches/main/protection \
  -X PUT \
  -f required_status_checks='{"strict":true,"contexts":["quality"]}' \
  -f enforce_admins=false \
  -f required_pull_request_reviews='{"required_approving_review_count":1}' \
  -f restrictions=null

# Protect dev: require CI
gh api repos/<owner>/<repo>/branches/dev/protection \
  -X PUT \
  -f required_status_checks='{"strict":true,"contexts":["quality"]}' \
  -f enforce_admins=false \
  -f required_pull_request_reviews=null \
  -f restrictions=null
```

Ask user before applying protection rules.

### Phase 8: Add Framework Distribution (Optional)

If the project uses the Claude framework (`~/.claude/FRAMEWORK.md` exists):

Ask: "Would you like to distribute the Claude framework to new developers? This adds a `claude-framework/` directory and setup script to the repo."

If yes:

- Create `claude-framework/` directory
- Run `/sync-framework` to populate it
- Create `scripts/setup-claude.sh` installer script
- Add setup instructions to CONTRIBUTING.md

### Phase 9: Add Git Workflow Guide (Optional)

Ask: "Would you like a plain-language Git workflow guide for developers who are newer to git?"

If yes, create `docs/GIT_WORKFLOW_GUIDE.md` with:

- Common commands explained
- Branch workflow diagram
- How to create PRs
- How to resolve merge conflicts
- Jargon glossary

### Phase 10: Report

```
## Collaborative Setup Complete

### Added
- [x] Dev branch (created/verified)
- [x] CI workflow (.github/workflows/ci.yml)
- [x] PR template (.github/pull_request_template.md)
- [x] CODEOWNERS
- [x] CONTRIBUTING.md
- [x] Branch protection (main: PR + CI + approval, dev: CI)
- [x] Framework distribution (claude-framework/ + setup script)
- [x] Git workflow guide (docs/GIT_WORKFLOW_GUIDE.md)

### Branch Strategy
- `main` — production (protected: PR + CI + 1 approval)
- `dev` — integration (protected: CI)
- `feature/*` — work branches (from dev)
- `fix/*` — bug fixes (from dev)
- `hotfix/*` — urgent fixes (from main)

### For New Developers
1. Clone the repo
2. Run `./scripts/setup-claude.sh --preset=standard`
3. Read CONTRIBUTING.md
4. Create a feature branch and start working
```

## What This Does NOT Do

- Does not set up SSH keys or GitHub accounts for other developers
- Does not configure Vercel/deployment (that's project-specific)
- Does not create user accounts or permissions beyond CODEOWNERS
- Does not modify existing code — only adds collaboration infrastructure

## Idempotent

Safe to run multiple times — skips anything that already exists.
