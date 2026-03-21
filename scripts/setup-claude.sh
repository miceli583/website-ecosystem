#!/bin/bash
# Setup Claude framework from project distribution
# Safe to run multiple times (idempotent)

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DIST_DIR="$PROJECT_DIR/claude-framework"
TARGET_DIR="$HOME/.claude"

if [ ! -d "$DIST_DIR" ]; then
  echo "Error: claude-framework/ directory not found in project root"
  exit 1
fi

echo "Installing Claude framework from project distribution..."

# Create target directory if needed
mkdir -p "$TARGET_DIR/skills"

# Copy framework files (backup existing)
for file in FRAMEWORK.md CLAUDE.md MULTIAGENT.md; do
  if [ -f "$DIST_DIR/$file" ]; then
    if [ -f "$TARGET_DIR/$file" ]; then
      echo "  Backing up existing $file"
      cp "$TARGET_DIR/$file" "$TARGET_DIR/${file}.bak"
    fi
    cp "$DIST_DIR/$file" "$TARGET_DIR/$file"
    echo "  Installed $file"
  fi
done

# Copy skills
for skill_dir in "$DIST_DIR/skills"/*/; do
  skill_name=$(basename "$skill_dir")
  mkdir -p "$TARGET_DIR/skills/$skill_name"
  if [ -f "$skill_dir/SKILL.md" ]; then
    cp "$skill_dir/SKILL.md" "$TARGET_DIR/skills/$skill_name/SKILL.md"
  fi
done

skill_count=$(ls -d "$DIST_DIR/skills"/*/ 2>/dev/null | wc -l | tr -d ' ')
echo "  Installed $skill_count skills"

echo ""
echo "Claude framework installed to $TARGET_DIR"
echo "Skills available — restart Claude Code to pick them up."
