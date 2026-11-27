export type BackOutcome = 'confirm' | 'exit';

/** "Press Back again to exit": a second Back within `windowMs` of the first exits the app. */
export function createExitGuard({ windowMs }: { windowMs: number }) {
  let confirmUntil = -Infinity;
  return {
    pressBack(now: number): BackOutcome {
      if (now <= confirmUntil) return 'exit';
      confirmUntil = now + windowMs;
      return 'confirm';
    },
  };
}
