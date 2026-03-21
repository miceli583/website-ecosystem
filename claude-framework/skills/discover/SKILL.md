---
name: discover
description: Discover and manage external skills, MCP servers, and integrations
allowed-tools: Read, Write, Bash, WebSearch, WebFetch, Grep, Glob, AskUserQuestion
---

# Discover - Dynamic Skill & MCP Discovery

Dynamically search for, evaluate, and install external skills and MCP servers based on current project needs.

## How It Works

When invoked, this skill:

1. **Analyzes current project** - Reads package.json, CLAUDE.md, code patterns
2. **Checks installed MCPs** - Runs `claude mcp list`
3. **Searches live sources** - MCP Registry, GitHub, npm
4. **Recommends based on context** - Suggests relevant tools
5. **Offers to install** - Handles setup automatically

## Invocation

```
/discover                    # Analyze project and suggest tools
/discover payments           # Search for payment-related tools
/discover "PDF handling"     # Search for specific capability
/discover --installed        # Show what's already installed
/discover --update           # Check for updates to installed MCPs
```

## Steps

### 1. Analyze Current Project

```bash
# Check tech stack
cat package.json | head -30

# Check what's already installed
claude mcp list

# Read project context
cat CLAUDE.md 2>/dev/null
```

Build a profile:

- Framework (Next.js, React, etc.)
- Database (Supabase, Postgres, etc.)
- Auth method
- Current MCP servers
- Gaps/needs based on TODO.md or user request

### 2. Search Live Sources

**If user has specific need:**

```
WebSearch: "MCP server {user_need} Claude 2026"
WebFetch: https://registry.modelcontextprotocol.io/
WebFetch: https://github.com/punkpeye/awesome-mcp-servers
```

**Extract from results:**

- Tool name
- Purpose
- Install command
- Requirements (Python? Node? Database?)
- Maintenance status (last update, stars)

### 3. Evaluate & Recommend

Present findings:

```
## Discovery Results: "{query}"

### Recommended (Best Match)
| Tool | Type | Why | Install |
|------|------|-----|---------|
| stripe-mcp | MCP | Official, well-maintained | `claude mcp add...` |

### Alternatives
| Tool | Type | Notes |
|------|------|-------|
| community-payments | MCP | More features, less stable |

### Already Installed
- supabase (connected)
- memory (connected)

### Would you like me to install any of these?
```

### 4. Install Selected Tools

For each selected tool:

```bash
# Check if already installed
claude mcp list | grep <name>

# Install based on type
# HTTP transport:
claude mcp add --transport http <name> <url>

# NPX package:
claude mcp add <name> -- npx -y <package>

# Python-based:
# Clone repo, create venv, pip install, configure
```

### 5. Verify Installation

```bash
claude mcp list
# Check for ✓ Connected
```

If failed:

- Check requirements (Python version, Node, etc.)
- Look for missing dependencies
- Suggest manual setup steps

## Context-Aware Suggestions

**Trigger phrases → Search focus:**

| User says                             | Search for              |
| ------------------------------------- | ----------------------- |
| "PDF", "Word", "Excel"                | Document processing MCP |
| "Stripe", "payments", "billing"       | Payment integration MCP |
| "graph", "relationships", "knowledge" | Graph database MCP      |
| "remember", "context", "memory"       | Persistent memory MCP   |
| "images", "SVG", "icons"              | Image generation MCP    |
| "test", "E2E", "Playwright"           | Testing tools           |
| "GPT", "Gemini", "multi-model"        | LLM bridge MCP          |

## Live Resources

When searching, query these:

- **MCP Registry**: https://registry.modelcontextprotocol.io/
- **Awesome MCP Servers**: https://github.com/punkpeye/awesome-mcp-servers
- **Awesome Claude Skills**: https://github.com/VoltAgent/awesome-claude-skills
- **npm**: https://www.npmjs.com/search?q=mcp
- **GitHub**: Search for "MCP server {topic}"

## Installation Patterns

### MCP Servers

**HTTP-based (easiest):**

```bash
claude mcp add --transport http <name> <url>
```

**NPX-based:**

```bash
claude mcp add <name> -- npx -y <package-name>
```

**Python-based (more complex):**

```bash
git clone <repo>
cd <repo>
python -m venv .venv
source .venv/bin/activate
pip install -e .
claude mcp add-json "<name>" '{"command":"python","args":["-m","<module>.server"]}'
```

### Skills (Claude Code)

**From GitHub:**

```bash
# Clone to personal skills
git clone <repo> ~/.claude/skills/<name>

# Or to project skills
git clone <repo> .claude/skills/<name>
```

**Manual creation:**

```bash
mkdir -p ~/.claude/skills/<name>
# Create SKILL.md with frontmatter:
# ---
# name: <name>
# description: <what it does>
# allowed-tools: Read, Write, Bash, etc.
# ---
```

**Official Anthropic skills:**
Already built-in, just invoke by name:

- `anthropics/pdf`, `anthropics/docx`, `anthropics/xlsx`
- `anthropics/webapp-testing`, `anthropics/mcp-builder`

**Verify skill loads:**
Skills auto-load based on context. Check `~/.claude/skills/` or `.claude/skills/`

## Example Session

```
User: /discover payments

Claude: [Analyzes project - sees Next.js + Supabase]
Claude: [Searches: "MCP server payments Stripe 2026"]
Claude: [Finds: Stripe official, jsyapps/stripe-mcp, CData Stripe]

Claude:
## Discovery: Payment Tools

### Your Project
- Framework: Next.js 16
- Database: Supabase
- Current MCPs: supabase, memory

### Recommended
1. **Stripe MCP** (Official)
   - Install: `claude mcp add --transport http stripe https://mcp.stripe.com`
   - Features: Full Stripe API access
   - Auth: OAuth (will prompt)

### Alternatives
2. **jsyapps/stripe-mcp** - Payment links, simpler API
3. **CData Stripe** - Read-only, SQL-like queries

Install Stripe MCP now? [Y/n]

User: Y

Claude: [Runs install command]
Claude: ✅ Stripe MCP installed. Will authenticate on first use.
```

## Maintenance

**Check for updates:**

```bash
/discover --update
```

**Remove unused:**

```bash
claude mcp remove <name>
```

## Security Notes

- **Official MCPs** (Anthropic, Stripe, Supabase): Generally safe
- **Community MCPs**: Review GitHub repo before installing
- **Permissions**: Some MCPs access filesystem/network - be aware
- **API keys**: Never hardcode, use environment variables
