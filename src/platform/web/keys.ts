import type { RemoteKey } from '../../domain/remote/remoteKey';

// On the web the keyboard stands in for the remote (see docs/roadmap.md).
const KEYBOARD: Readonly<Record<string, RemoteKey>> = {
  ArrowUp: 'Up',
  ArrowDown: 'Down',
  ArrowLeft: 'Left',
  ArrowRight: 'Right',
  Enter: 'Ok',
  Escape: 'Back',
  Backspace: 'Back',
  PageUp: 'ChannelUp',
  PageDown: 'ChannelDown',
  ' ': 'PlayPause',
  F1: 'Red',
  F2: 'Green',
  F3: 'Yellow',
  F4: 'Blue',
};

/** Translates `KeyboardEvent.key` into a RemoteKey, or null for keys the remote lacks. */
export function webRemoteKey(key: string): RemoteKey | null {
  if (/^[0-9]$/.test(key)) return `Digit${Number(key) as 0}`;
  return KEYBOARD[key] ?? null;
}
