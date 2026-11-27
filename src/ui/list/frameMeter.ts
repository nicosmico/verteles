/** Frame-rate stats over a sliding window, fed with requestAnimationFrame timestamps (H5). */
export function createFrameMeter({ windowMs }: { windowMs: number }) {
  let frames: number[] = [];
  return {
    tick(now: number) {
      frames.push(now);
      const oldest = now - windowMs;
      if ((frames[0] as number) < oldest) frames = frames.filter((t) => t >= oldest);
    },
    stats(): { fps: number; worstFrameMs: number } | null {
      if (frames.length < 2) return null;
      let worstFrameMs = 0;
      for (let i = 1; i < frames.length; i++) {
        worstFrameMs = Math.max(worstFrameMs, (frames[i] as number) - (frames[i - 1] as number));
      }
      const span = (frames.at(-1) as number) - (frames[0] as number);
      return { fps: Math.round(((frames.length - 1) / span) * 1000), worstFrameMs };
    },
  };
}
