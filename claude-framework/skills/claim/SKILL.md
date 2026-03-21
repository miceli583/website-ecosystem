---
name: claim
description: Claim a feature branch assignment and set up worker session context
allowed-tools: Read, Write, Edit, Bash, Glob
---

# Claim Branch Assignment

Set up a worker session on a feature branch for parallel development.

## Steps

1. **Detect Branch**

   ```bash
   git branch --show-current
   ```

   Confirm we're on a feature branch (not dev or main).

2. **Read Project Context**
   - Read CLAUDE.md for project overview and conventions
   - Read STATUS.md for current state
   - Read TODO.md for outstanding work

3. **Understand Assignment**
   The worker prompt (pasted by the user) contains:
   - Branch name and objective
   - Acceptance criteria
   - File ownership boundaries
   - Port assignment

   If no prompt was pasted, ask the user what task they're working on.

4. **Verify Setup**

   ```bash
   # Confirm branch exists and is checked out
   git branch --show-current

   # Confirm clean working tree
   git status --short

   # Confirm dependencies installed
   ls node_modules/.package-lock.json 2>/dev/null
   ```

5. **Start Dev Server** (if user confirms)

   ```bash
   PORT=<assigned-port> npm run dev
   ```

   Run in background so session can continue.

6. **Report Ready**

## Output Format

```
## Worker Session Ready

**Branch:** feature/<name>
**Port:** <port>

### Task
<objective from prompt>

### Acceptance Criteria
- [ ] <criteria>

### File Ownership
<files this worker should modify>

### Ready to Start
Dev server running on port <port>.
```

## Completion Protocol

**CRITICAL**: Before finishing, workers MUST:

1. Commit all changes: `git add <files>` + `git commit`
2. Push the branch: `git push origin feature/<name>`
3. Verify the push: `git log origin/feature/<name> --oneline -1`

The integrator merges pushed branches — uncommitted or unpushed work will be lost.
