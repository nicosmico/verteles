import type { PlatformAdapter } from '../types';
import { tizenSystemInfo } from './systemInfo';

export const platform: PlatformAdapter = {
  name: 'tizen',
  systemInfo: tizenSystemInfo,
};
