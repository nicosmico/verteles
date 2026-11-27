import type { PlatformName, SystemInfo } from '../types';
import { describeUserAgent } from './userAgent';

export function browserSystemInfo(platform: PlatformName): SystemInfo {
  const userAgent = navigator.userAgent;
  return {
    platform,
    userAgent,
    ...describeUserAgent(userAgent),
    viewport: { width: window.innerWidth, height: window.innerHeight, pixelRatio: window.devicePixelRatio },
  };
}
