# Resume PDF Generation Guide

This document explains how to generate a PDF version of Matthew Miceli's resume from the Next.js website.

## Overview

The resume PDF is generated using Puppeteer, which launches a headless Chrome browser to render the `/resume` page and convert it to a PDF with optimized print styling.

## Prerequisites

- Node.js and npm installed
- All project dependencies installed (`npm install`)
- Dev server running on `localhost:3000`

## Quick Start

### Option 1: Two Terminal Approach (Recommended)

**Terminal 1 - Start the dev server:**
```bash
npm run dev
```

**Terminal 2 - Generate the PDF:**
```bash
npm run generate-resume-pdf
```

The PDF will be generated at:
```
Matthew_Miceli_Resume.pdf
```

### Option 2: Sequential Commands

```bash
# Start dev server in background
npm run dev &

# Wait for server to start (5-10 seconds)
sleep 10

# Generate PDF
npm run generate-resume-pdf

# Stop dev server
pkill -f "next dev"
```

## Output

- **Filename:** `Matthew_Miceli_Resume.pdf`
- **Location:** Project root directory
- **Pages:** 2 pages
- **Format:** US Letter (8.5" × 11")
- **Margins:** 0.25 inches on all sides

## PDF Features

The generated PDF includes:

✅ Professional header with profile picture (centered)
✅ Contact information
✅ Professional summary
✅ Complete professional experience (4 positions)
✅ Education (3 degrees with GPAs)
✅ Core competencies (clean layout without bullets)
✅ Technical skills (4 categories)
✅ Notable projects (3 projects)

## Technical Details

### Script Location
```
scripts/generate-resume-pdf.ts
```

### What the Script Does

1. Launches headless Chrome browser
2. Navigates to `http://localhost:3000/resume`
3. Waits for content to load
4. Injects CSS to:
   - Disable animations
   - Fix page breaks
   - Optimize spacing for print
   - Center profile picture
   - Compress layout to fit 2 pages
5. Generates PDF with optimized print settings
6. Saves to project root

### Key Optimizations

- **Font sizes:** 9-9.5pt body text for compact layout
- **Line height:** 1.3-1.35 for tight spacing
- **Animations disabled:** Prevents layout issues during PDF capture
- **Print media emulation:** Uses print-specific CSS styles
- **Page break control:** Prevents awkward section splits

## Troubleshooting

### Error: "Cannot connect to localhost:3000"
**Solution:** Make sure the dev server is running first with `npm run dev`

### Error: "page.waitForTimeout is not a function"
**Solution:** This has been fixed in the current version. The script now uses `Promise + setTimeout` instead.

### PDF has blank pages or wrong layout
**Solution:** The script includes a 1-second wait for layout to settle. If issues persist, try increasing the wait time in `scripts/generate-resume-pdf.ts`.

### Profile picture not centered
**Solution:** This has been fixed with CSS injection that forces absolute positioning and centering.

## Customization

To modify the PDF output, edit:

1. **Content:** `/src/app/resume/page.tsx`
2. **Styling:** Modify the CSS injection in `scripts/generate-resume-pdf.ts` (lines 34-190)
3. **Page margins:** Edit the `margin` object in the PDF generation call (around line 60)

## Git Configuration

The generated PDF (`Matthew_Miceli_Resume.pdf`) is added to `.gitignore` to prevent it from being committed to version control. Generate it locally as needed.

## Notes

- The PDF is optimized for **2 pages exactly**
- Changing content may affect pagination - test after major edits
- The web version (`/resume`) and PDF version use the same source but different styling
- Print styles are applied via CSS `@media print` queries in the page component

## Related Files

- Resume page component: `src/app/resume/page.tsx`
- PDF generation script: `scripts/generate-resume-pdf.ts`
- npm script: Defined in `package.json` under `"generate-resume-pdf"`
- Profile image: `public/images/profile.jpg`

---

**Last Updated:** 2026-01-07
**Script Version:** 1.0
**Output Format:** 2-page PDF, US Letter, 0.25" margins
