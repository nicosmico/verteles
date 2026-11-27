import { browserSystemInfo } from '../shared/browserSystemInfo';
import type { PlatformAdapter } from '../types';

export const platform: PlatformAdapter = {
  name: 'web',
  systemInfo: () => browserSystemInfo('web'),
};
