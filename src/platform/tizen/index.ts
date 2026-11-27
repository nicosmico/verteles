import { browserSystemInfo } from '../shared/browserSystemInfo';
import type { PlatformAdapter } from '../types';

// Ticket 02 adds model and firmware from Samsung's product info API.
export const platform: PlatformAdapter = {
  name: 'tizen',
  systemInfo: () => browserSystemInfo('tizen'),
};
