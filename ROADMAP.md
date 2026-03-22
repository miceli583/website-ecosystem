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

## Phase 5 — Client Onboarding & Deliverables

### Client Onboarding

- [ ] Set up Marissa Lambert in client portal → prep Soul Map UI
- [ ] Add Zoey Wind to client portal → start building website
- [ ] Add Shane David Street to client portal → start building website

### Active Client Deliverables

- [ ] Glo Moss: next phase of website + connect re: Tony Cho
- [ ] Shechem: TapCHW website, Gamma slide builder, LinkedIn photos, LMS prototype demo

## Phase 6 — Role-Based Access & Permissions

- [ ] Create role-based accounts: Account Management, Development, Sales
- [ ] Build role-specific views/dashboards for each role
- [ ] Account manager permissions: filter by assigned clients, scoped editing

## Phase 7 — Client Portal UX Refresh

- [ ] Client portal UI overhaul — friendlier, prettier, easier to read
- [ ] Non-dev Account Manager interactability
- [ ] Proposal Builder UI (admin-facing, replaces manual proposal creation)

## Phase 8 — Admin Portal Expansion

- [ ] Project management / task management UI in admin portal
- [ ] Bug & ticketing system: clients submit via portal, team manages in admin (Open → In Progress → Resolved → Closed)
- [ ] Profile view tab: role, contracts, legal, financial data, 1099/profit sharing payouts
- [ ] Legal agreements for portal onboarding (bundled with profile/contracts)
- [ ] Privacy policies and ToS improvements

## Phase 9 — Team Scorecard & Accountability

- [ ] Project health tracking: on-time delivery, scope changes, client satisfaction (1-5 rating at milestones)
- [ ] Team member metrics: tasks completed, tickets resolved, active projects (auto-derived from project/task data)
- [ ] Quarterly rocks: 3-5 goals per person per quarter, binary done/not-done, quarterly review
- [ ] Definition of Done templates: per project type (website, demo, portal setup) — checklist before marking complete

## Phase 10 — Payments & Billing

- [ ] One-time invoice payment flow: Mercury linking for one-time payments in client portal
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
