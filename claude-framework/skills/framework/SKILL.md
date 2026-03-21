---
name: framework
description: View the unified development framework document
allowed-tools: Read
---

# View Framework

Display the unified development framework document from any project.

## Steps

1. Read and display `~/.claude/FRAMEWORK.md`

2. If user asks about a specific section, navigate to that section:
   - Philosophy
   - Tech Stack
   - Project Structure
   - Documentation Standards
   - Code Conventions
   - Database Patterns
   - API Patterns
   - Authentication Patterns
   - UI/Component Patterns
   - Environment Management
   - Testing Standards
   - Security Best Practices
   - Performance Patterns
   - Git Workflow
   - Session Workflow
   - Multi-Agent Workflow
   - Tool Arsenal
   - Skills Reference
   - Templates
   - Troubleshooting

## Usage

```
/framework                    # View full document
/framework tech stack         # Jump to tech stack section
/framework authentication     # Jump to auth patterns
/framework multi-agent        # Jump to multi-agent workflow
```

## Quick Reference

If user just wants a quick overview, show:

```
UNIFIED DEVELOPMENT FRAMEWORK v1.0.0

Location: ~/.claude/FRAMEWORK.md

Quick Links:
• Tech Stack: Next.js 15-16, tRPC, Drizzle, Supabase, Tailwind, shadcn/ui
• Docs: CLAUDE.md, STATUS.md, TODO.md (required)
• Session: /resume → work → /handoff
• Multi-agent: /spawn → /claim → /integrate

Run /framework <section> for details on any section.
```
