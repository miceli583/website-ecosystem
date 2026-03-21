# Quality Scorecard

Generate a quality scorecard for a feature, page, or application. Provides objective assessment across multiple dimensions.

## When to Use

- After completing a feature ("how did we do?")
- Before release/deployment
- Periodic quality reviews
- When user asks for "score", "rating", "quality check", "review"

## Steps

### Step 1: Identify Scope

Ask user or infer from context:

- Specific feature or page
- Entire application
- Comparison against previous version

### Step 2: Assess Each Category

Read relevant files and assess against the following categories:

#### 2.1 Core Functionality (0-10)

- All specified features work
- Edge cases handled
- No blocking bugs

#### 2.2 Error Handling (0-10)

- Validation errors show inline
- API errors show user-friendly messages
- Network failures handled gracefully
- No console errors in production

#### 2.3 Accessibility (0-10)

- Icon buttons have aria-labels
- Forms have proper labels
- Keyboard navigation works
- Focus management correct

#### 2.4 Performance (0-10)

- Loading states present
- Appropriate caching (staleTime)
- No unnecessary re-renders
- Large data sets optimized

#### 2.5 Polish (0-10)

- Consistent styling
- Smooth transitions
- Feedback on interactions (toasts)
- Empty states designed

#### 2.6 Code Quality (0-10)

- TypeScript types complete
- No any types
- Consistent patterns
- DRY (no duplication)

#### 2.7 Security (0-10)

- Auth checks in place
- Input validation
- No sensitive data exposed
- RBAC implemented correctly

#### 2.8 Documentation (0-10)

- CLAUDE.md up to date
- STATUS.md reflects current state
- TODO.md organized
- Code comments where needed

### Step 3: Calculate Scores

```
Category weights:
- Core Functionality: 20%
- Error Handling: 15%
- Accessibility: 10%
- Performance: 15%
- Polish: 10%
- Code Quality: 15%
- Security: 10%
- Documentation: 5%
```

### Step 4: Generate Report

## Output Format

```markdown
# Quality Scorecard: [Feature/Page Name]

**Generated:** YYYY-MM-DD
**Scope:** `path/to/feature/`

---

## Overall Score: X.X / 10
```

[████████░░] 8.2/10

```

---

## Category Breakdown

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Core Functionality | 9/10 | 20% | 1.80 |
| Error Handling | 8/10 | 15% | 1.20 |
| Accessibility | 7/10 | 10% | 0.70 |
| Performance | 8/10 | 15% | 1.20 |
| Polish | 8/10 | 10% | 0.80 |
| Code Quality | 9/10 | 15% | 1.35 |
| Security | 9/10 | 10% | 0.90 |
| Documentation | 7/10 | 5% | 0.35 |
| **Total** | | **100%** | **8.30** |

---

## Category Details

### Core Functionality: 9/10 ✅

**Strengths:**
- All CRUD operations working
- Role-based filtering implemented
- Filter persistence across tabs

**Gaps:**
- Offline mode not supported

### Error Handling: 8/10 ✅

**Strengths:**
- Toast notifications on mutations
- API errors display cleanly

**Gaps:**
- Network retry not implemented

### Accessibility: 7/10 ⚠️

**Strengths:**
- Icon buttons have aria-labels
- Forms have labels

**Gaps:**
- Missing Escape handler on one modal
- Focus not restored after dialog close

### Performance: 8/10 ✅

**Strengths:**
- 5-minute staleTime on static data
- Loading states present

**Gaps:**
- No skeleton loaders (using spinners)

### Polish: 8/10 ✅

**Strengths:**
- Consistent gold/black theme
- Smooth hover transitions
- Toast feedback on actions

**Gaps:**
- Some animations could be smoother

### Code Quality: 9/10 ✅

**Strengths:**
- Full TypeScript coverage
- Consistent tRPC patterns
- Reusable components extracted

**Gaps:**
- Minor code duplication in filter logic

### Security: 9/10 ✅

**Strengths:**
- RBAC on all endpoints
- Input validation via Zod
- No sensitive data in client

**Gaps:**
- Rate limiting not implemented

### Documentation: 7/10 ⚠️

**Strengths:**
- STATUS.md current
- TODO.md organized

**Gaps:**
- Missing inline comments in complex logic

---

## Quick Wins (Easy Improvements)

1. Add Escape handler to remaining modals (+0.1)
2. Add loading skeletons to lists (+0.1)
3. Add inline comments to filter logic (+0.05)

**Potential improvement:** +0.25 points

---

## Comparison

| Metric | Previous | Current | Change |
|--------|----------|---------|--------|
| Overall | 7.9 | 8.3 | +0.4 ✅ |
| Accessibility | 6 | 7 | +1.0 ✅ |
| Polish | 7 | 8 | +1.0 ✅ |

---

## Recommendations

### High Priority
1. Implement rate limiting on API endpoints
2. Add focus management to dialogs

### Medium Priority
3. Replace spinners with skeleton loaders
4. Add optimistic updates for notes

### Lower Priority
5. Add keyboard shortcuts (Cmd+K)
6. Improve offline handling
```

## Scoring Guidelines

### 10/10 (Exceptional)

- Exceeds all requirements
- Production-ready, polished
- Could serve as a reference implementation

### 8-9/10 (Good)

- Meets all requirements
- Minor improvements possible
- Production-ready

### 6-7/10 (Adequate)

- Core requirements met
- Notable gaps
- Needs work before production

### 4-5/10 (Needs Work)

- Basic functionality works
- Significant gaps
- Not production-ready

### 1-3/10 (Incomplete)

- Core functionality broken
- Major issues
- Requires substantial work

## Integration

- Run after major feature completion
- Track scores over time in STATUS.md
- Use recommendations to populate TODO.md
- Combine with `/qa` for comprehensive review
