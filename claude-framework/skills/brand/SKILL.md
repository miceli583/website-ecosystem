---
name: brand
description: Brand lifecycle management — init, extract, audit, and whitelist brand guidelines for any project
allowed-tools: Read, Grep, Glob, Bash, AskUserQuestion
user-invocable: true
---

# /brand — Brand Lifecycle Management

Manage brand consistency across any project. Reads brand guidelines from the project's `CLAUDE.md` and supports four modes: **init** (set up guidelines), **extract** (scan code to discover patterns), **audit** (check against reference), and **whitelist** (register intentional exceptions).

## How It Works

Brand configuration lives in the project's `CLAUDE.md` under a `## Brand Reference` section. This skill defines the _process_ — the project defines the _values_.

```
CLAUDE.md
├── ## Brand Reference
│   ├── ### Palette          ← approved colors
│   ├── ### Typography       ← fonts, weights, usage
│   ├── ### Off-brand Patterns ← what to flag
│   ├── ### Exceptions       ← whitelisted deviations
│   └── ### Scan Scope       ← directories to audit/skip
```

## Step 1 — Determine Mode

Use AskUserQuestion to ask which mode to run:

- **Audit** — Check code against existing brand reference (default if `## Brand Reference` exists)
- **Init** — Set up brand guidelines for a new project
- **Extract** — Scan existing code to discover and propose brand patterns
- **Whitelist** — Add exceptions for intentional deviations

If no `## Brand Reference` section exists in the project's `CLAUDE.md`, suggest **Init** or **Extract** instead of Audit.

---

## Mode: Init

Set up brand guidelines from scratch.

### Step I-1 — Gather Brand Info

Use AskUserQuestion to collect:

1. **Primary color(s)** — hex values and usage (accent, bg, text)
2. **Secondary/neutral colors** — approved grays, backgrounds
3. **Typography** — font families for titles, body, code
4. **Theme** — dark mode, light mode, or both
5. **Status colors** — error (red?), success (green?), warning (amber?)

### Step I-2 — Generate Brand Reference

Create a `## Brand Reference` section with the collected info, using this structure:

```markdown
## Brand Reference

### Palette

| Token   | Value     | Usage                 |
| ------- | --------- | --------------------- |
| Primary | `#XXXXXX` | Accents, icons, hover |
| ...     | ...       | ...                   |

### Typography

| Element     | Font      | Weight | Extra          |
| ----------- | --------- | ------ | -------------- |
| Page titles | Font Name | bold   | optional notes |
| Body text   | Font Name | normal | —              |

### Off-brand Patterns

- Tailwind `yellow-*` classes (use exact hex instead)
- Other patterns to flag...

### Exceptions

- `path/to/files` — reason for exception
- Specific Tailwind classes that are intentionally off-palette

### Scan Scope

- **Include**: `src/app/`, `src/components/`
- **Skip**: `node_modules/`, `.next/`, files that define the palette itself
```

### Step I-3 — Apply

Use AskUserQuestion: "Add this Brand Reference to your project's CLAUDE.md?"

- If yes, append the section to the project CLAUDE.md
- If no, output the section for manual addition

---

## Mode: Extract

Scan existing code to discover brand patterns and propose a reference.

### Step E-1 — Scan for Colors

Use Grep to find:

- Hex colors in `style=` attributes: `#[0-9a-fA-F]{3,8}`
- Tailwind color classes: `(text|bg|border|ring|fill|stroke)-([\w]+-[\d]+|white|black|\[#[\w]+\])`
- CSS variable definitions: `--[\w-]+:\s*#`
- `rgba()` and `hsl()` values

Tally frequency of each color/class across the codebase.

### Step E-2 — Scan for Typography

Use Grep to find:

- `fontFamily` in style attributes and CSS
- `font-*` Tailwind classes
- `@font-face` declarations
- Google Fonts imports

### Step E-3 — Propose Reference

Present findings as a draft Brand Reference:

- Most-used colors → proposed palette
- Typography patterns → proposed font rules
- Outlier colors (used 1-2 times) → potential off-brand patterns

Use AskUserQuestion: "Accept this as your Brand Reference? You can edit before applying."

### Step E-4 — Apply

Same as Init Step I-3.

---

## Mode: Audit

Check code against the existing `## Brand Reference` in CLAUDE.md.

### Step A-1 — Load Brand Reference

Read the project's `CLAUDE.md` and parse the `## Brand Reference` section:

- Extract approved palette (colors, hex values, rgba patterns)
- Extract typography rules (font families, weights)
- Extract off-brand patterns to flag
- Extract exceptions (whitelisted deviations)
- Extract scan scope (include/skip directories)

If no `## Brand Reference` exists, inform the user and suggest Init or Extract mode.

### Step A-2 — Scan for Off-brand Colors

Use Grep to search the audit scope for color classes and hex values:

```
Pattern: (off-brand patterns from Brand Reference)
Scope: (include directories from Brand Reference)
Exclude: (skip directories from Brand Reference)
```

For each match, check against:

- Approved palette → **SKIP** (on-brand)
- Whitelisted exceptions → **SKIP** (intentional deviation)
- Otherwise → **FLAG** with file:line

### Step A-3 — Scan for Hardcoded Hex Colors

Use Grep for inline hex colors in `style=` attributes within audit scope.

Check each against the approved palette. Flag any that are not:

- In the approved palette
- Standard grays (#000, #111, #222, #333, #444, #555, #666, #777, #888, #999, #aaa, #bbb, #ccc, #ddd, #eee, #fff and their full 6-digit equivalents)
- In the exceptions list

### Step A-4 — Check Border Patterns

Search for border classes that conflict with brand guidelines (e.g., `border-gray-*` when the brand uses custom rgba borders on dark backgrounds).

### Step A-5 — Check Typography

Search for `fontFamily` in audit scope. Verify they match the approved typography from the Brand Reference.

### Step A-6 — Generate Report

Present findings:

```
## Brand Audit Report

### Summary
| Check | Status | Issues |
|-------|--------|--------|
| Off-brand colors | PASS/WARN/FAIL | N files |
| Hex palette | PASS/WARN/FAIL | N files |
| Border colors | PASS/WARN/FAIL | N files |
| Typography | PASS/WARN/FAIL | N files |

### Overall: X/4 checks passing

---

### Issues Detail

#### Off-brand Colors (N files)
- `file.tsx:42` — Uses `text-blue-400`, expected brand color
- ...

### Recommendations
1. Replace X with Y
2. ...
```

### Step A-7 — Offer Fixes

Use AskUserQuestion:

- "Fix all issues automatically?"
- "Fix one section at a time?"
- "Just report, don't fix"
- "Whitelist some of these" (→ switches to Whitelist mode for flagged items)

If fixing, make targeted edits following the Brand Reference.

---

## Mode: Whitelist

Add exceptions for intentional brand deviations.

### Step W-1 — Identify Items to Whitelist

Either:

- Accept items from a preceding Audit (flagged but intentional)
- Ask user what patterns/files to whitelist via AskUserQuestion

### Step W-2 — Update Exceptions

Append new entries to the `### Exceptions` subsection under `## Brand Reference` in the project's CLAUDE.md:

```markdown
### Exceptions

- `src/app/portal/**/slides/` — multi-color badges for slide type differentiation
- `text-red-*` — error/danger states (standard UX pattern)
- `src/app/portal/**/frontend/` — client-specific branding (not portal chrome)
```

Each exception should include:

- Path glob or pattern
- Brief reason why it's intentional

---

## When to Use

| Situation                                 | Mode              |
| ----------------------------------------- | ----------------- |
| New project, no brand defined             | Init              |
| Existing project, want to codify patterns | Extract           |
| Before committing UI changes              | Audit             |
| After branding a new section              | Audit             |
| Periodic brand coherence check            | Audit             |
| Found intentional deviations during audit | Whitelist         |
| Extending to new clients/domains          | Audit + Whitelist |

## Integration with Other Skills

- `/seed` — Prompts "Set up brand guidelines?" after scaffolding
- `/validate` — Includes brand check if `## Brand Reference` exists
- `/cohere` — Includes brand coherence alongside code patterns
- `/init-standards` — Mentions brand reference as optional CLAUDE.md section
- `/tidy` — Flags if brand reference exists but audit scope directories have changed
