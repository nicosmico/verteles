// Contracts every platform adapter implements (ADR-0005).
// The UI imports an adapter only through the `@platform` alias, resolved at build time.
import type { RemoteKey } from '../domain/remote/remoteKey';

export type PlatformName = 'web' | 'tizen';

export interface SystemInfo {
  platform: PlatformName;
  userAgent: string;
  chromium: string | null;
  tizen: string | null;
  /** Device model and firmware, when the platform reports them (TVs). */
  model: string | null;
  firmware: string | null;
  viewport: { width: number; height: number; pixelRatio: number };
}

/** A key press as the app sees it: the RemoteKey (null when unknown) and what the platform reported. */
export interface KeyPress {
  key: RemoteKey | null;
  raw: string;
}

/** Small key-value persistence for app state that must survive a restart. */
export interface Storage {
  get<T>(key: string): Promise<T | undefined>;
  set(key: string, value: unknown): Promise<void>;
  remove(key: string): Promise<void>;
}

export interface PlatformAdapter {
  name: PlatformName;
  systemInfo(): SystemInfo;
  /** Starts delivering key presses; returns a function that stops it. */
  listenKeys(onKey: (press: KeyPress) => void): () => void;
  /** Closes the app. A no-op where the platform cannot (a browser tab). */
  exit(): void;
  /** Opens the app's Storage. Rejects when the platform cannot persist (e.g. IndexedDB disabled). */
  openStorage(): Promise<Storage>;
  /** Downloads a text resource such as an M3U Lista. Rejects with HttpError on a non-2xx response. */
  fetchText(url: string): Promise<string>;
}
