import { createSignal, onCleanup, type ParentProps } from 'solid-js';
import styles from './Stage.module.css';

/** Landscape (TV, computer, phone on its side): the 1920×1080 canvas the TV uses. */
const LANDSCAPE_WIDTH = 1920;
const LANDSCAPE_HEIGHT = 1080;
/** Portrait (phone held upright): a narrower canvas, so text stays readable once scaled. */
const PORTRAIT_WIDTH = 720;

interface Layout {
  orientation: 'landscape' | 'portrait';
  width: number;
  height: number;
  transform: string;
}

/**
 * A fixed-size canvas scaled to fit the window. On TVs the window is 1920×1080,
 * so the scale is 1 and nothing moves. Screens style themselves per orientation
 * through `[data-orientation]`. Window size is read only on resize, never while
 * handling keys.
 */
export function Stage(props: ParentProps) {
  const [layout, setLayout] = createSignal(fit());

  const onResize = () => setLayout(fit());
  window.addEventListener('resize', onResize);
  onCleanup(() => window.removeEventListener('resize', onResize));

  return (
    <div data-viewport class={styles.viewport}>
      <div
        data-stage
        data-orientation={layout().orientation}
        class={styles.stage}
        style={{ width: `${layout().width}px`, height: `${layout().height}px`, transform: layout().transform }}
      >
        {props.children}
      </div>
    </div>
  );
}

function fit(): Layout {
  const { innerWidth: w, innerHeight: h } = window;
  if (h > w) {
    const scale = w / PORTRAIT_WIDTH;
    return { orientation: 'portrait', width: PORTRAIT_WIDTH, height: Math.round(h / scale), transform: `scale(${scale})` };
  }
  const scale = Math.min(w / LANDSCAPE_WIDTH, h / LANDSCAPE_HEIGHT);
  const x = (w - LANDSCAPE_WIDTH * scale) / 2;
  const y = (h - LANDSCAPE_HEIGHT * scale) / 2;
  return {
    orientation: 'landscape',
    width: LANDSCAPE_WIDTH,
    height: LANDSCAPE_HEIGHT,
    transform: `translate(${x}px, ${y}px) scale(${scale})`,
  };
}
