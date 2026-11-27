import type { Storage } from '../../platform/types';

/** Counts this launch and returns the total (hypothesis H6 of phase 0). */
export async function recordLaunch(storage: Storage): Promise<number> {
  const launches = ((await storage.get<number>('launches')) ?? 0) + 1;
  await storage.set('launches', launches);
  return launches;
}
