# Project Status

**Version:** 0.4.3
**Last Updated:** 2026-02-02
**Commits:** 112

## Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| Multi-domain routing | Working | matthewmiceli.com, miraclemind.dev, miraclemind.live |
| Authentication (Supabase) | Working | Email/password, magic links, tRPC protectedProcedure |
| Admin dashboard | Working | Protected routes at `/admin/*`, includes CRM |
| Client portal v2 | Working | `/portal/[slug]` with role-based auth, magic link claim flow |
| Portal pages | Working | Dashboard, Demos, Proposals, Tooling, Billing, Profile |
| Portal users | Working | Admin/client roles, claim account flow via magic link |
| Client resources | Working | Flexible demos, tooling, credentials, embeds per client |
| CHW360 mockup demo | Working | Exact mockup replica with carousel, brand assets page |
| Shader gallery | Working | 8 interactive shaders (orbit-star enhanced) |
| Template gallery | Working | Component showcase |
| Blog system | Partial | Basic functionality, automation incomplete |
| Daily values system | Working | Quotes, authors, values CRUD (mutations protected) |
| BANYAN early access | Working | Waitlist signup + email confirmation + admin notification |
| Instagram automation | Working | Endpoints secured, Make.com webhook configured |
| Resume/PDF generation | Working | Server-side Puppeteer |
| Stripe integration | Working | Billing, subscriptions, webhook events, proposal linking |
| Resend email | Working | Templates for BANYAN confirmation, admin alerts, client updates |
| Security hardening | Complete | RLS on all tables, rate limiting, CSP/HSTS headers, Bearer auth |
| Homepage v2 | Working | New company homepage with orbit-star shader, image-based service cards |
| Services page | Working | 9 service offerings with themed images, gold tint effect |
| Stewardship program | Working | Partner page with Entheos Holistics image card |
| Legal pages | Working | Terms of Service, Privacy Policy |
| Contact form | Working | 9 services + stewardship interest, role dropdown |
| Footer redesign | Working | 3-column: CTA left, orbit star center, links right |

## Known Limitations

- **Portal**: Admin UI for managing resources pending

## Recent Changes

| Date | Commit | Description |
|------|--------|-------------|
| Feb 02 | c3b0ce1 | Subscription tracking in webhooks, proposal linking in billing |
| Feb 02 | 702c7c5 | Link payments to proposal names in billing history |
| Feb 02 | ba8fc6c | Add one-time payments to billing history |
| Feb 02 | 1d2b5d2 | CHW360 mockup demo: exact replica with carousel, brand assets page |
| Feb 02 | 9bf9474 | Fix Stripe customer test/live mode mismatch |

See `git log --oneline` for full history.
