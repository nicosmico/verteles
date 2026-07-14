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
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0a0a0a] transition-all duration-300">
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 opacity-15 transition-all duration-1000 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${fallbackColor} 0%, transparent 70%)`,
        }}
      />
      <div className="relative flex flex-col items-center gap-6 z-10 animate-fade-in">
        <div className="relative flex items-center justify-center">
          {/* Pulsing glow shadow */}
          <div
            className="absolute -inset-6 rounded-full opacity-40 blur-2xl animate-pulse"
            style={{ backgroundColor: fallbackColor }}
          />
          {/* Spinning ring loader */}
          <div className="absolute -inset-3.5 rounded-[24px] border-[3px] border-t-white/80 border-r-white/10 border-b-white/10 border-l-white/10 animate-spin" />
          
          {/* Logo container using LazyImage */}
          <LazyImage
            src={logo}
            alt={channelName}
            fallbackColor={fallbackColor}
            fallbackText={fallbackText}
            className="relative h-24 w-24 rounded-2xl text-3xl font-extrabold text-white shadow-2xl flex items-center justify-center"
          />
        </div>
        
        <div className="relative text-center">
          <h3 className="text-xl font-bold tracking-tight text-white">{channelName}</h3>
          <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-white/40 animate-pulse">
            Conectando...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
