---
name: handoff
description: Generate session summary, update STATUS.md, prepare for next session
allowed-tools: Read, Write, Edit, Grep, Glob, Bash, AskUserQuestion
---

# Session Handoff

Generate a handoff summary for this session, update project status, and prepare context for the next developer (which might be you or someone else).

## Steps

1. **Identify Developer**
   Detect the current developer:

   ```bash
   git config user.name
   ```

   Use this as the developer identity for tagging STATUS.md changes and TODO.md items.
   If the git user.name is generic or unclear, use AskUserQuestion:

   > "Who's working this session? (Name or initials — used to tag your changes)"

2. **Detect Session Type**

   ```bash
   git worktree list
   ```

   - If in main worktree: standard handoff
   - If in feature worktree: worker handoff (also update WORKTREES.md)

3. **Gather Changes**
   - Run `git diff --stat` to see files changed this session
   - Run `git log --oneline -10` for recent commits
   - Read STATUS.md and TODO.md for current state
   - If worker: Read .worktree-context for task state

4. **Generate Summary**
   Create a brief summary covering:
   - **Developer:** who worked this session
   - What was accomplished
   - Files modified (with brief descriptions)
   - Any new TODOs or issues discovered
   - Decisions made and why
   - What to do next (and who should do it, if known)

5. **Update STATUS.md**
   - Update "Last Updated" date and "Last Updated By" developer name
   - Add recent changes to the table with author column (keep last 5)
   - Update feature status if changed
   - Update known limitations if changed

6. **Update TODO.md**
   - Mark completed items as done or remove them
   - Add any new items discovered during session
   - Tag new items with `@developer` if they're assigned to someone specific
   - Reorganize by priority if needed

7. **Worker-Specific: Update Coordination Files**
   If in a feature worktree:
   - Update .worktree-context with session log entry (include developer name)
   - Update acceptance criteria checkboxes
   - If task complete: Update main's WORKTREES.md
     - Set worktree status to "complete"
     - Add to Pending Integrations section

8. **Hygiene Check (from /tidy)**
   After updating docs, run a quick hygiene scan:
   - Check if ROADMAP.md exists and is 100% complete → suggest `/close-roadmap`
   - Check if TODO.md has `[x]` items that should be removed
   - Check if STATUS.md recent changes table exceeds 5 entries
     Present findings inline with the summary (don't run full /tidy, just the quick checks).

9. **Sync Framework Distribution**
   If `claude-framework/` exists in the project root:

   ```bash
   ls claude-framework/ 2>/dev/null
   ```

   If present, compare canonical vs distribution framework version:

   ```bash
   grep 'Version:' ~/.claude/FRAMEWORK.md | head -1
   grep 'Version:' claude-framework/FRAMEWORK.md | head -1
   ```

   If versions differ, sync using `/sync-framework` steps and stage the changes.

10. **Commit Doc Updates**
    Commit the STATUS.md, TODO.md, and any claude-framework/ changes locally:

    ```bash
    git add STATUS.md TODO.md
    git add claude-framework/ 2>/dev/null || true
    git commit -m "Update STATUS.md and TODO.md for session handoff"
    ```

11. **Output Summary**
    Display the handoff summary to the user so they can review or share it.

12. **Ask About Push (Optional)**
    After displaying the summary, use AskUserQuestion to ask:
    - "Push changes to remote?" with options:
      - **Push now** — run `git push origin HEAD`
      - **Skip push** — leave changes local, user will push later

    Do NOT push automatically. The user may want to review, add more commits, or push later with `/push`.

## Output Format (Standard)

```
## Session Summary - [DATE]

**Developer:** <name>
**Branch:** <branch>

### Completed
- [item 1]
- [item 2]

### Changes
- `file.ts` - [description]

### Discovered Issues
- [any new bugs or tech debt found]

### Next Steps
- [recommended next actions]
- [tag with @developer if assigned to someone specific]
```

## Output Format (Worker)

```
## Worker Session Summary - [DATE]

**Developer:** <name>
**Worktree:** ../project-<name>
**Branch:** feature/<name>
**Task:** <task description>

### Progress
- [x] Completed item
- [ ] Remaining item

### Changes
- `file.ts` - [description]

### Integration Status
- [ ] Ready for integration
- Blockers: [any blockers]

### Next Steps
- [what the next worker session should do]
- [tag with @developer if relevant]
```
