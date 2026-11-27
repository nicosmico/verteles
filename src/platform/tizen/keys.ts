import type { RemoteKey } from '../../domain/remote/remoteKey';

interface TizenKey {
  remoteKey: RemoteKey;
  /** Name for `tizen.tvinputdevice.registerKey`; arrows, Enter and Return need no registration. */
  register?: string;
}

// Samsung remote key codes (Tizen TV input device API).
const KEYS: ReadonlyMap<number, TizenKey> = new Map<number, TizenKey>([
  [38, { remoteKey: 'Up' }],
  [40, { remoteKey: 'Down' }],
  [37, { remoteKey: 'Left' }],
  [39, { remoteKey: 'Right' }],
  [13, { remoteKey: 'Ok' }],
  [10009, { remoteKey: 'Back' }],
  [427, { remoteKey: 'ChannelUp', register: 'ChannelUp' }],
  [428, { remoteKey: 'ChannelDown', register: 'ChannelDown' }],
  [10252, { remoteKey: 'PlayPause', register: 'MediaPlayPause' }],
  [415, { remoteKey: 'Play', register: 'MediaPlay' }],
  [19, { remoteKey: 'Pause', register: 'MediaPause' }],
  [413, { remoteKey: 'Stop', register: 'MediaStop' }],
  [403, { remoteKey: 'Red', register: 'ColorF0Red' }],
  [404, { remoteKey: 'Green', register: 'ColorF1Green' }],
  [405, { remoteKey: 'Yellow', register: 'ColorF2Yellow' }],
  [406, { remoteKey: 'Blue', register: 'ColorF3Blue' }],
  ...Array.from({ length: 10 }, (_, digit): [number, TizenKey] => [
    48 + digit,
    { remoteKey: `Digit${digit as 0}`, register: String(digit) },
  ]),
]);

/** Translates a Samsung `KeyboardEvent.keyCode` into a RemoteKey, or null for keys Verteles does not use. */
export function tizenRemoteKey(keyCode: number): RemoteKey | null {
  return KEYS.get(keyCode)?.remoteKey ?? null;
}

/** Keys the app must register to receive them instead of the TV. */
export const KEYS_TO_REGISTER: readonly string[] = [...KEYS.values()].flatMap((key) =>
  key.register ? [key.register] : [],
);
