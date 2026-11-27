import { importPlaylist } from '../../domain/playlist/importPlaylist';
import type { SuggestedPlaylist } from '../../domain/playlist/suggested';
import { HttpError } from '../../platform/shared/fetchText';

export type PlaylistProbe =
  | { state: 'loading' }
  | { state: 'loaded'; channels: number; sources: number; downloadMs: number; parseMs: number }
  | { state: 'failed'; reason: string };

/** Downloads and imports a Lista, timing each step (hypothesis H4 of phase 0). */
export async function probePlaylist(
  playlist: SuggestedPlaylist,
  fetchText: (url: string) => Promise<string>,
): Promise<PlaylistProbe> {
  const started = performance.now();
  let text: string;
  try {
    text = await fetchText(playlist.url);
  } catch (error) {
    return { state: 'failed', reason: error instanceof HttpError ? `HTTP ${error.status}` : 'sin conexión' };
  }
  const downloaded = performance.now();
  const channels = importPlaylist(text, { country: playlist.country });
  const parsed = performance.now();
  return {
    state: 'loaded',
    channels: channels.length,
    sources: channels.reduce((total, channel) => total + channel.sources.length, 0),
    downloadMs: Math.round(downloaded - started),
    parseMs: Math.round(parsed - downloaded),
  };
}
