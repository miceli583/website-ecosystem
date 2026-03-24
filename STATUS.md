# Project Status

**Version:** 0.9.0
**Last Updated:** 2026-03-24
**Last Updated By:** Matthew Miceli
**Commits:** 200+

## Feature Status

| Feature                   | Status  | Notes                                                                                                 |
| ------------------------- | ------- | ----------------------------------------------------------------------------------------------------- |
| Multi-domain routing      | Working | matthewmiceli.com, miraclemind.dev, miraclemind.live                                                  |
| Authentication (Supabase) | Working | Email/password, magic links, tRPC protectedProcedure                                                  |
| Admin dashboard v2        | Working | Collapsible sidebar, breadcrumbs, expanded navigation                                                 |
| Admin ecosystem map       | Working | 151 routes, redirects, API routes, all domains/statuses                                               |
| Admin tooling pages       | Working | 47 tools across 14 categories, 22 tables across 6 domains                                             |
| Admin finance dashboard   | Working | Overview, revenue, expenses, yearly P&L, tax & deductions                                             |
| Admin analytics dashboard | Working | Internal metrics, revenue summary, contact growth, domain activity                                    |
| Admin CRM system          | Working | Pipeline, contacts list/detail with inline editing, leads, AM assignment, CRM→client sync             |
| Admin organization        | Working | Team member CRUD, single-select role (4 roles), founder-only editing                                  |
| Admin clients             | Working | List view with pagination/search/sort, inline AM/dev assignment, action menus                         |
| Admin profile             | **New** | Editable name/phone, role display, founder role switcher, reset password, documents/bank placeholders |
| Admin notifications       | **New** | Bell in header, polling, /admin/notifications page, triggered by status changes and updates           |
| Role-based access (RBAC)  | **New** | 4 roles (Founder/Admin/Dev/AM), role-scoped nav, AM contact scoping, requireRoles middleware          |
| Finance integrations      | Working | Stripe Live + Mercury API (date-filtered), smart auto-categorization                                  |
| Finance expense tracking  | Working | Manual expenses, IRS categories seeded, tax deductibility tracking                                    |
| Client portal v3          | **New** | Sidebar layout (matches admin hub), collapsible nav, mobile sheet drawer                              |
| Portal profile            | Working | Editable metadata, "Your Team" card (AM + Dev), reset password, security section                      |
| Portal demos              | Working | Hub pages, subroutes, slide sub-demos, Wildflower landing, CargoWatch multi-page                      |
| Public demo sharing       | Working | `/s/[token]` with subroute support, OG metadata, custom slugs                                         |
| Portal skeletons          | Working | Loading skeletons for all portal pages                                                                |
| Portal proposals          | Working | Bundle discount, admin controls (WIP/private/archive), Stripe checkout                                |
| Portal notes              | Working | Rich text formatting now renders in previews (TipTap HTML)                                            |
| Project/task management   | **New** | Admin hub + portal, list/kanban views, filters, sort, AM/dev/client scoping, standalone tasks         |
| Stripe integration        | Working | Billing, subscriptions, webhook events, proposal linking                                              |
| Mercury integration       | Working | API client with date filtering, bearer token auth                                                     |

## Known Limitations

- **Mercury API**: Requires `MERCURY_API_KEY` env var (generate at Mercury Settings → Tokens)
- **Analytics external**: PostHog/Vercel Analytics/Sentry not yet integrated (internal metrics working)
- **Mercury transactions**: Limited to 500 per query; paginate for high-volume accounts
- **Analytics loading**: Supabase pooler can be slow under concurrent dashboard queries; added retry + staleTime caching

## Recent Changes

| Date   | Commit  | Description                                                                              |
| ------ | ------- | ---------------------------------------------------------------------------------------- |
| Mar 24 | pending | Phase 8: Project/task management — schema, tRPC router, admin pages, portal integration  |
| Mar 24 | 5053e50 | Phase 7: portal sidebar layout, client list redesign, Your Team card, notes formatting   |
| Mar 24 | 78da76e | Phase 6: RBAC (4 roles), notifications, admin profile, CRM inline editing, org overhaul  |
| Mar 21 | 03e1a0e | Expand roadmap: ops infrastructure, notifications, SOP tab, audit trail, global search   |
| Mar 21 | b07ce49 | Reorganize roadmap and reprioritize TODOs around client onboarding and platform buildout |

_Older changes: `git log --oneline`_
