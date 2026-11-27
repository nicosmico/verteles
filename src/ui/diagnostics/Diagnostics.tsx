import { For } from 'solid-js';
import type { KeyPress, SystemInfo } from '../../platform/types';
import styles from './Diagnostics.module.css';

interface Props {
  info: SystemInfo;
  lastKey: KeyPress | null;
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
