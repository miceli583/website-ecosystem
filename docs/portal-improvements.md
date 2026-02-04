# Client Portal Improvements

Prioritized list of improvements organized by effort and impact.

---

## Quick Wins (< 1 hour each)

High-impact, low-effort improvements to boost portal quality.

### 1. Standardize Query Cache Times

**Current Issue:** Inconsistent `staleTime` across queries causes unpredictable cache behavior.

| Query | Current | Recommended |
|-------|---------|-------------|
| `getNotes` | 30 seconds | 5 minutes |
| `getResources` | 2 minutes | 5 minutes |
| All others | 5 minutes | 5 minutes |

**Files:**
- `src/app/portal/[slug]/notes/page.tsx` line 118
- `src/app/portal/[slug]/demos/page.tsx` line 64

**Fix:**
```typescript
// Change staleTime to 5 * 60 * 1000 in all portal queries
{ staleTime: 5 * 60 * 1000 }
```

---

### 2. Remove Redundant Stripe Customer Fetch

**Current Issue:** `getBillingInfo` calls `stripe.customers.retrieve()` twice.

**File:** `src/server/api/routers/portal.ts`

**Lines:** 544-558 (verification) and 585 (balance fetch)

**Fix:** Cache customer from first retrieve:
```typescript
// Line 543-558: Store the customer object
const customer = await stripe.customers.retrieve(validCustomerId);

// Line 585: Remove this duplicate call
// const customer = await stripe.customers.retrieve(validCustomerId);
// Just use the already-fetched customer object
```

---

### 3. Add Toast Notifications

**Current Issue:** No feedback after mutations (archive, delete, save).

**Implementation:**
1. Install sonner: `npm install sonner`
2. Add `<Toaster />` to root layout
3. Call `toast.success()` in mutation `onSuccess` callbacks

**Example:**
```typescript
const archiveNote = api.portalNotes.updateNote.useMutation({
  onSuccess: () => {
    toast.success("Note archived");
    void utils.portalNotes.getNotes.invalidate({ slug });
  },
});
```

---

### 4. Add Loading Skeletons

**Current Issue:** Full-page spinner during data fetches looks unpolished.

**Implementation:**
1. Create `<CardSkeleton />` component
2. Replace `<Loader2 />` spinners with skeleton arrays
3. Match card dimensions to actual content

**Example:**
```typescript
if (isLoading) {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 animate-pulse rounded-lg bg-white/5" />
      ))}
    </div>
  );
}
```

---

### 5. Add Aria Labels to Icon Buttons

**Current Issue:** Icon-only buttons lack screen reader labels.

**Files:** All portal pages with icon buttons

**Fix:**
```typescript
// Before
<button onClick={...}>
  <Pencil className="h-4 w-4" />
</button>

// After
<button onClick={...} aria-label="Edit note">
  <Pencil className="h-4 w-4" />
</button>
```

---

## Medium Effort (1-4 hours each)

### 6. Implement Optimistic Updates for Notes

**Current Issue:** Notes tab flashes on rapid mutations due to full cache invalidation.

**Implementation:**
```typescript
const togglePin = api.portalNotes.updateNote.useMutation({
  onMutate: async ({ noteId, isPinned }) => {
    await utils.portalNotes.getNotes.cancel({ slug });
    const previous = utils.portalNotes.getNotes.getData({ slug });

    utils.portalNotes.getNotes.setData({ slug }, (old) =>
      old?.map((n) => (n.id === noteId ? { ...n, isPinned } : n))
    );

    return { previous };
  },
  onError: (err, vars, ctx) => {
    utils.portalNotes.getNotes.setData({ slug }, ctx?.previous);
  },
  onSettled: () => {
    void utils.portalNotes.getNotes.invalidate({ slug });
  },
});
```

---

### 7. Add Keyboard Shortcuts

**Implementation:**
- `Cmd/Ctrl + K` — Focus search input
- `Escape` — Close modal/drawer
- `Cmd/Ctrl + N` — Create new note (on notes tab)

**Library:** Use `@tanstack/react-virtual` or custom `useHotkeys` hook

---

### 8. Add Stripe Product Name Caching

**Current Issue:** Product names fetched on every billing page load.

**Implementation:**
1. Create in-memory cache with 24-hour TTL
2. Check cache before Stripe API call
3. Populate cache on fetch

```typescript
const productCache = new Map<string, { name: string; expiry: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function getProductName(productId: string): Promise<string> {
  const cached = productCache.get(productId);
  if (cached && cached.expiry > Date.now()) {
    return cached.name;
  }

  const product = await stripe.products.retrieve(productId);
  const name = "deleted" in product ? "Unknown" : product.name;
  productCache.set(productId, { name, expiry: Date.now() + CACHE_TTL });
  return name;
}
```

---

## Larger Efforts (4+ hours)

### 9. Add Comprehensive Error Boundaries

Wrap each tab in an error boundary with retry functionality.

### 10. Add Analytics Event Tracking

Track user behavior: page views, button clicks, feature usage.

### 11. Add Service Worker for Offline Support

Cache static assets and provide offline indicator.

### 12. Internationalization (i18n)

Extract all strings to translation files for future localization.

---

## Scorecard Reference

Current scores and targets:

| Category | Current | Target | Key Improvements |
|----------|---------|--------|------------------|
| Brand Consistency | 9/10 | 10/10 | Minor border cleanup |
| Feature Completeness | 9/10 | 10/10 | Add toasts |
| Code Quality | 8/10 | 9/10 | Standardize cache, optimistic updates |
| Mobile Responsiveness | 8/10 | 9/10 | Add touch feedback |
| Performance | 7/10 | 9/10 | Remove redundant calls, add caching |
| UX Polish | 8/10 | 9/10 | Skeletons, toasts, keyboard shortcuts |
| Error Handling | 8/10 | 9/10 | Error boundaries with retry |
| Accessibility | 6/10 | 8/10 | Aria labels, keyboard nav |

---

## Implementation Order

Recommended sequence for maximum impact:

1. **Day 1:** Cache standardization + redundant Stripe call fix
2. **Day 2:** Toast notifications + loading skeletons
3. **Day 3:** Aria labels + keyboard shortcuts
4. **Week 2:** Optimistic updates + product caching
5. **Future:** Analytics, i18n, offline support
