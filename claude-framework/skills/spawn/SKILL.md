---
name: spawn
description: Plan parallel work, create feature branches, generate worker session prompts
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, AskUserQuestion
---

# Spawn Parallel Workers

Integrator skill to divide work into parallel tasks, create feature branches, and generate prompts for worker sessions running in separate terminals.

## Architecture

Workers run in **separate terminal sessions** on the same repo, each on their own feature branch. No worktrees — every worker has full access to all project files, node_modules, .env, and build tooling.

```
Terminal 1 (Integrator)          Terminal 2 (Worker A)         Terminal 3 (Worker B)
├── main repo                    ├── same repo                 ├── same repo
├── dev branch                   ├── feature/auth branch       ├── feature/api branch
└── coordinates                  └── does focused work         └── does focused work
```

## Prerequisites

- Must be run from the main repo (not a worktree)
- Project should use git with a dev branch

## Steps

1. **Gather Tasks**
   Ask user what work needs to be parallelized, or read from:
   - User input (preferred)
   - TODO.md items

2. **Analyze & Plan**
   For each task, determine:
   - Branch name: `feature/<short-name>` (branched from dev)
   - Port assignment: 3001, 3002, etc. (if workers need dev servers)
   - Dependencies between tasks (if any)
   - Acceptance criteria
   - File ownership (which files each worker should modify to avoid conflicts)

   Present plan to user for approval before creating anything.

3. **Create Feature Branches**
   For each approved task:

   ```bash
   git branch feature/<name> dev
   ```

4. **Generate Worker Prompts**
   For each task, generate a copy-paste prompt:

   ```
   ================================================================================
   WORKER SESSION: <name>
   BRANCH: feature/<name>
   PORT: <port>
   ================================================================================

   Open a new terminal, cd to the project, then start a Claude session:

   cd <absolute-project-path>
   git checkout feature/<name>
   claude

   Then paste this prompt:

   ---
   I'm a worker session for parallel development.

   **Branch:** feature/<name>
   **Port:** <port>

   **Objective:**
   <task description>

   **Acceptance Criteria:**
   - [ ] <criteria>

   **File Ownership:**
   <files this worker should modify — avoid touching files owned by other workers>

   **When done:**
   1. Commit all changes to feature/<name>
   2. Push the branch: `git push origin feature/<name>`
   3. Let me know you're done

   Please start the dev server on port <port> if needed: `PORT=<port> npm run dev`
   ---
   ```

## Output Format

```
## Parallel Work Plan

### Tasks to Spawn

| # | Task | Branch | Port |
|---|------|--------|------|
| 1 | <desc> | feature/<name> | 3001 |
| 2 | <desc> | feature/<name> | 3002 |

### File Ownership
- Worker 1 owns: <files/dirs>
- Worker 2 owns: <files/dirs>
- Shared (coordinate): <files>

### Dependencies
- <any ordering constraints>

Proceed with creation? [y/n]

---

## Branches Created

- feature/<name> (from dev)
- feature/<name> (from dev)

## Worker Session Prompts

Copy each prompt below into a new terminal:

================================================================================
WORKER 1: <name>
BRANCH: feature/<name>
PORT: 3001
================================================================================

<instructions>

---

## Integrator Next Steps

1. Open new terminals for each worker
2. Start each worker session with the prompts above
3. When workers push their branches, merge via PR or direct merge
```

## Task Division Guidelines

When dividing work:

- Prefer tasks that touch different files/directories
- Identify shared dependencies and assign clear ownership
- Keep tasks roughly equal in scope
- Flag any tasks that must be sequential (can't parallelize)
- Workers have FULL repo access — they can read any file for context, but should only modify their owned files

## Integration

When workers are done:

- Each worker pushes their feature branch
- Integrator merges branches into dev (via PR or direct merge)
- Resolve any conflicts in the merge
- No special cleanup needed (no worktrees to remove)

## Error Handling

- **Branch exists**: Ask to reuse or pick new name
- **Port conflict**: Auto-increment to next available
