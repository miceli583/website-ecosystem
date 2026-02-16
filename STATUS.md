# Project Status

**Version:** 0.7.2
**Last Updated:** 2026-02-15
**Commits:** 180+

## Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| Multi-domain routing | Working | matthewmiceli.com, miraclemind.dev, miraclemind.live |
| Authentication (Supabase) | Working | Email/password, magic links, tRPC protectedProcedure |
| Admin dashboard v2 | Working | Collapsible sidebar, breadcrumbs, expanded navigation |
| Admin ecosystem map | Working | 151 routes, redirects, API routes, all domains/statuses |
| Admin tooling pages | Working | 47 tools across 14 categories, 22 tables across 6 domains |
| Admin finance dashboard | Working | Overview, revenue, expenses, yearly P&L, tax & deductions |
| Admin analytics dashboard | Working | Internal metrics, revenue summary, contact growth, domain activity |
| Admin CRM system | Working | Pipeline, contacts list/detail, leads, account managers, CRM→client sync |
| Admin organization | Working | Team member CRUD, role management, account manager assignments |
| Admin clients | Working | Hybrid edit modal, delete/archive, action menus, CRM sync-on-save |
| Finance integrations | Working | Stripe Live + Mercury API (date-filtered), smart auto-categorization |
| Finance expense tracking | Working | Manual expenses, IRS categories seeded, tax deductibility tracking |
| Client portal v2 | Working | `/portal/[slug]` with role-based auth, rich text push updates, admin Projects tab |
| Portal profile | Working | Role-aware: org members see company roles, admins see nav links |
| Portal demos | Working | Hub pages, subroutes, slide sub-demos, Wildflower landing, CargoWatch multi-page |
| Public demo sharing | Working | `/s/[token]` with subroute support, OG metadata, custom slugs |
| Portal skeletons | Working | Loading skeletons for all portal pages |
| Stripe integration | Working | Billing, subscriptions, webhook events, proposal linking |
| Mercury integration | Working | API client with date filtering, bearer token auth |

## Known Limitations

- **Mercury API**: Requires `MERCURY_API_KEY` env var (generate at Mercury Settings → Tokens)
- **Analytics external**: PostHog/Vercel Analytics/Sentry not yet integrated (internal metrics working)
- **Mercury transactions**: Limited to 500 per query; paginate for high-volume accounts

## Recent Changes

| Date | Commit | Description |
|------|--------|-------------|
| Feb 15 | 012d5e0 | TAPCHW demo: add CHW360 logo, remove CEUs, highlight footer credit |
| Feb 12 | 820d253 | Fix testimonial overflow on mobile in TAPCHW demo |
| Feb 12 | 1aa8f46 | Fix login auth cookie race, expand slug cascade, fix email URL |
| Feb 12 | 8fe1103 | Portal fixes: sign-out redirect, rich text updates, slug sync |
| Feb 12 | df26be4 | Migrate admin clients to slug routes, add portal Projects tab |

_Older changes: `git log --oneline`_
