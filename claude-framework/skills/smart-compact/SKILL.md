---
name: smart-compact
description: Interactive context preservation before conversation compaction or reset
allowed-tools: Read, Glob
---

# Smart Compact

Interactively capture essential context before using `/compact` or starting a new conversation. Ensures important decisions, state, and preferences survive compaction.

## Purpose

Claude's `/compact` command summarizes conversation history but may lose nuanced context. This skill:

- Prompts you to identify what matters most
- Captures current task state and progress
- Records key decisions and their reasoning
- Notes pending work and blockers
- Preserves important file locations
- Documents preferences and patterns learned

The output is optimized to be pasted at the start of a new conversation or fed to `/compact`.

## When to Use

- Before running `/compact` on a long conversation
- Before starting deep work that may require compaction later
- When switching focus areas but wanting to preserve context
- Before ending a session that may not get a proper `/handoff`

## Interactive Steps

### Step 1: Current Task State

Ask: **"What are you currently working on? Briefly describe the active task and its status."**

Capture:

- Task description
- Current progress (percentage or phase)
- Immediate next step

### Step 2: Key Decisions Made

Ask: **"What important decisions were made this session? Include the 'why' for each."**

Capture:

- Architecture choices
- Approach selections
- Trade-offs accepted
- Problems explicitly deferred

### Step 3: Critical Context

Ask: **"What context would be painful to lose? (Files, patterns, gotchas, or things that took time to figure out)"**

Capture:

- Key file paths and their roles
- Non-obvious patterns or conventions
- Discovered gotchas or edge cases
- Debugging insights

### Step 4: Pending Work

Ask: **"What's left to do? Include any blockers or dependencies."**

Capture:

- Remaining tasks (prioritized)
- Known blockers
- Dependencies on external factors
- Items explicitly deferred

### Step 5: Learned Preferences

Ask: **"Any preferences or patterns I should remember? (Code style, communication, workflow)"**

Capture:

- Code style preferences
- Communication preferences
- Workflow patterns
- Tool preferences

## Gathering Context Automatically

Before asking questions, gather available context:

1. **Check git state**

   ```bash
   git status --short
   git diff --stat
   git log --oneline -3
   ```

2. **Read project state** (if available)
   - STATUS.md
   - TODO.md
   - CLAUDE.md

3. **Check recent file activity**
   - Note files modified in git status
   - These are likely relevant to current work

Present this gathered context to help jog memory.

## Output Format

Generate a compact, structured summary optimized for conversation continuation:

```markdown
# Context Snapshot - [DATE]

## Active Task

**Working on:** [task description]
**Status:** [progress/phase]
**Next step:** [immediate action]

## Key Decisions

- [Decision 1]: [reasoning]
- [Decision 2]: [reasoning]

## Critical Files

- `[path]` - [role/purpose]
- `[path]` - [role/purpose]

## Important Context

- [Gotcha or insight 1]
- [Gotcha or insight 2]

## Pending Work

1. [High priority item]
2. [Next item]

- Blocked: [any blockers]
- Deferred: [explicitly deferred items]

## Preferences

- [Preference 1]
- [Preference 2]

---

_Feed this to /compact or paste at conversation start._
```

## Usage Examples

### Before Compaction

```
User: /smart-compact
Claude: [gathers git state, asks questions interactively]
Claude: [generates Context Snapshot]
User: /compact
User: [pastes Context Snapshot]
```

### Before New Session

```
User: /smart-compact
Claude: [generates Context Snapshot]
User: [copies snapshot, starts new conversation]
User: [pastes snapshot as first message]
```

### Quick Capture (Minimal Interaction)

If user is in a hurry, they can provide all context in one message:

```
User: /smart-compact
Working on: auth flow refactor, 70% done
Decisions: chose JWT over sessions for stateless scaling
Key files: src/auth/, src/middleware.ts
Pending: token refresh logic, then tests
Preferences: prefer explicit over clever
```

Claude will format this into the standard snapshot format.

## Relationship to Other Skills

- **/handoff**: Updates project files (STATUS.md, TODO.md) for persistent record
- **/smart-compact**: Creates ephemeral snapshot optimized for conversation continuity
- **/resume**: Reads project files to restore context from handoff

Use `/handoff` for persistent project state. Use `/smart-compact` for preserving conversation-specific context that won't make it into project files.

## Tips

- Be specific about file paths - vague references don't survive compaction
- Include the "why" for decisions - the "what" is easier to rediscover
- Note anything that took multiple attempts to figure out
- Mention any user preferences expressed during the conversation
