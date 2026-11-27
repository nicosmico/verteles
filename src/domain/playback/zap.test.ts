import { describe, expect, it } from 'vitest';
import { zapIndex } from './zap';

describe('zapIndex', () => {
  it('moves to the next or previous Channel, wrapping at both ends', () => {
    expect(zapIndex({ count: 106, from: 0, step: 1 })).toBe(1);
    expect(zapIndex({ count: 106, from: 105, step: 1 })).toBe(0);
    expect(zapIndex({ count: 106, from: 0, step: -1 })).toBe(105);
  });
});
