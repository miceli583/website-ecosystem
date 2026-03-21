# Multi-Agent Parallel Development Protocol

Coordination standards for parallel Claude sessions working on feature branches.

## Architecture

Workers run in **separate terminal sessions** on the same repo, each on their own feature branch. Every worker has full access to all project files, node_modules, .env, and build tooling.

```
Terminal 1 (Integrator)          Terminal 2 (Worker A)         Terminal 3 (Worker B)
├── project repo                 ├── same repo                 ├── same repo
├── dev branch                   ├── feature/auth branch       ├── feature/api branch
└── plans & coordinates          └── focused work              └── focused work
```

## Coordination

The integrator session plans work, creates feature branches, and generates prompts. Workers run in separate terminals on their assigned branches. No coordination files needed — git branches are the source of truth.

## Session Roles

### Integrator (dev branch)

- Plans and divides work into discrete tasks
- Creates feature branches from dev
- Generates worker prompts with clear objectives
- Handles integration/merges when workers are done
- Runs quality checks after merge

### Worker (feature branch)

- Works on a single focused task
- Has full repo access (reads anything, modifies owned files)
- Commits and pushes to their feature branch
- Does NOT merge to dev or modify other branches

## Workflow

```
1. PLAN (Integrator)
   └─→ Discuss tasks with user
   └─→ Identify parallelizable work
   └─→ Assign file ownership to avoid conflicts

2. SPAWN (Integrator — /spawn)
   └─→ Creates feature branches from dev
   └─→ Assigns ports (3001, 3002, ...)
   └─→ Generates worker prompts

3. WORK (Workers — separate terminals)
   └─→ User opens new terminal, cd to project
   └─→ git checkout feature/<name>
   └─→ Starts Claude session, pastes worker prompt
   └─→ Worker runs /claim to confirm setup
   └─→ Works on task, commits frequently

4. COMPLETE (Workers)
   └─→ Commit all changes
   └─→ Push branch: git push origin feature/<name>
   └─→ Signal done to integrator

5. INTEGRATE (Integrator — /integrate)
   └─→ Reviews each feature branch
   └─→ Merges into dev (--no-ff)
   └─→ Resolves conflicts
   └─→ Runs quality checks
   └─→ Cleans up merged branches
```

## Task Division Guidelines

- Prefer tasks that touch different files/directories
- Assign clear file ownership — who modifies what
- Workers can READ any file for context but should only MODIFY their owned files
- Keep tasks roughly equal in scope
- Flag any tasks that must be sequential

## Port Assignments

When multiple workers need dev servers:

- Integrator: 3000 (default)
- Worker 1: 3001
- Worker 2: 3002
- Worker 3: 3003

## Conflict Resolution

When conflicts arise during integration:

1. **Integrator resolves** if conflict is:
   - Between two worker branches
   - Architectural/cross-cutting
   - Requires context from multiple features

2. **Worker resolves** if conflict is:
   - With dev (rebase worker branch)
   - Within their feature scope

## Anti-patterns

- Worker modifying files owned by another worker
- Multiple workers on the same branch
- Worker merging to dev directly
- Integrator doing feature work on dev during parallel work
- Not pushing before signaling completion
