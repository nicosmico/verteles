import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { importPlaylist } from './importPlaylist';

const m3u = (...lines: string[]) => ['#EXTM3U', ...lines].join('\n');

describe('importPlaylist', () => {
  it('turns an M3U entry into a numbered Channel with its Source', () => {
    const channels = importPlaylist(
      m3u(
        '#EXTINF:-1 tvg-logo="https://logo.example/24h.png" group-title="news", 24 horas',
        'https://stream.example/24h.m3u8',
      ),
    );

    expect(channels).toEqual([
      {
        key: '24 horas',
        number: 1,
        name: '24 horas',
        logo: 'https://logo.example/24h.png',
        group: 'news',
        country: null,
        sources: ['https://stream.example/24h.m3u8'],
      },
    ]);
  });

  it('reads the País from the tag that ends the name', () => {
    const [channel] = importPlaylist(m3u('#EXTINF:-1, 24 horas [CL]', 'https://stream.example/24h.m3u8'));

    expect(channel).toMatchObject({ name: '24 horas', country: 'CL', key: '24 horas [cl]' });
  });

  it('merges entries that differ only by their (n) suffix into one Channel with its Sources in order', () => {
    const channels = importPlaylist(
      m3u(
        '#EXTINF:-1 tvg-logo="https://logo.example/atacama.png" group-title="general", Atacama TV (1) [CL]',
        'https://one.example/atacama.m3u8',
        '#EXTINF:-1, Atacama TV (2) [CL]',
        'https://two.example/atacama.m3u8',
        '#EXTINF:-1, Antofagasta TV [CL]',
        'https://one.example/antofagasta.m3u8',
        '#EXTINF:-1, Atacama TV (3) [CL]',
        'https://three.example/atacama.m3u8',
      ),
    );

    expect(channels).toEqual([
      {
        key: 'atacama tv [cl]',
        number: 1,
        name: 'Atacama TV',
        logo: 'https://logo.example/atacama.png',
        group: 'general',
        country: 'CL',
        sources: [
          'https://one.example/atacama.m3u8',
          'https://two.example/atacama.m3u8',
          'https://three.example/atacama.m3u8',
        ],
      },
      expect.objectContaining({ name: 'Antofagasta TV', number: 2 }),
    ]);
  });

  it('identifies a Channel ignoring accents and capitalization', () => {
    const channels = importPlaylist(
      m3u(
        '#EXTINF:-1, TELEVISIÓN Ñuble (1) [CL]',
        'https://one.example/nuble.m3u8',
        '#EXTINF:-1, Televisión Ñuble (2) [cl]',
        'https://two.example/nuble.m3u8',
      ),
    );

    expect(channels).toHaveLength(1);
    expect(channels[0]).toMatchObject({ key: 'television nuble [cl]', name: 'TELEVISIÓN Ñuble', country: 'CL' });
  });

  it('uses tvg-id as the Identidad de canal when the Lista provides it', () => {
    const channels = importPlaylist(
      m3u(
        '#EXTINF:-1 tvg-id="TVN.cl", TVN [CL]',
        'https://one.example/tvn.m3u8',
        '#EXTINF:-1 tvg-id="TVN.cl", TVN HD [CL]',
        'https://two.example/tvn.m3u8',
      ),
    );

    expect(channels).toEqual([expect.objectContaining({ key: 'TVN.cl', name: 'TVN', sources: [expect.any(String), expect.any(String)] })]);
  });

  it('keeps only the Channels of one País, numbered among themselves', () => {
    const channels = importPlaylist(
      m3u(
        '#EXTINF:-1, América TV [AR]',
        'https://one.example/america-ar.m3u8',
        '#EXTINF:-1, 24 horas [CL]',
        'https://one.example/24h.m3u8',
        '#EXTINF:-1, Net TV [AR]',
        'https://one.example/net.m3u8',
        '#EXTINF:-1, TVN [CL]',
        'https://one.example/tvn.m3u8',
      ),
      { country: 'CL' },
    );

    expect(channels.map(({ number, name }) => [number, name])).toEqual([
      [1, '24 horas'],
      [2, 'TVN'],
    ]);
  });

  it('tolerates the mess of real Listas', () => {
    const text = [
      '\uFEFF#EXTM3U x-tvg-url="https://epg.example"',
      '',
      '# a comment',
      '#EXTINF:-1 tvg-name="Mega, el canal" group-title="general", Mega [CL]',
      '#EXTVLCOPT:http-user-agent=Mozilla',
      'https://one.example/mega.m3u8',
      '#EXTINF:-1, Without URL [CL]',
      '#EXTINF:-1,Chilevisión [CL]',
      'https://one.example/chv.m3u8',
      'https://orphan.example/no-extinf.m3u8',
    ].join('\r\n');

    expect(importPlaylist(text)).toEqual([
      expect.objectContaining({ number: 1, name: 'Mega', group: 'general', sources: ['https://one.example/mega.m3u8'] }),
      expect.objectContaining({ number: 2, name: 'Chilevisión', logo: null, group: null, sources: ['https://one.example/chv.m3u8'] }),
    ]);
  });

  it('imports the real Alplox Lista: 188 Chilean entries become 106 Channels', () => {
    // Snapshot of https://raw.githubusercontent.com/Alplox/json-teles/refs/heads/main/channels.m3u.
    // The expected counts were computed independently with shell tools.
    const text = readFileSync(new URL('./fixtures/alplox-2026-11-26.m3u', import.meta.url), 'utf8');

    const chile = importPlaylist(text, { country: 'CL' });

    expect(chile).toHaveLength(106);
    expect(chile.reduce((total, channel) => total + channel.sources.length, 0)).toBe(188);
    expect(chile[0]).toMatchObject({ number: 1, name: '24 horas', country: 'CL' });
    expect(chile.at(-1)?.number).toBe(106);
  });
});
