/**
 * Server-side Instagram Carousel Generator for Daily Value Posts
 * Uses node-canvas to generate identical images to client-side version
 */

import { createCanvas, Canvas, CanvasRenderingContext2D, loadImage, registerFont } from "canvas";
import { join } from "path";
import type { BrandTheme } from "./brand-themes";
import { BRAND_TYPOGRAPHY } from "./brand-themes";

// Register custom fonts for node-canvas
// These fonts must be registered before any canvas operations
const fontsDir = join(process.cwd(), "public", "fonts");

registerFont(join(fontsDir, "QuattrocentoSans-Regular.ttf"), {
  family: "Quattrocento Sans",
  weight: "400",
});

registerFont(join(fontsDir, "QuattrocentoSans-Bold.ttf"), {
  family: "Quattrocento Sans",
  weight: "700",
});

registerFont(join(fontsDir, "Barlow-Light.ttf"), {
  family: "Barlow",
  weight: "300",
});

registerFont(join(fontsDir, "Barlow-Regular.ttf"), {
  family: "Barlow",
  weight: "400",
});

registerFont(join(fontsDir, "Barlow-Medium.ttf"), {
  family: "Barlow",
  weight: "500",
});

registerFont(join(fontsDir, "Barlow-SemiBold.ttf"), {
  family: "Barlow",
  weight: "600",
});

registerFont(join(fontsDir, "Barlow-Bold.ttf"), {
  family: "Barlow",
  weight: "700",
});

registerFont(join(fontsDir, "Barlow-ExtraBold.ttf"), {
  family: "Barlow",
  weight: "800",
});

// Instagram 4:5 portrait format
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1350;
const PADDING = 80;
const CONTENT_VERTICAL_PADDING = 150;
const LOGO_HEIGHT = 100;
const LOGO_MARGIN_BOTTOM = 50;

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
 * Draw logo in bottom-right corner
 */
async function drawLogo(ctx: CanvasRenderingContext2D, theme: BrandTheme) {
  try {
    const logoPath = join(process.cwd(), "public", "brand", theme.logoFile.replace('.svg', '.png'));
    const logo = await loadImage(logoPath);
    const logoWidth = LOGO_HEIGHT * (logo.width / logo.height);
    const LOGO_HORIZONTAL_OFFSET = 130;
    const LOGO_VERTICAL_OFFSET = 40;
    const x = CANVAS_WIDTH - logoWidth - PADDING + LOGO_HORIZONTAL_OFFSET;
    const baselineY = CANVAS_HEIGHT - LOGO_MARGIN_BOTTOM;
    const y = baselineY - LOGO_HEIGHT + LOGO_VERTICAL_OFFSET + 3;
    ctx.drawImage(logo, x, y, logoWidth, LOGO_HEIGHT);
  } catch (error) {
    console.error("Error loading logo:", error);
  }
}

/**
 * Draw "Daily Anchor" branding at bottom-left
 */
function drawDailyAnchorBranding(
  ctx: CanvasRenderingContext2D,
  theme: BrandTheme
) {
  ctx.fillStyle = theme.secondaryAccentColor ?? theme.accentColor;
  ctx.font = `600 ${BRAND_TYPOGRAPHY.sizes.caption}px Barlow, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.globalAlpha = 0.9;
  const baselineY = CANVAS_HEIGHT - LOGO_MARGIN_BOTTOM - 8;
  ctx.fillText("DAILY ANCHOR", PADDING, baselineY);
  ctx.globalAlpha = 1.0;
}

/**
 * Generate Page 1: Quote
 */
export async function generateQuotePage(
  content: CarouselContent,
  theme: BrandTheme
): Promise<Buffer> {
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  const ctx = canvas.getContext("2d");

  // Background
  drawBackground(ctx, theme, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Logo at bottom right
  await drawLogo(ctx, theme);

  // Daily Anchor branding at bottom left
  drawDailyAnchorBranding(ctx, theme);

  // Calculate available space for text
  const textAreaHeight =
    CANVAS_HEIGHT - LOGO_HEIGHT - LOGO_MARGIN_BOTTOM - PADDING * 2;
  const maxWidth = CANVAS_WIDTH - PADDING * 2;

  // Quote text - dynamic sizing based on length
  const quoteText = `"${content.quote.text}"`;
  let fontSize = BRAND_TYPOGRAPHY.sizes.quote;
  let lineHeight = fontSize * 1.6;

  ctx.fillStyle = theme.textColor;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  // Try decreasing font sizes until text fits
  const fontSizes = [58, 54, 50, 46, 42, 38, 34];
  for (const size of fontSizes) {
    fontSize = size;
    lineHeight = fontSize * 1.6;
    ctx.font = `300 ${fontSize}px Barlow, sans-serif`;

    const testLines = wrapText(ctx, quoteText, maxWidth);
    const totalTextHeight = testLines.length * lineHeight + 120;

    if (totalTextHeight <= textAreaHeight) {
      break;
    }
  }

  ctx.font = `300 ${fontSize}px Barlow, sans-serif`;
  const lines = wrapText(ctx, quoteText, maxWidth);

  // Calculate total content height
  const authorSize = Math.max(32, fontSize * 0.72);
  const totalContentHeight = lines.length * lineHeight + 50 + authorSize;

  // Calculate available space and vertically center
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

  // Author
  if (
    content.quote.author &&
    content.quote.author.trim() &&
    content.quote.author.toLowerCase() !== "unknown"
  ) {
    ctx.font = `300 ${authorSize}px Barlow, sans-serif`;
    ctx.fillStyle = theme.accentColor;
    ctx.fillText(`— ${content.quote.author}`, PADDING, startY + 50);
  }

  // Swipe indicator
  ctx.font = `300 26px Barlow, sans-serif`;
  ctx.fillStyle = theme.secondaryAccentColor ?? theme.accentColor;
  ctx.globalAlpha = 0.5;
  ctx.textAlign = "right";
  ctx.fillText("→ Swipe", CANVAS_WIDTH - PADDING, PADDING + 70);

  // Page indicator
  ctx.font = `300 22px Barlow, sans-serif`;
  ctx.fillStyle = theme.secondaryAccentColor ?? theme.accentColor;
  ctx.globalAlpha = 0.4;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const indicatorY = CANVAS_HEIGHT - LOGO_MARGIN_BOTTOM - 8;
  ctx.fillText("1/3", CANVAS_WIDTH / 2, indicatorY);
  ctx.globalAlpha = 1.0;

  return canvas.toBuffer("image/jpeg", { quality: 0.95 });
}

/**
 * Generate Page 2: Value + Description
 */
export async function generateValuesPage(
  content: CarouselContent,
  theme: BrandTheme
): Promise<Buffer> {
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  const ctx = canvas.getContext("2d");

  // Background
  drawBackground(ctx, theme, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Logo at bottom right
  await drawLogo(ctx, theme);

  // Daily Anchor branding
  drawDailyAnchorBranding(ctx, theme);

  const maxWidth = CANVAS_WIDTH - PADDING * 2;

  // Pre-calculate all content dimensions
  const valueFontSize = BRAND_TYPOGRAPHY.sizes.title + 20;
  ctx.font = `800 ${valueFontSize}px Quattrocento Sans, sans-serif`;
  const valueLines = wrapText(ctx, content.value.name, maxWidth);

  ctx.font = `400 ${BRAND_TYPOGRAPHY.sizes.body}px Barlow, sans-serif`;
  const descLines = wrapText(ctx, content.value.description, maxWidth);

  // Calculate total content height
  const labelHeight = BRAND_TYPOGRAPHY.sizes.caption * 1.4 + 80;
  const valueHeight = valueLines.length * valueFontSize * 1.25;
  const decorativeLineSpacing = 70 + 80;
  const descHeight = descLines.length * BRAND_TYPOGRAPHY.sizes.body * 1.75;
  const totalContentHeight =
    labelHeight + valueHeight + decorativeLineSpacing + descHeight;

  // Vertically center content
  const availableHeight =
    CANVAS_HEIGHT -
    CONTENT_VERTICAL_PADDING -
    (LOGO_HEIGHT + LOGO_MARGIN_BOTTOM);
  const contentCenterY =
    CONTENT_VERTICAL_PADDING + (availableHeight - totalContentHeight) / 2;

  let y = contentCenterY - 35;

  // Label with letter spacing
  ctx.fillStyle = theme.accentColor;
  ctx.font = `700 ${BRAND_TYPOGRAPHY.sizes.caption}px Barlow, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const labelText = "VALUE OF THE DAY";
  const labelLetterSpacing = 2;
  let labelX = PADDING;
  for (let i = 0; i < labelText.length; i++) {
    const char = labelText[i]!;
    ctx.fillText(char, labelX, y);
    labelX += ctx.measureText(char).width + labelLetterSpacing;
  }
  y += BRAND_TYPOGRAPHY.sizes.caption * 1.4 + 80;

  // The Value
  ctx.fillStyle = theme.textColor;
  ctx.font = `800 ${valueFontSize}px Quattrocento Sans, sans-serif`;

  valueLines.forEach((line) => {
    let valueX = PADDING;
    const valueLetterSpacing = 1.5;
    for (let i = 0; i < line.length; i++) {
      const char = line[i]!;
      ctx.fillText(char, valueX, y);
      valueX += ctx.measureText(char).width + valueLetterSpacing;
    }
    y += valueFontSize * 1.25;
  });

  // Decorative line
  y += 70;
  ctx.strokeStyle = theme.accentColor;
  ctx.globalAlpha = 0.6;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(PADDING, y);
  ctx.lineTo(PADDING + 180, y);
  ctx.stroke();
  ctx.globalAlpha = 1.0;
  y += 80;

  // Description
  ctx.fillStyle = theme.textColor;
  ctx.font = `400 ${BRAND_TYPOGRAPHY.sizes.body}px Barlow, sans-serif`;

  descLines.forEach((line) => {
    ctx.fillText(line, PADDING, y);
    y += BRAND_TYPOGRAPHY.sizes.body * 1.75;
  });

  // Swipe indicator
  ctx.font = `300 26px Barlow, sans-serif`;
  ctx.fillStyle = theme.secondaryAccentColor ?? theme.accentColor;
  ctx.globalAlpha = 0.5;
  ctx.textAlign = "right";
  ctx.fillText("→ Swipe", CANVAS_WIDTH - PADDING, PADDING + 70);

  // Page indicator
  ctx.font = `300 22px Barlow, sans-serif`;
  ctx.fillStyle = theme.secondaryAccentColor ?? theme.accentColor;
  ctx.globalAlpha = 0.4;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const indicatorY = CANVAS_HEIGHT - LOGO_MARGIN_BOTTOM - 8;
  ctx.fillText("2/3", CANVAS_WIDTH / 2, indicatorY);
  ctx.globalAlpha = 1.0;

  return canvas.toBuffer("image/jpeg", { quality: 0.95 });
}

/**
 * Generate Page 3: Call to Action
 */
export async function generateCTAPage(
  content: CarouselContent,
  theme: BrandTheme
): Promise<Buffer> {
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  const ctx = canvas.getContext("2d");

  // Background
  drawBackground(ctx, theme, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Logo at bottom right
  await drawLogo(ctx, theme);

  // Daily Anchor branding
  drawDailyAnchorBranding(ctx, theme);

  const maxWidth = CANVAS_WIDTH - PADDING * 2;
  ctx.font = `400 ${BRAND_TYPOGRAPHY.sizes.body - 6}px Barlow, sans-serif`;
  const explanationText = `Living with an embodied value system means letting principles like ${content.value.name} guide your decisions, shape your character, and anchor you in what truly matters on a moment to moment basis.`;
  const explanationLines = wrapText(ctx, explanationText, maxWidth);

  // Calculate total content height
  const questionHeight = BRAND_TYPOGRAPHY.sizes.subtitle * 1.4 * 2;
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

  // Vertically center content
  const availableHeight =
    CANVAS_HEIGHT -
    CONTENT_VERTICAL_PADDING -
    (LOGO_HEIGHT + LOGO_MARGIN_BOTTOM);
  const contentCenterY =
    CONTENT_VERTICAL_PADDING + (availableHeight - totalContentHeight) / 2;

  let y = contentCenterY + 10;

  // Explanation text
  ctx.fillStyle = theme.textColor;
  ctx.font = `400 ${BRAND_TYPOGRAPHY.sizes.body - 6}px Barlow, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  explanationLines.forEach((line) => {
    ctx.fillText(line, PADDING, y);
    y += (BRAND_TYPOGRAPHY.sizes.body - 6) * 1.6;
  });

  y += 60;

  // CTA Question
  ctx.fillStyle = theme.textColor;
  ctx.font = `600 ${BRAND_TYPOGRAPHY.sizes.subtitle}px Barlow, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  ctx.fillText("How will you", PADDING, y);
  y += BRAND_TYPOGRAPHY.sizes.subtitle * 1.4;
  ctx.fillText("embody it?", PADDING, y);
  y += BRAND_TYPOGRAPHY.sizes.subtitle * 2.2;

  // Decorative line
  ctx.strokeStyle = theme.accentColor;
  ctx.globalAlpha = 0.4;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(PADDING, y);
  ctx.lineTo(PADDING + 200, y);
  ctx.stroke();
  ctx.globalAlpha = 1.0;
  y += 60;

  // Save & Share message
  ctx.fillStyle = theme.accentColor;
  ctx.font = `500 ${BRAND_TYPOGRAPHY.sizes.body}px Barlow, sans-serif`;
  ctx.textAlign = "left";

  const saveShareText = "Be sure to Save and Share with likeminded friends!";
  const saveShareLines = wrapText(ctx, saveShareText, maxWidth);

  saveShareLines.forEach((line) => {
    ctx.fillText(line, PADDING, y);
    y += BRAND_TYPOGRAPHY.sizes.body * 1.8;
  });

  // Page indicator
  ctx.font = `300 22px Barlow, sans-serif`;
  ctx.fillStyle = theme.secondaryAccentColor ?? theme.accentColor;
  ctx.globalAlpha = 0.4;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const indicatorY = CANVAS_HEIGHT - LOGO_MARGIN_BOTTOM - 8;
  ctx.fillText("3/3", CANVAS_WIDTH / 2, indicatorY);
  ctx.globalAlpha = 1.0;

  return canvas.toBuffer("image/jpeg", { quality: 0.95 });
}

/**
 * Generate all 3 carousel pages
 */
export async function generateCarousel(
  content: CarouselContent,
  theme: BrandTheme
): Promise<{ page1: Buffer; page2: Buffer; page3: Buffer }> {
  const [page1, page2, page3] = await Promise.all([
    generateQuotePage(content, theme),
    generateValuesPage(content, theme),
    generateCTAPage(content, theme),
  ]);

  return { page1, page2, page3 };
}
