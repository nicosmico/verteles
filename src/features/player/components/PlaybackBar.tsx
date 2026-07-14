import React from 'react';
import { ChevronUp, ChevronDown, Heart, RotateCcw } from 'lucide-react';
import type { ParsedChannel } from '../../playlist/types';
import LazyImage from '../../../shared/media/LazyImage';

interface PlaybackBarProps {
  channel: ParsedChannel;
  onReload: () => void;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  onPrevChannel: () => void;
  onNextChannel: () => void;
}

export const PlaybackBar: React.FC<PlaybackBarProps> = ({
  channel,
  onReload,
  isFavorite,
  onFavoriteToggle,
  onPrevChannel,
  onNextChannel,
}) => {
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 px-6 pb-6 transition-all duration-300">
      <div className="rounded-2xl bg-[#111111]/95 border border-bg-border backdrop-blur-xl px-5 py-4 2xl:px-8 2xl:py-6 shadow-2xl shadow-black/60">
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
                <ChevronUp className="h-6 w-6 2xl:h-8 2xl:w-8" />
              </button>
              
              <LazyImage
                src={channel.logo}
                alt={channel.name}
                fallbackColor={channel.fallbackColor}
                fallbackText={channel.fallbackText}
                className="grid h-12 w-12 2xl:h-16 2xl:w-16 place-items-center rounded-xl text-base 2xl:text-xl font-extrabold text-white shadow-md"
              />
              
              <button
                type="button"
                onClick={onNextChannel}
                className="text-tx-secondary hover:text-white transition-all outline-none p-0.5"
                title="Canal siguiente"
              >
                <ChevronDown className="h-6 w-6 2xl:h-8 2xl:w-8" />
              </button>
            </div>

            {/* Title, Category & Current program details */}
            <div className="flex flex-col justify-center min-w-0 flex-1 md:flex-initial">
              <div className="flex items-center gap-2">
                <h4 className="text-lg 2xl:text-2xl font-bold text-white leading-none truncate">
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
                    className={`h-4 w-4 2xl:h-5 2xl:w-5 transition-colors ${
                      isFavorite ? 'fill-amber-400 text-amber-400' : 'text-tx-secondary hover:text-white'
                    }`}
                  />
                </button>
              </div>
              
              {/* Program info hidden intentionally */}
            </div>
          </div>

          {/* Right part: Controls (Reload, resolution/aspect badges) */}
          <div className="flex items-center gap-3.5 w-full md:w-auto justify-end border-t border-bg-border pt-4 md:pt-0 md:border-none">
            <span className="rounded-md bg-[#222] border border-bg-border px-2.5 py-1 2xl:px-3 2xl:py-1.5 text-xs 2xl:text-sm font-semibold text-tx-secondary select-none">
              {channel.resolution || '1080p'}
            </span>
            
            <span className="rounded-md bg-accent-subtle border border-accent/20 px-2.5 py-1 2xl:px-3 2xl:py-1.5 text-xs 2xl:text-sm font-bold uppercase tracking-widest text-accent select-none">
              Fit
            </span>

            <div className="h-6 w-px bg-bg-border hidden sm:block" />

            {/* Reload Stream button */}
            <button
              type="button"
              onClick={onReload}
              className="w-9 h-9 2xl:w-11 2xl:h-11 rounded-xl flex items-center justify-center transition-all bg-bg-card hover:bg-bg-hover text-tx-secondary hover:text-white border border-bg-border active:scale-95 shrink-0 cursor-pointer"
              title="Recargar transmisión"
            >
              <RotateCcw className="h-4 w-4 2xl:h-5 2xl:w-5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PlaybackBar;
