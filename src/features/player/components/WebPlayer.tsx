import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import type { PlayerProps } from './types';

export const WebPlayer: React.FC<PlayerProps> = ({
  url,
  autoplay = true,
  onPlayStateChange,
  onError,
  onBuffering,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Stable refs for callbacks — prevents stale closures and avoids HLS
  // being destroyed/recreated whenever the parent re-renders.
  const onPlayStateChangeRef = useRef(onPlayStateChange);
  const onErrorRef = useRef(onError);
  const onBufferingRef = useRef(onBuffering);

  useEffect(() => {
    onPlayStateChangeRef.current = onPlayStateChange;
    onErrorRef.current = onError;
    onBufferingRef.current = onBuffering;
  });

  // Effect 1: Initialize HLS and attach event listeners — only re-runs when URL changes.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    onBufferingRef.current?.(true);
    let hls: Hls | null = null;

    const handlePlaying = () => {
      onPlayStateChangeRef.current?.(true);
      onBufferingRef.current?.(false);
    };

    const handlePause = () => {
      onPlayStateChangeRef.current?.(false);
    };

    const handleWaiting = () => {
      onBufferingRef.current?.(true);
    };

    const handleCanPlay = () => {
      onBufferingRef.current?.(false);
    };

    const handleNativeError = (e: Event) => {
      const mediaError = (e.target as HTMLVideoElement).error;
      const errorMsg = mediaError
        ? `Error nativo del reproductor: ${mediaError.message} (Código ${mediaError.code})`
        : 'Error nativo desconocido en el reproductor de video.';
      onErrorRef.current?.(errorMsg);
      onBufferingRef.current?.(false);
    };

    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleNativeError);

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (e.g. Safari)
      video.src = url;
      video.play().catch((err) => {
        console.warn('Fallo al reproducir automáticamente:', err);
      });
    } else if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
      });

      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((err) => {
          console.warn('Fallo al reproducir automáticamente (HLS.js):', err);
        });
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.error('HLS.js Error:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.warn('Error fatal de red, intentando recuperar...');
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.warn('Error fatal de medios, intentando recuperar...');
              hls?.recoverMediaError();
              break;
            default:
              onErrorRef.current?.(`Error fatal de reproducción (HLS.js): ${data.details}`);
              onBufferingRef.current?.(false);
              break;
          }
        }
      });
    } else {
      onErrorRef.current?.('La reproducción HLS no está soportada en este navegador.');
      onBufferingRef.current?.(false);
    }

    return () => {
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleNativeError);

      if (hls) {
        hls.destroy();
      }
      video.src = '';
    };
  }, [url]);

  // Effect 2: Handle play/pause imperatively without touching the HLS instance.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (autoplay) {
      video.play().catch((err) => {
        console.warn('Error al reanudar reproducción:', err);
      });
    } else {
      video.pause();
    }
  }, [autoplay]);

  return (
    <video
      ref={videoRef}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        backgroundColor: 'black',
      }}
      playsInline
    />
  );
};
