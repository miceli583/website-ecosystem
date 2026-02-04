# TODO

## Critical (blocks production)

_None currently — all critical security items resolved_

## Bugs (broken functionality)

_None currently_

## Tech Debt (code quality issues)

- [ ] Add Stripe product name caching (24hr TTL) to reduce API calls
- [ ] Implement optimistic updates for notes mutations (reduce flash on rapid actions)

## Enhancements (prioritized)

### High Priority
- [ ] Stress test portal flows using `docs/portal-qa-checklist.md`
- [ ] Add loading skeletons to replace spinner states
- [ ] Admin UI for managing client resources (demos, tooling, proposals)
- [ ] Complete blog automation system `src/app/admin/blog/page.tsx:191`

### Medium Priority
- [ ] Add keyboard shortcuts (Cmd+K search, Esc close, Cmd+N new note)
- [ ] Add Gamma API integration for slide automation
- [ ] Populate Matti demo content for client portal
- [ ] Research device-independent magic links (Supabase auth)

### Lower Priority
- [ ] Create next blog post
- [ ] Bundle size optimization pass
- [ ] Privacy policies and ToS improvements
- [ ] Legal agreements for portal onboarding
- [ ] Email/text marketing opt-in management

## Design Questions (needs decision)

- [ ] **Page templating architecture**: Design system to copy sample pages between routes
- [ ] **Shader creation skill**: Should we create a `/shader` skill for generating GLSL shaders?
