# TODO

## Critical (blocks production)

_None currently — all critical security items resolved_

## Bugs (broken functionality)

- [ ] Assets pages: remove nav bars and footers (remnants of old dev hub view, not needed inside dashboard viewport)

## Tech Debt (code quality issues)

- [ ] Add Stripe product name caching (24hr TTL) to reduce API calls
- [ ] Implement optimistic updates for notes mutations (reduce flash on rapid actions)
- [ ] CMS UI: refactor to follow brand guidelines (gold/black theme)
- [ ] Rename "Landing Pages" nav section to "Web Design"; landing page links open in new tab
- [ ] Audit service inventory to ensure nothing was missed

## Enhancements (prioritized)

### High Priority
- [ ] **Full-stack analytics**: Set up Vercel Analytics + PostHog across ecosystem — portal usage, site visits, form submissions, domain activity
- [ ] **Sentry error tracking**: Implement across ecosystem (especially client portal); add dedicated "Sentry" tab in dev hub
- [ ] Stress test portal flows using `docs/portal-qa-checklist.md`
- [ ] Admin UI for managing client resources (demos, tooling, proposals)

### Medium Priority
- [ ] **Account manager permissions**: Role-based access so account managers can filter by their clients, only edit projects for their assigned clients
- [ ] **CRM enhancements**: Notes management, deeper project management, in-site scheduling of emails/updates/outreach
- [ ] **CMS email/text sequences**: Add email and text sequence builder to CMS
- [ ] Add keyboard shortcuts (Cmd+K search, Esc close, Cmd+N new note)
- [ ] Dynamic route scanning for ecosystem map (currently static list)
- [ ] Complete blog automation system `src/app/admin/blog/page.tsx:191`

### Lower Priority
- [ ] Evaluate Turso for demo data isolation
- [ ] Bundle size optimization pass

## Design Questions (needs decision)

- [ ] **Page templating architecture**: Design system to copy sample pages between routes
- [ ] **Shader creation skill**: Should we create a `/shader` skill for generating GLSL shaders?
