# TODO

## Critical (blocks production)

_None currently — all critical security items resolved_

## Bugs (broken functionality)

_None currently_

## Tech Debt (code quality issues)

- [ ] Improve site efficiency and reduce lag/response times (bundle size, caching, queries)
- [ ] Authenticate Stripe MCP server for full integration testing

## Enhancements (prioritized)

### High Priority
- [ ] Build Stripe checkout flows and billing UI for client portal
- [ ] Add client self-service auth (admin creates account, client confirms email)
- [ ] Complete blog automation system `src/app/admin/blog/page.tsx:191`

### Medium Priority
- [ ] Configure Make.com/Zapier webhook for Instagram automation
- [ ] Add Gamma API integration for slide automation
- [ ] Populate CHW360 demo content for client portal

### Lower Priority
- [ ] Create next blog post
- [ ] Bundle size optimization pass
- [ ] Usage-based pricing / COG calculators
- [x] Create shader for miracle-mind-orbit-star-v3.svg
- [x] Security hardening (protectedProcedure, Bearer auth, rate limiting, RLS)
- [x] Stripe foundation + Resend email integration
- [x] BANYAN signup email notifications
- [x] New company homepage v2 with orbit-star shader
- [x] Stewardship program page + partner cards
- [x] Terms of Service + Privacy Policy pages
- [x] Client portal with CRM, admin interface, email notifications
- [x] Remove dead code (animations page, deprecated carousel function)

## Design Questions (needs decision)

- [ ] **Page templating architecture**: Design system to copy sample pages between routes
- [ ] **Shader creation skill**: Should we create a `/shader` skill for generating GLSL shaders?
