# Project Status

**Version:** 0.11.0
**Last Updated:** 2026-03-26
**Last Updated By:** Matthew Miceli
**Commits:** 235+

## Feature Status

| Feature                   | Status      | Notes                                                                                                           |
| ------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------- |
| Multi-domain routing      | Working     | matthewmiceli.com, miraclemind.dev, miraclemind.live                                                            |
| Authentication (Supabase) | Working     | Email/password, magic links, tRPC protectedProcedure                                                            |
| Admin dashboard v2        | Working     | Collapsible sidebar, breadcrumbs, expanded navigation                                                           |
| Admin ecosystem map       | Working     | 151 routes, redirects, API routes, all domains/statuses                                                         |
| Admin tooling pages       | Working     | 47 tools across 14 categories, 22 tables across 6 domains                                                       |
| Admin finance dashboard   | Working     | Overview, revenue, expenses, yearly P&L, tax & deductions                                                       |
| Admin analytics dashboard | Working     | Internal metrics, revenue summary, contact growth, domain activity                                              |
| Admin CRM system          | **Updated** | Full pipeline, kanban drag-and-drop, CSV import/export, unscoped for all team, portal links gated by assignment |
| Admin Team page           | Working     | Multi-role support, role/status filters, sorting, Create Portal button                                          |
| Admin clients (portals)   | **Updated** | Portal management page, table with SortHeader, filters, assignment-scoped, Delete Portal action                 |
| Admin login               | Working     | Matches portal login UX — shader bg, Team Login, forgot password, claim account, set-password flow              |
| Admin profile             | Working     | Editable name/phone, role display, founder role switcher, reset password                                        |
| Admin notifications       | Working     | Bell in header, polling, /admin/notifications page, triggered by status changes and updates                     |
| Role-based access (RBAC)  | **Updated** | 5 roles, CRM unscoped, portal links gated by assignment, clients page scoped by assignment                      |
| Finance integrations      | Working     | Stripe Live + Mercury API (date-filtered), smart auto-categorization                                            |
| Finance expense tracking  | Working     | Manual expenses, IRS categories seeded, tax deductibility tracking                                              |
| Client portal v3          | Working     | Sidebar layout (matches admin hub), collapsible nav, mobile sheet drawer                                        |
| Portal profile            | Working     | Editable metadata, "Your Team" card (AM + Dev), reset password, security section                                |
| Portal demos              | Working     | Hub pages, subroutes, slide sub-demos, Wildflower landing, CargoWatch multi-page                                |
| Public demo sharing       | Working     | `/s/[token]` with subroute support, OG metadata, custom slugs                                                   |
| Portal notes              | Working     | Rich text (TipTap), CRM notes shared between contact + client pages, portal notes independent                   |
| Portal projects           | Working     | Read-only project list visible to clients, task management for team only                                        |
| Project/task management   | Working     | Admin hub + portal, list/kanban views, filters, sort, AM/dev/client scoping, standalone tasks                   |
| CRM contact detail        | **Updated** | 3-tab layout (Activity, Details & Tags, Notes), StatusDropdown, smart promote/demote, developer assignment      |
| CRM client detail         | **Updated** | 3-tab layout mirroring contacts, CRM notes (shared), Delete Portal action, team pickers                         |
| Portal creation           | **New**     | Create portal for any pipeline stage (not just clients), preserveStatus option, carries team assignments        |
| CRM kanban pipeline       | **Updated** | Drag-and-drop with visual drop targets, smart status changes, demotion dialog                                   |
| CRM CSV import/export     | Working     | Export filtered/selected contacts, 4-step import wizard with column mapping                                     |

## Known Limitations

- **Mercury API**: Requires `MERCURY_API_KEY` env var (generate at Mercury Settings → Tokens)
- **Analytics external**: PostHog/Vercel Analytics/Sentry not yet integrated (internal metrics working)
- **Mercury transactions**: Limited to 500 per query; paginate for high-volume accounts
- **Analytics loading**: Supabase pooler can be slow under concurrent dashboard queries; added retry + staleTime caching

## Recent Changes

| Date   | Commit  | Description                                                                                     |
| ------ | ------- | ----------------------------------------------------------------------------------------------- |
| Mar 26 | a29d69f | Unscope CRM contacts, gate portal links by assignment, remove client status, Delete Portal      |
| Mar 26 | b337dc5 | Portal creation for any pipeline stage, developer assignment on contacts, CRM notes unification |
| Mar 26 | c62b3b7 | Client list & detail page overhaul — table, filters, tabs, notes, connector column              |
| Mar 26 | 877d8f8 | CRM UX: contacts toolbar, drag-and-drop kanban, status sync, TipTap rich text fixes             |
| Mar 25 | 5969f0a | CRM enhancements: kanban view, CSV import/export, filters, status sync                          |

_Older changes: `git log --oneline`_
