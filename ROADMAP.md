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

## Phase 6 — Role-Based Access & Permissions (DONE)

- [x] Create role-based accounts: Account Management, Development, Sales
- [x] Build role-specific views/dashboards for each role
- [x] Account manager permissions: filter by assigned clients, scoped editing
- [x] CRM contact page overhaul: comprehensive UI, inline editing, admin can assign devs/account managers
- [x] Notifications system: in-app + email alerts for tickets, payments, proposal actions, updates

## Phase 7 — Client Portal UX Refresh (DONE)

- [x] Refactor client portal layout to match admin hub pattern (sidebar + header + content area)
- [x] Sidebar navigation for portal tabs
- [x] Redesign client cards — pagination, search/filter, role-scoped views
- [x] Editable client metadata, reset password, "Your Team" card

### Deferred to Phase 9+

- [ ] Proposals modal UI refresh (friendlier, easier to read)
- [ ] Proposal Builder UI for non-dev Account Managers (create/edit proposals)
- [ ] Projects tab: internal notes section + task management UI (linked to admin hub task system)

## Phase 8a — Proposal & Billing Completion (NEXT)

- [ ] Test proposal creation UI end-to-end (build from scratch → view → checkout)
- [ ] Recurring billing tracking: handle `invoice.payment_succeeded` webhook, log each subscription payment to billing tab
- [x] Proposal Builder UI for non-dev Account Managers (create/edit proposals)
- [x] Proposal system v2: checkout groups, per-package payments, required/optional toggle
- [x] Mercury AR invoice creation via API (auto-create customer, return payment link)
- [x] Payment linking: search Stripe/Mercury, link to specific packages
- [x] Stripe checkout with webhook fee capture and proposal status recalculation
- [x] CRM contact/client detail unification (same tabs, bidirectional sync, expanded portal view)

## Phase 8b — Admin Portal Expansion

- [ ] Project management / task management UI in admin portal
- [ ] CRM contact/client detail: robust project filtering (status, search, assignee, date range) matching portal project page capabilities
- [ ] Bug & ticketing system: clients submit via portal, team manages in admin (Open → In Progress → Resolved → Closed)
- [ ] SOP tab: checklist-driven client onboarding workflow (create portal → magic link → assign AM → first project), reusable process templates
- [x] Activity log / audit trail: crm_activities table with auto-logging on status/assignment changes
- [ ] Contracts section: client portal + admin CRM view (files, agreements, legal docs)
- [ ] Global search (Cmd+K): search across contacts, clients, projects, tickets
- [ ] Profile view tab: role, contracts, legal, financial data, 1099/profit sharing payouts
- [ ] Legal agreements for portal onboarding (bundled with profile/contracts)
- [ ] Privacy policies and ToS improvements

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

## Phase 14 — Environment Isolation & Sandbox (BLOCKED — needs free Supabase slot)

### Database Protection

- [ ] Create sandbox Supabase project (free tier — auth + Postgres)
- [ ] Switch from `db:push` to `db:generate` + `db:migrate` workflow for production
- [ ] Commit migration files to git (`drizzle/` folder)
- [ ] Add `db:push` guard script — warns/blocks if `DATABASE_URL` matches production
- [ ] Document deploy process: code merges to main → `db:migrate` runs against prod

### Sandbox Setup

- [ ] Write `scripts/seed-sandbox.ts` — creates Supabase Auth accounts + matching portal_users rows (founder, AM, dev, client roles with known passwords)
- [ ] Seed fake client data: 3-5 clients with proposals, notes, demos, billing history
- [ ] Add production URL guard to seed script (refuse to run against prod Supabase)
- [ ] Create `sandbox` long-lived branch from dev

### Deployment & Onboarding

- [ ] Pin Vercel preview deployment to `sandbox` branch (sandbox.miraclemind.dev)
- [ ] Configure sandbox branch env vars in Vercel (sandbox Supabase URL, keys, DATABASE_URL)
- [ ] Write team onboarding doc: sandbox URL, credentials per role, what to explore
- [ ] Update `.env.example` with dual-environment documentation

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
- [ ] Mercury webhooks: replace cron polling with real-time invoice status updates (register account-level webhook, build handler, remove polling endpoint)
