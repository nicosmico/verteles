import React, { useState, useEffect, useRef } from 'react';

// Timeout in ms before forcing fallback for images that never fire onLoad/onError
const LOAD_TIMEOUT_MS = 8000;

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
  const [isLoading, setIsLoading] = useState(!!src);
  const [hasError, setHasError] = useState(!src);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Reset states and start safety timeout when source changes
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (src) {
      setIsLoading(true);
      setHasError(false);

      // Safety net: if the image neither loads nor errors within the timeout, force fallback
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        setHasError(true);
      }, LOAD_TIMEOUT_MS);
    } else {
      setIsLoading(false);
      setHasError(true);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [src]);

  // Handle the race condition where a cached image fires onLoad BEFORE React
  // attaches the handler — in that case naturalWidth > 0 but isLoading stays true.
  useEffect(() => {
    if (!isLoading) return;
    const img = imgRef.current;
    if (img && img.complete) {
      if (img.naturalWidth > 0) {
        // Image already loaded from cache
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsLoading(false);
        setHasError(false);
      } else if (img.naturalWidth === 0 && img.src) {
        // Image finished but with an error
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsLoading(false);
        setHasError(true);
      }
    }
  });

  const handleLoad = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsLoading(false);
    setHasError(true);
  };

  // If there's no source or there was an error loading the image, show initials fallback
  if (hasError || !src) {
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
      {/* Loading state - Shimmer placeholder */}
      {isLoading && (
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
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
};

export default LazyImage;
