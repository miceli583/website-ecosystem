---
name: sync-todos
description: Scan codebase for TODO/FIXME comments and sync to TODO.md
allowed-tools: Read, Write, Edit, Grep, Glob
---

# Sync TODOs

Scan the codebase for inline TODO/FIXME comments and synchronize them with TODO.md.

## Steps

1. **Scan Codebase**
   Search for inline comments:

   ```
   grep -rn "TODO:" src/
   grep -rn "FIXME:" src/
   grep -rn "HACK:" src/
   ```

2. **Read Current TODO.md**
   Get existing items to avoid duplicates.

3. **Categorize Found Items**
   - `FIXME:` → Bugs section
   - `TODO:` → Enhancements or Tech Debt (use judgment)
   - `HACK:` → Tech Debt section

4. **Update TODO.md**
   - Add new items not already tracked
   - Format: `- [ ] Description [file:line]`
   - Remove items that no longer exist in code
   - Keep manual entries that aren't in code (they may be planned work)

5. **Report Changes**
   Show what was added/removed.

## Rules

- Don't add duplicates (check if description or file:line already exists)
- Preserve manually-added items (no matching file:line in code)
- Keep TODO.md under 100 lines - summarize if needed
- Group related items together

## Output

```
## TODO Sync Complete

### Added
- [new item 1] `file:line`
- [new item 2] `file:line`

### Removed (no longer in code)
- [old item]

### Stats
- Total items: X
- From code: Y
- Manual: Z
```
