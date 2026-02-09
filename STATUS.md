# Project Status

**Version:** 0.7.0
**Last Updated:** 2026-02-09
**Commits:** 160+

## Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| Multi-domain routing | Working | matthewmiceli.com, miraclemind.dev, miraclemind.live |
| Authentication (Supabase) | Working | Email/password, magic links, tRPC protectedProcedure |
| Admin dashboard v2 | Working | Collapsible sidebar, breadcrumbs, expanded navigation |
| Admin ecosystem map | Working | Route inventory with domain/access/status filtering |
| Admin tooling pages | Working | Service inventory, database health dashboard |
| Admin finance dashboard | Working | Overview, revenue, expenses, yearly P&L, tax & deductions |
| Admin analytics dashboard | Working | Internal metrics, revenue summary, contact growth, domain activity |
| Admin CRM system | Working | Pipeline, contacts list/detail, leads, account managers, client sync |
| Admin organization | Working | Team member CRUD, role management, account manager assignments |
| Finance integrations | Working | Stripe Live + Mercury API (date-filtered), smart auto-categorization |
| Finance expense tracking | Working | Manual expenses, IRS categories seeded, tax deductibility tracking |
| Client portal v2 | Working | `/portal/[slug]` with role-based auth |
| Portal demos | Working | Hub pages, subroutes, all slide sub-demos (inputs, tracks, presentation, gamma) |
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
| Feb 09 | (uncommitted) | Finance: smart auto-categorize, official expense tracking, Mercury date filtering |
| Feb 09 | (uncommitted) | Demo sharing: 4 missing slide sub-demo components created |
| Feb 09 | (uncommitted) | Framework: Long Plan Context Management protocol added (v1.15.0) |
| Feb 05 | f082ccd | CRM contact detail, organization/team management, account managers |
| Feb 05 | 7e58bf9 | Finance UI wiring, analytics dashboard, CRM system |
| Feb 05 | 13e3cd5 | Finance tRPC router, Stripe Live + Mercury API clients |

_Older changes: `git log --oneline`_
