import { describe, expect, it } from 'vitest';
import { describeUserAgent } from './userAgent';

describe('describeUserAgent', () => {
  it('reads the Chromium version from a desktop Chrome user agent', () => {
    const ua =
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.71 Safari/537.36';

    expect(describeUserAgent(ua)).toEqual({ chromium: '120.0.6099.71', tizen: null });
  });

  it('reads the Chromium and Tizen versions from a Samsung TV user agent, which has no Chrome/ token', () => {
    const ua =
      'Mozilla/5.0 (SMART-TV; LINUX; Tizen 6.5) AppleWebKit/537.36 (KHTML, like Gecko) 85.0.4183.93/6.5 TV Safari/537.36';

    expect(describeUserAgent(ua)).toEqual({ chromium: '85.0.4183.93', tizen: '6.5' });
  });
});
