import { create } from 'zustand';
import type { ParsedChannel } from '../types';
import { fetchAndParseM3U } from '../services/m3uParser';

// Default playlist to load on app start (rules §3)
// jsDelivr serves with CORS headers — works directly in the browser without a proxy.
const DEFAULT_PLAYLIST_URL =
  'https://cdn.jsdelivr.net/gh/Alplox/json-teles@refs/heads/main/channels.m3u';

// ─── State shape ────────────────────────────────────────────────────────────

interface PlaylistState {
  /** All channels loaded from the active playlist */
  channels: ParsedChannel[];
  /** Currently selected / playing channel */
  currentChannel: ParsedChannel | null;
  /** IDs of channels marked as favourites */
  favorites: string[];
  /** Whether a playlist fetch is in progress */
  isLoadingPlaylist: boolean;
  /** Last playlist fetch error message, or null */
  playlistError: string | null;

  // ── Actions ──
  loadDefaultPlaylist: () => Promise<void>;
  setCurrentChannel: (channel: ParsedChannel | null) => void;
  toggleFavorite: (channelId: string) => void;
  goToNextChannel: () => void;
  goToPreviousChannel: () => void;
}

// ─── Store ──────────────────────────────────────────────────────────────────

export const usePlaylistStore = create<PlaylistState>((set, get) => {
  // Shared helper — shifts currentChannel by `step` positions in the list
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
    channels: [],
    currentChannel: null,
    favorites: [],
    isLoadingPlaylist: false,
    playlistError: null,

    loadDefaultPlaylist: async () => {
      set({ isLoadingPlaylist: true, playlistError: null });
      try {
        const channels = await fetchAndParseM3U(DEFAULT_PLAYLIST_URL);
        set({
          channels,
          // Auto-select the first channel so playback can start immediately
          currentChannel: channels[0] ?? null,
          isLoadingPlaylist: false,
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Unknown error loading playlist';
        console.error('[PlaylistStore] loadDefaultPlaylist failed:', message);
        set({ isLoadingPlaylist: false, playlistError: message });
      }
    },

    setCurrentChannel: (channel) => set({ currentChannel: channel }),

    toggleFavorite: (channelId) =>
      set((state) => {
        const isFav = state.favorites.includes(channelId);
        return {
          favorites: isFav
            ? state.favorites.filter((id) => id !== channelId)
            : [...state.favorites, channelId],
        };
      }),

    goToNextChannel: () => shiftChannel(1),
    goToPreviousChannel: () => shiftChannel(-1),
  };
});
