/**
 * Convert SVG logos to PNG for node-canvas
 * Run with: node scripts/convert-logos-to-png.js
 */

import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, "..", "public", "brand");

async function convertLogos() {
  console.log("Converting SVG logos to PNG...\n");

  const logos = [
    { input: "miracle-mind-logo-color.svg", output: "miracle-mind-logo-color.png" },
    { input: "miracle-mind-logo-white.svg", output: "miracle-mind-logo-white.png" },
    { input: "miracle-mind-logo-black.svg", output: "miracle-mind-logo-black.png" },
  ];

  for (const logo of logos) {
    const inputPath = join(publicDir, logo.input);
    const outputPath = join(publicDir, logo.output);

    try {
      await sharp(inputPath)
        .resize({ width: 800, height: 200, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toFile(outputPath);

      console.log(`✅ Converted ${logo.input} -> ${logo.output}`);
    } catch (error) {
      console.error(`❌ Error converting ${logo.input}:`, error.message);
    }
  }

  console.log("\n✅ All logos converted!");
}

convertLogos();
