import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { initialScriptSizes } from './bundle-size.mjs';

function fakeBuild(html: string, files: Record<string, string>) {
  const dir = mkdtempSync(join(tmpdir(), 'bundle-'));
  mkdirSync(join(dir, 'assets'));
  writeFileSync(join(dir, 'index.html'), html);
  for (const [name, content] of Object.entries(files)) writeFileSync(join(dir, name), content);
  return dir;
}

describe('initialScriptSizes', () => {
  it('measures the gzip size of the scripts index.html loads, ignoring lazy chunks', () => {
    const dir = fakeBuild('<script type="module" crossorigin src="./assets/index-abc.js"></script>', {
      'assets/index-abc.js': 'a'.repeat(10_000),
      'assets/hls-lazy.js': 'b'.repeat(50_000),
    });

    const sizes = initialScriptSizes(dir);

    expect(sizes.map((s) => s.file)).toEqual(['assets/index-abc.js']);
    expect(sizes[0]?.raw).toBe(10_000);
    expect(sizes[0]?.gzip).toBeLessThan(200); // 10 KB of one repeated byte compresses to almost nothing.
  });
});
