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

## Session 4+ — Admin Overhaul (Phased)

### Phase 1: Foundation (DONE)
- [x] Admin-only route protection
- [x] Dashboard layout + custom nav/footer

### Phase 2: CRM Core (DONE)
- [x] Input customers
- [x] Search
- [x] Pipeline view

### Phase 3: CRM Advanced
- [x] Source tracking from intake forms
- [x] Stripe lifetime spend per customer
- [ ] Customer notes with todos
- [ ] Link admin notes to portal client view

### Phase 4: Analytics
- [x] Site analytics (internal submission metrics)
- [ ] Full-stack analytics (Vercel Analytics + PostHog across ecosystem)
- [ ] Login frequency
- [ ] Email sends
- [ ] Click tracking

### Phase 5: Platform Expansion
- [ ] Account manager role-based permissions (filter clients, scoped editing)
- [ ] CRM notes management + project management + outreach scheduling
- [ ] CMS email/text sequence builder
- [ ] Sentry error tracking (ecosystem-wide, dedicated admin tab)
- [x] Rename "Landing Pages" to "Web Design"; landing pages open in new tab
- [x] Remove Assets page nav/footer remnants

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

## Cross-Cutting / Ongoing

- [ ] Privacy policies and ToS improvements
- [ ] Legal agreements for portal onboarding
- [ ] Email/text marketing opt-in management (CRM, portal, intake forms)
- [ ] Stripe account configuration
- [ ] Admin UI for proposals creation/editing + invoice submission to portal billing

## Backlog

- [ ] Admin UI for managing client resources (demos, tooling, proposals)
- [ ] Bundle size optimization pass
- [ ] Site efficiency improvements (caching, queries)
- [ ] Page templating architecture
- [ ] Shader creation skill
- [ ] Image carousel (continuous sliding) for matthewmiceli.com
- [ ] Research device-independent magic links (Supabase auth)
- [ ] Stress test portal flows (manual QA — checklist in docs/)

## Low Priority

- [ ] Blog automation system
- [ ] Audit service inventory for completeness
