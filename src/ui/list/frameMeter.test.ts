import { describe, expect, it } from 'vitest';
import { createFrameMeter } from './frameMeter';

describe('frame meter', () => {
  it('reports average FPS and the worst frame over the recent window', () => {
    const meter = createFrameMeter({ windowMs: 1000 });
    // 0 ms, then nine 20 ms frames and one 120 ms frame: 10 frames in 300 ms.
    let now = 0;
    meter.tick(now);
    for (const gap of [20, 20, 20, 20, 120, 20, 20, 20, 20, 20]) meter.tick((now += gap));

    expect(meter.stats()).toEqual({ fps: Math.round((10 / 300) * 1000), worstFrameMs: 120 });
  });

  it('forgets frames older than the window', () => {
    const meter = createFrameMeter({ windowMs: 1000 });
    meter.tick(0);
    meter.tick(500); // A 500 ms hitch, long ago.
    for (let now = 2000; now <= 3000; now += 20) meter.tick(now);

    expect(meter.stats()).toEqual({ fps: 50, worstFrameMs: 20 });
  });

  it('has no stats before two frames', () => {
    expect(createFrameMeter({ windowMs: 1000 }).stats()).toBeNull();
  });
});
