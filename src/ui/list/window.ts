/** First visible row after moving focus, scrolling as little as possible to keep `focused` in view. */
export function scrollToShow({ focused, first, visibleRows }: { focused: number; first: number; visibleRows: number }): number {
  if (focused < first) return focused;
  if (focused >= first + visibleRows) return focused - visibleRows + 1;
  return first;
}

/** Rows to keep in the DOM: the visible ones plus `overscan` on each side. `to` is exclusive. */
export function renderedRange(options: { first: number; visibleRows: number; overscan: number; count: number }) {
  const { first, visibleRows, overscan, count } = options;
  return { from: Math.max(first - overscan, 0), to: Math.min(first + visibleRows + overscan, count) };
}
