import { createSignal, onCleanup, type ParentProps } from 'solid-js';
import styles from './Stage.module.css';

const STAGE_WIDTH = 1920;
const STAGE_HEIGHT = 1080;

/**
 * A fixed 1920×1080 canvas scaled to fit the window, centred with letterboxing.
 * On TVs the window already is 1920×1080, so the scale is 1 and nothing moves.
 * Window size is read only on resize, never while handling keys.
 */
export function Stage(props: ParentProps) {
  const [transform, setTransform] = createSignal(fit());

  const onResize = () => setTransform(fit());
  window.addEventListener('resize', onResize);
  onCleanup(() => window.removeEventListener('resize', onResize));

  return (
    <div class={styles.viewport}>
      <div class={styles.stage} style={{ transform: transform() }}>
        {props.children}
      </div>
    </div>
  );
}

function fit(): string {
  const scale = Math.min(window.innerWidth / STAGE_WIDTH, window.innerHeight / STAGE_HEIGHT);
  const x = (window.innerWidth - STAGE_WIDTH * scale) / 2;
  const y = (window.innerHeight - STAGE_HEIGHT * scale) / 2;
  return `translate(${x}px, ${y}px) scale(${scale})`;
}
