import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { usePlayerInterface } from '../store/usePlayerInterface';
import type { PlayerProps } from './types';

export const WebPlayer: React.FC<PlayerProps> = ({ url, onError, onBuffering }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const onErrorRef = useRef(onError);
  const onBufferingRef = useRef(onBuffering);
  useEffect(() => {
    onErrorRef.current = onError;
    onBufferingRef.current = onBuffering;
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    onBufferingRef.current?.(true);

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

    let hls: Hls | null = null;
    // For Safari native HLS — one-shot play trigger; tracked for proper cleanup.
    let onCanPlayThrough: (() => void) | null = null;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari — native HLS. Play once canplay fires (user gesture already happened).
      video.src = url;
      onCanPlayThrough = () => {
        video.play().catch(() => {/* autoplay blocked despite gesture — silently ignore */});
        if (onCanPlayThrough) video.removeEventListener('canplay', onCanPlayThrough);
        onCanPlayThrough = null;
      };
      video.addEventListener('canplay', onCanPlayThrough);
    } else if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true, backBufferLength: 60 });
      hls.loadSource(url);
      hls.attachMedia(video);

      // Play as soon as manifest is ready — user gesture already satisfied by ClickToPlayOverlay.
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {/* silently ignore */});
      });

      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (!data.fatal) return;
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            hls?.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            hls?.recoverMediaError();
            break;
          default:
            onErrorRef.current?.(`Error de reproducción (HLS): ${data.details}`);
            onBufferingRef.current?.(false);
        }
      });
    } else {
      onErrorRef.current?.('HLS no está soportado en este navegador.');
      onBufferingRef.current?.(false);
    }

    return () => {
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('error', onNativeError);
      if (onCanPlayThrough) video.removeEventListener('canplay', onCanPlayThrough);
      hls?.destroy();
      video.src = '';
    };
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
