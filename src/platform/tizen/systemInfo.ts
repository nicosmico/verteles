import { browserSystemInfo } from '../shared/browserSystemInfo';
import type { SystemInfo } from '../types';
import type { SamsungGlobals } from './samsung';

const PLATFORM_VERSION = 'http://tizen.org/feature/platform.version';

export function tizenSystemInfo(): SystemInfo {
  const base = browserSystemInfo('tizen');
  const { webapis, tizen } = window as SamsungGlobals;

  const platformVersion = read(() => tizen?.systeminfo?.getCapability?.(PLATFORM_VERSION));
  return {
    ...base,
    // The platform API is authoritative; the user agent is only a fallback.
    tizen: typeof platformVersion === 'string' ? platformVersion : base.tizen,
    model: asText(read(() => webapis?.productinfo?.getRealModel?.())),
    firmware: asText(read(() => webapis?.productinfo?.getFirmware?.())),
  };
}

/** Samsung APIs throw when a privilege is missing; a missing value is not an error here. */
export function read<T>(get: () => T): T | undefined {
  try {
    return get();
  } catch {
    return undefined;
  }
}

function asText(value: unknown): string | null {
  return typeof value === 'string' && value !== '' ? value : null;
}
