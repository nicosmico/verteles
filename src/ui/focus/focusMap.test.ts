import { describe, expect, it } from 'vitest';
import { createFocusMap } from './focusMap';

describe('focus map', () => {
  it('moves through a vertical list with Up and Down, stopping at both ends', () => {
    const focus = createFocusMap({ start: 'channels', zones: { channels: { count: 3 } } });

    expect(focus.current()).toEqual({ zone: 'channels', index: 0 });
    focus.press('Up');
    expect(focus.current().index).toBe(0);
    focus.press('Down');
    focus.press('Down');
    focus.press('Down');
    expect(focus.current().index).toBe(2);
  });

  it('moves between neighbor zones with Left and Right, each remembering its last position', () => {
    const focus = createFocusMap({
      start: 'channels',
      zones: {
        groups: { count: 5, right: 'channels' },
        channels: { count: 100, left: 'groups' },
      },
    });
    for (let i = 0; i < 40; i++) focus.press('Down');

    focus.press('Left');
    expect(focus.current()).toEqual({ zone: 'groups', index: 0 });
    focus.press('Down');
    focus.press('Left'); // No neighbor on the left of Grupos: nothing happens.
    expect(focus.current()).toEqual({ zone: 'groups', index: 1 });

    focus.press('Right');
    expect(focus.current()).toEqual({ zone: 'channels', index: 40 });
    focus.press('Left');
    expect(focus.current()).toEqual({ zone: 'groups', index: 1 });
  });

  it('keeps the remembered position inside a zone that shrank', () => {
    const focus = createFocusMap({ start: 'channels', zones: { channels: { count: 100 } } });
    for (let i = 0; i < 80; i++) focus.press('Down');

    focus.setCount('channels', 10);

    expect(focus.current()).toEqual({ zone: 'channels', index: 9 });
  });
});
