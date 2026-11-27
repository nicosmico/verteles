// Contracts every platform adapter implements (ADR-0005).
// The UI imports an adapter only through the `@platform` alias, resolved at build time.

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

export interface PlatformAdapter {
  name: PlatformName;
  systemInfo(): SystemInfo;
}
