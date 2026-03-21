# QA Checklist Generator

Generate comprehensive QA checklists for features, pages, or entire applications.

## When to Use

- After completing a feature
- Before release/deployment
- When user asks for "test checklist", "QA plan", "test flows"
- After major refactoring

## Steps

### Step 1: Identify Scope

Ask user or infer from context:

- Specific feature name
- File paths involved
- User flows to test

### Step 2: Analyze the Feature

Read the relevant files to understand:

- User roles involved (admin, client, public)
- Data mutations (create, update, delete)
- External integrations (Stripe, email, etc.)
- Edge cases and error states

### Step 3: Generate Checklist

Create a structured checklist covering:

#### 3.1 Happy Path

Core user flows that must work.

#### 3.2 Authentication & Authorization

Role-based access, permission boundaries.

#### 3.3 Edge Cases

Empty states, maximum values, special characters.

#### 3.4 Error Handling

Network failures, validation errors, API errors.

#### 3.5 Mobile Responsiveness

Breakpoints, touch interactions, viewport sizes.

#### 3.6 Performance

Loading states, large data sets, caching.

#### 3.7 Browser Compatibility

Chrome, Safari, Firefox, mobile browsers.

## Output Format

```markdown
# QA Checklist: [Feature Name]

**Generated:** YYYY-MM-DD
**Scope:** `path/to/feature/`

---

## Prerequisites

- [ ] Dev server running (`npm run dev`)
- [ ] Test data seeded
- [ ] Test accounts available (admin, client)

---

## 1. Happy Path

### 1.1 [User Flow Name]

- [ ] Step 1 description
- [ ] Step 2 description
- [ ] Expected result

### 1.2 [Another Flow]

- [ ] ...

---

## 2. Authentication & Authorization

### 2.1 Admin Access

- [ ] Admin can access [feature]
- [ ] Admin can perform [action]

### 2.2 Client Access

- [ ] Client can only access their own [data]
- [ ] Client cannot access admin-only [feature]

### 2.3 Unauthenticated

- [ ] Unauthenticated users redirected to login
- [ ] Protected API returns 401

---

## 3. Edge Cases

### 3.1 Empty States

- [ ] Empty list shows appropriate message
- [ ] Clear filters button appears when filtering

### 3.2 Boundary Values

- [ ] Maximum length inputs handled
- [ ] Special characters escaped properly

### 3.3 Data Variations

- [ ] Works with minimal data
- [ ] Works with maximum data
- [ ] Works with special characters

---

## 4. Error Handling

### 4.1 Network Errors

- [ ] Offline state handled gracefully
- [ ] Retry mechanism works

### 4.2 Validation Errors

- [ ] Form validation shows inline errors
- [ ] API validation errors displayed

### 4.3 Server Errors

- [ ] 500 errors show user-friendly message
- [ ] Errors don't expose sensitive info

---

## 5. Mobile Responsiveness

- [ ] Displays correctly on 375px width (iPhone SE)
- [ ] Displays correctly on 768px width (tablet)
- [ ] Touch targets are 44px minimum
- [ ] No horizontal scroll on mobile

---

## 6. Performance

- [ ] Initial load under 3 seconds
- [ ] Interactions feel instant (< 100ms feedback)
- [ ] Large lists paginated or virtualized
- [ ] No unnecessary re-fetches

---

## 7. Browser Compatibility

- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Test Accounts

| Role   | Email                   | Password       |
| ------ | ----------------------- | -------------- |
| Admin  | test-admin@example.com  | [in 1Password] |
| Client | test-client@example.com | [in 1Password] |

---

## Notes

- [Any special testing considerations]
- [Known limitations]
```

### Step 4: Save Checklist

Ask user where to save:

- `docs/[feature]-qa.md` (recommended)
- Output to console only
- Custom path

## Feature-Specific Templates

### Billing Feature

Add sections for:

- Payment flow testing
- Subscription lifecycle
- Invoice generation
- Refund handling
- Stripe webhook events

### Authentication Feature

Add sections for:

- Login/logout flows
- Password reset
- Magic links
- Session expiration
- Multi-device behavior

### CRUD Feature

Add sections for:

- Create with all fields
- Create with minimal fields
- Update single field
- Update all fields
- Delete with confirmation
- Soft delete behavior

## Integration

- Run after `/handoff` on major features
- Archive checklists after feature passes QA (per anti-bloat rules)
- Reference from STATUS.md if feature is in QA phase
