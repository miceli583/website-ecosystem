# Contributing & Documentation Standards

## Inline Comment Conventions

Use these prefixes consistently throughout the codebase:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `TODO:` | Work to be done | `// TODO: Add validation` |
| `FIXME:` | Broken, needs fixing | `// FIXME: Race condition here` |
| `HACK:` | Temporary workaround | `// HACK: Bypassing auth for demo` |
| `NOTE:` | Important context | `// NOTE: Order matters here` |

## Anti-Bloat Protocols

### One Source of Truth
- Each topic documented in exactly one place
- Cross-reference with links, never duplicate content
- STATUS.md = current state, TODO.md = planned work

### Delete Over Archive
- Git has full history; delete stale content
- Don't comment out code "for later"
- Remove unused files, don't rename to `.bak`

### Size Limits
- STATUS.md: max 100 lines
- TODO.md: max 100 lines
- Prefer tables over prose

### Weekly Review
- Prune completed items from TODO.md
- Update STATUS.md feature table
- Remove stale inline TODOs

### Code Over Comments
If you need to explain code, consider fixing the code instead:
- Extract to well-named function
- Add type annotations
- Simplify logic

## File Locations

| File | Purpose |
|------|---------|
| `STATUS.md` | Current project state snapshot |
| `TODO.md` | Tracked work items by priority |
| `docs/` | Architecture, setup, development guides |

## Searching for Work Items

```bash
# Find all inline TODOs
grep -r "TODO:" src/

# Find FIXMEs
grep -r "FIXME:" src/

# Find HACKs (temporary code)
grep -r "HACK:" src/
```
