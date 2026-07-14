import { create } from 'zustand';

// Modal identifiers to avoid magic strings
export const MODAL_LISTS = 'lists' as const;
export const MODAL_SETTINGS = 'settings' as const;

export type ModalType = typeof MODAL_LISTS | typeof MODAL_SETTINGS | null;

export interface PlayerInterfaceState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  showControls: boolean;
  setShowControls: (visible: boolean) => void;
  modal: ModalType;
  setModal: (modal: ModalType) => void;
  resetHideTimer: () => void;
}

let hideTimer: number | null = null;
const autoHideDelayMs = 5000;

export const usePlayerInterface = create<PlayerInterfaceState>((set, get) => {
  const resetHideTimer = () => {
    set({ showControls: true });
    if (hideTimer) {
      window.clearTimeout(hideTimer);
      hideTimer = null;
    }
    const { sidebarOpen, modal } = get();
    if (!sidebarOpen && !modal) {
      hideTimer = window.setTimeout(() => {
        set({ showControls: false });
      }, autoHideDelayMs);
    }
  };

  return {
    sidebarOpen: false,
    showControls: true,
    modal: null,

    setSidebarOpen: (open) => {
      set({ sidebarOpen: open });
      if (open) {
        set({ showControls: true });
        if (hideTimer) {
          window.clearTimeout(hideTimer);
          hideTimer = null;
        }
      } else {
        resetHideTimer();
      }
    },

    setShowControls: (visible) => set({ showControls: visible }),

    setModal: (modal) => {
      set({ modal });
      if (modal) {
        set({ showControls: true });
        if (hideTimer) {
          window.clearTimeout(hideTimer);
          hideTimer = null;
        }
      } else {
        resetHideTimer();
      }
    },

    resetHideTimer,
  };
});

export default usePlayerInterface;
