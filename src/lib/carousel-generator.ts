/**
 * Instagram Carousel Generator for Daily Value Posts
 * Generates 3 branded images: Quote, Values, Description
 */

import type { BrandTheme } from "./brand-themes";
import { BRAND_TYPOGRAPHY } from "./brand-themes";

// Instagram 4:5 portrait format
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1350;
const PADDING = 80;
const CONTENT_VERTICAL_PADDING = 150; // Minimum padding from top edge for content
const LOGO_HEIGHT = 100; // Increased from 80
const LOGO_MARGIN_BOTTOM = 50; // Adjusted for better alignment
const LOGO_VERTICAL_OFFSET = 40; // Offset to account for transparent padding in logo file
const LOGO_HORIZONTAL_OFFSET = 130; // Horizontal offset to fine-tune logo position

export interface CarouselContent {
  quote: {
    text: string;
    author: string;
  };
  value: {
    name: string;
    description: string;
  };
}

/**
 * Load an image from URL
 */
async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Draw gradient or solid background
 */
function drawBackground(
  ctx: CanvasRenderingContext2D,
  theme: BrandTheme,
  width: number,
  height: number
) {
  if (theme.backgroundGradient) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, theme.backgroundGradient.from);
    gradient.addColorStop(1, theme.backgroundGradient.to);
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = theme.backgroundColor;
  }
  ctx.fillRect(0, 0, width, height);
}

/**
 * Draw logo in bottom-right corner, aligned with text baseline
 */
async function drawLogo(ctx: CanvasRenderingContext2D, logoPath: string) {
  try {
    const logo = await loadImage(logoPath);
    const logoWidth = LOGO_HEIGHT * (logo.width / logo.height);
    const x = CANVAS_WIDTH - logoWidth - PADDING + LOGO_HORIZONTAL_OFFSET;
    // Align logo bottom with text baseline, accounting for embedded padding
    const baselineY = CANVAS_HEIGHT - LOGO_MARGIN_BOTTOM;
    const y = baselineY - LOGO_HEIGHT + LOGO_VERTICAL_OFFSET + 3; // 3px lower
    ctx.drawImage(logo, x, y, logoWidth, LOGO_HEIGHT);
  } catch (error) {
    console.error("Error loading logo:", error);
  }
}

/**
 * Wrap text to fit within maxWidth
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Draw "Daily Anchor" branding at bottom-left
 */
function drawDailyAnchorBranding(
  ctx: CanvasRenderingContext2D,
  theme: BrandTheme
) {
  ctx.fillStyle = theme.secondaryAccentColor ?? theme.accentColor;
  ctx.font = `600 ${BRAND_TYPOGRAPHY.sizes.caption}px ${BRAND_TYPOGRAPHY.fonts.subtitle}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic"; // Use alphabetic baseline for better alignment
  ctx.globalAlpha = 0.9; // Increased from 0.7 to 0.9 for brighter golden text
  // Align with logo bottom - account for text below baseline
  const baselineY = CANVAS_HEIGHT - LOGO_MARGIN_BOTTOM - 8; // Slight adjustment for visual alignment
  ctx.fillText("DAILY ANCHOR", PADDING, baselineY);
  ctx.globalAlpha = 1.0;
}

/**
 * Generate Page 1: Quote
 */
export async function generateQuotePage(
  content: CarouselContent,
  theme: BrandTheme
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  // Background
  drawBackground(ctx, theme, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Logo at bottom right
  await drawLogo(ctx, `/brand/${theme.logoFile}`);

  // Daily Anchor branding at bottom left
  drawDailyAnchorBranding(ctx, theme);

  // Calculate available space for text (leave room for logo at bottom)
  const textAreaHeight =
    CANVAS_HEIGHT - LOGO_HEIGHT - LOGO_MARGIN_BOTTOM - PADDING * 2;
  const maxWidth = CANVAS_WIDTH - PADDING * 2;

  // Quote text - dynamic sizing based on length with improved spacing
  const quoteText = `"${content.quote.text}"`;
  let fontSize = BRAND_TYPOGRAPHY.sizes.quote;
  let lineHeight = fontSize * 1.6; // Increased from 1.5 for better readability

  // Iteratively adjust font size to ensure quote fits
  ctx.fillStyle = theme.textColor;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  // Try decreasing font sizes until text fits
  const fontSizes = [58, 54, 50, 46, 42, 38, 34];
  for (const size of fontSizes) {
    fontSize = size;
    lineHeight = fontSize * 1.6;
    ctx.font = `300 ${fontSize}px ${BRAND_TYPOGRAPHY.fonts.subtitle}`; // Barlow Light

    const testLines = wrapText(ctx, quoteText, maxWidth);
    const totalTextHeight = testLines.length * lineHeight + 120; // More space for author

    if (totalTextHeight <= textAreaHeight) {
      break;
    }
  }

  ctx.font = `300 ${fontSize}px ${BRAND_TYPOGRAPHY.fonts.subtitle}`;
  const lines = wrapText(ctx, quoteText, maxWidth);

  // Calculate total content height
  const authorSize = Math.max(32, fontSize * 0.72);
  const totalContentHeight = lines.length * lineHeight + 50 + authorSize;

  // Calculate available space and vertically center the content
  const availableHeight =
    CANVAS_HEIGHT -
    CONTENT_VERTICAL_PADDING -
    (LOGO_HEIGHT + LOGO_MARGIN_BOTTOM);
  const contentCenterY =
    CONTENT_VERTICAL_PADDING + (availableHeight - totalContentHeight) / 2;

  let startY = contentCenterY;

  lines.forEach((line) => {
    ctx.fillText(line, PADDING, startY);
    startY += lineHeight;
  });

  // Author - scale proportionally with better spacing (only if author exists and is not "Unknown")
  if (
    content.quote.author &&
    content.quote.author.trim() &&
    content.quote.author.toLowerCase() !== "unknown"
  ) {
    ctx.font = `300 ${authorSize}px ${BRAND_TYPOGRAPHY.fonts.subtitle}`;
    ctx.fillStyle = theme.accentColor;
    ctx.fillText(`— ${content.quote.author}`, PADDING, startY + 50); // More space
  }

  // Add subtle swipe indicator in top right - refined
  ctx.font = `300 26px ${BRAND_TYPOGRAPHY.fonts.subtitle}`;
  ctx.fillStyle = theme.secondaryAccentColor ?? theme.accentColor;
  ctx.globalAlpha = 0.5;
  ctx.textAlign = "right";
  ctx.fillText("→ Swipe", CANVAS_WIDTH - PADDING, PADDING + 70);

  // Add page indicator - centered at bottom, aligned with other elements
  ctx.font = `300 22px ${BRAND_TYPOGRAPHY.fonts.subtitle}`;
  ctx.fillStyle = theme.secondaryAccentColor ?? theme.accentColor;
  ctx.globalAlpha = 0.4;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const indicatorY = CANVAS_HEIGHT - LOGO_MARGIN_BOTTOM - 8;
  ctx.fillText("1/3", CANVAS_WIDTH / 2, indicatorY);
  ctx.globalAlpha = 1.0;

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
      },
      "image/jpeg",
      0.95
    );
  });
}

/**
 * Generate Page 2: Single Value + Description (Focused & Impactful)
 */
export async function generateValuesPage(
  content: CarouselContent,
  theme: BrandTheme
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  // Background
  drawBackground(ctx, theme, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Logo at bottom right
  await drawLogo(ctx, `/brand/${theme.logoFile}`);

  // Daily Anchor branding at bottom left
  drawDailyAnchorBranding(ctx, theme);

  const maxWidth = CANVAS_WIDTH - PADDING * 2;

  // Pre-calculate all content dimensions for vertical centering
  const valueFontSize = BRAND_TYPOGRAPHY.sizes.title + 20;
  ctx.font = `800 ${valueFontSize}px ${BRAND_TYPOGRAPHY.fonts.title}`;
  const valueLines = wrapText(ctx, content.value.name, maxWidth);

  ctx.font = `400 ${BRAND_TYPOGRAPHY.sizes.body}px ${BRAND_TYPOGRAPHY.fonts.body}`;
  const descLines = wrapText(ctx, content.value.description, maxWidth);

  // Calculate total content height
  const labelHeight = BRAND_TYPOGRAPHY.sizes.caption * 1.4 + 80;
  const valueHeight = valueLines.length * valueFontSize * 1.25;
  const decorativeLineSpacing = 70 + 80;
  const descHeight = descLines.length * BRAND_TYPOGRAPHY.sizes.body * 1.75;
  const totalContentHeight =
    labelHeight + valueHeight + decorativeLineSpacing + descHeight;

  // Calculate available space and vertically center the content
  const availableHeight =
    CANVAS_HEIGHT -
    CONTENT_VERTICAL_PADDING -
    (LOGO_HEIGHT + LOGO_MARGIN_BOTTOM);
  const contentCenterY =
    CONTENT_VERTICAL_PADDING + (availableHeight - totalContentHeight) / 2;

  let y = contentCenterY - 35; // Shift up by 35px for better visual balance

  // Small label with letter spacing for elegance
  ctx.fillStyle = theme.accentColor;
  ctx.font = `700 ${BRAND_TYPOGRAPHY.sizes.caption}px ${BRAND_TYPOGRAPHY.fonts.subtitle}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  // Manually add letter spacing for "Value of the Day"
  const labelText = "VALUE OF THE DAY";
  const labelLetterSpacing = 2;
  let labelX = PADDING;
  for (let i = 0; i < labelText.length; i++) {
    const char = labelText[i]!;
    ctx.fillText(char, labelX, y);
    labelX += ctx.measureText(char).width + labelLetterSpacing;
  }
  y += BRAND_TYPOGRAPHY.sizes.caption * 1.4 + 80;

  // The Value - LARGE and impactful with letter spacing
  ctx.fillStyle = theme.textColor;
  ctx.font = `800 ${valueFontSize}px ${BRAND_TYPOGRAPHY.fonts.title}`; // Bolder weight

  valueLines.forEach((line) => {
    // Add subtle letter spacing to value
    let valueX = PADDING;
    const valueLetterSpacing = 1.5;
    for (let i = 0; i < line.length; i++) {
      const char = line[i]!;
      ctx.fillText(char, valueX, y);
      valueX += ctx.measureText(char).width + valueLetterSpacing;
    }
    y += valueFontSize * 1.25;
  });

  // Decorative accent line - more prominent
  y += 70;
  ctx.strokeStyle = theme.accentColor;
  ctx.globalAlpha = 0.6; // More visible
  ctx.lineWidth = 4; // Thicker
  ctx.beginPath();
  ctx.moveTo(PADDING, y);
  ctx.lineTo(PADDING + 180, y); // Longer
  ctx.stroke();
  ctx.globalAlpha = 1.0;
  y += 80; // More space

  // Description - more space, better line height
  ctx.fillStyle = theme.textColor;
  ctx.font = `400 ${BRAND_TYPOGRAPHY.sizes.body}px ${BRAND_TYPOGRAPHY.fonts.body}`;

  descLines.forEach((line) => {
    ctx.fillText(line, PADDING, y);
    y += BRAND_TYPOGRAPHY.sizes.body * 1.75; // Better line height
  });

  // Add subtle swipe indicator in top right
  ctx.font = `300 26px ${BRAND_TYPOGRAPHY.fonts.subtitle}`;
  ctx.fillStyle = theme.secondaryAccentColor ?? theme.accentColor;
  ctx.globalAlpha = 0.5;
  ctx.textAlign = "right";
  ctx.fillText("→ Swipe", CANVAS_WIDTH - PADDING, PADDING + 70);

  // Add page indicator - centered at bottom, aligned with other elements
  ctx.font = `300 22px ${BRAND_TYPOGRAPHY.fonts.subtitle}`;
  ctx.fillStyle = theme.secondaryAccentColor ?? theme.accentColor;
  ctx.globalAlpha = 0.4;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const indicatorY = CANVAS_HEIGHT - LOGO_MARGIN_BOTTOM - 8;
  ctx.fillText("2/3", CANVAS_WIDTH / 2, indicatorY);
  ctx.globalAlpha = 1.0;

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
      },
      "image/jpeg",
      0.95
    );
  });
}

/**
 * Generate Page 3: Call to Action
 */
export async function generateCTAPage(
  content: CarouselContent,
  theme: BrandTheme
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  // Background
  drawBackground(ctx, theme, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Logo at bottom right
  await drawLogo(ctx, `/brand/${theme.logoFile}`);

  // Daily Anchor branding at bottom left
  drawDailyAnchorBranding(ctx, theme);

  // Pre-calculate explanation text height
  const maxWidth = CANVAS_WIDTH - PADDING * 2;
  ctx.font = `400 ${BRAND_TYPOGRAPHY.sizes.body - 6}px ${BRAND_TYPOGRAPHY.fonts.body}`;
  const explanationText = `Living with an embodied value system means letting principles like ${content.value.name} guide your decisions, shape your character, and anchor you in what truly matters on a moment to moment basis.`;
  const explanationLines = wrapText(ctx, explanationText, maxWidth);

  // Calculate total content height for vertical centering
  const questionHeight = BRAND_TYPOGRAPHY.sizes.subtitle * 1.4 * 2; // 2 question lines: "How will you" / "embody it?"
  const questionSpacing = BRAND_TYPOGRAPHY.sizes.subtitle * 2.2;
  const explanationHeight =
    explanationLines.length * (BRAND_TYPOGRAPHY.sizes.body - 6) * 1.6 + 60;
  const decorativeLineSpacing = 60;
  const saveShareHeight = BRAND_TYPOGRAPHY.sizes.body * 1.8 * 2;
  const totalContentHeight =
    questionHeight +
    questionSpacing +
    explanationHeight +
    decorativeLineSpacing +
    saveShareHeight;

  // Calculate available space and vertically center the content
  const availableHeight =
    CANVAS_HEIGHT -
    CONTENT_VERTICAL_PADDING -
    (LOGO_HEIGHT + LOGO_MARGIN_BOTTOM);
  const contentCenterY =
    CONTENT_VERTICAL_PADDING + (availableHeight - totalContentHeight) / 2;

  let y = contentCenterY + 10; // Shift down by 10px

  // Embodied value system explanation (comes first) - left aligned
  ctx.fillStyle = theme.textColor;
  ctx.font = `400 ${BRAND_TYPOGRAPHY.sizes.body - 6}px ${BRAND_TYPOGRAPHY.fonts.body}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  // Use pre-calculated explanationLines from above
  explanationLines.forEach((line) => {
    ctx.fillText(line, PADDING, y);
    y += (BRAND_TYPOGRAPHY.sizes.body - 6) * 1.6;
  });

  y += 60;

  // Single CTA Question - left aligned
  ctx.fillStyle = theme.textColor;
  ctx.font = `600 ${BRAND_TYPOGRAPHY.sizes.subtitle}px ${BRAND_TYPOGRAPHY.fonts.title}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const question1 = "How will you";
  const question2 = "embody it?";

  ctx.fillText(question1, PADDING, y);
  y += BRAND_TYPOGRAPHY.sizes.subtitle * 1.4;
  ctx.fillText(question2, PADDING, y);
  y += BRAND_TYPOGRAPHY.sizes.subtitle * 2.2;

  // Decorative line - left aligned
  ctx.strokeStyle = theme.accentColor;
  ctx.globalAlpha = 0.4;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(PADDING, y);
  ctx.lineTo(PADDING + 200, y);
  ctx.stroke();
  ctx.globalAlpha = 1.0;
  y += 60;

  // Save & Share message - left aligned
  ctx.fillStyle = theme.accentColor;
  ctx.font = `500 ${BRAND_TYPOGRAPHY.sizes.body}px ${BRAND_TYPOGRAPHY.fonts.body}`;
  ctx.textAlign = "left";

  const saveShareText = "Be sure to Save and Share with likeminded friends!";
  const saveShareLines = wrapText(ctx, saveShareText, maxWidth);

  saveShareLines.forEach((line) => {
    ctx.fillText(line, PADDING, y);
    y += BRAND_TYPOGRAPHY.sizes.body * 1.8;
  });

  // Add page indicator - centered at bottom, aligned with other elements
  ctx.font = `300 22px ${BRAND_TYPOGRAPHY.fonts.subtitle}`;
  ctx.fillStyle = theme.secondaryAccentColor ?? theme.accentColor;
  ctx.globalAlpha = 0.4;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const indicatorY = CANVAS_HEIGHT - LOGO_MARGIN_BOTTOM - 8;
  ctx.fillText("3/3", CANVAS_WIDTH / 2, indicatorY);
  ctx.globalAlpha = 1.0;

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
      },
      "image/jpeg",
      0.95
    );
  });
}

/**
 * Generate Page 3: Core Value Description
 * NOTE: This function is currently unused and disabled.
 * @deprecated - Not currently part of the 3-page carousel
 */
/*
async function generateDescriptionPage(
  content: CarouselContent,
  theme: BrandTheme
): Promise<Blob> {
  // This function is commented out as it's not currently used
  // and references properties that don't exist in CarouselContent
  throw new Error("generateDescriptionPage is deprecated");
}
*/

/**
 * Generate carousel pages (3 pages: Quote + Values + CTA)
 * Page order: 1. Quote, 2. Value/Description, 3. CTA
 */
export async function generateCarousel(
  content: CarouselContent,
  theme: BrandTheme
): Promise<{ page1: Blob; page2: Blob; page3: Blob }> {
  const [page1, page2, page3] = await Promise.all([
    generateQuotePage(content, theme), // Page 1: Quote
    generateValuesPage(content, theme), // Page 2: Value + Description
    generateCTAPage(content, theme), // Page 3: CTA
  ]);

  return { page1, page2, page3 };
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
