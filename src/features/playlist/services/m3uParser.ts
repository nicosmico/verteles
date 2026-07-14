import Parser from 'iptv-playlist-parser';
import type { ParsedChannel } from '../types';
import { isTizen } from '../../../utils/platform';

// ─── Helpers ────────────────────────────────────────────────────────────────

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function getDeterministicColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return hslToHex(h, 65, 40);
}

function getFallbackText(name: string): string {
  if (!name) return '?';
  const cleanName = name.replace(/[[\]()\\:.\-]/g, ' ').trim();
  const words = cleanName.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return ((words[0][0] || '') + (words[1][0] || '')).toUpperCase();
  }
  return name.trim().substring(0, 2).toUpperCase();
}

/**
 * Builds the fetch URL for the M3U file.
 * - On Tizen: direct fetch (no CORS restrictions).
 * - On web + jsDelivr (or any host that already sends CORS headers): direct fetch.
 * - On web + other hosts: route through the Vite dev-server proxy to bypass CORS.
 */
const CORS_ENABLED_HOSTS = ['cdn.jsdelivr.net'];

function buildFetchUrl(rawUrl: string): string {
  if (isTizen()) return rawUrl;
  try {
    const { hostname } = new URL(rawUrl);
    if (CORS_ENABLED_HOSTS.includes(hostname)) return rawUrl;
  } catch {
    // malformed URL — fall through to proxy
  }
  return `/proxy/${rawUrl}`;
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Fetches and parses an M3U playlist URL.
 * Returns an array of `ParsedChannel` objects ready to be consumed by the store.
 */
export async function fetchAndParseM3U(url: string): Promise<ParsedChannel[]> {
  const fetchUrl = buildFetchUrl(url);

  const response = await fetch(fetchUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch M3U playlist (HTTP ${response.status}): ${url}`);
  }

  const text = await response.text();

  // iptv-playlist-parser is a CJS default export, so we may receive
  // the module object itself or its default property depending on bundler.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parser = (Parser as any).default ?? Parser;
  const { items } = parser.parse(text) as {
    items: Array<{
      name: string;
      tvg: { logo: string; id: string; name: string };
      group: { title: string };
      url: string;
    }>;
  };

  return items
    .filter((item) => Boolean(item.url)) // discard entries without a stream URL
    .map((item, index) => {
      const name = (item.tvg.name || item.name || '').trim();
      const id = item.tvg.id?.trim()
        ? `tvg-${item.tvg.id.trim()}`
        : `ch-${index}-${name.toLowerCase().replace(/\s+/g, '-').slice(0, 24)}`;

      return {
        id,
        name,
        url: item.url,
        logo: item.tvg.logo || undefined,
        group: item.group.title || undefined,
        fallbackColor: getDeterministicColor(name),
        fallbackText: getFallbackText(name),
      };
    });
}
