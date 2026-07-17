import React, { useState } from 'react';
import { Search, Star, Settings, ChevronRight, Tv2, PanelLeftClose } from 'lucide-react';
import { usePlaylistStore } from '../../features/playlist/store/usePlaylistStore';
import ChannelItem from '../../features/playlist/components/ChannelItem';

interface SidebarProps {
  onClose: () => void;
  onListClick: () => void;
  onSettingsClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onClose,
  onListClick,
  onSettingsClick,
}) => {
  const {
    channels,
    currentChannel,
    favorites,
    setCurrentChannel,
  } = usePlaylistStore();

  // Local UI States for searching & categories
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Todos', 'Favoritos'];

  // Filter channels in memory based on activeCategory and searchQuery
  const filteredChannels = channels.filter((ch) => {
    // 1. Group / Category filter
    if (activeCategory === 'Favoritos') {
      if (!favorites.includes(ch.id)) return false;
    }

    // 2. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return ch.name.toLowerCase().includes(q) || (ch.group && ch.group.toLowerCase().includes(q));
    }

    return true;
  });

  return (
    <div className="flex h-full w-[380px] flex-col bg-[#111111] border-r border-bg-border focus:outline-none">
      
      {/* Header Panel */}
      <div className="border-b border-bg-border px-4 pt-4 pb-0">
        
        {/* List Selector button & Close button */}
        <div className="flex items-center gap-2 mb-3">
          <button
            type="button"
            onClick={onListClick}
            className="flex flex-1 items-center gap-3 rounded-xl bg-bg-card px-4 py-3 text-left transition-all outline-none border border-bg-border/30 hover:bg-bg-hover hover:border-bg-border cursor-pointer group"
          >
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent shrink-0 text-white">
              <Tv2 className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate group-hover:text-accent transition-colors">
                Mi lista principal
              </p>
              <p className="text-[11px] text-tx-secondary">{channels.length} canales</p>
            </div>
            <ChevronRight className="h-4 w-4 text-tx-muted shrink-0" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-xl bg-bg-card border border-bg-border/30 text-tx-secondary transition-all outline-none hover:bg-bg-hover hover:text-white hover:border-bg-border cursor-pointer"
            title="Cerrar menú"
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>
        </div>

        {/* Categories Tab Selector & Settings Button */}
        <div className="flex items-center gap-1 pb-0 overflow-x-auto scrollbar-none">
          <div className="flex gap-1 overflow-x-auto scrollbar-none flex-1 max-w-[280px]">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1 rounded-t-lg px-3 py-2 text-xs font-semibold transition-all border-b-2 outline-none cursor-pointer shrink-0 ${
                    isActive
                      ? 'border-accent text-white'
                      : 'border-transparent text-tx-secondary hover:text-white'
                  }`}
                >
                  {cat === 'Todos' && <Tv2 className="h-3 w-3 shrink-0" />}
                  {cat === 'Favoritos' && <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />}
                  {cat}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onSettingsClick}
            className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-tx-secondary transition-all outline-none hover:bg-bg-hover hover:text-white cursor-pointer"
            title="Configuración"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>

      </div>

      {/* Search Input Bar */}
      <div className="px-4 py-3 border-b border-bg-border">
        <div className="flex items-center gap-2.5 rounded-xl bg-bg-card border border-bg-border/50 px-3.5 py-2 hover:border-bg-border focus-within:border-accent transition-all">
          <Search className="h-4 w-4 text-tx-muted shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar canal..."
            className="w-full bg-transparent text-sm text-white placeholder:text-tx-muted focus:outline-none"
          />
        </div>
      </div>

      {/* Channel Grid List */}
      <div className="flex-1 overflow-y-auto py-2 pb-4">
        {filteredChannels.map((ch) => {
          const isCurrent = currentChannel ? ch.id === currentChannel.id : false;
          const isFav = favorites.includes(ch.id);
          return (
            <ChannelItem
              key={ch.id}
              channel={ch}
              isCurrent={isCurrent}
              isFav={isFav}
              onSelect={(selectedCh) => {
                setCurrentChannel(selectedCh);
                onClose(); // Auto-close sidebar on channel select for TV layout
              }}
            />
          );
        })}

        {filteredChannels.length === 0 && (
          <div className="px-4 py-12 text-center">
            <p className="text-sm text-tx-secondary">Sin canales disponibles</p>
            <p className="text-xs text-tx-muted mt-1">Intenta cambiar la categoría o búsqueda</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Sidebar;
