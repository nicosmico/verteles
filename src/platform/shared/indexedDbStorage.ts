import type { Storage } from '../types';

const DB_NAME = 'verteles';
const STORE = 'kv';

/** Key-value Storage on IndexedDB, shared by every Platform (ADR-0005). */
export async function openIndexedDbStorage(factory: IDBFactory): Promise<Storage> {
  const db = await request(
    (() => {
      const open = factory.open(DB_NAME, 1);
      open.onupgradeneeded = () => open.result.createObjectStore(STORE);
      return open;
    })(),
  );

  const store = (mode: IDBTransactionMode) => db.transaction(STORE, mode).objectStore(STORE);
  return {
    get: <T>(key: string) => request(store('readonly').get(key)) as Promise<T | undefined>,
    set: async (key, value) => void (await request(store('readwrite').put(value, key))),
    remove: async (key) => void (await request(store('readwrite').delete(key))),
  };
}

function request<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** The Storage of the running app, on the browser's own IndexedDB. */
export function openBrowserStorage(): Promise<Storage> {
  const factory = (window as { indexedDB?: IDBFactory }).indexedDB;
  if (!factory) return Promise.reject(new Error('IndexedDB is not available'));
  return openIndexedDbStorage(factory);
}
