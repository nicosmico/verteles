import { describe, expect, it } from 'vitest';
import { median } from './median';

describe('median', () => {
  it('is the middle value, or the mean of the two middle values', () => {
    expect(median([900, 1500, 1100])).toBe(1100);
    expect(median([1000, 1400, 1200, 1100])).toBe(1150);
  });

  it('is null without samples', () => {
    expect(median([])).toBeNull();
  });
});
