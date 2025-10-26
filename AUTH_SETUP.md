# Authentication Setup Guide

Supabase authentication has been successfully integrated for the admin site.

## 🔐 Features

- **Email/Password Login**: Traditional authentication
- **Magic Link Login**: Passwordless authentication via email
- **Protected Routes**: Middleware-based authentication
- **Session Management**: Automatic session refresh
- **Secure Cookies**: Server-side session handling

## 🚀 Quick Start

### 1. Environment Variables

The following environment variables are required (already in `.env.example`):

```bash
NEXT_PUBLIC_SUPABASE_URL="https://wuxmtvdfzpjonzupmgsd.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Copy `.env.example` to `.env` if you haven't already.

### 2. Create Admin User in Supabase

#### Option 1: Via Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://supabase.com/dashboard/project/wuxmtvdfzpjonzupmgsd
2. Navigate to **Authentication** → **Users**
3. Click **Add User** → **Create new user**
4. Enter your email and password
5. Click **Create User**
6. (Optional) Click **Send magic link** to verify email

#### Option 2: Via SQL Editor

Run this in the Supabase SQL Editor:

```sql
-- Create an admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'your-email@example.com',
  crypt('your-password', gen_salt('bf')),
  now(),
  now(),
  now(),
  ''
);
```

Replace `your-email@example.com` and `your-password` with your desired credentials.

### 3. Configure Email Settings (For Magic Links)

1. In Supabase Dashboard, go to **Authentication** → **Settings**
2. Under **SMTP Settings**, configure your email provider:
   - **Sender Email**: noreply@miraclemind.dev
   - **SMTP Host**: Your email provider's SMTP host
   - **SMTP Port**: 587 (or your provider's port)
   - **Username**: Your SMTP username
   - **Password**: Your SMTP password
3. Save settings

**Note**: Magic links won't work until SMTP is configured. Email/password login works immediately.

## 📱 Usage

### Accessing Admin

**Development:**
```
http://localhost:3000/admin?domain=dev
```

**Production:**
```
https://miraclemind.dev/admin
```

### Login Methods

#### Method 1: Email & Password
1. Navigate to login page
2. Enter your email and password
3. Click "Sign In"

#### Method 2: Magic Link (Passwordless)
1. Navigate to login page
2. Enter your email only
3. Click "Send Magic Link"
4. Check your email
5. Click the link to log in automatically

### Sign Out
- Click the "Sign Out" button in the admin dashboard header

## 🔒 Security Features

### Middleware Protection

All `/admin/*` routes are protected except `/admin/login`. The middleware:

- ✅ Checks authentication on every request
- ✅ Redirects unauthenticated users to login
- ✅ Refreshes sessions automatically
- ✅ Maintains session cookies securely
- ✅ Logs auth status in development mode

### Authentication Flow

```
┌─────────────────┐
│  Visit /admin   │
└────────┬────────┘
         │
         ├─ Authenticated? ─── Yes ──→ Show Dashboard
         │
         └─ No ──→ Redirect to /admin/login
                   │
                   ├─ Login Success ──→ Redirect to /admin
                   └─ Login Failed  ──→ Show Error
```

### Session Handling

- **Client-side**: Supabase handles session in browser cookies
- **Server-side**: Middleware validates session on each request
- **Refresh**: Sessions auto-refresh before expiring
- **Logout**: Clears all session data

## 🛠️ Customization

### Adding More Protected Routes

Edit `src/middleware.ts` to protect additional routes:

```typescript
if (pathname.startsWith("/protected-route")) {
  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}
```

### Customizing Login Page

Edit `src/app/admin/login/page.tsx` to:
- Change styling
- Add social login providers
- Customize error messages
- Add additional fields

### Adding Social Providers

1. In Supabase Dashboard: **Authentication** → **Providers**
2. Enable provider (Google, GitHub, etc.)
3. Add configuration
4. Update login page with provider button:

```typescript
const handleGoogleLogin = async () => {
  const supabase = createClient();
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/admin`,
    },
  });
};
```

## 🐛 Troubleshooting

### Can't Log In

**Check Supabase Dashboard:**
1. Verify user exists in **Authentication** → **Users**
2. Check if email is confirmed
3. Verify password is set correctly

**Check Environment Variables:**
```bash
# Make sure these are set in .env
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Check Browser Console:**
- Look for Supabase auth errors
- Check network tab for failed requests

### Magic Link Not Working

1. Verify SMTP is configured in Supabase
2. Check spam/junk folder
3. Ensure callback URL is whitelisted:
   - Supabase Dashboard → **Authentication** → **URL Configuration**
   - Add redirect URLs for your domains

### Session Expires Immediately

1. Check cookie settings in browser (allow cookies)
2. Verify middleware is running (check logs)
3. Check Supabase project status

### Development vs Production

**Development:**
- Uses localhost with `?domain=dev` parameter
- Login at: `http://localhost:3000/admin/login?domain=dev`

**Production:**
- Uses actual domain
- Login at: `https://miraclemind.dev/admin/login`

## 📚 Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)

## 🎯 Next Steps

1. **Create your admin user** in Supabase Dashboard
2. **Test login** at `/admin/login`
3. **Configure SMTP** for magic links (optional)
4. **Add social providers** (optional)
5. **Customize admin dashboard** to your needs

---

**Security Note**: Never commit real passwords or API keys to git. The example values in this guide are for demonstration only.
