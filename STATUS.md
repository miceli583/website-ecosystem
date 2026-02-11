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
| Feb 11 | 5fa890f | Fix TAPCHW mobile: horizontal drift, iOS zoom, admin chart bars |
| Feb 11 | 1bb5449 | Custom URL slugs for public demo sharing (`/s/custom-slug` aliases) |
| Feb 11 | 303338f | Mobile responsiveness pass for TAPCHW demo |
| Feb 11 | fa99777 | CargoWatch refactor: shared nav, all 129 incidents, dashboard shell, report page, profile |
| Feb 11 | 8ce4b10 | Client onboarding (Cori, Daniel), Wildflower + CargoWatch demo migrations |

_Older changes: `git log --oneline`_
