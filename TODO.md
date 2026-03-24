# TODO

## Critical (blocks production)

_None currently_

## Bugs (broken functionality)

- [ ] **Analytics/Overview loading**: Supabase pooler intermittently slow under concurrent queries — retry + staleTime added but root cause is connection pool pressure

## Tech Debt (code quality issues)

- [ ] **Type assertions in portal profile**: `assignedDeveloper` requires `as typeof client & {...}` casts — clean up when Drizzle relation types stabilize

## Enhancements (prioritized)

### High Priority — Client Onboarding & Deliverables

- [ ] **Set up Marissa Lambert** in client portal → prep Soul Map UI
- [ ] **Add Zoey Wind** to client portal → start building website
- [ ] **Add Shane David Street** to client portal → start building website
- [ ] **Glo Moss next phase**: website work + connect re: Tony Cho
- [ ] **Shechem deliverables**: TapCHW website, Gamma slide builder, LMS prototype demo

### High Priority — Platform (Phase 8+)

- [ ] **Proposal Builder UI**: Non-dev Account Managers can create/edit proposals
- [ ] **Proposals modal UI refresh**: Friendlier, easier to read
- [ ] **Project/task management UI**: Admin portal task tracking + portal projects internal notes
- [ ] **Bug & ticketing system**: Client-facing issue submission, admin-side management
- [ ] **SOP tab**: Checklist-driven onboarding workflows and reusable process templates
- [ ] **Activity log**: Audit trail — who did what and when, visible in admin
- [ ] **Global search (Cmd+K)**: Search across contacts, clients, projects, tickets
- [ ] **Profile documents tab**: Contracts, agreements, file upload
- [ ] **Profile bank balance tab**: Mercury direct deposit integration, 1099 payouts

### Medium Priority

- [ ] **Role-specific KPI dashboards**: Overview tab per role with relevant metrics
- [ ] **KPI builder**: Founder defines custom KPIs per role, assigns targets
- [ ] **Team scorecard**: Project health, team metrics, quarterly rocks, DoD templates
- [ ] **AM billing access**: Search Mercury invoices/one-time bills, create custom invoices
- [ ] **One-time invoice payments**: Mercury linking for one-time payment flow
- [ ] **Mercury as payment platform**: Investigate Mercury Plus recurring invoices as Stripe replacement
- [ ] **Funnel & ad campaign**: Build marketing funnel for website/CRM building services
- [ ] **Privacy policies / ToS**: Legal agreements for portal onboarding

### Lower Priority

- [ ] **Full-stack analytics**: Vercel Analytics + PostHog across ecosystem
- [ ] **Sentry error tracking**: Ecosystem-wide, dedicated admin tab
- [ ] **CRM contact import**: Bulk VCF upload with duplicate detection
- [ ] **CRM enhancements**: Notes management, outreach scheduling
- [ ] **Brand tab in client portal**: Per-client guidelines, colors, fonts, logos
- [ ] **Keyboard shortcuts**: Cmd+K search, Esc close, Cmd+N new note
