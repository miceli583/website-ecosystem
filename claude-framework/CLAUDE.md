# Global Development Standards

## Documentation Protocol

**Required files (every project):**

- `CLAUDE.md` - Project-specific instructions for Claude
- `STATUS.md` - Current feature status and recent changes
- `TODO.md` - Tracked work items (semantic categories)

**Optional files:**

- `ROADMAP.md` - Phased development plan (for larger projects)
- `WORKTREES.md` - Multi-agent coordination (see MULTIAGENT.md)
- `docs/` - Feature-specific documentation
- `docs/archive/` - Superseded docs, old session notes

**Constraints:**

- Max 100 lines for STATUS.md/TODO.md
- Use `docs/<feature>.md` for complex system documentation

## TODO.md Structure

```markdown
## Critical (blocks production)

## Bugs (broken functionality)

## Tech Debt (code quality)

## Enhancements (nice to have)
```

## Inline Comment Conventions

- `TODO:` - Work to be done
- `FIXME:` - Broken, needs fixing
- `HACK:` - Temporary workaround
- `NOTE:` - Important context

## Session Workflow

### Standard (single session)

1. **Start**: Run `/resume` to load project state and see where things left off
2. **Work**: Update inline TODOs as you go
3. **End**: Run `/handoff` to document session and update status

### Multi-Agent (parallel sessions — optional)

See `~/.claude/MULTIAGENT.md` for full protocol.

- **Integrator** (dev branch): Plans work, creates feature branches, merges results
- **Workers** (separate terminals): Execute assigned tasks on feature branches with full repo access
- Coordination via git branches (no extra files needed)

**Trigger:** When user discusses parallelizing work, breaking tasks into parallel sessions, or multiple terminals → plan the breakdown, then run `/spawn` to create feature branches and generate worker prompts.

### New Project Setup

When starting a fresh project or one missing standards → run `/init-standards` to add CLAUDE.md, STATUS.md, TODO.md.

## Code Quality

- Prefer editing existing files over creating new ones
- Delete unused code (git has history)
- Fix code rather than adding explanatory comments
- Keep changes minimal and focused

## Unified Development Framework

**Full documentation:** `~/.claude/FRAMEWORK.md` or run `/framework`

The framework covers:

- Tech stack (Next.js, tRPC, Drizzle, Supabase, Tailwind, shadcn/ui)
- Project structure
- Code conventions
- Database, API, and auth patterns
- Testing and security standards
- Session and multi-agent workflows
- Troubleshooting

Use `/seed` to scaffold new projects with this stack.

## Available Skills

### Session Management

- `/init-session` - Load project context (architecture, docs, codebase orientation)
- `/resume` - Full session resume (init-session + where you left off)
- `/handoff` - Generate session summary and update STATUS.md
- `/smart-compact` - Interactive context capture before /compact or reset
- `/snapshot` - Quick read-only status snapshot (done, in progress, next)

### Project Setup

- `/init-standards` - Add CLAUDE.md, STATUS.md, TODO.md to a project
- `/seed` - Scaffold a new project with the unified tech stack
- `/align` - Add missing stack components to an existing project
- `/sync-to-global` - Promote a pattern from current project to global
- `/validate` - Double-check that project follows standards
- `/onboarding` - Full new developer setup (GitHub, env, deps, framework, verification)

### Code Quality & Hygiene

- `/sync-todos` - Scan codebase for TODOs and update TODO.md
- `/cohere` - Deep pattern coherence check against framework
- `/brand` - Brand lifecycle management (init, extract, audit, whitelist) for any project
- `/tidy` - Project hygiene check (stale docs, completed roadmaps, TODO drift, inventory drift)
- `/inventory` - Audit ecosystem routes, technology stack, and database tables against codebase
- `/close-roadmap` - Archive completed ROADMAP.md, reconcile TODO.md, bump version
- `/a11y` - Accessibility audit for pages and components
- `/responsive` - Audit mobile responsiveness (breakpoints, touch targets, overflow)
- `/qa` - Generate QA checklists for features
- `/scorecard` - Quality scorecard with category breakdown
- `/audit-sweep` - Full quality sweep: parallel audits, fix, and commit

### Multi-Agent Workflow (Optional)

- `/spawn` - Create feature branches and generate worker session prompts
- `/claim` - Claim a branch assignment (worker sessions)
- `/integrate` - Merge completed feature branches into dev
- `/collab-setup` - Turn a single-dev project into multi-dev collaborative

### Documentation

- `/framework` - View the unified development framework

### Collaboration

- `/checkout` - Create/switch feature branch from dev with proper naming
- `/pr` - Push branch and open pull request targeting dev (or main for hotfixes)
- `/review` - Review a PR with quality checks, summarize changes, provide feedback
- `/sync` - Pull latest upstream into current branch, resolve conflicts
- `/release` - Merge dev into main for production deployment with safety checks
- `/sync-framework` - Sync canonical ~/.claude/ framework into project's claude-framework/ distribution (auto-runs via /handoff, /push)
- `/sync-all` - Bidirectional framework sync (crash recovery for when /handoff didn't run)

### Deployment

- `/push` - Quality gate, coherence check, and confirmed push to remote

### Discovery & Integration

- `/discover` - Dynamic search for skills & MCP servers, analyzes project, auto-installs

## Intuitive Skill Protocols

**When to proactively use skills (without being asked):**

| Trigger                                                         | Action                                              |
| --------------------------------------------------------------- | --------------------------------------------------- |
| "What is this project?" / first time on codebase                | → `/init-session`                                   |
| Session start / "let's continue" / "where were we"              | → `/resume`                                         |
| "I'm done" / "wrapping up" / end of significant work            | → `/handoff`                                        |
| Context getting long / before `/compact`                        | → `/smart-compact`                                  |
| New project directory with no CLAUDE.md                         | → `/init-standards`                                 |
| "Create new project" / "scaffold" / "start fresh"               | → `/seed`                                           |
| "I'm new" / "set me up" / "onboard" / "first time"              | → `/onboarding`                                     |
| "Add tRPC" / "add auth" / "upgrade this project"                | → `/align`                                          |
| "This pattern is useful" / "save this globally"                 | → `/sync-to-global`                                 |
| Before release / "check quality" / periodic review              | → `/validate` then `/cohere`                        |
| "Sync TODOs" / after adding many inline comments                | → `/sync-todos`                                     |
| "Check patterns" / "code review against standards"              | → `/cohere`                                         |
| "Check branding" / "brand audit" / "off-brand colors"           | → `/brand` (audit mode)                             |
| "Set up brand" / "define colors" / "brand guidelines"           | → `/brand` (init mode)                              |
| "What colors am I using?" / "extract brand"                     | → `/brand` (extract mode)                           |
| "Whitelist this color" / "add brand exception"                  | → `/brand` (whitelist mode)                         |
| "Clean up" / "tidy" / "check hygiene"                           | → `/tidy`                                           |
| "Audit routes" / "audit tools" / "inventory" / "what's missing" | → `/inventory`                                      |
| After adding new routes or npm packages                         | → suggest `/inventory` during `/tidy` or `/handoff` |
| Roadmap 100% complete (detected by /handoff or /tidy)           | → suggest `/close-roadmap`                          |
| "Parallel work" / "multiple sessions" / "multiple terminals"    | → `/spawn`                                          |
| Worker session start / "I'm assigned to..."                     | → `/claim`                                          |
| "Merge branches" / "reintegrate" / workers done                 | → `/integrate`                                      |
| "Add collaboration" / "set up for team" / "multi-dev"           | → `/collab-setup`                                   |
| "Sync everything" / "sync all" / session crashed                | → `/sync-all`                                       |
| "Show me the framework" / "what are the standards"              | → `/framework`                                      |
| "new feature" / "start working on" / "create a branch"          | → `/checkout`                                       |
| "open a PR" / "pull request" / "ready for review"               | → `/pr`                                             |
| "review PR" / "check this PR" / "look at PR #X"                 | → `/review`                                         |
| "sync" / "update branch" / "pull latest" / "branch is behind"   | → `/sync`                                           |
| "release" / "ship to prod" / "merge dev to main" / "go live"    | → `/release`                                        |
| "push" / "ship it" / "deploy" / ready to push                   | → `/push`                                           |
| "snapshot" / "status" / "where are we" / "what's done"          | → `/snapshot`                                       |
| "accessibility" / "a11y" / "screen reader" / "aria"             | → `/a11y`                                           |
| "mobile" / "responsive" / "breakpoints" / "small screen"        | → `/responsive`                                     |
| "test checklist" / "QA plan" / "test flows"                     | → `/qa`                                             |
| "score" / "rate this" / "quality review" / "how did we do"      | → `/scorecard`                                      |
| "audit" / "full sweep" / "quality sweep" / "audit sweep"        | → `/audit-sweep`                                    |

**Suggest but don't auto-run:**

- When noticing missing docs → "Want me to run `/init-standards`?"
- When code doesn't match patterns → "Should I run `/cohere` to check?"
- When project seems outdated → "This could use `/align` - interested?"

**Never auto-run without asking:**

- `/seed` (creates files)
- `/spawn` (creates worktrees)
- Any skill that writes/modifies files

## External Tool Awareness

**Skills vs MCP Servers:**

- **Skills** = Prompt instructions (SKILL.md files, load automatically)
- **MCP Servers** = External tools (require installation, provide tools/resources)

**Suggest tools when user mentions:**

| Trigger                | Suggest (Skill or MCP)                                          |
| ---------------------- | --------------------------------------------------------------- |
| "PDF", "Word", "Excel" | `anthropics/pdf`, `anthropics/docx`, `anthropics/xlsx` (skills) |
| "Stripe", "payments"   | `stripe-mcp` (MCP - official)                                   |
| "code review"          | `getsentry/code-review` (skill)                                 |
| "TDD", "test first"    | `obra/test-driven-development` (skill)                          |
| "knowledge graph"      | `neo4j-mcp` or `graphiti` (MCP)                                 |
| "persistent memory"    | `memory` MCP (already installed)                                |
| "browser automation"   | `playwright-mcp` or `anthropics/webapp-testing`                 |
| "cross-model", "GPT"   | `ai-bridge` (MCP)                                               |

**Before suggesting:** Check if already installed (`claude mcp list` or `ls ~/.claude/skills/`).

## Skill Discovery

Skills are defined in `~/.claude/skills/<name>/SKILL.md`. To add new skills:

1. Create directory: `mkdir -p ~/.claude/skills/<name>`
2. Write SKILL.md with frontmatter (name, description, allowed-tools)
3. Update this file's Available Skills list
4. Update FRAMEWORK.md Skills Reference

**Resources:**

- [MCP Registry](https://registry.modelcontextprotocol.io/)
- [Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers)
- [Awesome Claude Skills](https://github.com/VoltAgent/awesome-claude-skills)
