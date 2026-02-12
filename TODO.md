# TODO

## Critical (blocks production)

_None currently — all critical security items resolved_

## Bugs (broken functionality)

_None currently_

## Tech Debt (code quality issues)

- [ ] CMS UI: refactor to follow brand guidelines (gold/black theme)

## Enhancements (prioritized)

### High Priority
- [ ] **Full-stack analytics**: Set up Vercel Analytics + PostHog across ecosystem — portal usage, site visits, form submissions, domain activity
- [ ] **Sentry error tracking**: Implement across ecosystem (especially client portal); add dedicated "Sentry" tab in dev hub
- [ ] Stress test portal flows using `docs/portal-qa-checklist.md`
- [ ] Admin UI for managing client resources (demos, tooling, proposals)
- [ ] **Mercury as payment platform**: Investigate Mercury Plus recurring invoices as Stripe replacement — recurring invoices, revenue dashboard integration (`admin/finance/revenue`), client portal checkout via Mercury invoicing. Mercury Plus is $35/mo; Stripe processing fee savings already cover the cost.

### Medium Priority
- [ ] **Account manager permissions**: Role-based access so account managers can filter by their clients, only edit projects for their assigned clients
- [ ] **CRM contact import**: Bulk upload contacts from phone via VCF file — client-side vCard parser, preview table with duplicate detection (match by email), bulk `crm.importContacts` mutation
- [ ] **CRM enhancements**: Notes management, deeper project management, in-site scheduling of emails/updates/outreach
- [ ] **CMS email/text sequences**: Add email and text sequence builder to CMS
- [ ] Add keyboard shortcuts (Cmd+K search, Esc close, Cmd+N new note)
- [ ] Dynamic route scanning for ecosystem map (currently static list)
- [ ] Complete blog automation system `src/app/admin/blog/page.tsx:191`
- [ ] **Integrate brand tab into client portal**: Each client gets a "Brand" tab with their guidelines, colors, fonts, logos
- [ ] **Page templating architecture**: Design system to copy sample pages between routes

### Lower Priority
- [ ] Evaluate Turso for demo data isolation
- [ ] Bundle size optimization pass
- [ ] **Shader creation skill**: Evaluate creating a `/shader` skill for generating GLSL shaders
