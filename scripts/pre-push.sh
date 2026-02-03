#!/bin/bash
# Pre-push quality gate
# Runs automatically on git push. Bypass with: git push --no-verify

set -e

echo "=== Pre-push quality gate ==="

# Step 1: Typecheck
if node -e "process.exit(require('./package.json').scripts?.typecheck ? 0 : 1)" 2>/dev/null; then
  echo "[1/3] Running typecheck..."
  npm run typecheck
else
  echo "[1/3] Skipping typecheck (no script found)"
fi

# Step 2: Lint
if node -e "process.exit(require('./package.json').scripts?.lint ? 0 : 1)" 2>/dev/null; then
  echo "[2/3] Running lint..."
  npm run lint
else
  echo "[2/3] Skipping lint (no script found)"
fi

# Step 3: Build
if node -e "process.exit(require('./package.json').scripts?.build ? 0 : 1)" 2>/dev/null; then
  echo "[3/3] Running build..."
  SKIP_ENV_VALIDATION=1 npm run build
else
  echo "[3/3] Skipping build (no script found)"
fi

echo "=== All checks passed. Pushing. ==="
