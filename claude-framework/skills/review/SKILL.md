---
name: review
description: Review a pull request — fetch changes, run quality checks, summarize, and provide feedback
allowed-tools: Read, Bash, Glob, Grep, AskUserQuestion
---

# Review - Pull Request Review

Fetch a pull request, analyze the changes, run quality checks locally, and provide a structured review with actionable feedback.

## When to Use

- User says "review PR", "check this PR", "look at PR #42"
- User receives a notification about a new PR
- Before merging any PR into dev or main

## Arguments

- `/review 42` — review PR #42
- `/review` — list open PRs and ask which one

## Steps

### Phase 1: Identify PR

If a PR number was provided, fetch it:

```bash
gh pr view <number> --json number,title,body,headRefName,baseRefName,author,additions,deletions,changedFiles,url
```

If no number provided, list open PRs:

```bash
gh pr list --json number,title,headRefName,author,createdAt --limit 10
```

Present the list and use AskUserQuestion to ask which one to review.

### Phase 2: Fetch Changes

```bash
# Get the full diff
gh pr diff <number>
```

```bash
# Get the list of changed files
gh pr diff <number> --name-only
```

```bash
# Get commit history
gh pr view <number> --json commits --jq '.commits[].messageHeadline'
```

### Phase 3: Analyze Changes

Read through the diff carefully and evaluate:

#### 3.1 Code Quality

- Are there TypeScript errors or `any` types?
- Are imports using the `~/` path alias?
- Is error handling appropriate?
- Any security concerns (SQL injection, XSS, exposed secrets)?

#### 3.2 Architecture

- Do changes follow existing patterns in the codebase?
- Are files in the right directories?
- Is there unnecessary complexity?
- Any code duplication that should be extracted?

#### 3.3 Completeness

- Does the PR description match what the code actually does?
- Are there TODO comments that should be resolved?
- Are STATUS.md / TODO.md updated if relevant?

#### 3.4 Testing

- If there are new routes/pages — can they be accessed?
- If there are new API endpoints — are they properly typed?
- Are there edge cases not handled?

### Phase 4: Run Local Checks (Optional)

Use AskUserQuestion to ask:

> Want me to check out this branch and run quality checks locally? (typecheck, lint, build)

If yes:

```bash
# Save current branch
ORIGINAL_BRANCH=$(git branch --show-current)

# Fetch and checkout PR branch
gh pr checkout <number>

# Run checks
npm run typecheck 2>&1 | tail -20
npm run lint 2>&1 | tail -20
npm run build 2>&1 | tail -20

# Return to original branch
git checkout "$ORIGINAL_BRANCH"
```

### Phase 5: Present Review

```
## PR Review: #<number> — <title>

**Author:** <author>
**Branch:** <head> → <base>
**Changes:** +<additions> -<deletions> across <files> files

---

### Summary
<1-3 sentences describing what this PR does>

### Quality Assessment

| Category | Status | Notes |
|----------|--------|-------|
| Code quality | Pass/Warn/Fail | <details> |
| Architecture | Pass/Warn/Fail | <details> |
| Completeness | Pass/Warn/Fail | <details> |
| Local checks | Pass/Warn/Fail/Skipped | <details> |

### Issues Found
<numbered list of specific issues, with file:line references>
<or "No issues found">

### Suggestions
<optional improvements that aren't blocking>

### Verdict
<one of: "Approve", "Request changes", "Needs discussion">
```

### Phase 6: Take Action

Use AskUserQuestion:

1. **Approve and merge** — approve the PR and merge it
2. **Request changes** — post review comments on GitHub
3. **Just approve** — approve but don't merge yet
4. **Done** — no action, just wanted the review

If "Approve and merge":

```bash
gh pr review <number> --approve --body "Looks good! Reviewed with Claude Code."
gh pr merge <number> --squash --delete-branch
```

If "Request changes":

```bash
gh pr review <number> --request-changes --body "<summary of issues>"
```

If "Just approve":

```bash
gh pr review <number> --approve --body "Looks good! Reviewed with Claude Code."
```

## Edge Cases

### PR has merge conflicts

Note in the review: "This PR has merge conflicts with `<base>`. The author needs to run `/sync` to resolve them before merging."

### PR is a draft

Note: "This is a draft PR — review is informational. The author will mark it ready when complete."

### Large PR (>500 lines changed)

Focus the review on:

- New files (most likely to have issues)
- Schema/database changes (highest risk)
- API changes (breaking change potential)

Note: "This is a large PR. Consider breaking future changes into smaller PRs for easier review."

## Beginner Context

When the reviewer seems new to code review, adjust the review output:

- **Code review** = Reading someone else's code changes and checking for problems before they become part of the project. Like proofreading, but for code.
- **Approve** = "This looks good, go ahead and add it to the project."
- **Request changes** = "I found some things that should be fixed first." This is normal and not personal — it's how teams improve code together.
- **Merge conflict** = Two people changed the same part of a file differently. Someone needs to decide which version to keep (or combine them).
- **Breaking change** = A change that might cause other parts of the app to stop working.
- **Schema change** = A change to how the database stores data. These are higher risk because they affect all stored information.

For beginner reviewers, simplify the verdict options:

1. **Looks good — merge it** (approve + merge)
2. **I have questions** (comment without verdict)
3. **Something seems wrong** (request changes — explain what and why)
4. **I'm not sure — skip for now** (no action)

Add a beginner-friendly review tip: "If you're new to reviewing code, focus on three things: Does the description match what the code does? Are there any obvious errors? Does it make sense to you?"

## Relationship to Other Skills

| Skill      | Role                                         |
| ---------- | -------------------------------------------- |
| `/pr`      | Create a PR (author side)                    |
| `/review`  | Review a PR (reviewer side)                  |
| `/release` | Merge dev → main after reviews pass          |
| `/cohere`  | Deep pattern check (complementary to review) |
