# Accessibility Audit

Audit a page or component for accessibility issues. Checks WCAG 2.1 AA compliance.

## When to Use

- Before shipping a new feature
- After UI changes to interactive elements
- When user mentions accessibility, a11y, screen reader, keyboard navigation
- As part of `/validate` or `/cohere` checks

## Steps

### Step 1: Identify Scope

Ask user or infer from context:

- Specific file path to audit
- Entire route/page
- Specific component

### Step 2: Scan for Issues

Use Grep to search for patterns in the target scope:

#### 2.1 Icon-Only Buttons (Missing aria-label)

```bash
# Find buttons with only icon children, no aria-label
# Pattern: <button> with icon but no text content
```

Search for:

- `<button` without `aria-label`
- Buttons containing only `<Icon />` or `className="*icon*"`

#### 2.2 Expandable Elements (Missing aria-expanded)

Search for:

- `useState` with `open` or `isOpen` or `expanded`
- Toggle buttons without `aria-expanded`
- Accordion/collapsible patterns

#### 2.3 Form Accessibility

Search for:

- `<input` without associated `<label htmlFor>`
- `<input` without `id` attribute
- Error messages without `role="alert"`

#### 2.4 Keyboard Navigation

Search for:

- `onClick` without corresponding `onKeyDown`
- Custom interactive elements (`div onClick`) without `role="button"` and `tabIndex`
- Modals/dialogs without Escape key handler

#### 2.5 Loading States

Search for:

- Loading spinners without `aria-busy` on parent
- `isPending` or `isLoading` states
- Disabled buttons during loading

### Step 3: Generate Report

````markdown
## Accessibility Audit Report

**Scope:** `path/to/file.tsx`
**Date:** YYYY-MM-DD

### Summary

| Category       | Status  | Issues                   |
| -------------- | ------- | ------------------------ |
| Icon buttons   | ⚠️ WARN | 3 missing aria-label     |
| Expandable     | ✅ PASS | -                        |
| Forms          | ❌ FAIL | 2 missing labels         |
| Keyboard nav   | ⚠️ WARN | 1 missing Escape handler |
| Loading states | ✅ PASS | -                        |

**Overall:** 2/5 categories need attention

---

### Issues Detail

#### Icon Buttons (3 issues)

1. `src/components/header.tsx:42` — Close button missing aria-label

   ```tsx
   // Current
   <button onClick={onClose}><X /></button>

   // Fix
   <button onClick={onClose} aria-label="Close menu"><X /></button>
   ```
````

2. ...

### Recommendations

1. Add `aria-label` to all icon-only buttons
2. Associate form inputs with labels using `htmlFor`
3. Add Escape key handler to modal component

````

### Step 4: Offer Fixes

Use AskUserQuestion:
- "Fix all issues automatically?"
- "Fix one category at a time?"
- "Just report, don't fix"

If fixing, apply targeted edits following the patterns in FRAMEWORK.md Accessibility section.

## Accessibility Patterns Reference

### Icon Button Fix
```tsx
<button aria-label="Description of action">
  <Icon />
</button>
````

### Expandable Fix

```tsx
<button aria-expanded={open} onClick={() => setOpen(!open)}>
  Toggle
</button>
```

### Form Label Fix

```tsx
<label htmlFor="input-id">Label</label>
<input id="input-id" />
```

### Error Message Fix

```tsx
{
  error && <p role="alert">{error}</p>;
}
```

### Escape Handler Fix

```tsx
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };
  if (open) {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }
}, [open, onClose]);
```

## Integration

- `/validate` includes a11y quick check
- `/cohere` includes a11y pattern check
- `/brand` skips a11y (different concern)
