# Website Ecosystem

Multi-domain Next.js application serving three websites from a single codebase.

## Domains

| Domain                | Purpose                           |
| --------------------- | --------------------------------- |
| **matthewmiceli.com** | Personal portfolio & playground   |
| **miraclemind.dev**   | Main company site (BANYAN LifeOS) |
| **miraclemind.live**  | Legacy (redirects to .dev)        |

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Access locally:

- `localhost:3000?domain=matthew`
- `localhost:3000?domain=dev`
- `localhost:3000/admin?domain=dev`

## Tech Stack

Next.js 16 | React 19 | TypeScript | Tailwind CSS 4 | tRPC | Drizzle ORM | Supabase

## Scripts

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run pre-commit       # Quality checks
npm run db:studio        # Database GUI
```

## Documentation

See [`docs/`](./docs/) for detailed guides:

- [README](./docs/README.md) - Project overview
- [SETUP](./docs/SETUP.md) - Environment, database, auth
- [INFRASTRUCTURE](./docs/INFRASTRUCTURE.md) - Domains, email, CI/CD
- [CONTRIBUTING](./docs/CONTRIBUTING.md) - Contribution guidelines
- [GIT_WORKFLOW_GUIDE](./docs/GIT_WORKFLOW_GUIDE.md) - Git workflow
