import React, { useState, useEffect } from 'react';

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

  // Reset states if source changes
  useEffect(() => {
    setIsLoading(!!src);
    setHasError(!src);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
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
        src={src}
        alt={alt}
        loading="lazy"
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
