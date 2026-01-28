# Setup Guide

Complete setup instructions for environment, database, and authentication.

## Environment Variables

### Required Variables

```env
# Database
DATABASE_URL="file:./db.sqlite"                    # Development (SQLite)
# DATABASE_URL="postgresql://..."                  # Production (PostgreSQL)

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### Setup Steps

```bash
# Copy template
cp .env.example .env

# Edit with your values
# Get Supabase credentials from: https://supabase.com/dashboard → Settings → API

# Validate setup
npm run env:validate
```

### Production (Vercel)

In Vercel dashboard → Settings → Environment Variables:

1. `DATABASE_URL` - PostgreSQL connection string from Supabase
   - Get from: Supabase Dashboard → Settings → Database → Connection String (URI)
2. `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
3. `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

### CI/CD (GitHub Actions)

```yaml
env:
  SKIP_ENV_VALIDATION: "true"
  DATABASE_URL: "file:./db.sqlite"
```

---

## Database

### Development (SQLite)

Zero configuration - just use the default:

```env
DATABASE_URL="file:./db.sqlite"
```

### Production (PostgreSQL/Supabase)

1. Create project at https://supabase.com
2. Go to Settings → Database → Connection String
3. Copy the URI (Connection Pooling) and add to Vercel

### Database Commands

```bash
npm run db:generate      # Generate migrations from schema changes
npm run db:migrate       # Apply pending migrations
npm run db:push          # Push schema directly (dev only)
npm run db:studio        # Open Drizzle Studio GUI
```

### Migrating SQLite to PostgreSQL

When ready for production:

1. Update `DATABASE_URL` to PostgreSQL connection string
2. Run `npm run db:push` to create tables in Supabase
3. The app auto-detects database type from URL format

---

## Authentication

Supabase Auth provides email/password and magic link authentication.

### Create Admin User

**Option 1: Supabase Dashboard (Recommended)**

1. Go to https://supabase.com/dashboard → Your Project
2. Navigate to Authentication → Users
3. Click Add User → Create new user
4. Enter email and password
5. Click Create User

**Option 2: SQL Editor**

```sql
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at, confirmation_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'your-email@example.com',
  crypt('your-password', gen_salt('bf')),
  now(), now(), now(), ''
);
```

### Login URLs

- **Development:** `http://localhost:3000/admin/login?domain=dev`
- **Production:** `https://miraclemind.dev/admin/login`

### Login Methods

1. **Email & Password** - Traditional login
2. **Magic Link** - Passwordless via email (requires SMTP setup)

### Protected Routes

All `/admin/*` routes require authentication except `/admin/login`.

Middleware handles:
- Session validation on every request
- Redirect to login if unauthenticated
- Automatic session refresh

### Magic Links (Optional)

To enable magic link login, configure SMTP in Supabase:

1. Dashboard → Authentication → Settings → SMTP Settings
2. Configure your email provider (SMTP2GO, SendGrid, etc.)
3. Set sender email: `noreply@miraclemind.dev`

---

## Supabase Storage

For features that need file storage (e.g., daily anchor images).

### Create Storage Bucket

1. Go to Supabase Dashboard → Storage → Buckets
2. Click "New bucket"
3. Configure:
   - Name: `daily-anchors`
   - Public bucket: YES
   - File size limit: 5 MB
   - Allowed MIME types: `image/jpeg, image/jpg`

### Public URLs

Files are accessible at:
```
https://[project-id].supabase.co/storage/v1/object/public/[bucket]/[filename]
```

---

## Troubleshooting

### Build Errors: "Invalid environment variables"

1. **Development:** Ensure `.env` exists with all required variables
2. **Production:** Check Vercel environment variables
3. **CI/CD:** Use `SKIP_ENV_VALIDATION=true`

### Database Connection Issues

```bash
# Reset local database
rm db.sqlite
npm run db:migrate

# View database state
npm run db:studio
```

### Authentication Issues

1. Verify user exists in Supabase → Authentication → Users
2. Check if email is confirmed
3. Verify environment variables are set
4. Check browser console for errors

### Magic Links Not Working

1. Verify SMTP is configured in Supabase
2. Check spam folder
3. Whitelist redirect URLs in Supabase → Authentication → URL Configuration
