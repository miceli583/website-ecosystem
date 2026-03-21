---
name: init-standards
description: Add STATUS.md, TODO.md, CLAUDE.md to a project and consolidate existing docs
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, AskUserQuestion
---

# Initialize Project Standards

Add unified documentation standards to a project that's missing them. Reads existing docs to extract project-specific context.

**Framework Reference:** See `~/.claude/FRAMEWORK.md` for full standards.

## Prerequisites

- Must be run from project root
- Will not overwrite existing STATUS.md/TODO.md/CLAUDE.md without confirmation

## Steps

### 1. Scan Project

Gather project-specific information:

```bash
# Check what exists
ls -la *.md docs/ 2>/dev/null

# Get tech stack
cat package.json | head -50

# Check for existing standards
ls STATUS.md TODO.md CLAUDE.md 2>/dev/null
```

Read existing documentation:

- README.md
- docs/\*.md (if exists)
- Any ROADMAP.md, CURRENT_STATE.md, etc.
- Inline TODOs: `grep -rn "TODO:\|FIXME:\|HACK:" src/`

### 2. Extract Project Context

From package.json and code, identify:

- Project name and description
- Tech stack (Next.js version, database, auth, etc.)
- Key dependencies
- Scripts available

From existing docs, extract:

- Current feature status
- Known issues or limitations
- Planned work or roadmap
- Project-specific patterns

From code structure:

- Key directories and their purposes
- Database schema location
- API routes or tRPC routers
- Auth configuration

### 3. Check for Existing Standards

If STATUS.md, TODO.md, or CLAUDE.md exist:

- Show current content
- Ask: "Merge with new content or skip?"

### 4. Ask Interactive Questions

**Required:**

- Confirm extracted project name and description

**Optional:**

- "Would you like to create a ROADMAP.md for phased development?"
- "Should I consolidate existing docs into the standard format?"
- "Archive old docs to docs/archive/?"

### 5. Generate Files

**CLAUDE.md** (project-specific):

````markdown
# <Project Name>

## Overview

<extracted or ask user>

## Quick Commands

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run db:push          # Push schema (if applicable)
```
````

## Tech Stack

- **Framework**: <detected>
- **Database**: <detected>
- **Auth**: <detected>

## Key Paths

| Path                    | Purpose         |
| ----------------------- | --------------- |
| src/app/                | Next.js pages   |
| src/server/db/schema.ts | Database schema |
| ...                     | ...             |

## Project-Specific Notes

<any unique patterns, gotchas, or instructions>

## Current Status

See STATUS.md for feature status and TODO.md for tracked work.

````

**STATUS.md**:
```markdown
# Project Status

**Version:** <from package.json>
**Last Updated:** <today>

## Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| <extracted features> | Working/Partial/Planned | <notes> |

## Known Limitations

- <extracted from docs or code comments>

## Recent Changes

| Date | Description |
|------|-------------|
| <today> | Initialized project standards |

See `git log --oneline` for full history.
````

**TODO.md**:

```markdown
# TODO

## Critical (blocks production)

<extracted or "_None currently_">

## Bugs (broken functionality)

<extracted from FIXME comments or docs>

## Tech Debt (code quality)

<extracted from HACK comments or docs>

## Enhancements (nice to have)

<extracted from TODO comments or docs>
```

**ROADMAP.md** (if requested):

```markdown
# Roadmap

## Phase 1: <name>

**Status:** In Progress / Complete / Planned

- [ ] Task 1
- [ ] Task 2

## Phase 2: <name>

**Status:** Planned

- [ ] Task 1
```

### 6. Consolidate Existing Docs (if approved)

If user approves consolidation:

1. Create `docs/archive/` if doesn't exist
2. Move superseded docs (CURRENT_STATE.md, NEXT_SESSION_PROMPT.md, etc.) to archive
3. Extract useful content into STATUS.md/TODO.md first
4. Keep README.md in place (update if needed)
5. Keep feature-specific docs in `docs/` (not archived)

### 7. Create Directory Structure

```bash
mkdir -p docs/archive
```

### 8. Brand Reference (Optional)

If the project has visual UI (not a pure API or CLI tool), ask:

```
Does this project have a visual brand identity (colors, fonts, theme)? [y/N]
```

If yes, suggest running `/brand init` or `/brand extract` after standards are set up. Note this in the report.

If no, skip — not every project needs brand guidelines.

### 9. Add Framework Reference

Add a note to CLAUDE.md referencing the unified framework:

```markdown
## Framework Reference

This project follows the Unified Development Framework.
See `~/.claude/FRAMEWORK.md` or run `/framework` for full standards.
```

Optionally create a symlink for easy access:

```bash
ln -sf ~/.claude/FRAMEWORK.md FRAMEWORK.md
```

### 9. Report Results

```
## Standards Initialized

### Created
- CLAUDE.md - Project instructions (references FRAMEWORK.md)
- STATUS.md - Feature status tracking
- TODO.md - Work tracking (<N> items from inline comments)
- ROADMAP.md - Phased development plan (if requested)
- FRAMEWORK.md - Symlink to ~/.claude/FRAMEWORK.md (optional)
- docs/archive/ - Directory for old docs

### Consolidated (if applicable)
- Archived: CURRENT_STATE.md, NEXT_SESSION_PROMPT.md
- Preserved: README.md, docs/<feature>.md

### Framework Access
Run /framework from any project to view the unified development standards.

### Next Steps
1. Review generated files and adjust as needed
2. Run /sync-todos to capture any missed inline comments
3. Commit: git add -A && git commit -m "Add project documentation standards"
```

## Cross-Pollination Protection

- ONLY reads from current project directory
- NEVER copies content from other projects
- Extracts values from THIS project's:
  - package.json (name, version, dependencies)
  - .env.example or .env (variable names only, not values)
  - Database schema (table names)
  - Code structure (directory names)
- All generated content is project-specific

## Edge Cases

- **No package.json**: Ask user for project details manually
- **Monorepo**: Ask which package to document
- **Existing partial standards**: Offer to merge or skip each file
- **Large docs/ folder**: List files and ask which to archive vs. keep
