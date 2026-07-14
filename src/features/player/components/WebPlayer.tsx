import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { usePlayerInterface } from '../store/usePlayerInterface';
import type { PlayerProps } from './types'

/**
 * WebPlayer — optimized for fast zapping.
 *
 * Architecture: two separate effects.
 *   Effect 1 (mount/unmount, deps=[]):
 *     Creates the HLS instance once, attaches it to the <video> element,
 *     and sets up persistent event listeners. Destroyed only on unmount or
 *     when the parent forces a remount via `key` (explicit retry).
 *
 *   Effect 2 (source swap, deps=[url]):
 *     When the URL changes, calls hls.loadSource(newUrl) on the existing
 *     instance — no teardown, no re-attach. For Safari (native HLS) it
 *     simply updates video.src. This is the minimal operation needed for
 *     channel switching and avoids all the overhead of a full remount.
 *
 * In App.tsx the VideoPlayer key only includes `retryKey` (not channelId),
 * so the component persists across channel switches and only remounts on
 * an explicit user retry after an error.
 */
export const WebPlayer: React.FC<PlayerProps> = ({ url, onError, onBuffering }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Stable refs so that Effect 1 callbacks never capture stale closures.
  const onErrorRef = useRef(onError);
  const onBufferingRef = useRef(onBuffering);
  useEffect(() => {
    onErrorRef.current = onError;
    onBufferingRef.current = onBuffering;
  });

  // Tracks whether the current browser uses native HLS (Safari).
  // Determined once on mount and reused across source swaps.
  const isSafariNative = useRef(false);

  // The single long-lived HLS instance, reused across all channel changes.
  const hlsRef = useRef<Hls | null>(null);

  // ─── Effect 1: one-time mount setup ───────────────────────────────────────
  // Creates the HLS instance (or detects native HLS), attaches it to the
  // video element, and wires up persistent playback/error event listeners.
  // Cleanup (unmount / retryKey change) fully tears everything down.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlaying = () => onBufferingRef.current?.(false);
    const onWaiting = () => onBufferingRef.current?.(true);
    const onCanPlay = () => onBufferingRef.current?.(false);
    const onNativeError = (e: Event) => {
      const err = (e.target as HTMLVideoElement).error;
      onErrorRef.current?.(
        err
          ? `Error del reproductor: ${err.message} (código ${err.code})`
          : 'Error desconocido en el reproductor.'
      );
      onBufferingRef.current?.(false);
    };

    video.addEventListener('playing', onPlaying);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('error', onNativeError);

    isSafariNative.current = !!video.canPlayType('application/vnd.apple.mpegurl');

    if (!isSafariNative.current) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 60,
        });

        // Attach media once — reused for every subsequent loadSource call.
        hls.attachMedia(video);

        // Play as soon as each manifest is parsed. Safe because the VideoPlayer
        // is only mounted after the user's explicit gesture (ClickToPlayOverlay).
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => { /* policy-blocked; ignored */ });
        });

        hls.on(Hls.Events.ERROR, (_e, data) => {
          if (!data.fatal) return;
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              onErrorRef.current?.(`Error de reproducción (HLS): ${data.details}`);
              onBufferingRef.current?.(false);
          }
        });

        hlsRef.current = hls;
      } else {
        onErrorRef.current?.('HLS no está soportado en este navegador.');
        onBufferingRef.current?.(false);
      }
    }

    return () => {
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('error', onNativeError);
      hlsRef.current?.destroy();
      hlsRef.current = null;
      video.src = '';
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps — intentionally runs once

  // ─── Effect 2: source swap (runs on every URL change) ─────────────────────
  // This is the hot path for zapping. For hls.js, it calls loadSource() on the
  // existing instance — no instance teardown, no re-attach, minimal overhead.
  // For Safari native HLS it simply updates video.src.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    onBufferingRef.current?.(true);

    if (isSafariNative.current) {
      // Safari — native HLS: swap src and play once ready.
      video.src = url;
      let cancelled = false;
      const onReady = () => {
        if (cancelled) return;
        video.play().catch(() => { /* ignored */ });
        video.removeEventListener('canplay', onReady);
      };
      video.addEventListener('canplay', onReady);
      return () => {
        cancelled = true;
        video.removeEventListener('canplay', onReady);
      };
    }

    // hls.js — hot swap: no destroy/recreate, just swap the source.
    const hls = hlsRef.current;
    if (hls) {
      hls.stopLoad();
      hls.loadSource(url);
      // hls.js calls startLoad internally after loadSource; MANIFEST_PARSED
      // will fire and trigger video.play() via the listener in Effect 1.
    }
  }, [url]);

  const { toggleInterface } = usePlayerInterface();

  return (
    <div
      onClick={(e) => { e.stopPropagation(); toggleInterface(); }}
      className="relative w-full h-full cursor-pointer flex items-center justify-center"
    >
      <video
        ref={videoRef}
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: 'black' }}
      />
    </div>
  );
};
