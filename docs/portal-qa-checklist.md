# Client Portal QA Checklist

Comprehensive testing protocol for the client portal at `/portal/[slug]/`.

## Test Data Requirements

Before testing, ensure you have:
- At least 2 test clients (one with full data, one minimal)
- Admin user account
- Client user account for one test client
- Stripe test mode with various proposal types

---

## Proposal Payment Combinations

Test all checkout scenarios to ensure Stripe integration handles every case:

| # | Scenario | Packages | Expected Behavior |
|---|----------|----------|-------------------|
| 1 | Single one-time | 1 package, type: "one-time" | Checkout mode: "payment", single line item |
| 2 | Multiple one-time | 2-3 packages, all "one-time" | Checkout mode: "payment", multiple line items |
| 3 | Single subscription | 1 package, type: "subscription", interval: "month" | Checkout mode: "subscription", recurring price |
| 4 | Multiple subscriptions | 2+ subscription packages, same interval | Checkout mode: "subscription", multiple recurring items |
| 5 | Mixed: one-time + sub | 1 one-time + 1 subscription | Checkout mode: "subscription" (takes precedence), mixed line items |
| 6 | Optional packages | Required + optional packages, user selects subset | Only selected packages in checkout |
| 7 | Annual subscription | Subscription with interval: "year" | Yearly billing cycle |
| 8 | Trial period | Subscription with trial (if supported) | Trial flow, then billing |

---

## Billing Tab Edge Cases

| # | Scenario | Test | Pass |
|---|----------|------|------|
| 1 | No Stripe customer | New client, no `stripeCustomerId` | [ ] Shows "Billing not configured" |
| 2 | Empty billing | Customer exists but no subs/invoices | [ ] Shows "No billing history" |
| 3 | Refunded payment | Payment with refund | [ ] Handled gracefully |
| 4 | Canceled subscription | Sub with `status: "canceled"` | [ ] Shows "Canceled" badge, resubscribe button |
| 5 | Canceling subscription | Sub with `cancel_at_period_end: true` | [ ] Shows "Canceling" badge, reactivate button |
| 6 | Trialing subscription | Sub in trial | [ ] Shows "Trial" badge, trial end date |
| 7 | Past due subscription | Sub with `status: "past_due"` | [ ] Shows "Past Due" badge |
| 8 | Multiple projects | Items across 3+ projects | [ ] Grouped view shows all groups |
| 9 | Orphaned Stripe data | Stripe objects with no proposal link | [ ] NOT displayed (filtered out) |
| 10 | Large dataset | 20+ invoices, 10+ subs | [ ] Performs well, no lag |

---

## Notes Tab Edge Cases

| # | Scenario | Test | Pass |
|---|----------|------|------|
| 1 | Empty notes | No notes created | [ ] Shows empty state |
| 2 | Pin behavior | Pin note | [ ] Moves to top, persists on refresh |
| 3 | Archive flow | Archive note | [ ] Moves to archived tab, restore works |
| 4 | Project assignment | Assign note to project | [ ] Shows in grouped view |
| 5 | Client delete restriction | Client tries to delete admin's note | [ ] Fails with error |
| 6 | Long content | Note with 5000+ chars | [ ] TipTap renders correctly |
| 7 | Rapid edits | Quick pin → archive → unarchive | [ ] No race conditions |
| 8 | Concurrent edits | Two users editing same note | [ ] Last write wins, no errors |

---

## Full Functional Checklist

### Authentication & Authorization

- [ ] Client can only access their own portal slug
- [ ] Admin can access any client portal
- [ ] Admin sees StatusTabs (Active/Archived), client does not
- [ ] Admin sees three-dot menus, client sees limited actions
- [ ] Unauthenticated user redirected to login
- [ ] Expired session handled gracefully

### Navigation

- [ ] All 6 tabs accessible: Demos, Proposals, Tooling, Notes, Billing, Profile
- [ ] Active tab highlighted in gold
- [ ] Mobile hamburger menu opens/closes
- [ ] Mobile menu closes on link click
- [ ] Sign out works from both desktop and mobile nav

### Filter Persistence (Per-Tab)

- [ ] Search query persists when switching tabs and returning
- [ ] Sort order persists
- [ ] Project filter persists
- [ ] View mode (list/grouped) persists
- [ ] Collapsed groups persist
- [ ] Active/Archived tab persists (admin only)
- [ ] Filters reset on page refresh (session-scoped, not persistent)

### Demos Tab

- [ ] Demo cards display correctly
- [ ] Featured demos highlighted
- [ ] Subscription-gated demos show lock when inactive
- [ ] Archive/unarchive works (admin)
- [ ] Project assignment works (admin)
- [ ] Search filters results
- [ ] Grouped view collapses/expands

### Proposals Tab

- [ ] Proposals display with status badges
- [ ] "View Proposal" opens modal
- [ ] Modal shows line items / packages correctly
- [ ] "Buy Now" creates checkout session
- [ ] Checkout completes and webhook updates status
- [ ] Accepted proposals show "Accepted" badge

### Tooling Tab

- [ ] Tools display with icons
- [ ] External links open in new tab
- [ ] Archive/unarchive works (admin)
- [ ] Project filter works

### Notes Tab

- [ ] Create note with title and content
- [ ] Edit note inline
- [ ] Pin/unpin moves note position
- [ ] Archive/restore works
- [ ] Project assignment via menu
- [ ] Delete works (own notes only for clients)
- [ ] Expand/collapse note cards
- [ ] Collapse indicator visible at top of expanded note

### Billing Tab

- [ ] Summary cards show MRR, Total Paid, Next Payment
- [ ] Subscriptions display with correct status badges
- [ ] Invoices display with PDF/view links
- [ ] One-time payments display
- [ ] Cancel subscription sets cancel_at_period_end
- [ ] Reactivate undoes pending cancellation
- [ ] Resubscribe creates new checkout for canceled sub
- [ ] Collapsible type sections work (Subscriptions / Paid)
- [ ] Grouped view by project works
- [ ] Proposal link in billing opens modal

### Profile Tab

- [ ] Name edit works
- [ ] Phone edit works
- [ ] Company edit works
- [ ] Password change works
- [ ] Admin viewing client sees read-only
- [ ] Member since date correct

### Mobile Responsiveness

- [ ] All pages render on 375px width (iPhone SE)
- [ ] No horizontal scroll on any page
- [ ] Touch targets minimum 44px
- [ ] Forms usable with mobile keyboard
- [ ] Tables scroll horizontally if needed
- [ ] Modal dialogs fit viewport
- [ ] Hamburger menu accessible

### Error States

- [ ] 404 for invalid slug
- [ ] 403 for unauthorized access
- [ ] Network error shows retry option
- [ ] Empty states have helpful messages
- [ ] Form validation errors display inline

---

## Performance Testing

| Test | Target | Pass |
|------|--------|------|
| Initial page load (billing) | < 2s | [ ] |
| Tab switch (cached) | < 200ms | [ ] |
| Search filter response | < 100ms | [ ] |
| Mutation feedback | < 500ms | [ ] |
| Mobile Lighthouse score | > 80 | [ ] |

---

## Browser Compatibility

- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] iOS Safari
- [ ] Android Chrome

---

## Sign-off

| Role | Name | Date | Status |
|------|------|------|--------|
| Developer | | | |
| QA | | | |
| Product | | | |
