# Project Status

**Version:** 0.5.6
**Last Updated:** 2026-02-05
**Commits:** 152+

## Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| Multi-domain routing | Working | matthewmiceli.com, miraclemind.dev, miraclemind.live |
| Authentication (Supabase) | Working | Email/password, magic links, tRPC protectedProcedure |
| Admin dashboard v2 | Working | Collapsible sidebar, dashboard layout, overview page |
| Client portal v2 | Working | `/portal/[slug]` with role-based auth, magic link claim flow |
| Portal pages | Working | Dashboard, Demos, Proposals, Tooling, Notes, Billing, Profile |
| Portal notes | Working | TipTap rich text, collaborative (admin + client), pin/search |
| Client resources | Working | Flexible demos, tooling, credentials, embeds per client, under_development flag |
| CHW360 mockup demo | Working | Exact mockup replica with carousel, brand assets page |
| TAPCHW demo site | Working | 7-page demo site with calendar, animated carousel, stats counter |
| Shader gallery | Working | 8 interactive shaders (orbit-star enhanced) |
| Template gallery | Working | Component showcase |
| Blog system | Partial | Basic functionality, automation incomplete |
| Daily values system | Working | Quotes, authors, values CRUD (mutations protected) |
| BANYAN early access | Working | Waitlist signup + email confirmation + admin notification |
| Instagram automation | Working | Endpoints secured, Make.com webhook configured |
| Resume/PDF generation | Working | Server-side Puppeteer |
| Stripe integration | Working | Billing, subscriptions, webhook events, proposal linking |
| Resend email | Working | Templates for BANYAN confirmation, admin alerts, client updates |
| Security hardening | Complete | RLS on all tables, rate limiting, CSP/HSTS headers, Bearer auth |
| Homepage v2 | Working | New company homepage with orbit-star shader, image-based service cards |
| Services page | Working | 9 service offerings with themed images, gold tint effect |
| Stewardship program | Working | Partner page with Entheos Holistics image card |
| Legal pages | Working | Terms of Service, Privacy Policy |
| Contact form | Working | 9 services + stewardship interest, role dropdown |
| Footer redesign | Working | 3-column: CTA left, orbit star center, links right |

## Known Limitations

- **Portal**: Admin UI for managing resources pending

## Recent Changes

| Date | Commit | Description |
|------|--------|-------------|
| Feb 05 | 0220c8a | Loading skeletons + Admin dashboard refactor with sidebar |
| Feb 05 | 85a6f45 | Add under_development flag to hide WIP items from clients |
| Feb 05 | e98954b | Add TAPCHW demo site with visual enhancements |
| Feb 04 | 809dc48 | Update STATUS.md and TODO.md for session handoff |
| Feb 04 | 3030101 | Fix all ESLint errors (escape entities, use Next.js Link) |

_Older changes: `git log --oneline`_
