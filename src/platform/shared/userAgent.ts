export interface UserAgentInfo {
  /** Full Chromium version, e.g. "85.0.4183.93". Null when the engine is not Chromium. */
  chromium: string | null;
  /** Tizen OS version, e.g. "6.5". Null outside Samsung TVs. */
  tizen: string | null;
}

export function describeUserAgent(userAgent: string): UserAgentInfo {
  const tizen = /Tizen (\d+(?:\.\d+)*)/.exec(userAgent)?.[1] ?? null;
  // Samsung TVs report the engine as "<chromium>/<tizen> TV" instead of "Chrome/<chromium>".
  const chromium =
    /Chrome\/(\d+(?:\.\d+)*)/.exec(userAgent)?.[1] ??
    /\s(\d+(?:\.\d+){3})\/[\d.]+ TV\b/.exec(userAgent)?.[1] ??
    null;
  return { chromium, tizen };
}
