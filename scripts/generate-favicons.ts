import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const PUBLIC_DIR = join(process.cwd(), 'public');
const BRAND_DIR = join(PUBLIC_DIR, 'brand');
const SVG_PATH = join(BRAND_DIR, 'miracle-mind-orbit-star-v3.svg');

async function generateFavicons() {
  console.log('Generating favicons from miracle-mind-orbit-star-v3.svg...');

  const svgBuffer = readFileSync(SVG_PATH);

  // Generate various PNG sizes for different use cases
  const sizes = [
    { size: 16, name: 'favicon-16x16.png' },
    { size: 32, name: 'favicon-32x32.png' },
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 192, name: 'android-chrome-192x192.png' },
    { size: 512, name: 'android-chrome-512x512.png' },
  ];

  for (const { size, name } of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(PUBLIC_DIR, name));
    console.log(`✓ Generated ${name}`);
  }

  // Generate ICO file (32x32 is standard)
  const icoBuffer = await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toBuffer();

  // ICO format is just a PNG with different header for simple cases
  // For a proper ICO, we'd need a library, but modern browsers accept PNG as .ico
  writeFileSync(join(PUBLIC_DIR, 'favicon.ico'), icoBuffer);
  console.log('✓ Generated favicon.ico');

  // Generate a 1200x630 OG image (social media preview)
  await sharp(svgBuffer)
    .resize(1200, 630, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .png()
    .toFile(join(PUBLIC_DIR, 'og-image.png'));
  console.log('✓ Generated og-image.png');

  console.log('All favicons generated successfully!');
}

generateFavicons().catch(console.error);
