# Project Status

**Version:** 0.10.0
**Last Updated:** 2026-03-25
**Last Updated By:** Matthew Miceli
**Commits:** 220+

## Feature Status

| Feature                   | Status      | Notes                                                                                                     |
| ------------------------- | ----------- | --------------------------------------------------------------------------------------------------------- |
| Multi-domain routing      | Working     | matthewmiceli.com, miraclemind.dev, miraclemind.live                                                      |
| Authentication (Supabase) | Working     | Email/password, magic links, tRPC protectedProcedure                                                      |
| Admin dashboard v2        | Working     | Collapsible sidebar, breadcrumbs, expanded navigation                                                     |
| Admin ecosystem map       | Working     | 151 routes, redirects, API routes, all domains/statuses                                                   |
| Admin tooling pages       | Working     | 47 tools across 14 categories, 22 tables across 6 domains                                                 |
| Admin finance dashboard   | Working     | Overview, revenue, expenses, yearly P&L, tax & deductions                                                 |
| Admin analytics dashboard | Working     | Internal metrics, revenue summary, contact growth, domain activity                                        |
| Admin CRM system          | **Updated** | Unified contact/client detail pages, activity feed, shared components, multi-level sort, CSV (planned)    |
| Admin Team page           | **Updated** | Renamed from Organization, multi-role support, role/status filters, sorting, Create Portal button         |
| Admin clients             | **Updated** | Mirrors CRM contact detail, projects tab, bidirectional sync, role-based scoping                          |
| Admin login               | **Updated** | Matches portal login UX — shader bg, Team Login, forgot password, claim account, set-password flow        |
| Admin profile             | Working     | Editable name/phone, role display, founder role switcher, reset password                                  |
| Admin notifications       | Working     | Bell in header, polling, /admin/notifications page, triggered by status changes and updates               |
| Role-based access (RBAC)  | **Updated** | 5 roles (Founder/Admin/Dev/AM/Connector), multi-role, scoped clients/contacts/portals, dual-role accounts |
| Finance integrations      | Working     | Stripe Live + Mercury API (date-filtered), smart auto-categorization                                      |
| Finance expense tracking  | Working     | Manual expenses, IRS categories seeded, tax deductibility tracking                                        |
| Client portal v3          | Working     | Sidebar layout (matches admin hub), collapsible nav, mobile sheet drawer                                  |
| Portal profile            | Working     | Editable metadata, "Your Team" card (AM + Dev), reset password, security section                          |
| Portal demos              | Working     | Hub pages, subroutes, slide sub-demos, Wildflower landing, CargoWatch multi-page                          |
| Public demo sharing       | Working     | `/s/[token]` with subroute support, OG metadata, custom slugs                                             |
| Portal skeletons          | Working     | Loading skeletons for all portal pages                                                                    |
| Portal proposals          | Working     | Bundle discount, admin controls (WIP/private/archive), Stripe checkout                                    |
| Portal notes              | Working     | Rich text formatting now renders in previews (TipTap HTML)                                                |
| Portal projects           | **Updated** | Read-only project list visible to clients, task management for team only                                  |
| Project/task management   | Working     | Admin hub + portal, list/kanban views, filters, sort, AM/dev/client scoping, standalone tasks             |
| Stripe integration        | Working     | Billing, subscriptions, webhook events, proposal linking                                                  |
| Mercury integration       | Working     | API client with date filtering, bearer token auth                                                         |
| CRM activity feed         | **New**     | crm_activities table, auto-logging on status/assignment changes, activity tab on contact/client detail    |
| Shared CRM components     | **New**     | Extracted to src/components/crm/ — TeamMemberPicker, TagPicker, ReferralPicker, CompanyPicker, SortHeader |
| Form registry             | **New**     | Dynamic form metadata via DB table, source labels shared via src/lib/source-labels.ts                     |

## Known Limitations

- **Mercury API**: Requires `MERCURY_API_KEY` env var (generate at Mercury Settings → Tokens)
- **Analytics external**: PostHog/Vercel Analytics/Sentry not yet integrated (internal metrics working)
- **Mercury transactions**: Limited to 500 per query; paginate for high-volume accounts
- **Analytics loading**: Supabase pooler can be slow under concurrent dashboard queries; added retry + staleTime caching

## Recent Changes

| Date   | Commit  | Description                                                                                     |
| ------ | ------- | ----------------------------------------------------------------------------------------------- |
| Mar 25 | 11920fb | Unified CRM contact & client detail pages, shared components, activity feed, bidirectional sync |
| Mar 25 | d2ccb96 | CRM improvements: multi-sort, shared source labels, form registry, team member pickers          |
| Mar 25 | c332a18 | Roles overhaul: connector role, multi-role, scoping, admin login redesign, dual-role accounts   |
| Mar 24 | f176d97 | Phase 8: Project/task management — schema, tRPC router, admin pages, portal integration         |
| Mar 24 | 5053e50 | Phase 7: portal sidebar layout, client list redesign, Your Team card, notes formatting          |

_Older changes: `git log --oneline`_
