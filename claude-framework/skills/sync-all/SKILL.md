---
name: sync-all
description: Bidirectional framework sync — promote changes to global AND update project distribution
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, AskUserQuestion
---

# Sync All — Bidirectional Framework Sync

Runs both `/sync-to-global` and `/sync-framework` in sequence to ensure the framework is consistent in both directions. Useful as a crash-recovery alternative to `/handoff` when you've made framework changes during a session.

## When to Use

- After a session crash before `/handoff` could run
- After manually editing skills, patterns, or FRAMEWORK.md
- When you want to ensure global and project distribution are in sync
- "sync everything" / "sync all" / "sync framework both ways"

## Flow

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│  Project Changes    │ ──► │  ~/.claude/ (global) │ ──► │  claude-framework/  │
│  (skills, patterns) │     │  (canonical source)  │     │  (distribution)     │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
       Step 1: sync-to-global            Step 2: sync-framework
```

## Steps

### Phase 1: Detect Changes

```bash
# Check if project has framework distribution
ls claude-framework/ 2>/dev/null

# Compare versions
grep 'Version:' ~/.claude/FRAMEWORK.md | head -1
grep 'Version:' claude-framework/FRAMEWORK.md 2>/dev/null | head -1
```

### Phase 2: Sync to Global (if needed)

Ask the user: "Did you create or modify any skills, patterns, or framework docs this session that should be promoted to global?"

If yes, run the `/sync-to-global` flow:

- Identify what changed
- Preview changes
- Get confirmation
- Write to `~/.claude/`
- Update version and changelog

If no, skip to Phase 3.

### Phase 3: Sync Framework Distribution (if needed)

If `claude-framework/` exists in the project:

- Compare canonical (`~/.claude/`) vs distribution (`claude-framework/`)
- If versions differ, copy canonical → distribution
- Stage changes: `git add claude-framework/`

This is identical to the `/sync-framework` skill.

### Phase 4: Report

```
## Sync Complete

### Global (sync-to-global)
- Promoted: <list of changes, or "nothing new">
- Version: <version>

### Distribution (sync-framework)
- Status: <synced / already up to date / no distribution dir>
- Skills: <count>
- Patterns: <count>

### Next Steps
- Changes staged — commit when ready
- Or run `/handoff` to commit with session summary
```

## Relationship to Other Skills

| Skill             | Direction               | When                               |
| ----------------- | ----------------------- | ---------------------------------- |
| `/sync-to-global` | Project → Global        | When you create something reusable |
| `/sync-framework` | Global → Distribution   | Auto-runs in `/handoff`, `/push`   |
| `/sync-all`       | Both directions         | Manual catch-all, crash recovery   |
| `/handoff`        | Includes sync-framework | End of session                     |
