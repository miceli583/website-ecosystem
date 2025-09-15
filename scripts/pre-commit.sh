#!/bin/bash

# Pre-commit quality checks script
# Run this before committing code to ensure quality standards

set -e  # Exit on any error

echo "🔍 Running pre-commit quality checks..."

# 1. Format code with Prettier
echo "📝 Formatting code with Prettier..."
npm run format

# 2. Auto-fix lint issues
echo "🔧 Auto-fixing lint issues..."
npm run lint:fix

# 3. Check for remaining lint errors
echo "🔍 Checking for lint errors..."
npm run lint

# 4. Run TypeScript checks
echo "🔷 Running TypeScript checks..."
npm run typecheck

# 5. Build the project
echo "🏗️  Building project..."
npm run build

echo "✅ All quality checks passed! Ready to commit."
echo ""
echo "Now you can run:"
echo "  git add ."
echo "  git commit -m 'your commit message'"
echo "  git push origin main"