# Project Status

**Version:** 0.10.0
**Last Updated:** 2026-04-01
**Last Updated By:** Matthew Miceli
**Commits:** 260+

## Feature Status

| Feature                        | Status    | Notes                                                                                                   |
| ------------------------------ | --------- | ------------------------------------------------------------------------------------------------------- |
| Multi-domain routing           | Working   | matthewmiceli.com, miraclemind.dev, miraclemind.live                                                    |
| Authentication (Supabase)      | Working   | Email/password, magic links, tRPC protectedProcedure                                                    |
| Admin dashboard v2             | Working   | Collapsible sidebar, breadcrumbs, expanded navigation                                                   |
| Admin ecosystem map            | Working   | 151 routes, redirects, API routes, all domains/statuses                                                 |
| Admin tooling pages            | Working   | 47 tools across 14 categories, 22 tables across 6 domains                                               |
| Admin finance dashboard        | Working   | Overview, revenue, expenses, yearly P&L, tax & deductions, Stripe fee auto-logging                      |
| Admin analytics dashboard      | Working   | Internal metrics, revenue summary, contact growth, domain activity                                      |
| Admin CRM system               | Working   | Full pipeline, DnD kanban, CSV import/export, unscoped, optional email on contacts                      |
| Admin Team page                | Working   | Multi-role support, role/status filters, sorting, Create Portal button                                  |
| Admin portals page             | Working   | Table with SortHeader, pipeline status + tag filters, assignment-scoped                                 |
| Admin projects                 | Working   | DnD kanbans, archiving, delete impact dialog, connector scoping, portal links, searchable client filter |
| Admin login                    | Working   | Matches portal login UX — shader bg, Team Login, forgot password, claim account, set-password flow      |
| Admin profile                  | Working   | Editable name/phone, role display, founder role switcher, reset password                                |
| Admin notifications            | Working   | Bell in header, polling, /admin/notifications page, triggered by status changes and updates             |
| Role-based access (RBAC)       | Working   | 5 roles, all see CRM/Assets, connectors see connected projects, tooling dev-only                        |
| Finance integrations           | Working   | Stripe Live + Mercury API (date-filtered), smart auto-categorization                                    |
| Client portal v3               | Working   | Sidebar layout, table views for Demos/Proposals/Tooling/Notes, Projects before Billing in nav           |
| Portal project detail          | Working   | `portal/[slug]/projects/[id]` — mirrors admin, read-only for clients, admin edit/create                 |
| Portal notes                   | Working   | Table layout with expandable previews, dedicated `/notes/[id]` detail page with inline editing          |
| Portal projects                | Working   | Admin gets DnD kanban + task management, optimistic drag, archived toggle                               |
| CRM contact detail             | **New**   | Unified with client detail — Projects tab, merged activity timeline, team row, portal expansion         |
| CRM client detail              | **New**   | Unified with contact detail — same layout, same tabs, bidirectional data sync                           |
| Proposal system v2             | **New**   | Full rebuild: checkout groups, per-package payments, Stripe + Mercury, link existing payments           |
| Proposal Builder               | **New**   | Rich text editor, line items, required/optional packages, credit/bank payment toggles                   |
| Mercury invoicing              | **New**   | AR API integration — auto-create customer, create invoice, return payment link, cron polling            |
| Stripe checkout (v2)           | **New**   | Per-package checkout sessions, webhook fee capture, proposal status recalculation                       |
| Payment linking                | **New**   | Search Stripe/Mercury by date, link existing payments to specific proposal packages                     |
| Portal demos/tooling/proposals | Working   | Table layout with SortHeader multi-column sorting                                                       |
| Note detail page               | Working   | `/portal/[slug]/notes/[id]` — full content view, inline editing, admin actions                          |
| Frazier Dentistry demo         | Working   | 28-page website demo under Shechem's portal, public share support via registry                          |
| Public share OG branding       | Working   | Universal Miracle Mind OG images (4 variants), branded link previews for all share links                |
| CRM shared components          | Working   | PromoteToClientModal, DemotionDialog, ContactRow type extracted to `src/components/crm/`                |
| Showcase page                  | Working   | Live demos only (demos + creative); full CV content in docs/cv-matthew-miceli.md                        |
| CRM ↔ Client sync              | **Fixed** | Bidirectional sync for all 6 shared fields including assignedDeveloperId                                |
| Portal lifecycle               | **Fixed** | promote/create/demote/delete all sync clients ↔ portal_users correctly                                  |
| Database config                | **Fixed** | Drizzle tablesFilter removed (was matching nothing), SQLite dead path removed, db typed properly        |
| Security hardening             | Working   | XSS sanitization, input length limits, RLS on all tables, client-scoped auth on checkout procedures     |
| Proposal UX improvements       | **New**   | Customer info autopopulate, Save Draft / Save & Publish, Publish/Unpublish, consolidated privacy toggle |
| Quality sweep (proposals)      | **New**   | Auth fixes, atomic mutations, shared formatters, a11y (dialog/keyboard), responsive fixes               |

## Known Limitations

- **Mercury API**: Requires `MERCURY_API_KEY` env var (generate at Mercury Settings → Tokens)
- **Mercury invoicing**: Uses AR API (`/ar/invoices`), requires Mercury Plus plan
- **Mercury cron**: Vercel cron configured but untested in production — fallback is manual "Check Payment" or Link Payment
- **Analytics external**: PostHog/Vercel Analytics/Sentry not yet integrated (internal metrics working)
- **Mercury transactions**: Limited to 500 per query; paginate for high-volume accounts
- **Recurring billing**: Subscription payments after initial checkout not yet logged to billing tab
- **Notion edge functions**: API token hardcoded in edge function source — needs migration to Supabase secrets

## Recent Changes

| Date   | Commit  | Description                                                                          | Author         |
| ------ | ------- | ------------------------------------------------------------------------------------ | -------------- |
| Apr 01 | 6cefd70 | Quality sweep: security auth, a11y, responsive, shared formatters, atomic mutations  | Matthew Miceli |
| Apr 01 | 2015bb9 | Proposal UX: autopopulate, table overflow fix, privacy consolidation, draft/publish  | Matthew Miceli |
| Mar 31 | 368f949 | Proposal system v2, CRM/client unification, Mercury invoicing, payment linking       | Matthew Miceli |
| Mar 30 | 41ae7bd | Project cleanup: dead deps, security hardening, DB fixes, portal lifecycle bug fixes | Matthew Miceli |
| Mar 30 | 3a7c5d9 | Showcase → live demos only, CV markdown created, /resume redirects to /showcase      | Matthew Miceli |

_Older changes: `git log --oneline`_
