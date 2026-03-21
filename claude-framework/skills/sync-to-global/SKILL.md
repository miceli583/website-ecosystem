---
name: sync-to-global
description: Promote a pattern, skill, or standard from current project to global ~/.claude/ and update manifest
allowed-tools: Read, Write, Edit, Bash, Glob, AskUserQuestion
---

# Sync to Global

Explicitly promote a pattern, template, or standard from the current project to the global `~/.claude/` configuration.

## Purpose

When you discover or create a useful pattern in one project that should be available across all projects, use this skill to promote it to the global level.

## Steps

### 1. Identify What to Sync

Ask the user what they want to promote:

```
What would you like to sync to global?

1. A new skill (workflow automation)
2. A template file (STATUS.md format, component template, etc.)
3. A documentation standard (update CLAUDE.md conventions)
4. Update the FRAMEWORK.md (unified development framework)
5. A code pattern (utility function, hook, component)
6. Other (describe)
```

### 2. Gather Details

Based on selection:

**For skills:**

- Skill name
- Description
- What tools it needs
- The workflow steps

**For templates:**

- Template name
- File path in current project
- What to generalize (remove project-specific content)

**For documentation standards:**

- What convention to add
- Where it should go in CLAUDE.md or MULTIAGENT.md

**For FRAMEWORK.md updates:**

- Which section to update (Tech Stack, Code Conventions, API Patterns, etc.)
- What to add, modify, or remove
- Reason for the change (will be logged in Changelog)

**For code patterns (INTERACTIVE):**

Ask these clarifying questions to properly document the pattern:

```
I'll need some details about this pattern to document it properly:

1. Pattern name: What should this pattern be called?

2. Source file: Which file contains the pattern? (I'll read it)

3. Problem it solves: What specific problem does this pattern address?
   (e.g., "Handles race conditions in concurrent updates")

4. When to use it: In what situations should developers reach for this pattern?
   (e.g., "When you need to update multiple database tables atomically")

5. When NOT to use it: What are the anti-patterns or situations where this doesn't apply?
   (e.g., "Don't use for simple single-table updates - adds unnecessary complexity")

6. Generalization: What project-specific details need to be abstracted?
```

Capture all responses before proceeding.

### 3. Show Preview

Display what will be added/changed:

```
## Sync Preview

### Will Create:
~/.claude/templates/api-route.ts
  - Generic tRPC router template
  - Extracted from: src/server/api/routers/example.ts

### Will Update:
~/.claude/CLAUDE.md
  - Add new convention under "Code Patterns"

Proceed? [y/N]
```

### 4. Check for Conflicts

```bash
# Check if file already exists
ls ~/.claude/templates/<name> 2>/dev/null
ls ~/.claude/skills/<name> 2>/dev/null
```

If exists:

- Show diff between existing and proposed
- Ask: "Overwrite, merge, or cancel?"

### 5. Execute Sync

**For skills:**

```bash
mkdir -p ~/.claude/skills/<name>
# Write SKILL.md with content
```

**For templates:**

```bash
mkdir -p ~/.claude/templates
# Write template file
```

**For documentation:**

- Read existing ~/.claude/CLAUDE.md
- Add new section or update existing
- Preserve all other content

**For code patterns:**

- Create pattern file in ~/.claude/patterns/<name>.md with:
  - Pattern name and description
  - Problem it solves
  - When to use
  - When NOT to use
  - Code example (generalized from source)
  - Usage notes

### 6. Update Global Index

If adding a new skill, update ALL THREE:

**~/.claude/CLAUDE.md:**

- Add to "Available Skills" section under the appropriate category

**~/.claude/FRAMEWORK.md:**

- Add to "Skills Reference" section under the appropriate category/tier table
- Format: `| /skill-name | Description |`

**manifest.json (in project repo):**

- If `claude-framework/manifest.json` exists in the current project, add the skill to the appropriate category
- Ask the user which category it belongs to if unclear:

```
Which category should this skill belong to?

1. Session (essential) — session lifecycle: start, work, end
2. Collaboration (essential) — git workflow for team development
3. Quality (recommended) — code quality, auditing, hygiene
4. Project Setup (maintainer) — scaffolding and initialization
5. Multi-Agent (advanced) — parallel worktree coordination
6. Utilities (maintainer) — framework maintenance and discovery
```

- Add the skill name to that category's `"skills"` array
- Update the preset descriptions if the skill count changed (e.g., "11 skills" → "12 skills")
- Update the total count in the FRAMEWORK.md Skills Reference footer

### 7. Update FRAMEWORK.md Changelog (for framework changes)

If the sync involved updating FRAMEWORK.md (option 4 or adding a skill):

1. Read the current version from FRAMEWORK.md header
2. Determine version bump:
   - Patch (x.x.1): Bug fixes, minor clarifications
   - Minor (x.1.0): New patterns, new skills, new sections
   - Major (1.0.0): Breaking changes, major restructuring
3. Add entry to Changelog section:

```markdown
### vX.Y.Z (YYYY-MM-DD)

- <Description of change>
```

4. Update the version in the header:

```markdown
> **Version:** X.Y.Z
> **Last Updated:** YYYY-MM-DD
```

### 8. Report Results

```
## Synced to Global

### Added
- ~/.claude/templates/api-route.ts

### Updated
- ~/.claude/CLAUDE.md (added to Code Patterns section)
- ~/.claude/FRAMEWORK.md (added to Skills Reference, updated Changelog)

### Verification
The pattern is now available in all projects.

### Usage
- In any project, reference: ~/.claude/templates/api-route.ts
- Or copy to new projects via /seed
```

## Safety Checks

- **Never auto-sync** - Always requires explicit user approval
- **Show preview** - User sees exactly what will change before confirming
- **Conflict detection** - Warns if overwriting existing content
- **Backup option** - Can create .bak file before overwriting

## Examples

### Sync a new skill

```
User: /sync-to-global
Claude: What would you like to sync? → "A new skill"
Claude: Skill name? → "validate-env"
Claude: Description? → "Check all env vars are set before deploy"
Claude: Which category? → "Quality (recommended)"
Claude: [Creates ~/.claude/skills/validate-env/SKILL.md]
Claude: [Updates ~/.claude/CLAUDE.md skills list]
Claude: [Updates ~/.claude/FRAMEWORK.md Skills Reference section]
Claude: [Updates manifest.json — adds to quality category, updates skill counts]
Claude: [Updates FRAMEWORK.md Changelog with new version]
```

### Sync a template

```
User: /sync-to-global
Claude: What would you like to sync? → "A template file"
Claude: Which file? → "src/server/api/routers/example.ts"
Claude: Template name? → "trpc-router"
Claude: [Extracts, generalizes, saves to ~/.claude/templates/trpc-router.ts]
```

### Sync a convention

```
User: /sync-to-global
Claude: What would you like to sync? → "A documentation standard"
Claude: What convention? → "All API routes should have error handling wrapper"
Claude: [Updates ~/.claude/CLAUDE.md with new convention]
```

### Sync a code pattern (interactive)

```
User: /sync-to-global
Claude: What would you like to sync? → "A code pattern"
Claude: Pattern name? → "optimistic-update"
Claude: Source file? → "src/hooks/useOptimisticMutation.ts"
Claude: What problem does this solve? → "Provides instant UI feedback while mutations are in flight"
Claude: When to use it? → "Any mutation where you want to show immediate results"
Claude: When NOT to use it? → "When the operation might fail often or when server validation is critical"
Claude: What to generalize? → "Remove project-specific types, use generic TData"
Claude: [Creates ~/.claude/patterns/optimistic-update.md with full documentation]
```

### Update the Framework

```
User: /sync-to-global
Claude: What would you like to sync? → "Update the FRAMEWORK.md"
Claude: Which section? → "Database Patterns"
Claude: What to add? → "Add soft delete pattern with deletedAt timestamp"
Claude: [Updates ~/.claude/FRAMEWORK.md Database Patterns section]
Claude: [Adds entry to Changelog: "Added soft delete pattern to Database Patterns"]
Claude: [Updates version number from 1.0.0 to 1.1.0]
Claude: Framework updated! Run /framework to see changes.
```

The framework is automatically available in all projects via `/framework` command.

## What NOT to Sync

- Project-specific configurations (.env values, database URLs)
- Brand assets or content
- Business logic specific to one project
- Large code files (sync patterns, not entire modules)

## Rollback

If something goes wrong:

```bash
# Skills and templates are in git-like structure
# Can manually revert by editing files in ~/.claude/
```
