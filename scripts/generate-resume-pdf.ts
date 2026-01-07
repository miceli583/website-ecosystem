#!/usr/bin/env tsx

/**
 * Generate Resume PDF using Puppeteer
 * Run: npm run generate-resume-pdf
 */

import puppeteer from 'puppeteer';
import { join } from 'path';

async function generateResumePDF() {
  console.log('🚀 Starting PDF generation...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Emulate print media type
  await page.emulateMediaType('print');

  // Navigate to local resume page
  const resumeUrl = 'http://localhost:3000/resume';
  console.log(`📄 Loading resume from ${resumeUrl}...`);

  await page.goto(resumeUrl, {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });

  // Wait for content to load
  await page.waitForSelector('.resume-container');
  console.log('✅ Resume content loaded');

  // Disable all animations and fix page breaks
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
      }
      .animate-fade-in-up {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }

      /* Fix page break issues */
      .resume-section {
        page-break-inside: auto !important;
        break-inside: auto !important;
        page-break-after: auto !important;
        break-after: auto !important;
      }

      /* Ensure proper flow between sections */
      .resume-section:not(:last-child) {
        margin-bottom: 0.75rem !important;
      }

      /* Remove excessive spacing */
      .min-h-screen {
        min-height: auto !important;
      }

      /* Fix profile picture centering in circle */
      .resume-header img {
        position: absolute !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        object-position: center !important;
      }

      /* Remove all shadows for clean PDF output */
      * {
        box-shadow: none !important;
        text-shadow: none !important;
        -webkit-box-shadow: none !important;
      }

      /* Compress layout for 2-page resume */
      body {
        font-size: 9.5pt !important;
        line-height: 1.35 !important;
      }

      .resume-header {
        padding: 1rem 1.5rem !important;
      }

      .resume-header h1 {
        font-size: 1.75rem !important;
        margin-bottom: 0.25rem !important;
      }

      .resume-header p {
        font-size: 1.1rem !important;
        margin-bottom: 0.5rem !important;
      }

      .resume-header .text-sm {
        font-size: 0.8rem !important;
      }

      .resume-content {
        padding: 1rem 1.5rem !important;
      }

      .resume-section {
        margin-bottom: 0.6rem !important;
      }

      .resume-section-title {
        font-size: 1.2rem !important;
        margin-bottom: 0.4rem !important;
        padding-bottom: 0.2rem !important;
      }

      .resume-section p {
        line-height: 1.35 !important;
        margin-bottom: 0.3rem !important;
        font-size: 9.5pt !important;
      }

      .resume-job,
      .resume-education {
        margin-bottom: 0.5rem !important;
      }

      .resume-job h3,
      .resume-education h3 {
        font-size: 0.95rem !important;
        margin-bottom: 0.15rem !important;
      }

      .resume-job p,
      .resume-education p {
        font-size: 0.85rem !important;
        line-height: 1.3 !important;
      }

      .resume-job ul,
      .resume-education ul {
        margin-top: 0.25rem !important;
        margin-bottom: 0.25rem !important;
        margin-left: 1rem !important;
      }

      .resume-job li,
      .resume-education li {
        margin-bottom: 0.2rem !important;
        line-height: 1.35 !important;
        font-size: 9pt !important;
      }

      /* Compress skills grid */
      .grid {
        gap: 0.4rem !important;
      }

      .grid h3 {
        font-size: 0.85rem !important;
        margin-bottom: 0.2rem !important;
      }

      .grid p {
        font-size: 9pt !important;
        line-height: 1.3 !important;
      }

      /* Compress notable projects */
      .resume-section:last-child > div > div {
        margin-bottom: 0.4rem !important;
      }

      .resume-section:last-child h3 {
        font-size: 0.9rem !important;
        margin-bottom: 0.15rem !important;
      }

      .resume-section:last-child .text-sm {
        font-size: 0.75rem !important;
        margin-bottom: 0.15rem !important;
      }

      /* Profile picture - make slightly smaller */
      .resume-header .relative {
        width: 6rem !important;
        height: 6rem !important;
      }
    `
  });

  // Wait a bit for layout to settle after disabling animations
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('✅ Animations disabled, layout settled');

  // Generate PDF with optimized settings
  const outputPath = join(process.cwd(), 'Matthew_Miceli_Resume.pdf');

  await page.pdf({
    path: outputPath,
    format: 'Letter',
    margin: {
      top: '0.25in',
      right: '0.25in',
      bottom: '0.25in',
      left: '0.25in',
    },
    printBackground: true,
    preferCSSPageSize: false,
  });

  console.log(`✅ PDF generated successfully: ${outputPath}`);

  await browser.close();
  console.log('🎉 Done!');
}

generateResumePDF().catch((error) => {
  console.error('❌ Error generating PDF:', error);
  process.exit(1);
});
