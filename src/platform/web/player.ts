import type Hls from 'hls.js';
import type { PlayerEvent } from '../../domain/playback/tuner';
import type { Player } from '../types';

/**
 * HTML5 video. Browsers that play HLS natively (Safari, iPhone) get the URL
 * directly; the rest use hls.js (light build: no DRM, subtitles or alternate
 * audio), loaded on first use and reused across Zappings so channel changes
 * skip its setup.
 */
export function createWebPlayer(container: HTMLElement): Player {
  const video = document.createElement('video');
  video.playsInline = true;
  video.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000';
  container.appendChild(video);

  const playsHlsNatively = video.canPlayType('application/vnd.apple.mpegurl') !== '';
  let hls: Hls | null = null;
  let onEvent: ((event: PlayerEvent) => void) | null = null;
  let shownFrame = false;

  const emit = (event: PlayerEvent) => onEvent?.(event);
  video.addEventListener('playing', () => {
    if (shownFrame) return;
    shownFrame = true;
    emit('playing');
  });
  video.addEventListener('error', () => emit('error'));

  const play = () =>
    video.play().catch((error: DOMException) => {
      // Autoplay with sound needs a user gesture; muted playback is always allowed.
      if (error.name !== 'NotAllowedError') return;
      video.muted = true;
      void video.play().catch(() => {});
    });

  const useHls = async (url: string, handler: (event: PlayerEvent) => void) => {
    const { default: HlsJs } = await import('hls.js/light');
    if (onEvent !== handler) return; // A newer load() took over while hls.js was loading.
    if (!HlsJs.isSupported()) return handler('error');
    if (!hls) {
      const instance = new HlsJs();
      instance.attachMedia(video);
      instance.on(HlsJs.Events.ERROR, (_, data) => {
        if (!data.fatal) return;
        // A fatal error leaves hls.js unusable: start fresh on the next load.
        instance.destroy();
        if (hls === instance) hls = null;
        emit('error');
      });
      hls = instance;
    }
    hls.loadSource(url);
    play();
  };

  const stop = () => {
    onEvent = null;
    hls?.stopLoad();
    video.pause();
    video.removeAttribute('src');
  };

  return {
    load(url, handler) {
      onEvent = handler;
      shownFrame = false;
      if (playsHlsNatively) {
        video.src = url;
        play();
      } else {
        void useHls(url, handler);
      }
    },
    stop,
    destroy() {
      stop();
      hls?.destroy();
      hls = null;
      video.remove();
    },
  };
}
