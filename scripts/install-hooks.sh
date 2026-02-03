#!/bin/bash
# Install git hooks for this project
# Run once after cloning: bash scripts/install-hooks.sh

HOOKS_DIR="$(git rev-parse --git-dir)/hooks"
SCRIPTS_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Installing git hooks..."

# Install pre-push hook
if [ -f "$HOOKS_DIR/pre-push" ] && [ ! -L "$HOOKS_DIR/pre-push" ]; then
  echo "  Backing up existing pre-push hook to pre-push.bak"
  mv "$HOOKS_DIR/pre-push" "$HOOKS_DIR/pre-push.bak"
fi

ln -sf "$SCRIPTS_DIR/pre-push.sh" "$HOOKS_DIR/pre-push"
chmod +x "$HOOKS_DIR/pre-push"

echo "Done. Pre-push hook installed."
echo "  Bypass with: git push --no-verify"
