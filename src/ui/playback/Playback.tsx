import { platform } from '@platform';
import { createSignal, onCleanup, onMount, Show } from 'solid-js';
import { createTuner, type TunerState } from '../../domain/playback/tuner';
import { zapIndex } from '../../domain/playback/zap';
import type { Channel } from '../../domain/playlist/channel';
import type { Storage } from '../../platform/types';
import type { KeyBus } from '../shell/keyBus';
import { median } from './median';
import styles from './Playback.module.css';

const SOURCE_TIMEOUT_MS = 8000;
const SAMPLES = 10;
const LAST_CHANNEL = 'lastChannel';

interface Props {
  channels: Channel[];
  /** Null when the platform cannot persist. */
  storage: Storage | null;
  keys: KeyBus;
}

/** Phase 0 Reproducción: full-screen Channel with Zapping and first-frame timing (H3). */
export function Playback(props: Props) {
  let container!: HTMLDivElement;
  const [state, setState] = createSignal<TunerState | null>(null);
  const [samples, setSamples] = createSignal<number[]>([]);
  let index = 0;
  let tune: (channel: Channel) => void = () => {};
  // Set by the first Zapping, so a slow startup never overrides the viewer's choice.
  let tunedByViewer = false;

  const tuneAt = (next: number) => {
    const channel = props.channels[next];
    if (!channel) return;
    index = next;
    tune(channel);
    void props.storage?.set(LAST_CHANNEL, channel.key).catch(() => {});
  };
  const zap = (step: 1 | -1) => {
    tunedByViewer = true;
    tuneAt(zapIndex({ count: props.channels.length, from: index, step }));
  };

  onMount(() => {
    const player = platform.createPlayer(container);
    onCleanup(() => player.destroy());
    const tuner = createTuner({
      player,
      clock: {
        now: () => performance.now(),
        setTimer: (run, ms) => {
          const timer = setTimeout(run, ms);
          return () => clearTimeout(timer);
        },
      },
      sourceTimeoutMs: SOURCE_TIMEOUT_MS,
      onChange(next) {
        setState(next);
        if (next.status === 'playing' && next.firstFrameMs !== null) {
          setSamples((all) => [...all, Math.round(next.firstFrameMs as number)].slice(-SAMPLES));
        }
      },
    });
    tune = (channel) => tuner.tune(channel);

    void (async () => {
      const lastKey = await props.storage?.get<string>(LAST_CHANNEL).catch(() => undefined);
      if (tunedByViewer) return;
      const last = props.channels.findIndex((channel) => channel.key === lastKey);
      tuneAt(last >= 0 ? last : 0);
    })();
  });

  onCleanup(
    props.keys.listen(({ key }) => {
      if (key === 'ChannelUp' || key === 'Up') zap(1);
      if (key === 'ChannelDown' || key === 'Down') zap(-1);
    }),
  );

  const status = () => {
    switch (state()?.status) {
      case 'playing':
        return 'En vivo';
      case 'unavailable':
        return 'Canal no disponible';
      default:
        return 'Conectando…';
    }
  };

  return (
    <section class={styles.screen}>
      <div ref={container} class={styles.video} />
      <Show when={state()}>
        {(current) => (
          <div class={styles.info}>
            <h1 class={styles.title}>Reproducción</h1>
            <p data-testid="now-playing" class={styles.channel}>
              {current().channel.number} · {current().channel.name}
            </p>
            <p data-testid="tuner-status" class={styles.status}>
              {status()}
            </p>
            <p class={styles.detail}>
              Fuente {current().sourceIndex + 1} de {current().channel.sources.length}
            </p>
            <p class={styles.detail}>{describeTimings(samples())}</p>
          </div>
        )}
      </Show>
      <div class={styles.zapButtons}>
        <button type="button" tabIndex={-1} aria-label="Canal anterior" onClick={() => zap(-1)}>
          ▼ Canal anterior
        </button>
        <button type="button" tabIndex={-1} aria-label="Canal siguiente" onClick={() => zap(1)}>
          ▲ Canal siguiente
        </button>
      </div>
    </section>
  );
}

function describeTimings(samples: number[]): string {
  const last = samples.at(-1);
  if (last === undefined) return 'Primer cuadro: —';
  return `Primer cuadro: ${last} ms · mediana de ${samples.length}: ${Math.round(median(samples) ?? 0)} ms`;
}
