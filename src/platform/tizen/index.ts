import { fetchText } from '../shared/fetchText';
import type { PlatformAdapter } from '../types';
import { KEYS_TO_REGISTER, tizenRemoteKey } from './keys';
import type { SamsungGlobals } from './samsung';
import { read, tizenSystemInfo } from './systemInfo';

const samsung = () => window as SamsungGlobals;

export const platform: PlatformAdapter = {
  name: 'tizen',
  systemInfo: tizenSystemInfo,
  listenKeys(onKey) {
    // Without registering, the TV keeps CH±, media, color and number keys for itself.
    for (const keyName of KEYS_TO_REGISTER) read(() => samsung().tizen?.tvinputdevice?.registerKey?.(keyName));

    const onKeyDown = (event: KeyboardEvent) => {
      const key = tizenRemoteKey(event.keyCode);
      if (key) event.preventDefault();
      onKey({ key, raw: String(event.keyCode) });
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  },
  exit: () => read(() => samsung().tizen?.application?.getCurrentApplication?.().exit()),
  fetchText,
};
