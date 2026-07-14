import React, { useState, useEffect, useRef, useCallback } from 'react';

// Safety timeout before forcing fallback for images that never fire onLoad/onError
const LOAD_TIMEOUT_MS = 8000;

// Single status enum avoids two separate setState calls (= two re-renders)
type ImageStatus = 'loading' | 'loaded' | 'error';

interface LazyImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackColor?: string;
  fallbackText?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  fallbackColor = '#333',
  fallbackText = '?',
}) => {
  const [status, setStatus] = useState<ImageStatus>(src ? 'loading' : 'error');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Reset status and arm safety timeout whenever the source changes
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!src) {
      setStatus('error');
      return;
    }

    setStatus('loading');

    // Safety net: force fallback if neither onLoad nor onError fires in time
    timeoutRef.current = setTimeout(() => setStatus('error'), LOAD_TIMEOUT_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [src]);

  // Resolve cached-image race condition: onLoad may fire before React attaches
  // the handler. Only runs once after the img element mounts (empty dep array).
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    if (img.complete) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setStatus(img.naturalWidth > 0 ? 'loaded' : 'error');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — only needs to run once on mount

  // Stable callbacks — won't cause unnecessary child re-renders
  const handleLoad = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setStatus('loaded');
  }, []);

  const handleError = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setStatus('error');
  }, []);

  if (status === 'error' || !src) {
    return (
      <div
        className={`flex items-center justify-center font-bold text-white select-none ${className}`}
        style={{ backgroundColor: fallbackColor }}
      >
        <span className="text-sm tracking-wider">{fallbackText}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Shimmer visible only while loading */}
      {status === 'loading' && (
        <div className="absolute inset-0 bg-[#222] animate-pulse flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          status === 'loading' ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
};

export default LazyImage;
