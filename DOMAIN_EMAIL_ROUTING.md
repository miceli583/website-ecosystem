# Domain, Email & Service Routing Documentation

Comprehensive overview of all domains, email routing, hosting, and service configurations for the MiracleMind ecosystem.

Last Updated: October 26, 2025

---

## 🌐 Domains Overview

| Domain                | Purpose                         | Hosting | Status    |
| --------------------- | ------------------------------- | ------- | --------- |
| **matthewmiceli.com** | Personal portfolio & playground | Vercel  | ✅ Active |
| **miraclemind.live**  | Main platform/product           | Vercel  | ✅ Active |
| **miraclemind.dev**   | Development & admin             | Vercel  | ✅ Active |

---

## 📧 Email Configuration

### miraclemind.live

**Email Provider:** Neo.space
**Main Inbox:** admin@miraclemind.live

**Configured Aliases (Neo):**

- `admin@miraclemind.live` (main inbox)
- `waitlist@miraclemind.live` → alias to admin
- `beta@miraclemind.live` → alias to admin
- `support@miraclemind.live` → alias to admin

**Capabilities:**

- ✅ **Receiving:** All emails to above addresses route to admin@miraclemind.live
- ✅ **Sending:** Can send via Neo's webmail interface
- ⚠️ **SMTP Sending:** Could theoretically send via SMTP from these aliases and still receive replies (since Neo handles receiving)
- 📌 **Future Use:** Marketing emails, customer communications, product notifications

**DNS/MX Records:** Managed by Neo.space

**Notes:**

- Neo.space does NOT provide SMTP server for programmatic sending
- For automated/programmatic sending, need external SMTP service
- Aliases allow multiple "from" addresses while managing in one inbox

---

### miraclemind.dev

**Email Provider:** None (send-only via SMTP2GO)
**SMTP Service:** SMTP2GO (Free Tier)
**Status:** ✅ Fully Configured & Active

**Sending Configuration:**

- ✅ Domain verified with SMTP2GO
- ✅ SMTP user created: `miraclemind.dev_user`
- ✅ Supabase SMTP configured
- ✅ DNS CNAME records configured (via Namecheap):
  - `em826661.miraclemind.dev` → return.smtp2go.net
  - `s826661._domainkey.miraclemind.dev` → dkim.smtp2go.net
  - `link.miraclemind.dev` → track.smtp2go.net

**SMTP Credentials:**

- Host: `mail.smtp2go.com`
- Port: `587`
- Username: `miraclemind.dev_user`
- Password: [stored securely in SMTP2GO and Supabase]

**Sending Addresses (any @miraclemind.dev):**

- `noreply@miraclemind.dev` - Supabase auth emails (magic links, password resets)
- `admin@miraclemind.dev` - Admin notifications
- `notifications@miraclemind.dev` - System notifications
- Can send from ANY address @miraclemind.dev (domain is verified)

**Receiving Configuration:**

- ❌ **Not currently configured**
- 📌 **Future Option:** Set up email forwarding via Namecheap
  - Could forward `support@miraclemind.dev` → `admin@miraclemind.live`
  - Or use ImprovMX/CloudFlare for free forwarding

**SMTP2GO Free Tier Limits:**

- 1,000 emails/month
- 200 emails/day
- 5 verified sender domains
- 5 days analytics retention

**Notes:**

- Primarily for transactional/admin emails
- No receiving capability currently
- Can expand to other SMTP services if volume increases

---

### matthewmiceli.com

**Email Configuration:** None currently configured

**Future Options:**

- Could add SMTP2GO as additional verified domain (4 more slots available)
- Could forward emails via DNS provider to personal email
- Low priority (personal site, no auth needed)

---

## 🔐 Authentication & Services

### Supabase Configuration

**Project:** wuxmtvdfzpjonzupmgsd.supabase.co
**Database:** PostgreSQL (production) / SQLite (local dev)

**Environment Variables:**

```
NEXT_PUBLIC_SUPABASE_URL=https://wuxmtvdfzpjonzupmgsd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**SMTP Settings (configured in Supabase Dashboard):**

- ✅ **Configured and Active**
- Provider: SMTP2GO
- Host: mail.smtp2go.com
- Port: 587
- Username: miraclemind.dev_user
- Sender: noreply@miraclemind.dev
- Sender Name: MiracleMind
- Used for: Magic links, password resets, auth emails

**Admin Authentication:**

- Login URL (dev): `http://localhost:3000/admin/login?domain=dev`
- Login URL (prod): `https://miraclemind.dev/admin/login`
- Protected routes: `/admin/*` (except `/admin/login`)
- Session management: Cookie-based via Supabase Auth

---

## 🚀 Vercel Hosting

**Deployment:** All three domains hosted on single Vercel project

**Environment Variables (set in Vercel):**

```
DATABASE_URL=[production PostgreSQL URL]
NEXT_PUBLIC_SUPABASE_URL=https://wuxmtvdfzpjonzupmgsd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon key]
```

**Domain Routing:**

- Multi-domain middleware handles routing
- Each domain shows different content based on hostname
- Admin panel only accessible on miraclemind.dev
- Playground only accessible on matthewmiceli.com

---

## 📊 Email Flow Diagrams

### Current Sending Flow (Admin Emails)

```
┌─────────────────────┐
│   Supabase Auth     │
│  (Magic Links, etc) │
└──────────┬──────────┘
           │
           ▼
    ┌──────────────┐
    │   SMTP2GO    │
    │ mail.smtp2go │
    └──────┬───────┘
           │
           ▼
┌──────────────────────┐
│ noreply@             │
│ miraclemind.dev      │
└──────────────────────┘
           │
           ▼
    [Recipient Inbox]
```

### Current Receiving Flow (Customer Emails)

```
[User sends to               [User sends to
 support@miraclemind.live]    waitlist@miraclemind.live]
           │                            │
           ▼                            ▼
    ┌─────────────────────────────────────┐
    │         Neo.space Mail              │
    │      (Alias Resolution)             │
    └─────────────┬───────────────────────┘
                  │
                  ▼
        ┌──────────────────────┐
        │ admin@miraclemind    │
        │     .live            │
        │   (Main Inbox)       │
        └──────────────────────┘
```

---

## 🔮 Future Considerations

### When to Scale Email

**SMTP2GO Upgrade Triggers:**

- Hitting 1,000 emails/month (upgrade to $10/mo for 10K emails)
- Need more than 5 verified domains
- Want longer analytics retention

**Alternative Services to Consider:**

- **Resend** - If need better developer experience, React Email support
- **Mailgun** - If need advanced API features
- **SendGrid** - If need marketing features integrated

### Email Receiving for miraclemind.dev

**Option 1: Namecheap Email Forwarding (Free)**

- Forward specific addresses to admin@miraclemind.live
- Example: `support@miraclemind.dev` → `admin@miraclemind.live`

**Option 2: ImprovMX / CloudFlare Email Routing (Free)**

- More flexible forwarding options
- Can reply from forwarded address
- Good for low-volume support emails

**Option 3: Google Workspace / Microsoft 365 (Paid)**

- Full email hosting (~$6-12/user/month)
- Professional setup for team
- Only needed if scaling team/support

### Email Alias Strategy Question

**Can you send from support@miraclemind.live via SMTP and still receive via Neo?**

**Answer:** Yes, theoretically! Here's how:

```
Sending:
Your App → SMTP2GO → support@miraclemind.live (as sender)

Receiving:
User Reply → Neo Mail → admin@miraclemind.live (alias resolves)
```

**To set this up:**

1. Verify miraclemind.live domain in SMTP2GO (use 2nd of 5 slots)
2. Add DNS records for SMTP2GO sending
3. Send programmatically from support@miraclemind.live
4. Replies still go to Neo → admin@miraclemind.live

**Benefits:**

- Professional "from" address
- Programmatic control of sending
- Centralized inbox for replies
- No need to manage separate inboxes

**Next Steps if Implementing:**

- Verify miraclemind.live in SMTP2GO
- Add SMTP2GO DNS records (won't conflict with Neo receiving)
- Test sending + receiving flow

---

## 🛠️ Quick Reference

### Adding New Email Address

**For miraclemind.live (receiving):**

1. Log into Neo.space
2. Add alias in email settings
3. All aliases route to admin@miraclemind.live

**For miraclemind.dev (sending):**

- Just use it! Domain already verified
- Example: `hello@miraclemind.dev` works immediately

### Testing Email Sending

**Local Development:**

```bash
# Login page
http://localhost:3000/admin/login?domain=dev

# Test magic link
1. Enter email
2. Click "Send Magic Link"
3. Check email for link
```

**Production:**

```bash
https://miraclemind.dev/admin/login
```

### Checking Email Analytics

**SMTP2GO Dashboard:**

- Login to smtp2go.com
- View last 5 days of sends
- Check delivery rates, bounces, opens

**Supabase Logs:**

- Supabase Dashboard → Authentication → Logs
- See auth email attempts

---

## 📝 Configuration Checklist

### Environment Variables Needed

**Local (.env):**

```bash
DATABASE_URL="file:./db.sqlite"
NEXT_PUBLIC_SUPABASE_URL="https://wuxmtvdfzpjonzupmgsd.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[key]"
```

**Vercel (Production):**

```bash
DATABASE_URL="[PostgreSQL URL]"
NEXT_PUBLIC_SUPABASE_URL="https://wuxmtvdfzpjonzupmgsd.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[key]"
```

### DNS Records to Maintain

**miraclemind.dev (Namecheap):**

- CNAME: em826661 → return.smtp2go.net
- CNAME: s826661.\_domainkey → dkim.smtp2go.net
- CNAME: link → track.smtp2go.net
- A/CNAME: Vercel hosting records

**miraclemind.live (Neo.space):**

- MX: Neo.space mail servers (managed by Neo)
- A/CNAME: Vercel hosting records

**matthewmiceli.com:**

- A/CNAME: Vercel hosting records

---

## 🚨 Important Notes

1. **Never commit SMTP credentials** - Keep in .env / Vercel secrets
2. **SMTP2GO username/password** - Stored in SMTP2GO dashboard only
3. **Supabase anon key** - Safe to expose client-side (public key)
4. **Neo email password** - Separate from code/hosting
5. **Email aliases vs forwarding** - Neo uses aliases (one inbox), forwarding would be separate service

---

## 📚 Related Documentation

- [AUTH_SETUP.md](./AUTH_SETUP.md) - Detailed Supabase auth setup
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Database configuration
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development workflow
- [README.md](./README.md) - Project overview

---

## 🆘 Troubleshooting

### Magic Links Not Sending

1. Check Supabase SMTP settings
2. Verify SMTP2GO credentials correct
3. Check SMTP2GO dashboard for failed sends
4. Verify DNS records still active

### Emails Going to Spam

1. Check SPF/DKIM records configured
2. Warm up domain (start with low volume)
3. Use consistent "from" addresses
4. Add unsubscribe links for marketing

### Receiving Issues (miraclemind.live)

1. Check Neo.space mail status
2. Verify aliases configured correctly
3. Check spam folder
4. Verify MX records point to Neo

---

**Last Updated:** October 26, 2025 - SMTP2GO fully configured with Supabase
**Maintained By:** Matthew Miceli
**Next Review:** When adding new domains or scaling email volume
