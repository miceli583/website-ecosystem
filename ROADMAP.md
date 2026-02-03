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
- [ ] Stress test portal flows (manual QA — checklist printed)
- [ ] Research device-independent magic links (Supabase auth) — tabled

## Session 3 — Branding & Polish (DONE)

- [x] Portal branding consistency — standardized demo hubs, gold accent colors
- [x] Admin login page rebranded to gold/black Miracle Mind theme
- [x] Proposal spacing and markdown rendering improved
- [ ] Image carousel (continuous sliding) for matthewmiceli.com — deprioritized

## Session 4+ — Admin Overhaul (Phased)

### Phase 1: Foundation
- [ ] Admin-only route protection
- [ ] Dashboard layout + custom nav/footer

### Phase 2: CRM Core
- [ ] Input customers
- [ ] Search
- [ ] Pipeline view

### Phase 3: CRM Advanced
- [ ] Source tracking from intake forms
- [ ] Stripe lifetime spend per customer
- [ ] Customer notes with todos
- [ ] Link admin notes to portal client view

### Phase 4: Analytics
- [ ] Site analytics
- [ ] Login frequency
- [ ] Email sends
- [ ] Click tracking

## Target Admin Structure

- Admin Dashboard
- CRM
- Ecosystem Map (centered around live sites)
- Design Assets
- Tooling (future CMS)
- Web Design Playground
- Custom admin nav/footer

## Cross-Cutting / Ongoing

- [ ] Privacy policies and ToS improvements
- [ ] Legal agreements for portal onboarding
- [ ] Email/text marketing opt-in management (CRM, portal, intake forms)
- [ ] Stripe account configuration
- [ ] Admin UI for proposals creation/editing + invoice submission to portal billing

## Backlog

- [ ] Admin UI for managing client resources (demos, tooling, proposals)
- [ ] Gamma API integration for slide automation
- [ ] Populate Matti demo content
- [ ] Bundle size optimization pass
- [ ] Site efficiency improvements (caching, queries)
- [ ] Page templating architecture
- [ ] Shader creation skill

## Low Priority

- [ ] Blog automation system
- [ ] Admin dashboard visual refactor
