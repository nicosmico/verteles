import { describe, expect, it } from 'vitest';
import { tizenRemoteKey } from './keys';

describe('tizenRemoteKey', () => {
  it.each([
    [38, 'Up'],
    [40, 'Down'],
    [37, 'Left'],
    [39, 'Right'],
    [13, 'Ok'],
    [10009, 'Back'],
    [427, 'ChannelUp'],
    [428, 'ChannelDown'],
    [10252, 'PlayPause'],
    [415, 'Play'],
    [19, 'Pause'],
    [413, 'Stop'],
    [403, 'Red'],
    [404, 'Green'],
    [405, 'Yellow'],
    [406, 'Blue'],
    [48, 'Digit0'],
    [57, 'Digit9'],
  ])('maps the Samsung key code %i to the remote key %s', (keyCode, remoteKey) => {
    expect(tizenRemoteKey(keyCode)).toBe(remoteKey);
  });

  it('ignores key codes Verteles does not use', () => {
    expect(tizenRemoteKey(10182)).toBeNull(); // Exit
    expect(tizenRemoteKey(0)).toBeNull();
  });
});
