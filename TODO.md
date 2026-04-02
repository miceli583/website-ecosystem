# TODO

## Critical (blocks production)

- [ ] **Test proposal checkout flow**: Verify full flow (create → view → publish → checkout → payment confirmation)
- [ ] **Recurring billing tracking**: Handle `invoice.payment_succeeded` webhook for subscriptions — log each monthly payment to billing tab

## Bugs & Tech Debt

- [ ] **Analytics/Overview loading**: Supabase pooler intermittently slow — retry + staleTime mitigates but root cause is connection pool pressure
- [ ] **Notion edge function token**: Hardcoded API token needs migration to Supabase secret + redeploy 3 edge functions
- [ ] **Instagram post automation**: Posts generated + sent to Zapier but not appearing on IG — check Zapier zap status / Instagram token
- [ ] **Console.log cleanup**: ~77 console.log/error statements in production code — gate behind NODE_ENV or remove
- [ ] **daily-values router**: Many `publicProcedure` endpoints should be `protectedProcedure` (admin-only, cron uses direct DB)
- [ ] **Mercury cron (Vercel)**: `vercel.json` cron configured but untested in production — verify `/api/mercury-invoice-poll` runs and updates pending Mercury checkouts. Fallback: manual DB update or Link Payment until confirmed working
- [ ] **CRM project filtering**: Contact/client detail project lists need robust filtering (status, search, assignee, date range)
- [ ] **Split proposals.ts**: 1,397 lines — extract checkout, payments, templates into sub-modules
- [ ] **Migrate V1 proposal-modal to V2**: Used in billing/page.tsx — update to V2 types/checkout, then remove V1 types
- [ ] **Dependabot PRs**: Merge #22 (minor/patch) → #24 (lucide-react) → #25 (Stripe 21) → #26 (TS 6) → #23 (eslint-config)

## Client Work (prioritized)

### Marissa Lambert

- [ ] Discuss Gene Keys ToS — can't use Gene Keys language in front-facing app
- [ ] Scope project for Soul Map App Phase 1, build proposal, set up project management
- [ ] Upload NDA to contracts tab (blocked by: Contracts section)

### Shechem Sauls

- [ ] Resolve DNS error for chw360.com
- [ ] Duplicate Frazier Dentistry demo under Karla Frazier's account when ready
- [ ] Refine project management for various projects
- [ ] Create Gamma alternative for slide builder
- [ ] Build LMS prototype demo
- [ ] Tell Shechem: host TapCHW in personal Vercel + Supabase

### Karla Alvarado

- [ ] Duplicate TapCHW demo from Shechem's portal, create copy under Karla
- [ ] Set up project management for TapCHW website + CRM build

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

- [ ] **Contracts section**: Client portal + admin CRM view — accepted proposals stored as contracts, document uploads — unblocks Marissa NDA
- [ ] **Tickets/change request tab**: Client-facing form for submitting change requests under retainer
- [ ] **Stripe expense tracking**: Retroactive fee logging in admin finance hub (not per-client billing)
- [ ] **Client tagging on finance line items**: Tag client name/portal to Stripe/Mercury transactions in finance hub
- [ ] **Recurring invoice tracking**: Log subsequent subscription payments to client billing tab

### High Priority — Financial Systems

- [ ] **Payment method separation**: Stripe one-time → default checking, subscriptions → recurring checking
- [ ] **Stripe sub-accounts for hosted clients**: Learn how to set up Stripe billing in apps hosted for clients
- [ ] **Team direct deposit**: Team members set up direct deposit in their profile
- [ ] **Profit-sharing payouts**: Mercury API to pay team based on percentage of client payments per project
- [ ] **Smart monthly COGS calculator**: Claude + Vercel + Supabase + Resend usage
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
