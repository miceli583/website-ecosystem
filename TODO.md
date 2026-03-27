# TODO

## Critical (blocks production)

_None currently_

## Bugs & Tech Debt

- [x] ~~**Extract shared dialogs**: PromoteToClientModal + DemotionDialog extracted to `src/components/crm/`~~
- [ ] **Analytics/Overview loading**: Supabase pooler intermittently slow — retry + staleTime mitigates but root cause is connection pool pressure

## Client Work (prioritized)

### Marissa Lambert

- [ ] Discuss Gene Keys ToS — can't use Gene Keys language in front-facing app
- [ ] Scope project for Soul Map App Phase 1, build proposal, set up project management
- [ ] Upload NDA to contracts tab (blocked by: Contracts section)

### Shechem Sauls

- [ ] Resolve DNS error for chw360.com
- [x] ~~Build demo for Karla Frazier~~ — Frazier Dentistry demo built (28 pages), project created under Shechem
- [ ] Duplicate Frazier Dentistry demo under Karla Frazier's account when ready
- [ ] Refine project management for various projects
- [ ] Create Gamma alternative for slide builder
- [ ] Build LMS prototype demo
- [ ] Log single invoice for TapCHW website build (blocked by: One-time invoice logging)
- [ ] Tell Shechem: host TapCHW in personal Vercel + Supabase

### Karla Alvarado

- [ ] Duplicate TapCHW demo from Shechem's portal, create copy under Karla
- [ ] Set up project management for TapCHW website + CRM build
- [ ] Log invoice payment under billing (blocked by: One-time invoice logging)

### Zoey Wind

- [ ] Set up meeting to discuss personal website + cogs
- [ ] Create demo personal website

### Shane David Street

- [ ] Set up meeting to discuss personal website + cogs
- [ ] Create demo personal website

### Glo Moss

- [ ] Refine project management
- [ ] Create contact and demo for Symbiosis

### Austin Terry

- [ ] Set up proposal for dad's landing page
- [ ] Set up hosting for dad's landing page
- [ ] Pay Austin once invoice goes through

## Platform Features (prioritized)

### High Priority — Unblocks Client Work

- [ ] **Contracts section**: Client portal + admin CRM view (files, agreements, legal docs) — unblocks Marissa NDA upload
- [ ] **Invoice payment logging**: AMs can log already-paid invoices by searching Mercury/Stripe by customer name, ID, or invoice ID (retroactive record-keeping) — unblocks Shechem + Karla invoicing
- [ ] **Proposal Builder UI**: Non-dev AMs can create/edit proposals — unblocks Austin proposal
- [ ] **Proposals modal UI refresh**: Friendlier, easier to read

### High Priority — Financial Systems

- [ ] **Payment method separation**: Stripe one-time → default checking, subscriptions → recurring checking. Set up second Mercury account for recurring payments.
- [ ] **Mercury invoice creation via API**: Investigate if AMs can create Mercury invoices through the app
- [ ] **Proposal Builder: Stripe vs Mercury option**: When creating new proposals, choose payment method (Stripe invoice or Mercury invoice) — currently Stripe-only. Depends on Mercury API investigation.
- [ ] **Stripe sub-accounts for hosted clients**: Learn how to set up Stripe billing in apps hosted for clients (payment middleman model)
- [ ] **Team direct deposit**: Team members set up direct deposit in their profile
- [ ] **Profit-sharing payouts**: Mercury API to pay team based on percentage of client payments per project
- [ ] **Smart monthly COGS calculator**: Claude sub + Vercel sub + Supabase ($25 + $10/additional DB) + Resend usage (scales with emails sent across hosted sites)
- [ ] **Purchase accounts**: Apple Developer, Vercel Pro, Supabase Pro

### High Priority — Platform

- [ ] **Bug & ticketing system**: Client-facing issue submission, admin-side management
- [ ] **SOP tab**: Checklist-driven onboarding workflows and reusable process templates
- [ ] **Email change flow**: Admin + client self-service email update (syncs auth, portal_users, clients, master_crm)
- [ ] **Global search (Cmd+K)**: Search across contacts, clients, projects, tickets

### Medium Priority

- [ ] **Role-specific KPI dashboards**: Overview tab per role with relevant metrics
- [ ] **KPI builder**: Founder defines custom KPIs per role, assigns targets
- [ ] **Team scorecard**: Project health, team metrics, quarterly rocks, DoD templates
- [ ] **Funnel & ad campaign**: Build marketing funnel for website/CRM building services
- [ ] **Privacy policies / ToS**: Legal agreements for portal onboarding

### Lower Priority

- [ ] **Full-stack analytics**: Vercel Analytics + PostHog across ecosystem
- [ ] **Sentry error tracking**: Ecosystem-wide, dedicated admin tab
- [ ] **Brand tab in client portal**: Per-client guidelines, colors, fonts, logos
- [ ] **Keyboard shortcuts**: Cmd+K search, Esc close, Cmd+N new note
- [ ] **Environment sandbox**: Needs free Supabase slot — second project for dev/sandbox
