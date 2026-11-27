import { IDBFactory } from 'fake-indexeddb';
import { describe, expect, it } from 'vitest';
import { openIndexedDbStorage } from './indexedDbStorage';

describe('IndexedDB storage', () => {
  it('reads back what it stored', async () => {
    const storage = await openIndexedDbStorage(new IDBFactory());

    await storage.set('lastChannel', { key: 'tvn [cl]', number: 7 });

    expect(await storage.get('lastChannel')).toEqual({ key: 'tvn [cl]', number: 7 });
  });

  it('keeps values across app restarts and forgets removed ones', async () => {
    const indexedDB = new IDBFactory();
    const firstRun = await openIndexedDbStorage(indexedDB);
    await firstRun.set('launches', 3);
    await firstRun.set('lastChannel', 'tvn [cl]');
    await firstRun.remove('lastChannel');

    const secondRun = await openIndexedDbStorage(indexedDB);

    expect(await secondRun.get('launches')).toBe(3);
    expect(await secondRun.get('lastChannel')).toBeUndefined();
  });
});
