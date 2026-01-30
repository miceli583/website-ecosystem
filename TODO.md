# TODO

## Critical (blocks production)

_None currently — all critical security items resolved_

## Bugs (broken functionality)

_None currently_

## Tech Debt (code quality issues)

- [ ] Improve site efficiency and reduce lag/response times (bundle size, caching, queries)

## Enhancements (prioritized)

### High Priority
- [ ] Admin UI for managing client resources (demos, tooling, proposals)
- [ ] Complete blog automation system `src/app/admin/blog/page.tsx:191`
- [ ] Webhook for Stripe checkout completion (update proposal status)

### Medium Priority
- [ ] Add Gamma API integration for slide automation
- [ ] Populate Matti demo content for client portal

### Lower Priority
- [ ] Create next blog post
- [ ] Bundle size optimization pass
- [ ] Usage-based pricing / COG calculators
- [x] Stripe checkout flows for proposals (one-time, subscription)
- [x] Demos page: project-based organization, search/filter
- [x] Proposals page: line items, expandable cards, checkout
- [x] Tooling page: search, refresh, improved credential display
- [x] Portal v2: role-based auth on miraclemind.live
- [x] Client self-service auth (magic link claim flow)
- [x] Stripe billing page with invoices/subscriptions
- [x] Profile page with editable fields + change password
- [x] Client resources system (demos, tooling, credentials)
- [x] Configure Make.com/Zapier webhook for Instagram automation
- [x] Stripe MCP integration + billing API

## Design Questions (needs decision)

- [ ] **Page templating architecture**: Design system to copy sample pages between routes
- [ ] **Shader creation skill**: Should we create a `/shader` skill for generating GLSL shaders?
