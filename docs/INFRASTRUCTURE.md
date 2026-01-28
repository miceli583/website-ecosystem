# Infrastructure

Domains, email routing, CI/CD, and deployment configuration.

## Domains

| Domain | Purpose | Hosting |
|--------|---------|---------|
| **matthewmiceli.com** | Personal portfolio & playground | Vercel |
| **miraclemind.dev** | Main platform & admin | Vercel |
| **miraclemind.live** | Legacy (redirects to .dev) | Vercel |

All three domains served from single Vercel project with middleware-based routing.

---

## Email Configuration

### miraclemind.live (Receiving)

**Provider:** Neo.space
**Main Inbox:** admin@miraclemind.live

**Aliases (all route to admin inbox):**
- `waitlist@miraclemind.live`
- `beta@miraclemind.live`
- `support@miraclemind.live`

### miraclemind.dev (Sending)

**Provider:** SMTP2GO (Free Tier)
**Status:** Configured and active

**Sending Addresses:**
- `noreply@miraclemind.dev` - Auth emails (magic links, password resets)
- `admin@miraclemind.dev` - Admin notifications
- Any `@miraclemind.dev` address (domain verified)

**SMTP Configuration:**
- Host: `mail.smtp2go.com`
- Port: `587`
- Credentials stored in SMTP2GO dashboard and Supabase

**DNS Records (Namecheap):**
- `em826661.miraclemind.dev` → return.smtp2go.net
- `s826661._domainkey.miraclemind.dev` → dkim.smtp2go.net
- `link.miraclemind.dev` → track.smtp2go.net

**Free Tier Limits:**
- 1,000 emails/month
- 200 emails/day

### Email Flow

```
Sending (Auth emails):
Supabase Auth → SMTP2GO → noreply@miraclemind.dev → User

Receiving (Customer emails):
User → support@miraclemind.live → Neo.space → admin@miraclemind.live
```

---

## CI/CD (GitHub Actions)

### Pipeline Triggers

- Push to `main` or `develop`
- Pull requests to `main` or `develop`

### Checks Run

1. ESLint (code linting)
2. Prettier (formatting)
3. TypeScript (type checking)
4. Next.js build (production build)

### Configuration

File: `.github/workflows/ci.yml`

```yaml
env:
  SKIP_ENV_VALIDATION: "true"
  DATABASE_URL: "file:./db.sqlite"
```

### Branch Protection (Recommended)

In GitHub → Settings → Branches → Add rule for `main`:

- Require pull request before merging
- Require status checks to pass (Lint and Type Check, Build)
- Require branches to be up to date

---

## Deployment (Vercel)

### Setup

1. Connect GitHub repository to Vercel
2. Import project
3. Add environment variables (see [SETUP.md](./SETUP.md))
4. Deploy automatically on push to `main`

### Environment Variables

```
DATABASE_URL=[PostgreSQL connection string]
NEXT_PUBLIC_SUPABASE_URL=[Supabase project URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[Supabase anon key]
```

### Domain Configuration

Add all three domains in Vercel project settings. Middleware handles routing based on hostname.

---

## DNS Records

### miraclemind.dev (Namecheap)

- A/CNAME: Vercel hosting
- CNAME: SMTP2GO records (for email sending)

### miraclemind.live (Neo.space)

- MX: Neo.space mail servers
- A/CNAME: Vercel hosting

### matthewmiceli.com

- A/CNAME: Vercel hosting

---

## Monitoring

### GitHub

- Actions tab: CI/CD history
- Insights: Code frequency, contributors
- Security: Dependabot alerts

### SMTP2GO

- Dashboard: Email delivery stats (5-day retention on free tier)
- Check delivery rates, bounces, opens

### Supabase

- Authentication → Logs: Auth email attempts
- Database: Query performance

---

## Troubleshooting

### Magic Links Not Sending

1. Check Supabase SMTP settings
2. Verify SMTP2GO credentials
3. Check SMTP2GO dashboard for failed sends
4. Verify DNS records active

### Emails Going to Spam

1. Verify SPF/DKIM records configured
2. Start with low volume to warm up domain
3. Use consistent "from" addresses

### CI/CD Failing

1. Check GitHub Actions logs
2. Run checks locally: `npm run pre-commit`
3. Ensure all environment variables set

### Deployment Issues

1. Check Vercel build logs
2. Verify environment variables in Vercel dashboard
3. Test build locally: `npm run build`
