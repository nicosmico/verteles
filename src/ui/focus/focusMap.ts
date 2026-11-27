import type { RemoteKey } from '../../domain/remote/remoteKey';

export interface ZoneSpec<Zone extends string> {
  /** Number of focusable items in this vertical list. */
  count: number;
  /** Zone reached with Left / Right, if any. */
  left?: Zone;
  right?: Zone;
}

export interface FocusPosition<Zone extends string> {
  zone: Zone;
  index: number;
}

/**
 * Explicit, non-geometric focus (ADR-0008): each zone is a vertical list that
 * declares its neighbors, and remembers its last index when focus leaves it.
 * Moving focus never measures the DOM.
 */
export function createFocusMap<Zone extends string>(options: { start: Zone; zones: Record<Zone, ZoneSpec<Zone>> }) {
  const zones = { ...options.zones };
  const remembered = {} as Record<Zone, number>;
  let zone = options.start;

  const indexIn = (name: Zone) => clamp(remembered[name] ?? 0, zones[name].count);

  return {
    current: (): FocusPosition<Zone> => ({ zone, index: indexIn(zone) }),

    /** Applies a remote key; returns whether focus moved. */
    press(key: RemoteKey): boolean {
      const spec = zones[zone];
      if (key === 'Left' || key === 'Right') {
        const next = key === 'Left' ? spec.left : spec.right;
        if (next === undefined) return false;
        zone = next;
        return true;
      }
      const step = key === 'Down' ? 1 : key === 'Up' ? -1 : 0;
      const from = indexIn(zone);
      const to = clamp(from + step, spec.count);
      remembered[zone] = to;
      return to !== from;
    },

    /** Updates a zone's size, e.g. when a Grupo filters the Channels. */
    setCount(name: Zone, count: number) {
      zones[name] = { ...zones[name], count };
    },
  };
}

function clamp(index: number, count: number): number {
  return Math.min(Math.max(index, 0), Math.max(count - 1, 0));
}
