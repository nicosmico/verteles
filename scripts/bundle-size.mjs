#!/usr/bin/env node
// Checks the size budget of the JavaScript a build loads on start (hypothesis H7).
// Usage: node scripts/bundle-size.mjs <buildDir> [budgetKiB]   (default budget: 60 KiB gzip)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

/** Raw and gzip size of each script `index.html` loads directly; lazily imported chunks are excluded. */
export function initialScriptSizes(buildDir) {
  const html = readFileSync(join(buildDir, 'index.html'), 'utf8');
  const files = [...html.matchAll(/<script[^>]*\ssrc="\.?\/?([^"$]+\.js)"/g)].map((match) => match[1]);
  return files.map((file) => {
    const content = readFileSync(join(buildDir, file));
    return { file, raw: content.length, gzip: gzipSync(content, { level: 9 }).length };
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [buildDir = 'dist', budgetKiB = '60'] = process.argv.slice(2);
  const budget = Number(budgetKiB) * 1024;
  const sizes = initialScriptSizes(buildDir);
  const total = sizes.reduce((sum, size) => sum + size.gzip, 0);
  for (const size of sizes) console.log(`${size.file}: ${(size.gzip / 1024).toFixed(1)} KiB gzip`);
  console.log(`${buildDir}: initial JS ${(total / 1024).toFixed(1)} KiB gzip (budget ${budgetKiB} KiB)`);
  if (total > budget) {
    console.error(`Over budget by ${((total - budget) / 1024).toFixed(1)} KiB.`);
    process.exit(1);
  }
}
