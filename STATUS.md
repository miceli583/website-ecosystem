# Project Status

**Version:** 0.7.1
**Last Updated:** 2026-02-11
**Commits:** 170+

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
| Client portal v2 | Working | `/portal/[slug]` with role-based auth |
| Portal profile | Working | Role-aware: org members see company roles, admins see nav links |
| Portal demos | Working | Hub pages, subroutes, slide sub-demos, Wildflower landing, CargoWatch multi-page |
| Public demo sharing | Working | `/s/[token]` with subroute support, OG metadata, all demo types |
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
| Feb 11 | fa99777 | CargoWatch refactor: shared nav, all 129 incidents, dashboard shell, report page, profile |
| Feb 11 | 8ce4b10 | Client onboarding (Cori, Daniel), Wildflower + CargoWatch demo migrations |
| Feb 10 | 60dca42 | Ecosystem map audit (74→151 routes), tooling audit (10→47 tools), DB audit (11→22 tables), `/inventory` skill |
| Feb 10 | db2b163 | CRM-client sync, hybrid edit modal, delete/archive, role-based portal profile |
| Feb 09 | dd65b40 | Finance overhaul: fix tax deductions, fuzzy auto-categorize, aggregate summary, optimistic UI |
| Feb 09 | 957044c | Fix public demo sharing: metadata, caching, share button, fallback |
| Feb 09 | 6e02cb5 | Finance expense tracking, smart categorization, public demo sharing, slide sub-demos |

_Older changes: `git log --oneline`_
