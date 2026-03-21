---
name: sync-framework
description: Sync the canonical ~/.claude/ framework into the project's claude-framework/ distribution directory
allowed-tools: Read, Bash, Glob, Grep, AskUserQuestion
---

# Sync Framework - Keep Distribution In Sync

Copies the canonical framework files from `~/.claude/` into the project's `claude-framework/` distribution directory, ensuring new developers always get the latest version when they run `scripts/setup-claude.sh`.

## When to Use

This skill is designed to run **automatically** as part of other skills — you rarely need to call it directly.

**Auto-triggered by:**

- `/handoff` — syncs framework before saving session state (if `claude-framework/` exists)
- `/push` — syncs framework before pushing (if `claude-framework/` exists)
- `/release` — syncs framework before release (if `claude-framework/` exists)

**Manual trigger:**

- User says "sync framework", "update framework distribution", "update setup script"
- After manually editing skills or patterns and wanting to distribute them

## Prerequisites

- `claude-framework/` directory must exist in the project root
- `~/.claude/FRAMEWORK.md` must exist (canonical source)

If `claude-framework/` doesn't exist, skip silently (project doesn't use framework distribution).

## Steps

### Phase 1: Detect

```bash
# Check if this project distributes the framework
ls claude-framework/ 2>/dev/null
```

If directory doesn't exist: output "No `claude-framework/` directory — skipping framework sync." and STOP.

### Phase 2: Compare Versions

```bash
# Get canonical version
grep 'Version:' ~/.claude/FRAMEWORK.md | head -1

# Get distribution version
grep 'Version:' claude-framework/FRAMEWORK.md | head -1
```

If versions match: output "Framework distribution is up to date (v<version>)." and STOP.

### Phase 3: Sync Files

```bash
# Core docs
cp ~/.claude/CLAUDE.md claude-framework/CLAUDE.md
cp ~/.claude/FRAMEWORK.md claude-framework/FRAMEWORK.md
cp ~/.claude/MULTIAGENT.md claude-framework/MULTIAGENT.md
cp ~/.claude/settings.json claude-framework/settings.json

# Skills (full replace to catch additions/removals)
rm -rf claude-framework/skills
mkdir -p claude-framework/skills
for skill_dir in ~/.claude/skills/*/; do
  skill_name=$(basename "$skill_dir")
  mkdir -p "claude-framework/skills/$skill_name"
  cp -R "$skill_dir"* "claude-framework/skills/$skill_name/"
done

# Patterns (full replace)
rm -rf claude-framework/patterns
mkdir -p claude-framework/patterns
cp ~/.claude/patterns/* claude-framework/patterns/ 2>/dev/null || true
```

### Phase 3b: Update Manifest

If `manifest.json` exists in the distribution, update the version to match FRAMEWORK.md:

```bash
# Get current version from FRAMEWORK.md
VERSION=$(grep 'Version:' ~/.claude/FRAMEWORK.md | head -1 | sed 's/.*: //')

# Update version in manifest.json if it exists
if [ -f claude-framework/manifest.json ]; then
  sed -i '' "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" claude-framework/manifest.json
fi
```

### Phase 3c: Validate Manifest

If `manifest.json` exists, verify every skill listed in it has a corresponding directory:

```bash
if [ -f claude-framework/manifest.json ]; then
  # Extract all skill names from manifest
  MANIFEST_SKILLS=$(grep -o '"[a-z_-]*"' claude-framework/manifest.json | grep -v '"version"\|"description"\|"tier"\|"skills"\|"categories"\|"presets"\|"core_docs"\|"session"\|"collaboration"\|"quality"\|"project_setup"\|"multi_agent"\|"utilities"\|"minimal"\|"standard"\|"full"' | tr -d '"' | sort -u)

  MISSING=""
  for skill in $MANIFEST_SKILLS; do
    if [ ! -d "claude-framework/skills/$skill" ]; then
      MISSING="$MISSING $skill"
    fi
  done

  if [ -n "$MISSING" ]; then
    echo "⚠ Skills in manifest.json but missing from distribution:$MISSING"
  fi
fi
```

### Phase 4: Report

```bash
SKILL_COUNT=$(ls -d claude-framework/skills/*/ 2>/dev/null | wc -l | tr -d ' ')
PATTERN_COUNT=$(ls claude-framework/patterns/*.md 2>/dev/null | wc -l | tr -d ' ')
VERSION=$(grep 'Version:' claude-framework/FRAMEWORK.md | head -1 | sed 's/.*: //')
```

Output:

```
Framework distribution synced.
  Version: <version>
  Skills: <count>
  Patterns: <count>

Changes will be included in the next commit.
```

### Phase 5: Stage (Optional)

If called as part of `/handoff` or `/push`, stage the changes:

```bash
git add claude-framework/
```

If called standalone, just report — don't auto-stage.

## Integration with Other Skills

This skill is called as a **sub-step** inside these skills:

### In /handoff (add after step 7, before commit):

```
7b. **Sync Framework Distribution**
    If `claude-framework/` exists in the project, sync it:
    - Run the sync-framework steps (Phases 1-4)
    - Stage changes: `git add claude-framework/`
    - Include in the handoff commit
```

### In /push (add to Phase 2, after documentation freshness):

```
2.4 **Framework Distribution Check**
    If `claude-framework/` exists:
    - Compare versions between ~/.claude/FRAMEWORK.md and claude-framework/FRAMEWORK.md
    - If out of date: WARN "Framework distribution is behind canonical (v<old> vs v<new>)"
    - Offer to sync before pushing
```

### In /release (add to Phase 1, pre-flight):

```
1.3 **Framework Distribution**
    If `claude-framework/` exists and versions differ:
    - Auto-sync before release
    - Include in release PR
```

## Beginner Context

- **Canonical framework** = The "real" copy of the development standards, stored at `~/.claude/` on your machine.
- **Distribution copy** = A snapshot of the framework stored in the project repo so new developers can install it.
- **Sync** = Making sure the distribution copy matches the canonical copy, so everyone gets the latest version.

You usually don't need to think about this — it happens automatically when you run `/handoff`, `/push`, or `/release`.
