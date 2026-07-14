import { create } from 'zustand';

interface PlayerState {
  isPlaying: boolean;
  isBuffering: boolean;
  hasDrifted: boolean; // true when the user paused and resumed (behind the live edge)
  errorMsg: string | null;
  retryKey: number;
  setIsPlaying: (playing: boolean) => void;
  setIsBuffering: (buffering: boolean) => void;
  setErrorMsg: (msg: string | null) => void;
  togglePlayPause: () => void;
  triggerRetry: () => void;
  resetDrift: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: true,
  isBuffering: true,
  hasDrifted: false,
  errorMsg: null,
  retryKey: 0,

  setIsPlaying: (playing) =>
    set((state) => ({
      isPlaying: playing,
      // Mark as drifted when resuming after a pause (was paused, now playing again)
      hasDrifted: !playing ? state.hasDrifted : state.hasDrifted || !state.isPlaying,
    })),

  setIsBuffering: (buffering) => set({ isBuffering: buffering }),
  setErrorMsg: (msg) => set({ errorMsg: msg }),

  togglePlayPause: () =>
    set((state) => {
      const nextPlaying = !state.isPlaying;
      return {
        isPlaying: nextPlaying,
        // If resuming after having been paused, mark as drifted
        hasDrifted: nextPlaying ? true : state.hasDrifted,
      };
    }),

  triggerRetry: () =>
    set((state) => ({
      errorMsg: null,
      isPlaying: true,
      isBuffering: true,
      hasDrifted: false,
      retryKey: state.retryKey + 1,
    })),

  resetDrift: () => set({ hasDrifted: false }),
}));
