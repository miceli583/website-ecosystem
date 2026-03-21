---
name: responsive
description: Audit mobile responsiveness - breakpoints, touch targets, overflow, and scaling
allowed-tools: Read, Grep, Glob, Bash, AskUserQuestion
---

# Mobile Responsiveness Audit

Audit a page, component, or route for mobile responsiveness issues. Checks layout, breakpoints, touch targets, overflow, and scaling patterns.

## When to Use

- Before shipping a new page or feature
- After UI changes to layout or grid components
- When user mentions "mobile", "responsive", "breakpoints", "small screen"
- As part of `/validate` or `/cohere` checks
- When reviewing demo sites or client deliverables

## Steps

### Step 1: Identify Scope

Ask user or infer from context:

- Specific file path to audit
- Entire route/page
- Specific component
- All pages in a directory

### Step 2: Static Code Analysis

Scan the target files for common responsiveness anti-patterns:

#### 2.1 Fixed Widths Without Responsive Alternatives

Search for patterns that lock elements to fixed widths on all screens:

```
# Fixed pixel widths without responsive prefixes
Grep: w-\[\d+px\] (without sm:/md:/lg: prefix)
Grep: width:\s*\d+px (inline styles)
Grep: min-w-\[\d+px\] (fixed min-widths)
```

**Flag**: Any fixed width > 320px without a responsive breakpoint variant.
**Exception**: Icons, avatars, logos with small fixed sizes (< 100px).

#### 2.2 Grid/Flex Without Mobile Fallback

Search for grids that don't collapse on mobile:

```
# Grids missing mobile-first single column
Grep: grid-cols-[2-9] (without sm:/md:/lg: prefix)
Grep: grid-cols-\d+ without a preceding grid-cols-1
```

**Expected pattern**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (mobile-first)
**Flag**: `grid-cols-3` without a mobile breakpoint (forces 3 columns on phone).

#### 2.3 Horizontal Overflow Risks

Search for patterns that can cause horizontal scroll on mobile:

```
# Flex rows that don't wrap
Grep: flex(?!.*flex-wrap)(?!.*flex-col) with multiple children
# Wide tables without overflow wrapper
Grep: <table without overflow-x-auto parent
# Fixed-width containers
Grep: max-w-none or w-screen without overflow-hidden
```

**Flag**: Flex rows without `flex-wrap` or `flex-col` on mobile.
**Flag**: Tables without `overflow-x-auto` wrapper.

#### 2.4 Text Sizing

Search for text that may be too small or too large on mobile:

```
# Very large text without responsive scaling
Grep: text-[5-9]xl (without sm:/md:/lg: prefix)
Grep: text-\[.*[4-9]\d+px\] (large inline text sizes)
# Very small text
Grep: text-\[1[0-1]px\] or text-xs used for primary content
```

**Expected pattern**: `text-3xl sm:text-4xl lg:text-6xl` (scales up, not down)
**Flag**: `text-6xl` without smaller mobile variant.

#### 2.5 Touch Target Sizes

Search for interactive elements that may be too small for touch:

```
# Small buttons/links
Grep: h-[4-7]\b w-[4-7]\b on Button/button/a elements
Grep: p-1\b or p-0.5 on interactive elements
# Icon-only buttons without adequate padding
Grep: <Button.*size="icon" or <button.*<Icon without min-h-10/min-w-10
```

**Minimum**: 44x44px (WCAG) / 48x48px (Material). In Tailwind: `h-10 w-10` minimum.
**Flag**: Interactive elements smaller than `h-9 w-9` (36px).

#### 2.6 Padding and Spacing

Search for inadequate mobile padding:

```
# Sections without horizontal padding
Grep: <section(?!.*px-) (missing horizontal padding)
# Container without mobile padding
Grep: max-w-.*mx-auto(?!.*px-)
```

**Expected pattern**: `px-4 sm:px-6 lg:px-8` (scales with screen).
**Flag**: Containers with only `mx-auto` and no `px-*` for mobile gutters.

#### 2.7 Images and Media

Search for images that may break mobile layout:

```
# Images without responsive sizing
Grep: <Image.*width=\{[5-9]\d\d (large fixed widths > 500px)
Grep: <img.*width="[5-9]\d\d
# Missing object-fit
Grep: <Image(?!.*object-) with large dimensions
```

**Expected**: Images use `w-full` or responsive classes, `object-cover`/`object-contain`.
**Flag**: Fixed-dimension images > 400px without responsive wrapper.

#### 2.8 Absolute/Fixed Positioning

Search for positioned elements that may escape viewport on mobile:

```
# Fixed/absolute elements with large offsets
Grep: (absolute|fixed).*(-right-|right-\[|left-\[)\d{3}
# Elements positioned off-screen
Grep: -translate-x-full or left-full without overflow-hidden parent
```

**Flag**: Absolute elements with offsets > 200px that may extend past mobile viewport.

#### 2.9 Hidden Content Strategy

Check for appropriate show/hide patterns:

```
# Content hidden on mobile
Grep: hidden sm:block or hidden md:block
# Content hidden on desktop
Grep: sm:hidden or md:hidden
```

**Info**: Note what's hidden on each breakpoint. Flag if critical content is `hidden` on mobile without an alternative.

#### 2.10 Viewport Meta and Container Width

For full pages, check:

```
# Max container widths
Grep: max-w-(sm|md|lg|xl|2xl|screen)
# Full-bleed sections
Grep: w-screen or w-full without overflow control
```

### Step 3: Generate Report

Present findings in this format:

```
## Mobile Responsiveness Audit

**Scope**: [file(s) or route audited]
**Issues Found**: X critical, Y warnings, Z info

### Critical (breaks on mobile)
- [ ] [FILE:LINE] Description — fix suggestion

### Warnings (degraded experience)
- [ ] [FILE:LINE] Description — fix suggestion

### Info (could be improved)
- [ ] [FILE:LINE] Description — fix suggestion

### Passing Checks
- [x] Check name — OK
```

**Severity Guide**:

- **Critical**: Layout breaks, content overflows viewport, elements unreachable
- **Warning**: Degraded UX — tiny touch targets, cramped spacing, poor scaling
- **Info**: Could be better — missing responsive variants, hardcoded values

### Step 4: Interactive Options

After presenting the report, ask:

1. **Fix all critical issues** — Apply fixes for layout-breaking problems
2. **Fix all** — Fix critical + warnings + info
3. **Fix specific items** — Let user choose which to fix
4. **Report only** — No changes, just the audit

### Step 5: Apply Fixes (if requested)

For each fix:

1. Read the file
2. Apply the minimal fix (prefer adding responsive prefixes over restructuring)
3. Note the change

**Common fix patterns**:

- `grid-cols-3` → `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- `text-6xl` → `text-3xl sm:text-4xl lg:text-6xl`
- `w-[500px]` → `w-full max-w-[500px]`
- `flex` → `flex flex-col sm:flex-row`
- `px-8` → `px-4 sm:px-6 lg:px-8`
- `gap-8` → `gap-4 sm:gap-6 lg:gap-8`
- `h-8 w-8` (button) → `h-10 w-10` (touch target)
- `<table>` → `<div className="overflow-x-auto"><table>...</table></div>`

## Integration

- Run as part of `/validate` for full project checks
- Run after `/cohere` to catch responsiveness gaps
- Pairs well with `/a11y` (touch targets overlap with accessibility)
- Can be included in `/qa` checklist generation

## Configuration

Projects can customize in CLAUDE.md:

```markdown
## Responsive Audit Config

- Min touch target: 44px (default) or 48px
- Skip files: [glob patterns to exclude]
- Breakpoint strategy: mobile-first (default) or desktop-first
- Custom max-width: 1280px (default)
```

## Examples

```
User: /responsive
Claude: What should I audit? [asks for scope]

User: /responsive src/components/demos/tapchw-website.tsx
Claude: [runs audit on specific file, presents report]

User: Check if this page works on mobile
Claude: [runs /responsive on current page context]
```
