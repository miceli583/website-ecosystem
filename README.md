# Website Ecosystem

A multi-domain Next.js application supporting different sites within a single codebase.

## 🌐 Supported Domains

- **matthewmiceli.com** - Personal portfolio and blog
- **miraclemind.live** - Live projects and demos
- **miraclemind.dev** - Development tools and resources

## 🛠️ Tech Stack

- **[Next.js 15](https://nextjs.org)** - React framework with App Router
- **[TypeScript](https://typescriptlang.org)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com)** - Styling with custom design system
- **[tRPC](https://trpc.io)** - Type-safe API layer
- **[Drizzle ORM](https://orm.drizzle.team)** - Database toolkit
- **[Supabase](https://supabase.com)** - Database and auth (when needed)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database URL

# Start development server
npm run dev
```

### Local Development with Domains

Access different domains locally:
- `http://localhost:3000?domain=matthew` - Matthew's site
- `http://localhost:3000?domain=live` - MiracleMind Live
- `http://localhost:3000?domain=dev` - MiracleMind Dev

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── domain-layout.tsx   # Multi-domain layout
│   ├── pages/              # Domain-specific pages
│   └── ui/                 # Shared UI components
├── lib/
│   └── domains.ts          # Domain configuration
├── server/
│   ├── api/                # tRPC routers
│   └── db/                 # Database schema
└── styles/                 # Global styles
```

## 🗄️ Database

- **Development**: SQLite (file-based)
- **Production**: PostgreSQL via Supabase
- **ORM**: Drizzle with automatic migrations

```bash
# Generate migrations
npm run db:generate

# Apply migrations
npm run db:migrate

# View database
npm run db:studio
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Set environment variables:
   ```
   DATABASE_URL=your-production-database-url
   ```
3. Deploy automatically on git push

### Environment Variables

See [`ENV_SETUP.md`](./ENV_SETUP.md) for detailed setup instructions.

## 📚 Documentation

- **[Environment Setup](./ENV_SETUP.md)** - Configure env variables
- **[GitHub Setup](./GITHUB_SETUP.md)** - CI/CD and deployment
- **[Database Migration](./DATABASE_MIGRATION.md)** - Moving to production DB
- **[Supabase Setup](./SUPABASE_SETUP.md)** - Production database setup

## 🔧 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript check
npm run format       # Format code with Prettier
```

## 🎯 Features

- ✅ Multi-domain routing
- ✅ Type-safe API with tRPC
- ✅ Responsive design system
- ✅ Database migrations
- ✅ CI/CD pipeline
- ✅ Environment validation
- 🚧 User authentication (planned with Supabase)
- 🚧 Content management
- 🚧 Analytics integration
