import type { Channel } from '../playlist/channel';

/** What a Player reports about the Source it is loading. */
export type PlayerEvent = 'playing' | 'error';

/** The part of a platform Player the tuner drives. */
export interface TunerPlayer {
  /** Starts loading `url`; events about this load are reported to `onEvent`. */
  load(url: string, onEvent: (event: PlayerEvent) => void): void;
  stop(): void;
}

export interface TunerClock {
  now(): number;
  /** Runs `run` after `ms`; returns a function that cancels it. */
  setTimer(run: () => void, ms: number): () => void;
}

export interface TunerState {
  channel: Channel;
  status: 'connecting' | 'playing' | 'unavailable';
  /** Index of the Source being tried or playing. */
  sourceIndex: number;
  /** Time from tuning to the first frame, once playing. */
  firstFrameMs: number | null;
}

export interface TunerOptions {
  player: TunerPlayer;
  clock: TunerClock;
  /** How long a Source may take to show its first frame before trying the next one. */
  sourceTimeoutMs: number;
  onChange(state: TunerState): void;
}

/**
 * Tunes a Channel by trying its Sources in order until one plays (ADR-0009).
 * A Source that errors or shows no frame within `sourceTimeoutMs` is skipped;
 * when none plays, the Channel is "Canal no disponible".
 */
export function createTuner({ player, clock, sourceTimeoutMs, onChange }: TunerOptions) {
  // Each tune() starts a new attempt; anything from an older attempt is ignored.
  let attempt = 0;
  let cancelPending = () => {};

  return {
    tune(channel: Channel) {
      const current = ++attempt;
      cancelPending();
      const startedAt = clock.now();

      const tryFrom = (sourceIndex: number) => {
        const url = channel.sources[sourceIndex];
        if (url === undefined) {
          player.stop();
          onChange({ channel, status: 'unavailable', sourceIndex: channel.sources.length - 1, firstFrameMs: null });
          return;
        }
        onChange({ channel, status: 'connecting', sourceIndex, firstFrameMs: null });

        let settled = false;
        const settle = () => {
          if (settled || current !== attempt) return false;
          settled = true;
          cancelTimeout();
          return true;
        };
        const cancelTimeout = clock.setTimer(() => settle() && tryFrom(sourceIndex + 1), sourceTimeoutMs);
        cancelPending = cancelTimeout;
        player.load(url, (event) => {
          if (!settle()) return;
          if (event === 'playing') {
            onChange({ channel, status: 'playing', sourceIndex, firstFrameMs: clock.now() - startedAt });
          } else {
            tryFrom(sourceIndex + 1);
          }
        });
      };

      tryFrom(0);
    },
  };
}
