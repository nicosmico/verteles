import { create } from 'zustand';

interface PlayerState {
  isBuffering: boolean;
  errorMsg: string | null;
  retryKey: number;
  setIsBuffering: (buffering: boolean) => void;
  setErrorMsg: (msg: string | null) => void;
  triggerRetry: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isBuffering: true,
  errorMsg: null,
  retryKey: 0,

  setIsBuffering: (buffering) => set({ isBuffering: buffering }),
  setErrorMsg: (msg) => set({ errorMsg: msg }),

  triggerRetry: () =>
    set((state) => ({
      errorMsg: null,
      isBuffering: true,
      retryKey: state.retryKey + 1,
    })),
}));
