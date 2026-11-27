import { For } from 'solid-js';
import type { KeyPress, SystemInfo } from '../../platform/types';
import styles from './Diagnostics.module.css';
import type { PlaylistProbe } from './probePlaylist';

interface Props {
  info: SystemInfo;
  lastKey: KeyPress | null;
  playlist: PlaylistProbe;
}

const PLATFORM_LABELS: Record<SystemInfo['platform'], string> = {
  web: 'Web',
  tizen: 'Tizen (Samsung)',
};

export function Diagnostics(props: Props) {
  const rows = (): Array<{ label: string; value: string; long?: boolean }> => {
    const { info } = props;
    return [
      { label: 'Plataforma', value: PLATFORM_LABELS[info.platform] },
      { label: 'Chromium', value: info.chromium ?? 'No detectado' },
      { label: 'Tizen', value: info.tizen ?? '—' },
      { label: 'Modelo', value: info.model ?? '—' },
      { label: 'Firmware', value: info.firmware ?? '—' },
      {
        label: 'Resolución',
        value: `${info.viewport.width}×${info.viewport.height} @${info.viewport.pixelRatio}x`,
      },
      { label: 'Lista de Chile', value: describePlaylist(props.playlist) },
      { label: 'Última tecla', value: describeKey(props.lastKey) },
      { label: 'User agent', value: info.userAgent, long: true },
    ];
  };

  return (
    <section class={styles.screen}>
      <h1 class={styles.title}>Diagnóstico</h1>
      <table class={styles.table}>
        <tbody>
          <For each={rows()}>
            {(row) => (
              <tr>
                <th scope="row">{row.label}</th>
                <td class={row.long ? styles.long : undefined}>{row.value}</td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </section>
  );
}

function describeKey(press: KeyPress | null): string {
  if (!press) return 'Presiona una tecla del control';
  return `${press.key ?? 'Desconocida'} (${press.raw})`;
}

function describePlaylist(probe: PlaylistProbe): string {
  switch (probe.state) {
    case 'loading':
      return 'Descargando…';
    case 'failed':
      return `No se pudo descargar (${probe.reason})`;
    case 'loaded':
      return `${probe.channels} Canales · ${probe.sources} Fuentes · descarga ${probe.downloadMs} ms · procesamiento ${probe.parseMs} ms`;
  }
}
