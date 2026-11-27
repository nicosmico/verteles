import { platform } from '@platform';
import { createEffect, createSignal, For, Match, onCleanup, Show, Switch } from 'solid-js';
import type { RemoteKey } from '../../domain/remote/remoteKey';
import type { KeyPress } from '../../platform/types';
import { CHILE } from '../../domain/playlist/suggested';
import { Diagnostics } from '../diagnostics/Diagnostics';
import { probePlaylist, type PlaylistProbe } from '../diagnostics/probePlaylist';
import { Placeholder } from '../placeholder/Placeholder';
import { Playback } from '../playback/Playback';
import type { Storage } from '../../platform/types';
import { createKeyBus } from './keyBus';
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
  // undefined while opening; null when the platform cannot persist.
  const [storage, setStorage] = createSignal<Storage | null | undefined>(undefined);
  void platform.openStorage().then(
    async (opened) => {
      setStorage(opened);
      setLaunches(await recordLaunch(opened).catch(() => null));
    },
    () => {
      setStorage(null);
      setLaunches(null);
    },
  );
  const keys = createKeyBus();
  const channels = () => {
    const probe = playlist();
    return probe.state === 'loaded' ? probe.channels : null;
  };

  // On a TV, AVPlay draws behind the page: Reproducción must leave the page transparent.
  createEffect(() => (document.documentElement.dataset.screen = screen()));

  const exitGuard = createExitGuard({ windowMs: EXIT_WINDOW_MS });
  let hidePrompt: ReturnType<typeof setTimeout> | undefined;

  const onKey = (press: KeyPress) => {
    setLastKey(press);
    keys.emit(press);
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
          <Show
            when={channels() !== null && storage() !== undefined}
            fallback={<Placeholder title="Reproducción" detail={describeLoading(playlist())} />}
          >
            <Playback channels={channels() ?? []} storage={storage() ?? null} keys={keys} />
          </Show>
        </Match>
        <Match when={screen() === 'list'}>
          <Placeholder title="Lista 2000" detail="Llega en el ticket 06 de la fase 0." />
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

function describeLoading(probe: PlaylistProbe): string {
  return probe.state === 'failed' ? `No se pudo descargar la Lista de Chile (${probe.reason}).` : 'Cargando la Lista de Chile…';
}
