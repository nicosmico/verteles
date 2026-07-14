import React from 'react';
import { Star } from 'lucide-react';
import type { ParsedChannel } from '../types';
import LazyImage from '../../../shared/media/LazyImage';

interface ChannelItemProps {
  channel: ParsedChannel;
  isCurrent: boolean;
  isFav: boolean;
  onSelect: (channel: ParsedChannel) => void;
}

export const ChannelItem: React.FC<ChannelItemProps> = ({
  channel,
  isCurrent,
  isFav,
  onSelect,
}) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(channel)}
      className={`group flex w-full items-center gap-3.5 px-4 py-3 text-left transition-all outline-none border-l-2 ${
        isCurrent
          ? 'bg-[#1e1e1e] border-accent'
          : 'border-transparent hover:bg-bg-card focus:bg-bg-card'
      }`}
    >
      {/* Logo using LazyImage with robust fallback */}
      <LazyImage
        src={channel.logo}
        alt={channel.name}
        fallbackColor={channel.fallbackColor}
        fallbackText={channel.fallbackText}
        className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg text-sm font-bold text-white shadow-sm"
      />

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 mb-0.5">
          <p className="truncate text-sm font-semibold text-white group-hover:text-accent group-focus:text-accent transition-colors">
            {channel.name}
          </p>
          {isFav && <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />}
        </div>
        <p className="truncate text-xs text-tx-secondary leading-snug">
          {channel.program ? channel.program.title : 'Programación Regular'}
        </p>

      </div>

      {/* Playing state visual indicator (equalizer) */}
      {isCurrent && (
        <div className="flex items-end gap-[3px] shrink-0 mr-1 h-3.5">
          <span className="w-[3px] rounded-full bg-accent animate-[bounce_0.6s_0s_infinite_alternate] h-2" />
          <span className="w-[3px] rounded-full bg-accent animate-[bounce_0.6s_0.2s_infinite_alternate] h-3.5" />
          <span className="w-[3px] rounded-full bg-accent animate-[bounce_0.6s_0.4s_infinite_alternate] h-2.5" />
        </div>
      )}
    </button>
  );
};

export default ChannelItem;
