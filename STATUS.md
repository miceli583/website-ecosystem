# Project Status

**Version:** 0.5.8
**Last Updated:** 2026-02-05
**Commits:** 155+

## Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| Multi-domain routing | Working | matthewmiceli.com, miraclemind.dev, miraclemind.live |
| Authentication (Supabase) | Working | Email/password, magic links, tRPC protectedProcedure |
| Admin dashboard v2 | Working | Collapsible sidebar, breadcrumbs, expanded navigation |
| Admin ecosystem map | Working | Route inventory with domain/access/status filtering |
| Admin tooling pages | Working | Service inventory, database health dashboard |
| Admin finance pages | **In Progress** | tRPC router done, UI needs wiring |
| Admin analytics page | Partial | Placeholder with recommended stack |
| Finance integrations | **In Progress** | Stripe Live + Mercury API clients created |
| Client portal v2 | Working | `/portal/[slug]` with role-based auth |
| Portal skeletons | Working | Loading skeletons for all portal pages |
| Stripe integration | Working | Billing, subscriptions, webhook events, proposal linking |
| Mercury integration | **New** | API client ready, MCP configured |

## Known Limitations

- **Finance UI**: Dashboard pages need to call new `finance.*` tRPC procedures
- **Analytics**: Needs PostHog/Vercel Analytics/Sentry setup
- **Mercury MCP**: Uses OAuth, will prompt on first use

## Recent Changes

| Date | Commit | Description |
|------|--------|-------------|
| Feb 05 | (pending) | Finance tRPC router, Stripe Live + Mercury API clients |
| Feb 05 | 8376d18 | P2 skeletons, breadcrumbs, ecosystem map, admin pages |
| Feb 05 | 9b6eb82 | Loading skeletons + Admin dashboard refactor with sidebar |
| Feb 05 | 85a6f45 | Add under_development flag to hide WIP items |
| Feb 05 | e98954b | Add TAPCHW demo site with visual enhancements |

_Older changes: `git log --oneline`_
