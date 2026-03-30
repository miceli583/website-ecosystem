# Project Status

**Version:** 0.9.0
**Last Updated:** 2026-03-29 (session 2)
**Last Updated By:** Matthew Miceli
**Commits:** 250+

## Feature Status

| Feature                        | Status      | Notes                                                                                                   |
| ------------------------------ | ----------- | ------------------------------------------------------------------------------------------------------- |
| Multi-domain routing           | Working     | matthewmiceli.com, miraclemind.dev, miraclemind.live                                                    |
| Authentication (Supabase)      | Working     | Email/password, magic links, tRPC protectedProcedure                                                    |
| Admin dashboard v2             | Working     | Collapsible sidebar, breadcrumbs, expanded navigation                                                   |
| Admin ecosystem map            | Working     | 151 routes, redirects, API routes, all domains/statuses                                                 |
| Admin tooling pages            | Working     | 47 tools across 14 categories, 22 tables across 6 domains                                               |
| Admin finance dashboard        | Working     | Overview, revenue, expenses, yearly P&L, tax & deductions                                               |
| Admin analytics dashboard      | Working     | Internal metrics, revenue summary, contact growth, domain activity                                      |
| Admin CRM system               | Working     | Full pipeline, DnD kanban, CSV import/export, unscoped, optional email on contacts                      |
| Admin Team page                | Working     | Multi-role support, role/status filters, sorting, Create Portal button                                  |
| Admin portals page             | **Updated** | Renamed from Clients, table with SortHeader, pipeline status + tag filters, assignment-scoped           |
| Admin projects                 | **Updated** | DnD kanbans, archiving, delete impact dialog, connector scoping, portal links, searchable client filter |
| Admin login                    | Working     | Matches portal login UX — shader bg, Team Login, forgot password, claim account, set-password flow      |
| Admin profile                  | Working     | Editable name/phone, role display, founder role switcher, reset password                                |
| Admin notifications            | Working     | Bell in header, polling, /admin/notifications page, triggered by status changes and updates             |
| Role-based access (RBAC)       | **Updated** | 5 roles, all see CRM/Assets, connectors see connected projects, tooling dev-only                        |
| Finance integrations           | Working     | Stripe Live + Mercury API (date-filtered), smart auto-categorization                                    |
| Client portal v3               | **Updated** | Sidebar layout, table views for Demos/Proposals/Tooling/Notes, Projects before Billing in nav           |
| Portal project detail          | Working     | `portal/[slug]/projects/[id]` — mirrors admin, read-only for clients, admin edit/create                 |
| Portal notes                   | **Updated** | Table layout with expandable previews, dedicated `/notes/[id]` detail page with inline editing          |
| Portal projects                | Working     | Client list view (no kanban), admin gets DnD kanban + task management                                   |
| CRM contact detail             | Working     | 3-tab layout, expandable notes, StatusDropdown, smart promote/demote, developer assignment              |
| CRM client detail              | Working     | 3-tab layout, expandable CRM notes, Delete Portal action, team pickers                                  |
| Portal demos/tooling/proposals | **Updated** | Converted from ListItem cards to table layout with SortHeader multi-column sorting                      |
| Note detail page               | **New**     | `/portal/[slug]/notes/[id]` — full content view, inline editing, admin actions                          |
| Frazier Dentistry demo         | Working     | 28-page website demo under Shechem's portal, public share support via registry                          |
| Public share OG branding       | Working     | Universal Miracle Mind OG images (4 variants), branded link previews for all share links                |
| CRM shared components          | **Updated** | PromoteToClientModal, DemotionDialog, ContactRow type extracted to `src/components/crm/`                |
| Showcase page                  | **Updated** | Portfolio showcase at `/showcase` — sovereignty messaging, about section, photo, section nav arrows     |

## Known Limitations

- **Mercury API**: Requires `MERCURY_API_KEY` env var (generate at Mercury Settings → Tokens)
- **Analytics external**: PostHog/Vercel Analytics/Sentry not yet integrated (internal metrics working)
- **Mercury transactions**: Limited to 500 per query; paginate for high-volume accounts
- **Analytics loading**: Supabase pooler can be slow under concurrent dashboard queries; added retry + staleTime caching

## Recent Changes

| Date   | Commit  | Description                                                                        | Author         |
| ------ | ------- | ---------------------------------------------------------------------------------- | -------------- |
| Mar 29 | —       | Showcase refinements: sovereignty messaging, about section, nav arrows, hero photo | Matthew Miceli |
| Mar 29 | 2a7ee11 | Showcase page with hero, tech stack, demos, creative sections + Mapbox env         | Matthew Miceli |
| Mar 28 | 88d3d45 | Portal pages → table layout with SortHeader sorting + note detail page             | Matthew Miceli |
| Mar 27 | bdf04f8 | Branded OG images for share link previews (4 variants, universal fallback)         | Matthew Miceli |
| Mar 27 | ee4d658 | Frazier demo → single component for public share support (TapCHW pattern)          | Matthew Miceli |

_Older changes: `git log --oneline`_
