import type { KeyPress } from '../../platform/types';

/** Fans out key presses from the Shell to whichever screen is listening. */
export function createKeyBus() {
  const listeners = new Set<(press: KeyPress) => void>();
  return {
    emit(press: KeyPress) {
      listeners.forEach((listener) => listener(press));
    },
    listen(listener: (press: KeyPress) => void) {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
  };
}

export type KeyBus = ReturnType<typeof createKeyBus>;
