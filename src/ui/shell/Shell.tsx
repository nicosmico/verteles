import { platform } from '@platform';
import { createSignal, For, Match, onCleanup, Switch } from 'solid-js';
import type { RemoteKey } from '../../domain/remote/remoteKey';
import type { KeyPress } from '../../platform/types';
import { CHILE } from '../../domain/playlist/suggested';
import { Diagnostics } from '../diagnostics/Diagnostics';
import { probePlaylist, type PlaylistProbe } from '../diagnostics/probePlaylist';
import { Placeholder } from '../placeholder/Placeholder';
import { recordLaunch } from '../diagnostics/launches';
import { createExitGuard } from './exitGuard';
import styles from './Shell.module.css';

type Screen = 'diagnostics' | 'playback' | 'list';

const SCREEN_KEYS: Partial<Record<RemoteKey, Screen>> = {
  Red: 'diagnostics',
  Green: 'playback',
  Yellow: 'list',
};

const LEGEND: Array<{ screen: Screen; label: string; color: 'red' | 'green' | 'yellow' }> = [
  { screen: 'diagnostics', label: 'Diagnóstico', color: 'red' },
  { screen: 'playback', label: 'Reproducción', color: 'green' },
  { screen: 'list', label: 'Lista 2000', color: 'yellow' },
];

const EXIT_WINDOW_MS = 2000;

/** The phase 0 spike: three test screens switched with the remote's color keys. */
export function Shell() {
  const [screen, setScreen] = createSignal<Screen>('diagnostics');
  const [lastKey, setLastKey] = createSignal<KeyPress | null>(null);
  const [exitPrompt, setExitPrompt] = createSignal(false);
  const [playlist, setPlaylist] = createSignal<PlaylistProbe>({ state: 'loading' });
  const systemInfo = platform.systemInfo();
  void probePlaylist(CHILE, platform.fetchText).then(setPlaylist);
  const [launches, setLaunches] = createSignal<number | null | undefined>(undefined);
  void platform
    .openStorage()
    .then(recordLaunch)
    .then(setLaunches, () => setLaunches(null));

  const exitGuard = createExitGuard({ windowMs: EXIT_WINDOW_MS });
  let hidePrompt: ReturnType<typeof setTimeout> | undefined;

  const onKey = (press: KeyPress) => {
    setLastKey(press);
    const target = press.key && SCREEN_KEYS[press.key];
    if (target) setScreen(target);
    if (press.key === 'Back') onBack();
  };

  const onBack = () => {
    if (exitGuard.pressBack(performance.now()) === 'exit') return platform.exit();
    setExitPrompt(true);
    clearTimeout(hidePrompt);
    hidePrompt = setTimeout(() => setExitPrompt(false), EXIT_WINDOW_MS);
  };

  onCleanup(platform.listenKeys(onKey));
  onCleanup(() => clearTimeout(hidePrompt));

  return (
    <>
      <Switch>
        <Match when={screen() === 'diagnostics'}>
          <Diagnostics info={systemInfo} lastKey={lastKey()} playlist={playlist()} launches={launches()} />
        </Match>
        <Match when={screen() === 'playback'}>
          <Placeholder title="Reproducción" ticket="05" />
        </Match>
        <Match when={screen() === 'list'}>
          <Placeholder title="Lista 2000" ticket="06" />
        </Match>
      </Switch>
      <nav class={styles.legend}>
        <For each={LEGEND}>
          {(item) => (
            // Tappable on phones; the remote reaches screens through the color keys instead.
            <button type="button" tabIndex={-1} class={styles[item.color]} onClick={() => setScreen(item.screen)}>
              {item.label}
            </button>
          )}
        </For>
      </nav>
      <div role="status" class={styles.toast} classList={{ [styles.visible as string]: exitPrompt() }}>
        {exitPrompt() ? 'Presiona Back otra vez para salir' : ''}
      </div>
    </>
  );
}
