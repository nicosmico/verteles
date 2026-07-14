/**
 * Detects if the current running platform is Samsung Tizen OS.
 */
export const isTizen = (): boolean => {
  return typeof window !== 'undefined' && (
    (window as any).tizen !== undefined || 
    (window as any).webapis !== undefined
  );
};

export const getProxiedUrl = (url: string): string => {
  if (typeof window !== 'undefined' && !isTizen() && import.meta.env.DEV) {
    // For the default playlist, serve the local static file to prevent proxy/CORS connection errors
    if (url.includes('json-teles') && url.endsWith('.m3u')) {
      return '/channels.m3u';
    }
    // Vite server proxy catches other URLs
    return `/proxy/${url}`;
  }
  return url;
};
