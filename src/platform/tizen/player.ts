import type { PlayerEvent } from '../../domain/playback/tuner';
import type { Player } from '../types';
import type { SamsungGlobals } from './samsung';
import { read } from './systemInfo';

/**
 * Samsung AVPlay: hardware playback on a video plane behind the web page, so
 * the page must stay transparent where the video shows. The `<object>` marks
 * where AVPlay draws; coordinates use the app's 1920×1080 resolution.
 */
export function createTizenPlayer(container: HTMLElement): Player {
  const surface = document.createElement('object');
  surface.setAttribute('type', 'application/avplayer');
  surface.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
  container.appendChild(surface);

  const avplay = () => (window as SamsungGlobals).webapis?.avplay;
  // Each load gets an id; callbacks from an older load are dropped.
  let currentLoad = 0;

  const reset = () => {
    read(() => avplay()?.stop());
    read(() => avplay()?.close());
  };

  const stop = () => {
    currentLoad++;
    reset();
  };

  return {
    load(url, onEvent) {
      const load = ++currentLoad;
      const emit = (event: PlayerEvent) => load === currentLoad && onEvent(event);
      const av = avplay();
      if (!av) return emit('error');
      reset();
      try {
        av.open(url);
        av.setDisplayRect(0, 0, 1920, 1080);
        av.setDisplayMethod('PLAYER_DISPLAY_MODE_LETTER_BOX');
        let shownFrame = false;
        av.setListener({
          // The first playback-time tick is the closest AVPlay gets to "first frame shown".
          oncurrentplaytime: () => {
            if (shownFrame) return;
            shownFrame = true;
            emit('playing');
          },
          onerror: () => emit('error'),
          onstreamcompleted: () => emit('error'),
        });
        av.prepareAsync(
          () => load === currentLoad && read(() => av.play()),
          () => emit('error'),
        );
      } catch {
        emit('error');
      }
    },
    stop,
    destroy() {
      stop();
      surface.remove();
    },
  };
}
