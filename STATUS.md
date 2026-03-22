# Project Status

**Version:** 0.8.0
**Last Updated:** 2026-03-21
**Last Updated By:** Matthew Miceli
**Commits:** 197+

## Feature Status

| Feature                   | Status  | Notes                                                                                                |
| ------------------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| Multi-domain routing      | Working | matthewmiceli.com, miraclemind.dev, miraclemind.live                                                 |
| Authentication (Supabase) | Working | Email/password, magic links, tRPC protectedProcedure                                                 |
| Admin dashboard v2        | Working | Collapsible sidebar, breadcrumbs, expanded navigation                                                |
| Admin ecosystem map       | Working | 151 routes, redirects, API routes, all domains/statuses                                              |
| Admin tooling pages       | Working | 47 tools across 14 categories, 22 tables across 6 domains                                            |
| Admin finance dashboard   | Working | Overview, revenue, expenses, yearly P&L, tax & deductions                                            |
| Admin analytics dashboard | Working | Internal metrics, revenue summary, contact growth, domain activity                                   |
| Admin CRM system          | Working | Pipeline, contacts list/detail, leads, account managers, CRM→client sync, status-to-client promotion |
| Admin organization        | Working | Team member CRUD, role management, account manager assignments                                       |
| Admin clients             | Working | Hybrid edit modal, delete/archive, action menus, CRM sync-on-save, add-from-contacts                 |
| Finance integrations      | Working | Stripe Live + Mercury API (date-filtered), smart auto-categorization                                 |
| Finance expense tracking  | Working | Manual expenses, IRS categories seeded, tax deductibility tracking                                   |
| Client portal v2          | Working | `/portal/[slug]` with role-based auth, rich text push updates, admin Projects tab                    |
| Portal profile            | Working | Role-aware: org members see company roles, admins see nav links                                      |
| Portal demos              | Working | Hub pages, subroutes, slide sub-demos, Wildflower landing, CargoWatch multi-page                     |
| Public demo sharing       | Working | `/s/[token]` with subroute support, OG metadata, custom slugs                                        |
| Portal skeletons          | Working | Loading skeletons for all portal pages                                                               |
| Portal proposals          | Working | Bundle discount, admin controls (WIP/private/archive), Stripe checkout                               |
| Stripe integration        | Working | Billing, subscriptions, webhook events, proposal linking                                             |
| Mercury integration       | Working | API client with date filtering, bearer token auth                                                    |

## Known Limitations

- **Mercury API**: Requires `MERCURY_API_KEY` env var (generate at Mercury Settings → Tokens)
- **Analytics external**: PostHog/Vercel Analytics/Sentry not yet integrated (internal metrics working)
- **Mercury transactions**: Limited to 500 per query; paginate for high-volume accounts

## Recent Changes

| Date   | Commit  | Description                                                                              |
| ------ | ------- | ---------------------------------------------------------------------------------------- |
| Mar 21 | 03e1a0e | Expand roadmap: ops infrastructure, notifications, SOP tab, audit trail, global search   |
| Mar 21 | b07ce49 | Reorganize roadmap and reprioritize TODOs around client onboarding and platform buildout |
| Mar 21 | 22c9b63 | Multi-dev collab infrastructure (Husky, lint-staged, Dependabot, CI, PR template)        |
| Mar 21 | f9874f2 | Bump next 16.1.7, jspdf 4.2.1, audit fix (consolidated Dependabot PRs #1-5)              |
| Mar 21 | 8e952c2 | Format entire codebase with Prettier, framework v1.23.0                                  |

_Older changes: `git log --oneline`_
