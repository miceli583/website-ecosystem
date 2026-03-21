---
name: snapshot
description: Generate a quick status snapshot — what's done, in progress, and next
allowed-tools: Bash, Read, Glob, Grep
user-invocable: true
---

# /snapshot — Session Status Snapshot

Generate a concise snapshot of the current session state. This is a lightweight alternative to `/handoff` — it reads state but doesn't write STATUS.md or generate handoff notes.

## Steps

1. **Gather state** (run in parallel):
   - `git status --short` — uncommitted changes
   - `git log --oneline -5` — recent commits
   - `git diff --stat HEAD` — scope of uncommitted work
   - Read `STATUS.md` — project feature status
   - Read `TODO.md` — tracked work items

2. **Present snapshot** in this format:

```
## Session Snapshot — {date}

### Completed
- Committed: list recent session commits with short descriptions
- Uncommitted: summarize staged/unstaged changes by area

### In Progress
- What's actively being worked on
- Current state (% complete, blocking issues)

### Next Up
1. Immediate next step
2. Short-term queue (2-3 items)
3. Backlog highlights from TODO.md
```

## Rules

- Keep it concise — this is a glanceable status, not a full report
- Group uncommitted changes by feature area, not individual files
- Flag any blockers or decisions needed
- Don't modify any files — this is read-only
- If no uncommitted changes exist, say so clearly
