import React from 'react';
import LazyImage from '../../../shared/media/LazyImage';

interface ClickToPlayOverlayProps {
  channelName: string;
  logo?: string;
  fallbackColor?: string;
  fallbackText?: string;
  onPlay: () => void;
}

export const ClickToPlayOverlay: React.FC<ClickToPlayOverlayProps> = ({
  channelName,
  logo,
  fallbackColor = '#2563eb',
  fallbackText = '?',
  onPlay,
}) => {
  return (
    <div className="absolute inset-0 z-11 flex flex-col items-center justify-center bg-[#0a0a0a]">
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at center, ${fallbackColor} 0%, transparent 70%)`,
        }}
      />

      <div className="relative flex flex-col items-center gap-8 z-10 animate-fade-in">
        {/* Channel logo */}
        <div className="relative flex items-center justify-center">
          <div
            className="absolute -inset-6 rounded-full opacity-30 blur-3xl"
            style={{ backgroundColor: fallbackColor }}
          />
          <LazyImage
            src={logo}
            alt={channelName}
            fallbackColor={fallbackColor}
            fallbackText={fallbackText}
            className="relative h-24 w-24 rounded-2xl text-3xl font-extrabold text-white shadow-2xl flex items-center justify-center"
          />
        </div>

        {/* Channel name */}
        <div className="text-center">
          <h3 className="text-2xl font-bold tracking-tight text-white">{channelName}</h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-white/40">
            EN VIVO
          </p>
        </div>

        {/* Play button */}
        <button
          id="click-to-play-btn"
          onClick={onPlay}
          className="group relative flex items-center gap-3 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1.5px solid rgba(255,255,255,0.18)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: `0 0 32px 0 ${fallbackColor}40, 0 4px 24px rgba(0,0,0,0.4)`,
          }}
        >
          {/* Glow hover layer */}
          <span
            className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient(circle at center, ${fallbackColor}30 0%, transparent 70%)`,
            }}
          />

          {/* Play icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5"
          >
            <path d="M8 5v14l11-7z" />
          </svg>

          <span className="relative">Reproducir</span>
        </button>
      </div>
    </div>
  );
};

export default ClickToPlayOverlay;
