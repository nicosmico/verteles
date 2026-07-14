import type { ParsedChannel } from '../types';

// Helper to generate deterministic colors for initials fallback background
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
  // Keep colors saturated and dark enough for white text to stand out
  return hslToHex(h, 65, 40);
}

function getFallbackText(name: string): string {
  if (!name) return '?';
  const cleanName = name.replace(/[\[\]\(\)\-\:\.\[\]]/g, ' ').trim();
  const words = cleanName.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    const first = words[0][0] || '';
    const second = words[1][0] || '';
    return (first + second).toUpperCase();
  }
  return name.trim().substring(0, 2).toUpperCase();
}

const rawMockChannels = [
  {
    id: 'ch-chilevision',
    name: 'Chilevisión',
    url: 'https://redirector.rudo.video/hls-video/10b92cafdf3646cbc1e727f3dc76863621a327fd/chv/chv.smil/playlist.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Emblema_de_Chilevisi%C3%B3n.svg',
    group: 'General',
    resolution: '1080p',
    program: {
      title: 'Contigo en la Mañana',
      start: '08:00',
      end: '13:00',
      progress: 0.65,
    },
  },
  {
    id: 'ch-canal13',
    name: 'Canal 13',
    url: 'https://redirector.rudo.video/hls-video/ey6283je82983je9823je8jowowiekldk9838274/13popup/13popup.smil/playlist.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Emblema_del_Canal_13_Chile.svg',
    group: 'General',
    resolution: '1080p',
    program: {
      title: 'Tu Día',
      start: '08:00',
      end: '13:00',
      progress: 0.55,
    },
  },
  {
    id: 'ch-24horas',
    name: '24 Horas',
    url: 'https://mdstrm.com/live-stream-playlist/689ba606ecfe7915e1f8f741.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Logotipo_del_Canal_24_Horas.png',
    group: 'Noticias',
    resolution: '720p',
    program: {
      title: 'Noticias Express',
      start: '10:00',
      end: '12:00',
      progress: 0.8,
    },
  },
  {
    id: 'ch-chvnoticias',
    name: 'CHV Noticias',
    url: 'https://mdstrm.com/live-stream-playlist/6491ced935a5833c47dd7f41.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/CHV_Noticias_2018.png',
    group: 'Noticias',
    resolution: '720p',
    program: {
      title: 'Noticiero Meridiano',
      start: '13:00',
      end: '15:30',
      progress: 0.1,
    },
  },
  {
    id: 'ch-radioadn',
    name: 'Radio ADN',
    url: 'https://redirector.rudo.video/hls-video/931b584451fa6dd1313ee66efbfd5802e3f3bcea/adntv/adntv.smil/playlist.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/ADN_Radio_Chile.svg',
    group: 'Música',
    resolution: '1080p',
    program: {
      title: 'Los Tenores',
      start: '14:00',
      end: '15:30',
      progress: 0.3,
    },
  },
  {
    id: 'ch-biobiotv',
    name: 'Radio Biobio TV',
    url: 'https://redirector.rudo.video/hls-video/339f69c6122f6d8f4574732c235f09b7683e31a5/bbtv/bbtv.smil/playlist.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Biobio_TV_logo.jpg',
    group: 'Música',
    resolution: '720p',
    program: {
      title: 'Bío Bío Deportes',
      start: '13:30',
      end: '14:30',
      progress: 0.45,
    },
  },
  {
    id: 'ch-carolinatv',
    name: 'Radio Carolina TV',
    url: 'https://mdstrm.com/live-stream-playlist/63a06468117f42713374addd.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Logo_Radio_Carolina_2020.png',
    group: 'Música',
    resolution: '720p',
    program: {
      title: 'Pegao a las Sábanas',
      start: '09:00',
      end: '12:00',
      progress: 0.9,
    },
  },
  {
    id: 'ch-agriculturatv',
    name: 'Agricultura TV',
    url: 'https://redirector.rudo.video/hls-video/ey6283je82983je9823je8jowowiekldk9838274/921tv/921tv.smil/playlist.m3u8',
    logo: 'https://graph.facebook.com/RadioAgricultura/picture?width=800&height=800',
    group: 'Música',
    resolution: '1080p',
    program: {
      title: 'Deportes en Agricultura',
      start: '14:00',
      end: '16:00',
      progress: 0.25,
    },
  },
  {
    id: 'ch-americatv',
    name: 'America TV',
    url: 'https://v2.tustreaming.cl/radioamericatv/index.m3u8',
    logo: 'https://radioamerica.cl/wp-content/uploads/2025/07/logo-america.png',
    group: 'General',
    resolution: '1080p',
    program: {
      title: 'Conexión América',
      start: '12:00',
      end: '14:00',
      progress: 0.5,
    },
  },
  {
    id: 'ch-antofagastatv',
    name: 'Antofagasta TV',
    url: 'https://unlimited1-cl-isp.dps.live/atv/atv.smil/playlist.m3u8',
    logo: 'https://graph.facebook.com/AntofagastaTelevision/picture?width=800&height=800',
    group: 'General',
    resolution: '1080p',
    program: {
      title: 'Noticiero Central',
      start: '20:00',
      end: '21:30',
      progress: 0.0,
    },
  },
];

export const MOCK_CHANNELS: ParsedChannel[] = rawMockChannels.map((c) => ({
  ...c,
  fallbackColor: getDeterministicColor(c.name),
  fallbackText: getFallbackText(c.name),
}));
