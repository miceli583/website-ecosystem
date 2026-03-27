/**
 * Generate OG image variants for the Miracle Mind ecosystem.
 *
 * Variants:
 *  - og-default.png   — 1200x630, standard Open Graph (Facebook, LinkedIn, iMessage)
 *  - og-twitter.png    — 1200x628, Twitter summary_large_image
 *  - og-square.png     — 1200x1200, square format (WhatsApp, some mobile)
 *  - og-compact.png    — 800x418, compact for text/SMS previews
 *
 * Each: black background, orbit star symbol, "MIRACLE MIND" text, slogan.
 *
 * Run: npx tsx scripts/generate-og-images.ts
 */

import { createCanvas, type CanvasRenderingContext2D } from "canvas";
import { writeFileSync } from "fs";
import { resolve } from "path";

const GOLD = "#D4AF37";
const GOLD_LIGHT = "#F6E6C1";
const GOLD_DARK = "#8C5C26";
const BLACK = "#000000";
const GRAY = "#888888";

function drawOrbitStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Outer ring
  const grad = ctx.createLinearGradient(-72, -72, 72, 72);
  grad.addColorStop(0, GOLD_LIGHT);
  grad.addColorStop(0.5, "#D8AD54");
  grad.addColorStop(1, GOLD_DARK);

  ctx.strokeStyle = grad;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, 72, 0, Math.PI * 2);
  ctx.stroke();

  // Inner ring
  ctx.strokeStyle = "rgba(235, 217, 185, 0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 58, 0, Math.PI * 2);
  ctx.stroke();

  // Curved spokes
  ctx.strokeStyle = grad;
  ctx.lineWidth = 5.5;
  ctx.lineCap = "round";

  const spokes: [number, number, number, number, number, number][] = [
    [0, -72, 16, -62, 52, -42], // top to right
    [72, 0, 62, 16, 42, 52], // right to bottom
    [0, 72, -16, 62, -52, 42], // bottom to left
    [-72, 0, -62, -16, -42, -52], // left to top
  ];
  const endpoints: [number, number][] = [
    [0, -72],
    [72, 0],
    [0, 72],
    [-72, 0],
  ];

  for (let i = 0; i < spokes.length; i++) {
    const [sx, sy, cp1x, cp1y, cp2x, cp2y] = spokes[i]!;
    const [ex, ey] = endpoints[(i + 1) % 4]!;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, ex, ey);
    ctx.stroke();
  }

  // Center dot
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawText(
  ctx: CanvasRenderingContext2D,
  cx: number,
  textY: number,
  sloganY: number,
  fontSize: number,
  sloganSize: number
) {
  // "MIRACLE" light weight
  ctx.fillStyle = GOLD;
  ctx.font = `200 ${fontSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const miracleWidth = ctx.measureText("MIRACLE ").width;
  const mindWidth = ctx.measureText("MIND").width;

  // We need to position them side by side centered
  const totalWidth = miracleWidth + mindWidth;
  const startX = cx - totalWidth / 2;

  ctx.textAlign = "left";
  ctx.font = `200 ${fontSize}px sans-serif`;
  ctx.fillText("MIRACLE ", startX, textY);

  ctx.font = `700 ${fontSize}px sans-serif`;
  ctx.fillText("MIND", startX + miracleWidth, textY);

  // Slogan
  ctx.textAlign = "center";
  ctx.font = `300 ${sloganSize}px sans-serif`;
  ctx.fillStyle = GRAY;
  ctx.fillText("Technology Empowering Human Sovereignty", cx, sloganY);
}

interface Variant {
  name: string;
  width: number;
  height: number;
  starScale: number;
  starY: number;
  textY: number;
  sloganY: number;
  fontSize: number;
  sloganSize: number;
}

const variants: Variant[] = [
  {
    name: "og-default",
    width: 1200,
    height: 630,
    starScale: 1.6,
    starY: 240,
    textY: 440,
    sloganY: 490,
    fontSize: 52,
    sloganSize: 18,
  },
  {
    name: "og-twitter",
    width: 1200,
    height: 628,
    starScale: 1.6,
    starY: 238,
    textY: 438,
    sloganY: 488,
    fontSize: 52,
    sloganSize: 18,
  },
  {
    name: "og-square",
    width: 1200,
    height: 1200,
    starScale: 2.2,
    starY: 460,
    textY: 820,
    sloganY: 880,
    fontSize: 56,
    sloganSize: 20,
  },
  {
    name: "og-compact",
    width: 800,
    height: 418,
    starScale: 1.1,
    starY: 160,
    textY: 300,
    sloganY: 340,
    fontSize: 36,
    sloganSize: 13,
  },
];

for (const v of variants) {
  const canvas = createCanvas(v.width, v.height);
  const ctx = canvas.getContext("2d");

  // Black background
  ctx.fillStyle = BLACK;
  ctx.fillRect(0, 0, v.width, v.height);

  // Subtle radial glow behind star
  const glow = ctx.createRadialGradient(
    v.width / 2,
    v.starY,
    0,
    v.width / 2,
    v.starY,
    180 * v.starScale
  );
  glow.addColorStop(0, "rgba(212, 175, 55, 0.06)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, v.width, v.height);

  // Draw orbit star
  drawOrbitStar(ctx, v.width / 2, v.starY, v.starScale);

  // Draw text
  drawText(ctx, v.width / 2, v.textY, v.sloganY, v.fontSize, v.sloganSize);

  // Subtle border line at bottom
  ctx.strokeStyle = "rgba(212, 175, 55, 0.15)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, v.height - 1);
  ctx.lineTo(v.width, v.height - 1);
  ctx.stroke();

  const outPath = resolve("public/og", `${v.name}.png`);
  writeFileSync(outPath, canvas.toBuffer("image/png"));
  console.log(`✓ ${v.name}.png (${v.width}x${v.height})`);
}

console.log("\nAll OG image variants generated in public/og/");
