import { create } from 'zustand';
import type { ParsedChannel } from '../types';
import { MOCK_CHANNELS } from '../mocks/channels';

interface PlaylistState {
  channels: ParsedChannel[];
  currentChannel: ParsedChannel | null;
  favorites: string[]; // List of channel IDs marked as favorites
  
  setCurrentChannel: (channel: ParsedChannel | null) => void;
  toggleFavorite: (channelId: string) => void;
  goToNextChannel: () => void;
  goToPreviousChannel: () => void;
}

export const usePlaylistStore = create<PlaylistState>((set, get) => {
  const shiftChannel = (step: number) => {
    const { channels, currentChannel } = get();
    if (channels.length === 0) return;

    let index = -1;
    if (currentChannel) {
      index = channels.findIndex((c) => c.id === currentChannel.id);
    }

    if (index === -1) {
      set({ currentChannel: channels[0] });
      return;
    }

    index = (index + step + channels.length) % channels.length;
    set({ currentChannel: channels[index] });
  };

  return {
    channels: MOCK_CHANNELS,
    currentChannel: MOCK_CHANNELS[0] || null,
    favorites: [],

    setCurrentChannel: (channel) => {
      set({ currentChannel: channel });
    },

    toggleFavorite: (channelId) => {
      set((state) => {
        const isFav = state.favorites.includes(channelId);
        const nextFavorites = isFav
          ? state.favorites.filter((id) => id !== channelId)
          : [...state.favorites, channelId];
        return { favorites: nextFavorites };
      });
    },

    goToNextChannel: () => shiftChannel(1),
    goToPreviousChannel: () => shiftChannel(-1),
  };
});
