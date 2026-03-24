# Roadmap

## Session 1 — Critical Stripe Fixes (DONE)

- [x] Fix Stripe webhook (307 redirect + env var typo)
- [x] Fix billing history to show PaymentIntents alongside invoices
- [x] Manually update Shechem's proposal status
- [x] Link payments to proposal names in billing history
- [x] Store stripeSubscriptionId on proposals during checkout
- [x] Handle invoice.payment_succeeded / subscription.updated / subscription.deleted webhooks
- [x] Resolve proposal names on invoices and subscriptions in billing page

## Session 2 — Portal Hardening (DONE)

- [x] Remove Matt M test profile from portal and login
- [x] Add collaborative notes tab (admin + client can both edit/view, multiple notes)

## Session 3 — Branding & Polish (DONE)

- [x] Portal branding consistency — standardized demo hubs, gold accent colors
- [x] Admin login page rebranded to gold/black Miracle Mind theme
- [x] Proposal spacing and markdown rendering improved

## Session 4 — Admin Overhaul Phase 1-2 (DONE)

- [x] Admin-only route protection + dashboard layout + custom nav/footer
- [x] CRM core: input customers, search, pipeline view
- [x] CRM advanced: source tracking, Stripe lifetime spend, collaborative notes
- [x] Site analytics (internal submission metrics)
- [x] Rename "Landing Pages" to "Web Design"; landing pages open in new tab
- [x] Remove Assets page nav/footer remnants

---

## Phase 5 — Client Onboarding & Deliverables (TABLED)

_Client onboarding will happen individually as calls are scheduled._

### Client Onboarding (on hold)

- [ ] Set up Marissa Lambert in client portal → prep Soul Map UI
- [ ] Add Zoey Wind to client portal → start building website
- [ ] Add Shane David Street to client portal → start building website

### Active Client Deliverables

- [ ] Glo Moss: next phase of website + connect re: Tony Cho
- [x] Shechem: LinkedIn photos
- [ ] Shechem: TapCHW website, Gamma slide builder, LMS prototype demo (longer horizon)

## Phase 6 — Role-Based Access & Permissions

- [ ] Create role-based accounts: Account Management, Development, Sales
- [ ] Build role-specific views/dashboards for each role
- [ ] Account manager permissions: filter by assigned clients, scoped editing
- [ ] CRM contact page overhaul: comprehensive UI, inline editing, admin can assign devs/account managers
- [ ] Notifications system: in-app + email alerts for tickets, payments, proposal actions, updates

## Phase 7 — Client Portal UX Refresh

### Portal Layout & Navigation

- [ ] Refactor client portal layout to match admin hub pattern (sidebar + header + content area)
- [ ] Sidebar navigation for portal tabs (Dashboard, Demos, Projects, Notes, Proposals, Billing, Profile, Tooling)

### Clients List Page (Admin-Side)

- [ ] Redesign client cards — sleeker, card-based with key info at a glance
- [ ] Add pagination and search/filter (by status, account manager, name)
- [ ] Role-scoped: AMs see only assigned clients, Devs see only clients with assigned projects

### Client Profile (Portal-Side)

- [ ] Editable client metadata (name, phone, company)
- [ ] Reset password option for client users
- [ ] "Your Team" card (replaces "Your Account Manager") — shows assigned AM + Dev, visible to active clients only

### Deferred to Phase 8+

- [ ] Proposals modal UI refresh (friendlier, easier to read)
- [ ] Proposal Builder UI for non-dev Account Managers (create/edit proposals)
- [ ] Projects tab: internal notes section + task management UI (linked to admin hub task system)

## Phase 8 — Admin Portal Expansion

- [ ] Project management / task management UI in admin portal
- [ ] Bug & ticketing system: clients submit via portal, team manages in admin (Open → In Progress → Resolved → Closed)
- [ ] SOP tab: checklist-driven client onboarding workflow (create portal → magic link → assign AM → first project), reusable process templates
- [ ] Activity log / audit trail: who did what and when, append-only, visible in admin
- [ ] Global search (Cmd+K): search across contacts, clients, projects, tickets
- [ ] Profile view tab: role, contracts, legal, financial data, 1099/profit sharing payouts
- [ ] Legal agreements for portal onboarding (bundled with profile/contracts)
- [ ] Privacy policies and ToS improvements
- [ ] Proposal Builder UI for non-dev Account Managers (create/edit proposals from admin)
- [ ] Proposals modal UI polish — better readability, package comparison

## Phase 9 — Team Scorecard & Accountability

- [ ] Role-specific KPI dashboards: Overview tab per role with relevant metrics (AM: client count, revenue per client; Dev: projects completed, tickets resolved)
- [ ] KPI builder: Founder can define custom KPIs per role, assign targets, track actuals
- [ ] Project health tracking: on-time delivery, scope changes, client satisfaction (1-5 rating at milestones)
- [ ] Team member metrics: tasks completed, tickets resolved, active projects (auto-derived from project/task data)
- [ ] Quarterly rocks: 3-5 goals per person per quarter, binary done/not-done, quarterly review
- [ ] Definition of Done templates: per project type (website, demo, portal setup) — checklist before marking complete

## Phase 10 — Payments & Billing

- [ ] AM access to billing tab: search Mercury invoices/one-time bills charged outside portal
- [ ] One-time invoice payment flow: Mercury linking for one-time payments in client portal
- [ ] Custom Mercury invoice creation from portal (AM-facing, fold into proposal UI editor)
- [ ] Mercury Plus investigation: recurring invoices as Stripe replacement
- [ ] Stripe account configuration cleanup

## Phase 11 — EOS Review Cadence

- [ ] Weekly L10 meeting dashboard: scorecard metrics, rock status, to-do list, issues list (IDS: Identify → Discuss → Solve)
- [ ] Monthly financial review: revenue vs forecast, expenses, profit margins, outstanding invoices, cash flow
- [ ] Quarterly rock review: score rocks (done/not done), set next quarter's rocks, update scorecards
- [ ] Annual planning view: yearly goals, revenue targets, key initiatives

## Phase 12 — Business Development

- [ ] Build funnel and ad campaign for website/CRM building services
- [ ] Email/text marketing opt-in management (CRM, portal, intake forms)

## Phase 13 — Observability

- [ ] Full-stack analytics (Vercel Analytics + PostHog) — login frequency, email sends, click tracking
- [ ] Sentry error tracking (ecosystem-wide, dedicated admin tab)

## Target Admin Structure

- Admin Dashboard
- CRM
- Organization (team + account managers)
- Ecosystem Map (centered around live sites)
- Web Design (renamed from Landing Pages)
- Design Assets
- CMS (blog + email/text sequences)
- Tooling (service inventory, database health)
- Sentry (error tracking)
- Custom admin nav/footer

## Backlog

- [ ] Admin UI for managing client resources (demos, tooling, proposals)
- [ ] CRM contact import (VCF bulk upload with duplicate detection)
- [ ] CRM enhancements: notes management, outreach scheduling
- [ ] Integrate brand tab into client portal
- [ ] Keyboard shortcuts (Cmd+K search, Esc close, Cmd+N new note)
- [ ] Bundle size optimization pass
- [ ] Site efficiency improvements (caching, queries)
- [ ] Page templating architecture (gallery exists, needs copy/scaffold)
- [ ] Image carousel (continuous sliding) for matthewmiceli.com
- [ ] Research device-independent magic links (Supabase auth)
- [ ] Stress test portal flows (after portal UI refresh — checklist in docs/)
- [ ] Shader creation skill
- [ ] Evaluate Turso for demo data isolation

## Low Priority

- [ ] Blog automation system
- [ ] CMS email/text sequence builder
