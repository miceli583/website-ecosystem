# Development Guide

## Workflow

### Before Making Changes

```bash
git pull origin main
npm install
```

### During Development

```bash
npm run dev                    # Start server at localhost:3000

# Test different domains
# localhost:3000?domain=matthew
# localhost:3000?domain=dev
# localhost:3000/admin?domain=dev
```

### Before Committing

```bash
npm run pre-commit             # Runs all quality checks
```

Or individually:

```bash
npm run format                 # Format with Prettier
npm run lint:fix               # Auto-fix lint issues
npm run lint                   # Check remaining errors
npm run typecheck              # TypeScript checks
npm run build                  # Verify build succeeds
```

---

## Code Quality Standards

### Prettier

- Automatic formatting for consistent style
- Tailwind CSS plugin for class sorting
- Config in `.prettierrc`

### ESLint

- TypeScript-specific rules
- Next.js best practices
- React hooks validation

### TypeScript

- Strict mode enabled
- No implicit any
- Unused variable detection

---

## Git Conventions

### Commit Messages

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: improve code structure
test: add tests
```

### Branch Workflow

```bash
git checkout -b feature/your-feature
# ... make changes ...
npm run pre-commit
git add .
git commit -m "feat: description"
git push -u origin feature/your-feature
```

---

## Best Practices

### Code Organization

- Group related components in same directory
- Use TypeScript interfaces for props and data
- Keep components small and focused
- Prefer named exports

### Styling

- Use Tailwind CSS for all styling
- Follow design system in `tailwind.config.ts`
- Use CSS variables for theme colors
- Prefer utilities over custom CSS

### Database

- Always generate migrations for schema changes
- Test migrations in development before production
- Use Drizzle Studio to inspect database state

---

## Troubleshooting

### Build Failures

```bash
npm run typecheck              # Check for type errors
npm run lint                   # Check for lint errors

# Clean rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Issues

```bash
rm db.sqlite                   # Reset local database
npm run db:migrate             # Reapply migrations
npm run db:studio              # Inspect database
```

### Environment Issues

```bash
npm run env:validate           # Check environment variables
```
