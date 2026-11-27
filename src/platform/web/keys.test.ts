import { describe, expect, it } from 'vitest';
import { webRemoteKey } from './keys';

describe('webRemoteKey', () => {
  it.each([
    ['ArrowUp', 'Up'],
    ['ArrowDown', 'Down'],
    ['ArrowLeft', 'Left'],
    ['ArrowRight', 'Right'],
    ['Enter', 'Ok'],
    ['Escape', 'Back'],
    ['Backspace', 'Back'],
    ['PageUp', 'ChannelUp'],
    ['PageDown', 'ChannelDown'],
    [' ', 'PlayPause'],
    ['F1', 'Red'],
    ['F2', 'Green'],
    ['F3', 'Yellow'],
    ['F4', 'Blue'],
    ['0', 'Digit0'],
    ['7', 'Digit7'],
  ])('maps the keyboard key %j to the remote key %s', (key, remoteKey) => {
    expect(webRemoteKey(key)).toBe(remoteKey);
  });

  it('ignores keys the remote does not have', () => {
    expect(webRemoteKey('a')).toBeNull();
    expect(webRemoteKey('Shift')).toBeNull();
  });
});
