# Contributing

## Setup

1. Clone the repo:

   ```bash
   git clone git@github.com:miceli583/website-ecosystem.git
   cd website-ecosystem
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment:

   ```bash
   cp .env.example .env.local
   npm run env:setup
   ```

   Ask @miceli583 for Supabase, Stripe, and Mercury credentials.

4. Install git hooks:

   ```bash
   bash scripts/install-hooks.sh
   ```

5. Set up Claude framework (optional):

   ```bash
   bash scripts/setup-claude.sh
   ```

6. Start dev server:
   ```bash
   npm run dev
   ```

## Branch Workflow

See `docs/GIT_WORKFLOW_GUIDE.md` for the full guide.

- **main** — production (protected: PR + CI + 1 approval)
- **dev** — integration branch (protected: CI)
- Branch from `dev`, PR back to `dev`
- Releases: PR from `dev` to `main`
- Hotfixes: branch from `main`, PR to both `main` and `dev`

### Branch naming

- `feature/<name>` — new functionality
- `fix/<name>` — bug fixes
- `chore/<name>` — maintenance, deps, docs
- `hotfix/<name>` — urgent production fixes

## Code Standards

### Before pushing

The pre-push hook automatically runs:

- `npm run typecheck`
- `npm run lint`
- `npm run build`

### Inline comments

| Prefix   | Purpose              |
| -------- | -------------------- |
| `TODO:`  | Work to be done      |
| `FIXME:` | Broken, needs fixing |
| `HACK:`  | Temporary workaround |
| `NOTE:`  | Important context    |

### Style

- Prefer editing existing files over creating new ones
- Delete unused code (git has history)
- Fix code rather than adding explanatory comments
- Keep changes minimal and focused

## Project Docs

| File         | Purpose                              |
| ------------ | ------------------------------------ |
| `CLAUDE.md`  | Project instructions for Claude Code |
| `STATUS.md`  | Current project state                |
| `TODO.md`    | Tracked work items                   |
| `ROADMAP.md` | Phased development plan              |
| `docs/`      | Architecture and setup guides        |
