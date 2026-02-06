# Project Status

**Version:** 0.6.0
**Last Updated:** 2026-02-05
**Commits:** 160+

## Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| Multi-domain routing | Working | matthewmiceli.com, miraclemind.dev, miraclemind.live |
| Authentication (Supabase) | Working | Email/password, magic links, tRPC protectedProcedure |
| Admin dashboard v2 | Working | Collapsible sidebar, breadcrumbs, expanded navigation |
| Admin ecosystem map | Working | Route inventory with domain/access/status filtering |
| Admin tooling pages | Working | Service inventory, database health dashboard |
| Admin finance dashboard | Working | Overview, revenue, expenses — wired to Stripe Live + Mercury |
| Admin analytics dashboard | Working | Internal metrics, revenue summary, contact growth, domain activity |
| Admin CRM system | Working | Pipeline, contacts list/detail, leads, account managers, client sync |
| Admin organization | Working | Team member CRUD, role management, account manager assignments |
| Finance integrations | Working | Stripe Live (read-only) + Mercury API clients |
| Client portal v2 | Working | `/portal/[slug]` with role-based auth |
| Portal skeletons | Working | Loading skeletons for all portal pages |
| Stripe integration | Working | Billing, subscriptions, webhook events, proposal linking |
| Mercury integration | Working | API client ready, MCP configured |

## Known Limitations

- **Mercury API**: Requires `MERCURY_API_KEY` env var (generate at Mercury Settings → Tokens)
- **Analytics external**: PostHog/Vercel Analytics/Sentry not yet integrated (internal metrics working)

## Recent Changes

| Date | Commit | Description |
|------|--------|-------------|
| Feb 05 | f082ccd | CRM contact detail, organization/team management, account managers |
| Feb 05 | 7e58bf9 | Finance UI wiring, analytics dashboard, CRM system |
| Feb 05 | 13e3cd5 | Finance tRPC router, Stripe Live + Mercury API clients |
| Feb 05 | 8376d18 | P2 skeletons, breadcrumbs, ecosystem map, admin pages |
| Feb 05 | 9b6eb82 | Loading skeletons + Admin dashboard refactor with sidebar |

_Older changes: `git log --oneline`_
