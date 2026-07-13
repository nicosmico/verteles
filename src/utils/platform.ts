/**
 * Detects if the current running platform is Samsung Tizen OS.
 */
export const isTizen = (): boolean => {
  return typeof window !== 'undefined' && (
    (window as any).tizen !== undefined || 
    (window as any).webapis !== undefined
  );
};

/**
 * Returns a proxied URL for local web development to bypass CORS restrictions.
 * In production or on Tizen OS, it returns the URL unchanged.
 */
export const getProxiedUrl = (url: string): string => {
  if (typeof window !== 'undefined' && !isTizen() && import.meta.env.DEV) {
    // Vite server proxy is configured to catch `/proxy/http...`
    return `/proxy/${url}`;
  }
  return url;
};
