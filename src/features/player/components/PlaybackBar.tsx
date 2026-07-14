import React from 'react';
import { ChevronUp, ChevronDown, Heart, RotateCcw, Play, Pause } from 'lucide-react';
import type { ParsedChannel } from '../../playlist/types';
import LazyImage from '../../../shared/media/LazyImage';

interface PlaybackBarProps {
  channel: ParsedChannel;
  isPlaying: boolean;
  onPlayPauseToggle: () => void;
  onReload: () => void;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  onPrevChannel: () => void;
  onNextChannel: () => void;
}

export const PlaybackBar: React.FC<PlaybackBarProps> = ({
  channel,
  isPlaying,
  onPlayPauseToggle,
  onReload,
  isFavorite,
  onFavoriteToggle,
  onPrevChannel,
  onNextChannel,
}) => {
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 px-6 pb-6 transition-all duration-300">
      <div className="rounded-2xl bg-[#111111]/95 border border-bg-border backdrop-blur-xl p-5 shadow-2xl shadow-black/60">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Channel info and simple zapping control */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Zapping arrows */}
            <div className="flex flex-col items-center select-none shrink-0">
              <button
                type="button"
                onClick={onPrevChannel}
                className="text-tx-secondary hover:text-white transition-all outline-none p-0.5"
                title="Canal anterior"
              >
                <ChevronUp className="h-6 w-6" />
              </button>
              
              <LazyImage
                src={channel.logo}
                alt={channel.name}
                fallbackColor={channel.fallbackColor}
                fallbackText={channel.fallbackText}
                className="grid h-12 w-12 place-items-center rounded-xl text-lg font-extrabold text-white shadow-md"
              />
              
              <button
                type="button"
                onClick={onNextChannel}
                className="text-tx-secondary hover:text-white transition-all outline-none p-0.5"
                title="Canal siguiente"
              >
                <ChevronDown className="h-6 w-6" />
              </button>
            </div>

            {/* Title, Category & Current program details */}
            <div className="flex flex-col justify-center min-w-0 flex-1 md:flex-initial">
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold text-white leading-none truncate">
                  {channel.name}
                </h4>
                
                {/* Favorite Heart Badge */}
                <button
                  type="button"
                  onClick={onFavoriteToggle}
                  className={`rounded-full p-1 outline-none transition-all hover:scale-115 active:scale-90 cursor-pointer`}
                  title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      isFavorite ? 'fill-amber-400 text-amber-400' : 'text-tx-secondary hover:text-white'
                    }`}
                  />
                </button>
              </div>
              
              {channel.program ? (
                <div className="mt-2 text-sm text-tx-secondary flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
                  <span className="font-semibold text-white/80 truncate max-w-[200px]">
                    {channel.program.title}
                  </span>
                  <span className="hidden sm:inline text-white/20">•</span>
                  <span className="tabular-nums text-xs">
                    {channel.program.start} – {channel.program.end}
                  </span>
                  
                  {/* Progress bar visual for program */}
                  <div className="w-24 h-1 bg-[#222] rounded-full overflow-hidden shrink-0 mt-1 sm:mt-0 sm:ml-1">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${channel.program.progress * 100}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className="mt-1 text-xs text-tx-secondary">Programación regular</p>
              )}
            </div>
          </div>

          {/* Right part: Playback Controls (Play/Pause, Reload, Aspect/Res badge) */}
          <div className="flex items-center gap-3.5 w-full md:w-auto justify-end border-t border-bg-border pt-4 md:pt-0 md:border-none">
            <span className="rounded-md bg-[#222] border border-bg-border px-2.5 py-1 text-[11px] font-semibold text-tx-secondary select-none">
              {channel.resolution || '1080p'}
            </span>
            
            <span className="rounded-md bg-accent-subtle border border-accent/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-accent select-none">
              Fit
            </span>

            <div className="h-6 w-px bg-bg-border hidden sm:block" />

            {/* Play/Pause control */}
            <button
              type="button"
              onClick={onPlayPauseToggle}
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-all bg-white hover:bg-neutral-200 text-neutral-950 active:scale-95 shrink-0 shadow-lg cursor-pointer"
              title={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
            </button>

            {/* Reload Stream button */}
            <button
              type="button"
              onClick={onReload}
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-all bg-bg-card hover:bg-bg-hover text-tx-secondary hover:text-white border border-bg-border active:scale-95 shrink-0 cursor-pointer"
              title="Recargar transmisión"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PlaybackBar;
