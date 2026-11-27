import { createMemo, For, type JSX } from 'solid-js';
import styles from './VirtualList.module.css';
import { renderedRange } from './window';

interface Props<T> {
  label: string;
  items: readonly T[];
  /** First visible row. */
  first: number;
  focused: number;
  rowHeight: number;
  visibleRows: number;
  renderRow(item: T, index: number): JSX.Element;
  onRowTap?(index: number): void;
  /** Pointer drags report how many rows to scroll (positive: down the list). */
  onDragRows?(rows: number): void;
}

const OVERSCAN = 3;

/**
 * Keeps only the visible rows (plus a small margin) in the DOM and moves them
 * with `transform`, so a 2,000-row list costs the same as a 20-row one.
 */
export function VirtualList<T>(props: Props<T>) {
  const indices = createMemo(() => {
    const { from, to } = renderedRange({
      first: props.first,
      visibleRows: props.visibleRows,
      overscan: OVERSCAN,
      count: props.items.length,
    });
    return Array.from({ length: to - from }, (_, i) => from + i);
  });

  let dragStart: { y: number; first: number } | null = null;
  const onPointerDown = (event: PointerEvent) => (dragStart = { y: event.clientY, first: props.first });
  const onPointerMove = (event: PointerEvent) => {
    if (!dragStart || !props.onDragRows) return;
    // Pointer deltas are in screen px; the stage may be scaled, so convert through the row's rendered height.
    const rowOnScreen = (event.currentTarget as HTMLElement).getBoundingClientRect().height / props.visibleRows;
    const rows = Math.round((dragStart.y - event.clientY) / rowOnScreen);
    props.onDragRows(dragStart.first + rows - props.first);
  };
  const onPointerUp = () => (dragStart = null);

  return (
    <div
      role="listbox"
      aria-label={props.label}
      class={styles.viewport}
      style={{ height: `${props.rowHeight * props.visibleRows}px` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div class={styles.rows} style={{ transform: `translateY(${-props.first * props.rowHeight}px)` }}>
        <For each={indices()}>
          {(index) => (
            <div
              role="option"
              aria-selected={index === props.focused}
              class={styles.row}
              style={{ height: `${props.rowHeight}px`, transform: `translateY(${index * props.rowHeight}px)` }}
              onClick={() => props.onRowTap?.(index)}
            >
              {props.renderRow(props.items[index] as T, index)}
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
