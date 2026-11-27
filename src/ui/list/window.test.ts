import { describe, expect, it } from 'vitest';
import { renderedRange, scrollToShow } from './window';

describe('scrollToShow', () => {
  it('keeps the list still while the focused row is visible', () => {
    expect(scrollToShow({ focused: 5, first: 0, visibleRows: 10 })).toBe(0);
  });

  it('scrolls just enough to bring the focused row into view', () => {
    expect(scrollToShow({ focused: 10, first: 0, visibleRows: 10 })).toBe(1);
    expect(scrollToShow({ focused: 3, first: 8, visibleRows: 10 })).toBe(3);
  });
});

describe('renderedRange', () => {
  it('covers the visible rows plus an overscan margin, within the list', () => {
    expect(renderedRange({ first: 0, visibleRows: 10, overscan: 3, count: 2000 })).toEqual({ from: 0, to: 13 });
    expect(renderedRange({ first: 500, visibleRows: 10, overscan: 3, count: 2000 })).toEqual({ from: 497, to: 513 });
    expect(renderedRange({ first: 1990, visibleRows: 10, overscan: 3, count: 2000 })).toEqual({ from: 1987, to: 2000 });
  });
});
