#!/usr/bin/env node

/**
 * Utility to clear auth state and caches
 * Run this if you're experiencing auth issues
 *
 * Usage: node scripts/clear-auth-state.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

console.log('🧹 Clearing auth state and caches...\n');

// 1. Clear Next.js cache
console.log('1️⃣  Clearing Next.js cache (.next)...');
const nextDir = path.join(projectRoot, '.next');
if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log('   ✓ Cleared .next directory\n');
} else {
  console.log('   ℹ️  No .next directory found\n');
}

// 2. Clear node_modules cache
console.log('2️⃣  Clearing node_modules cache...');
const nodeModulesCache = path.join(projectRoot, 'node_modules', '.cache');
if (fs.existsSync(nodeModulesCache)) {
  fs.rmSync(nodeModulesCache, { recursive: true, force: true });
  console.log('   ✓ Cleared node_modules/.cache\n');
} else {
  console.log('   ℹ️  No node_modules/.cache found\n');
}

// 3. Instructions for browser cookies
console.log('3️⃣  Browser cookies (manual step):');
console.log('   📌 Open your browser DevTools (Cmd+Option+I on Mac)');
console.log('   📌 Go to: Application tab → Cookies → http://localhost:3000');
console.log('   📌 Delete all cookies starting with: sb-');
console.log('   📌 Refresh the page\n');

console.log('✅ Done! Restart your dev server:\n');
console.log('   npm run dev\n');
