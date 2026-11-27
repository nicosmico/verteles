import { browserSystemInfo } from '../shared/browserSystemInfo';
import { fetchText } from '../shared/fetchText';
import { openBrowserStorage } from '../shared/indexedDbStorage';
import type { PlatformAdapter } from '../types';
import { webRemoteKey } from './keys';
import { createWebPlayer } from './player';

export const platform: PlatformAdapter = {
  name: 'web',
  systemInfo: () => browserSystemInfo('web'),
  listenKeys(onKey) {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = webRemoteKey(event.key);
      // Keys the remote has belong to the app (F1–F4 would otherwise open browser UI).
      if (key) event.preventDefault();
      onKey({ key, raw: event.key });
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  },
  // A page cannot close its own tab.
  exit: () => {},
  fetchText,
  createPlayer: createWebPlayer,
  openStorage: openBrowserStorage,
};
