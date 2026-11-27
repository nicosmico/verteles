/** Index of the Channel reached by Zapping `step` positions from `from`, wrapping around the Lista. */
export function zapIndex({ count, from, step }: { count: number; from: number; step: 1 | -1 }): number {
  return (((from + step) % count) + count) % count;
}
