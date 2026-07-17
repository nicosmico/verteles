import React from 'react';
import LazyImage from '../../../shared/media/LazyImage';

interface LoadingOverlayProps {
  channelName: string;
  logo?: string;
  fallbackColor?: string;
  fallbackText?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  channelName,
  logo,
  fallbackColor = '#2563eb',
  fallbackText = '?',
}) => {
  return (
    <div className="absolute inset-0 z-11 flex flex-col items-center justify-center bg-[#0a0a0a]">
      {/* Static ambient glow */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${fallbackColor} 0%, transparent 65%)`,
        }}
      />

      <div className="relative flex flex-col items-center gap-5 z-10">
        {/* Bouncing logo — single translateY, compositor-friendly */}
        <LazyImage
          src={logo}
          alt={channelName}
          fallbackColor={fallbackColor}
          fallbackText={fallbackText}
          className="h-20 w-20 rounded-2xl text-2xl font-extrabold text-white shadow-lg flex items-center justify-center animate-bounce"
        />

        <div className="text-center">
          <h3 className="text-lg font-semibold tracking-tight text-white">{channelName}</h3>
          <p className="mt-1 text-xs font-medium uppercase tracking-widest text-white/40">
            Conectando...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
