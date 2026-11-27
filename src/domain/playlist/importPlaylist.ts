import type { Channel } from './channel';

export interface ImportOptions {
  /** Keep only Channels of this País (e.g. "CL"). */
  country?: string;
}

interface Entry {
  attributes: Record<string, string>;
  title: string;
  url: string;
}

/**
 * Parses an M3U Lista into its Channels. Entries with the same Identidad de
 * canal become one Channel whose Sources keep the Lista's order (ADR-0009);
 * the first entry of a Channel decides its position, name, logo and Grupo.
 */
export function importPlaylist(text: string, options: ImportOptions = {}): Channel[] {
  const onlyCountry = options.country?.toUpperCase();
  const channels = new Map<string, Channel>();
  for (const entry of parseEntries(text)) {
    const { name, country } = splitTitle(entry.title);
    if (onlyCountry && country !== onlyCountry) continue;
    const key = entry.attributes['tvg-id'] || channelKey(name, country);
    const existing = channels.get(key);
    if (existing) {
      existing.sources.push(entry.url);
      continue;
    }
    channels.set(key, {
      key,
      number: channels.size + 1,
      name,
      logo: entry.attributes['tvg-logo'] ?? null,
      group: entry.attributes['group-title'] ?? null,
      country,
      sources: [entry.url],
    });
  }
  return [...channels.values()];
}

/** "Televisión Ñuble" + "CL" → "television nuble [cl]". */
function channelKey(name: string, country: string | null): string {
  const normalized = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ');
  return country ? `${normalized} [${country.toLowerCase()}]` : normalized;
}

/** "Atacama TV (2) [CL]" → name "Atacama TV", country "CL". */
function splitTitle(title: string): { name: string; country: string | null } {
  const tagged = /^(.*?)\s*\[([A-Za-z]{2})\]$/.exec(title);
  const withoutCountry = tagged?.[1] ?? title;
  const name = withoutCountry.replace(/\s*\(\d+\)$/, '');
  return { name, country: tagged?.[2]?.toUpperCase() ?? null };
}

function parseEntries(text: string): Entry[] {
  const entries: Entry[] = [];
  let pending: Omit<Entry, 'url'> | null = null;
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (line.startsWith('#EXTINF')) {
      pending = parseExtinf(line);
    } else if (pending && line && !line.startsWith('#')) {
      entries.push({ ...pending, url: line });
      pending = null;
    }
  }
  return entries;
}

function parseExtinf(line: string): Omit<Entry, 'url'> {
  const comma = titleSeparator(line);
  const header = line.slice(0, comma);
  const attributes: Record<string, string> = {};
  for (const [, name, value] of header.matchAll(/([\w-]+)="([^"]*)"/g)) {
    if (name && value !== undefined) attributes[name] = value;
  }
  return { attributes, title: line.slice(comma + 1).trim() };
}

/** The comma that starts the title: the first one outside a quoted attribute value. */
function titleSeparator(line: string): number {
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') quoted = !quoted;
    else if (line[i] === ',' && !quoted) return i;
  }
  return line.length;
}
