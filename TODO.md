# TODO

## Critical (blocks production)

- [ ] Enhance site-wide security (audit endpoints, CSP, rate limiting)
- [ ] Create Stripe integration for payments
- [ ] Enable auth on process-pending-post endpoint `src/app/api/process-pending-post/route.ts:16`

## Bugs (broken functionality)

_None currently_

## Tech Debt (code quality issues)

- [ ] Improve site efficiency and reduce lag/response times (bundle size, caching, queries)
- [ ] Clean up ecosystem - move deprecated pages under admin gate as templates
- [ ] Remove deprecated generateDescriptionPage `src/lib/carousel-generator.ts:505`

## Enhancements (prioritized)

### High Priority
- [ ] Change email service provider to Resend
- [ ] Create client account portals (payments, demo access) - depends on Stripe
- [ ] Update home page design (reference: Anthropic, thexyz.co) - less landing page, more home page

### Medium Priority
- [ ] Send confirmation email to user on BANYAN signup `src/app/api/banyan/early-access/route.ts:63`
- [ ] Send notification to admin on BANYAN signup `src/app/api/banyan/early-access/route.ts:64`
- [ ] Complete blog automation system `src/app/admin/blog/page.tsx:191`

### Lower Priority
- [ ] Create next blog post
- [x] Create shader for miracle-mind-orbit-star-v3.svg `public/brand/miracle-mind-orbit-star-v3.svg`
- [ ] Configure Make.com/Zapier webhook for Instagram automation

## Design Questions (needs decision)

- [ ] **Page templating architecture**: Design system to copy sample pages between routes without breaking (e.g., `.../route/sample` → `.../route2/sample`). Consider as skill?
- [ ] **Shader creation skill**: Should we create a `/shader` skill for generating GLSL shaders from SVGs/concepts?
