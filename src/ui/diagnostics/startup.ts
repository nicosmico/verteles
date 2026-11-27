/**
 * Time from navigation start to the first frame painted after the app rendered
 * (hypothesis H7). Two animation frames: the first is scheduled before paint,
 * the second runs once that paint has happened. On a TV, the time the system
 * spends launching the app before navigation starts is not included.
 */
export function measureStartup(): Promise<number> {
  return new Promise((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve(Math.round(performance.now())))),
  );
}
