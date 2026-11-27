import { createMemo, createSignal, onCleanup, Show } from 'solid-js';
import type { Channel } from '../../domain/playlist/channel';
import { createFocusMap } from '../focus/focusMap';
import type { KeyBus } from '../shell/keyBus';
import { createFrameMeter } from './frameMeter';
import styles from './ListScreen.module.css';
import { VirtualList } from './VirtualList';
import { scrollToShow } from './window';

const COUNT = 2000;
const ROW_HEIGHT = 96;
const VISIBLE_ROWS = 8;

interface Row {
  number: number;
  name: string;
  logo: string | null;
}

/** Phase 0 Lista 2000: a virtualized list of 2,000 Channels walked with the focus manager (H5). */
export function ListScreen(props: { channels: Channel[] | null; keys: KeyBus }) {
  const rows = createMemo(() => syntheticRows(props.channels ?? []));
  const focus = createFocusMap({ start: 'list', zones: { list: { count: COUNT } } });
  const [focused, setFocused] = createSignal(0);
  const [first, setFirst] = createSignal(0);

  const focusAt = (index: number) => {
    setFocused(index);
    setFirst((current) => scrollToShow({ focused: index, first: current, visibleRows: VISIBLE_ROWS }));
  };

  onCleanup(
    props.keys.listen(({ key }) => {
      if (key && focus.press(key)) focusAt(focus.current().index);
    }),
  );

  const meter = createFrameMeter({ windowMs: 10_000 });
  const [stats, setStats] = createSignal<ReturnType<typeof meter.stats>>(null);
  let frame = requestAnimationFrame(function tick(now) {
    meter.tick(now);
    frame = requestAnimationFrame(tick);
  });
  const refresh = setInterval(() => setStats(meter.stats()), 500);
  onCleanup(() => {
    cancelAnimationFrame(frame);
    clearInterval(refresh);
  });

  return (
    <section class={styles.screen}>
      <header class={styles.header}>
        <h1 class={styles.title}>Lista 2000</h1>
        <p data-testid="frame-stats" class={styles.stats}>
          <Show when={stats()} fallback="Midiendo…">
            {(s) => `${s().fps} FPS · peor cuadro ${Math.round(s().worstFrameMs)} ms (últimos 10 s)`}
          </Show>
        </p>
      </header>
      <VirtualList
        label="Canales"
        items={rows()}
        first={first()}
        focused={focused()}
        rowHeight={ROW_HEIGHT}
        visibleRows={VISIBLE_ROWS}
        onRowTap={focusAt}
        onDragRows={(delta) => setFirst((current) => clamp(current + delta, 0, COUNT - VISIBLE_ROWS))}
        renderRow={(row) => (
          <>
            <span class={styles.logo} aria-hidden="true">
              {row.name.slice(0, 1)}
              <Show when={row.logo}>
                {(src) => (
                  <img
                    src={src()}
                    alt=""
                    width={64}
                    height={64}
                    decoding="async"
                    onError={(event) => (event.currentTarget.style.visibility = 'hidden')}
                  />
                )}
              </Show>
            </span>
            <span class={styles.name}>
              {row.number} · {row.name}
            </span>
          </>
        )}
      />
    </section>
  );
}

/** 2,000 rows built by repeating the Lista de Chile (or plain names while it loads). */
function syntheticRows(channels: Channel[]): Row[] {
  return Array.from({ length: COUNT }, (_, i) => {
    const channel = channels.length ? channels[i % channels.length] : undefined;
    return { number: i + 1, name: channel?.name ?? `Canal ${i + 1}`, logo: channel?.logo ?? null };
  });
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
