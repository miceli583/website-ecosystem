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
- [ ] **Test Mercury API** — set `MERCURY_API_KEY` and verify finance dashboard shows real bank data
- [ ] **Test Stripe Live** — verify read-only key returns real revenue data
- [ ] Stress test portal flows using `docs/portal-qa-checklist.md`
- [ ] Admin UI for managing client resources (demos, tooling, proposals)

### Medium Priority
- [ ] Set up PostHog analytics for portal usage tracking
- [ ] Add keyboard shortcuts (Cmd+K search, Esc close, Cmd+N new note)
- [ ] Add Gamma API integration for slide automation
- [ ] Dynamic route scanning for ecosystem map (currently static list)
- [ ] Complete blog automation system `src/app/admin/blog/page.tsx:191`

### Lower Priority
- [ ] Populate Matti demo content for client portal
- [ ] Evaluate Turso for demo data isolation
- [ ] Bundle size optimization pass
- [ ] Sentry error tracking setup

## Design Questions (needs decision)

- [ ] **Page templating architecture**: Design system to copy sample pages between routes
- [ ] **Shader creation skill**: Should we create a `/shader` skill for generating GLSL shaders?
