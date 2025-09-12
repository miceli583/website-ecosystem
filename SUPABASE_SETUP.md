# Supabase Integration Setup

This document provides instructions for setting up and using Supabase with the website ecosystem.

## Environment Configuration

### Development (SQLite)

For local development, continue using SQLite:

```bash
DATABASE_URL="file:./db.sqlite"
```

### Production (Supabase)

For production with your Supabase instance, update your `.env` file:

```bash
# Database
DATABASE_URL="postgresql://postgres.wuxmtvdfzpjonzupmgsd:acim_mind_0101@aws-1-us-east-2.pooler.supabase.com:6543/postgres"

# Supabase (optional for future features)
NEXT_PUBLIC_SUPABASE_URL="https://wuxmtvdfzpjonzupmgsd.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1eG10dmRmenBqb256dXBtZ3NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNjM2NjIsImV4cCI6MjA3MjkzOTY2Mn0.uH4bWLJhyx3BJyc2Gz3MRhbA0b2hrOPWboIhAZJrJBc"
```

## Database Migration

### Option 1: Generate and Push Schema (Recommended)

1. **Generate migration files:**

   ```bash
   npm run db:generate
   ```

2. **Push schema to Supabase:**
   ```bash
   npm run db:push
   ```

### Option 2: Manual Migration

If you prefer manual control, you can run this SQL directly in your Supabase SQL editor:

```sql
-- Create tables with proper PostgreSQL types
CREATE TABLE IF NOT EXISTS "website-ecosystem_user" (
    "id" text PRIMARY KEY NOT NULL DEFAULT gen_random_uuid()::text,
    "name" text,
    "email" text NOT NULL,
    "email_verified" timestamp,
    "image" text
);

CREATE TABLE IF NOT EXISTS "website-ecosystem_post" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" text,
    "created_by_id" text NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp,
    CONSTRAINT "website-ecosystem_post_created_by_id_website-ecosystem_user_id_fk"
    FOREIGN KEY ("created_by_id") REFERENCES "website-ecosystem_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS "website-ecosystem_account" (
    "user_id" text NOT NULL,
    "type" text NOT NULL,
    "provider" text NOT NULL,
    "provider_account_id" text NOT NULL,
    "refresh_token" text,
    "access_token" text,
    "expires_at" integer,
    "token_type" text,
    "scope" text,
    "id_token" text,
    "session_state" text,
    CONSTRAINT "website-ecosystem_account_user_id_website-ecosystem_user_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "website-ecosystem_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "website-ecosystem_account_provider_provider_account_id_pk"
    PRIMARY KEY("provider","provider_account_id")
);

CREATE TABLE IF NOT EXISTS "website-ecosystem_session" (
    "session_token" text PRIMARY KEY NOT NULL,
    "user_id" text NOT NULL,
    "expires" timestamp NOT NULL,
    CONSTRAINT "website-ecosystem_session_user_id_website-ecosystem_user_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "website-ecosystem_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS "website-ecosystem_verification_token" (
    "identifier" text NOT NULL,
    "token" text NOT NULL,
    "expires" timestamp NOT NULL,
    CONSTRAINT "website-ecosystem_verification_token_identifier_token_pk"
    PRIMARY KEY("identifier","token")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "created_by_idx" ON "website-ecosystem_post" ("created_by_id");
CREATE INDEX IF NOT EXISTS "name_idx" ON "website-ecosystem_post" ("name");
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "website-ecosystem_account" ("user_id");
CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "website-ecosystem_session" ("user_id");
```

## Vercel Deployment

### Environment Variables

In your Vercel project settings, add these environment variables:

```
AUTH_SECRET=[your-auth-secret]
AUTH_DISCORD_ID=[your-discord-id]
AUTH_DISCORD_SECRET=[your-discord-secret]
DATABASE_URL=postgresql://postgres.wuxmtvdfzpjonzupmgsd:acim_mind_0101@aws-1-us-east-2.pooler.supabase.com:6543/postgres
NEXT_PUBLIC_SUPABASE_URL=https://wuxmtvdfzpjonzupmgsd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1eG10dmRmenBqb256dXBtZ3NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNjM2NjIsImV4cCI6MjA3MjkzOTY2Mn0.uH4bWLJhyx3BJyc2Gz3MRhbA0b2hrOPWboIhAZJrJBc
```

### Build Command

The build should work automatically. If you encounter issues, ensure the build command is:

```bash
npm run build
```

## Architecture Notes

- **Dual Database Support**: The app automatically detects whether to use SQLite (development) or PostgreSQL (production) based on the `DATABASE_URL` format.
- **Schema Compatibility**: Uses SQLite schema syntax that is compatible with PostgreSQL through Drizzle ORM's automatic adaptation.
- **Connection Pooling**: Uses Supabase's connection pooling endpoint for optimal performance.
- **Type Safety**: Maintains full TypeScript support across both database types.

## Troubleshooting

### Build Issues

- Ensure all environment variables are set correctly
- Check that the DATABASE_URL format matches exactly
- Verify Supabase credentials are valid

### Migration Issues

- If `db:push` fails, try `db:generate` first to create migration files
- Check Supabase dashboard for connection issues
- Verify your Supabase project is active and accessible

### Performance

- Use the pooled connection URL for production: `aws-1-us-east-2.pooler.supabase.com:6543`
- Monitor query performance in Supabase dashboard
- Consider enabling Row Level Security (RLS) for production data protection

## Next Steps

1. Run database migrations
2. Test the application with Supabase in production
3. Set up Row Level Security policies (recommended)
4. Configure additional Supabase features as needed (Storage, Edge Functions, etc.)
