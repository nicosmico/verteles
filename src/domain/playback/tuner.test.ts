import { describe, expect, it } from 'vitest';
import type { Channel } from '../playlist/channel';
import { createTuner, type PlayerEvent, type TunerState } from './tuner';

function channel(name: string, ...sources: string[]): Channel {
  return { key: name.toLowerCase(), number: 1, name, logo: null, group: null, country: 'CL', sources };
}

/** A player that records what it was asked to load and lets the test answer for it. */
function fakePlayer() {
  const loads: Array<{ url: string; emit: (event: PlayerEvent) => void }> = [];
  return {
    loads,
    load(url: string, onEvent: (event: PlayerEvent) => void) {
      loads.push({ url, emit: onEvent });
    },
    stop() {},
    get last() {
      const last = loads.at(-1);
      if (!last) throw new Error('nothing loaded');
      return last;
    },
  };
}

/** A manual clock: timers fire only when the test advances time. */
function fakeClock() {
  let now = 0;
  let timers: Array<{ at: number; run: () => void }> = [];
  return {
    now: () => now,
    setTimer(run: () => void, ms: number) {
      const timer = { at: now + ms, run };
      timers.push(timer);
      return () => {
        timers = timers.filter((t) => t !== timer);
      };
    },
    advance(ms: number) {
      now += ms;
      const due = timers.filter((t) => t.at <= now);
      timers = timers.filter((t) => t.at > now);
      due.forEach((t) => t.run());
    },
  };
}

function setup() {
  const player = fakePlayer();
  const clock = fakeClock();
  const states: TunerState[] = [];
  const tuner = createTuner({ player, clock, sourceTimeoutMs: 8000, onChange: (state) => states.push(state) });
  return { player, clock, tuner, states, current: () => states.at(-1) };
}

describe('tuner', () => {
  it('plays the first Source and reports how long the first frame took', () => {
    const { player, clock, tuner, current } = setup();

    tuner.tune(channel('TVN', 'https://a/tvn.m3u8', 'https://b/tvn.m3u8'));
    expect(player.last.url).toBe('https://a/tvn.m3u8');
    expect(current()).toMatchObject({ status: 'connecting', sourceIndex: 0 });

    clock.advance(1200);
    player.last.emit('playing');

    expect(current()).toMatchObject({ status: 'playing', sourceIndex: 0, firstFrameMs: 1200 });
  });

  it('falls back to the next Source when one fails or shows nothing before the timeout', () => {
    const { player, clock, tuner, current } = setup();
    tuner.tune(channel('Mega', 'https://a/mega.m3u8', 'https://b/mega.m3u8', 'https://c/mega.m3u8'));

    player.last.emit('error');
    expect(player.last.url).toBe('https://b/mega.m3u8');
    expect(current()).toMatchObject({ status: 'connecting', sourceIndex: 1 });

    clock.advance(8000);
    expect(player.last.url).toBe('https://c/mega.m3u8');

    clock.advance(500);
    player.last.emit('playing');
    expect(current()).toMatchObject({ status: 'playing', sourceIndex: 2, firstFrameMs: 8500 });
  });

  it('marks the Channel unavailable when every Source fails', () => {
    const { player, clock, tuner, current } = setup();
    tuner.tune(channel('Mega', 'https://a/mega.m3u8', 'https://b/mega.m3u8'));

    player.last.emit('error');
    clock.advance(8000);

    expect(player.loads).toHaveLength(2);
    expect(current()).toMatchObject({ status: 'unavailable' });
  });

  it('ignores late events and timeouts of a Channel left by zapping', () => {
    const { player, clock, tuner, current } = setup();
    tuner.tune(channel('Mega', 'https://a/mega.m3u8', 'https://b/mega.m3u8'));
    const megaLoad = player.last;

    clock.advance(3000);
    tuner.tune(channel('TVN', 'https://a/tvn.m3u8'));
    megaLoad.emit('playing');
    megaLoad.emit('error');

    expect(current()).toMatchObject({ channel: { name: 'TVN' }, status: 'connecting' });
    clock.advance(5000); // Mega's 8 s timeout would fire now.
    expect(player.loads.map((load) => load.url)).toEqual(['https://a/mega.m3u8', 'https://a/tvn.m3u8']);

    player.last.emit('playing');
    expect(current()).toMatchObject({ channel: { name: 'TVN' }, status: 'playing', firstFrameMs: 5000 });
  });
});
