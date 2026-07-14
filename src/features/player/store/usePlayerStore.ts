import { create } from 'zustand';

interface PlayerState {
  isPlaying: boolean;
  isBuffering: boolean;
  errorMsg: string | null;
  retryKey: number;
  setIsPlaying: (playing: boolean) => void;
  setIsBuffering: (buffering: boolean) => void;
  setErrorMsg: (msg: string | null) => void;
  togglePlayPause: () => void;
  triggerRetry: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: true,
  isBuffering: true,
  errorMsg: null,
  retryKey: 0,
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setIsBuffering: (buffering) => set({ isBuffering: buffering }),
  setErrorMsg: (msg) => set({ errorMsg: msg }),
  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),
  triggerRetry: () => set((state) => ({
    errorMsg: null,
    isPlaying: true,
    isBuffering: true,
    retryKey: state.retryKey + 1,
  })),
}));
