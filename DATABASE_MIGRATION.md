# Database Migration Guide

This app is designed to work with both SQLite (development) and PostgreSQL (production/Supabase). Here's how to migrate between them:

## Current Setup: SQLite/LibSQL

The app currently uses SQLite for simplicity and development speed:

- ✅ Zero configuration
- ✅ File-based database
- ✅ Perfect for development
- ✅ Works with Turso/LibSQL for production if needed

## Migrating to PostgreSQL/Supabase

When you're ready to scale to PostgreSQL/Supabase, follow these steps:

### 1. Update Dependencies

```bash
npm install postgres
npm install -D @types/pg
```

### 2. Update Database Client

In `src/server/db/index.ts`:

```typescript
// Replace these imports:
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

// With these:
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Replace the connection logic:
const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
```

### 3. Update Schema

In `src/server/db/schema.ts`:

```typescript
// Replace this import:
import { sqliteTableCreator } from "drizzle-orm/sqlite-core";

// With this:
import { pgTableCreator } from "drizzle-orm/pg-core";

// Replace table creator:
export const createTable = pgTableCreator((name) => \`temp-t3-app_\${name}\`);

// Update timestamp fields to use PostgreSQL syntax:
// Change: .integer("created_at", { mode: "timestamp" }).default(sql\`(unixepoch())\`)
// To: .timestamp("created_at").default(sql\`CURRENT_TIMESTAMP\`)
```

### 4. Update Drizzle Config

In `drizzle.config.ts`:

```typescript
export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql", // Changed from "sqlite"
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["temp-t3-app_*"],
  verbose: true,
  strict: true,
} satisfies Config;
```

### 5. Update Environment Variables

In `.env`:

```bash
# For Supabase:
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# For other PostgreSQL providers:
DATABASE_URL="postgresql://username:password@hostname:port/database"
```

### 6. Run Migrations

```bash
# Generate migration files
npm run db:generate

# Apply migrations to your database
npm run db:migrate

# Or push schema directly (for development)
npm run db:push
```

## Supabase Setup

1. Create a new Supabase project
2. Copy the connection string from Settings > Database
3. Update your `.env` file with the new `DATABASE_URL`
4. Follow the migration steps above
5. Run `npm run db:push` to create tables

## Benefits of Each Approach

### SQLite/LibSQL

- ✅ Zero configuration
- ✅ Single file database
- ✅ Perfect for prototyping
- ✅ Great performance for small to medium apps
- ✅ Can scale with Turso

### PostgreSQL/Supabase

- ✅ Full SQL feature set
- ✅ Better for complex queries
- ✅ Built-in real-time subscriptions (Supabase)
- ✅ Better for multi-user applications
- ✅ Industry standard for production apps

## Current Status

- **Schema**: ✅ Ready for both databases
- **Client**: ✅ Currently SQLite, easy to switch
- **Auth**: ✅ Works with both databases
- **Migrations**: ✅ Drizzle handles both dialects
- **Type Safety**: ✅ Full TypeScript support
