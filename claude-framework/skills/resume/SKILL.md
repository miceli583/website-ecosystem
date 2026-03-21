---
name: resume
description: Resume session - load project context AND continue where last session left off
allowed-tools: Read, Bash, Glob
---

# Resume Session

Full session resumption: understand the project AND pick up where you left off. Companion to `/handoff`.

This combines:

- `/init-session` functionality (project context)
- Session continuity (what happened last time)

## Steps

### Phase 1: Project Context (init-session)

#### 1.1 Load Project Identity

```bash
# Get project name and location
basename $(pwd)
pwd
```

#### 1.2 Read CLAUDE.md

Read the project's CLAUDE.md for:

- Project overview/description
- Tech stack and architecture
- Quick commands
- Key paths
- Project-specific notes or gotchas

If CLAUDE.md doesn't exist, note this and suggest `/init-standards`.

#### 1.3 Scan Tech Stack

```bash
# Check package.json for dependencies and scripts
cat package.json | head -60
```

Extract:

- Framework (Next.js version, React version)
- Key dependencies (tRPC, Drizzle, Supabase, etc.)
- Available scripts

#### 1.4 Map Key Directories

```bash
# Get high-level structure
ls src/ 2>/dev/null | head -10
```

#### 1.5 Check Available Documentation

```bash
# List docs
ls docs/*.md *.md 2>/dev/null
```

### Phase 2: Session Continuity

#### 2.1 Detect Session Type

```bash
git worktree list
```

- If in main worktree: standard or integrator resume
- If in feature worktree: worker resume

#### 2.2 Identify Current Developer

```bash
git config user.name
```

This tells us who's resuming. Compare with STATUS.md's "Last Updated By" to know if the same developer is continuing or someone new is picking up.

#### 2.3 Read Session State

- Read `STATUS.md` for feature status, recent changes, and who last updated
- Read `TODO.md` for outstanding work — note any `@developer` tagged items relevant to the current developer
- Read `ROADMAP.md` if it exists — check completion % and surface status
  - If 100% complete: Note "Roadmap fully complete — consider `/close-roadmap`"
  - If active: Show current phase and next items
- Run `git status` for uncommitted changes
- Run `git log --oneline -5` for recent commits
- Check for unpushed commits: `git log origin/main..HEAD --oneline 2>/dev/null`

#### 2.4 Check Team Activity

```bash
# Check for open PRs that may affect current work
gh pr list --limit 5 --json number,title,headRefName,author 2>/dev/null || true
```

Note any open PRs — especially ones that touch the same area the developer is about to work on. This prevents stepping on toes.

#### 2.3 Worker-Specific

If in a feature worktree:

- Read `.worktree-context` for task assignment and progress
- Read main's `WORKTREES.md` for coordination state
- Check if other worktrees have pending integrations

#### 2.4 Integrator-Specific

If `WORKTREES.md` exists:

- List active worktrees and their status
- Show pending integrations
- Note any workers waiting for review

### Phase 3: Present Full Summary

## Output Format (Standard)

```
## Session Resumed

**Project:** <name>
**Path:** <path>
**Branch:** <branch>
**Developer:** <current developer from git config>
**Last Session:** <date from STATUS.md> (by <last developer>)

---

### Project Context

**Tech Stack:** Next.js X, React X, tRPC, Drizzle, Supabase

**Quick Commands:**
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run db:push` - Push schema

**Key Paths:**
- `src/app/` - Pages
- `src/server/api/` - tRPC routers
- `src/server/db/schema.ts` - Database schema

---

### Session State

**Recent Changes:**
| Date | Description |
|------|-------------|
| <date> | <change> |

**Roadmap:** 60% complete (Session 2 next) | No roadmap | Roadmap complete — run /close-roadmap

**Outstanding Work (from TODO.md):**
- [ ] <critical/bug items first>
- [ ] <other items>

**Git Status:**
- Uncommitted: <clean or list>
- Unpushed: <count> commits ahead of origin

**Team Activity:**
- Open PRs: <list any open PRs, or "none">
- <flag any PRs that touch areas you're about to work on>

---

### Your TODO Items
<items tagged with @current-developer, or all items if no tags exist>

### Suggested Next Steps
1. <recommendation based on TODO.md priority>
2. <recommendation based on uncommitted work>
3. <flag if another dev has an open PR you should review>
```

## Output Format (Worker)

```
## Worker Session Resumed

**Worktree:** <path>
**Branch:** <branch>
**Port:** <port>
**Task:** <task from .worktree-context>

---

### Project Context
<abbreviated - tech stack and key paths>

---

### Task Progress
- [x] <completed criteria>
- [ ] <remaining criteria>

### Last Session Notes
<from .worktree-context session log>

### Git Status
- Uncommitted: <summary>

### Ready to Continue
Run `PORT=<port> npm run dev` to start dev server.
```

## Output Format (Integrator)

```
## Integrator Session Resumed

**Project:** <name>
**Active Worktrees:** <count>

---

### Project Context
<abbreviated>

---

### Worktree Status
| Worktree | Branch | Status | Owner |
|----------|--------|--------|-------|
| ... | ... | ... | ... |

### Pending Integrations
- [ ] feature/x - ready
- [ ] feature/y - blocked (needs tests)

### Outstanding Work
- [ ] <from TODO.md>

### Suggested Next Steps
1. Run /integrate to merge ready branches
2. <other recommendations>
```

## Relationship to Other Skills

| Skill           | Purpose                                   |
| --------------- | ----------------------------------------- |
| `/init-session` | Just project context (architecture, docs) |
| `/resume`       | Project context + session continuity      |
| `/handoff`      | Write session state for next resume       |

**Workflow:**

```
Session 1: Work → /handoff (saves state)
Session 2: /resume (loads context + state) → Work → /handoff
```

## Compatibility with /handoff

The `/handoff` skill writes:

- STATUS.md recent changes table
- TODO.md updates
- .worktree-context session log (for workers)
- WORKTREES.md status updates (for workers)

The `/resume` skill reads all of these to reconstruct context.
