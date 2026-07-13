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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    // Callback helpers
    const handlePlaying = () => {
      onPlayStateChange?.(true);
      onBuffering?.(false);
    };

    const handlePause = () => {
      onPlayStateChange?.(false);
    };

    const handleWaiting = () => {
      onBuffering?.(true);
    };

    const handleCanPlay = () => {
      onBuffering?.(false);
    };

    const handleNativeError = (e: Event) => {
      const mediaError = (e.target as HTMLVideoElement).error;
      const errorMsg = mediaError
        ? `Error nativo del reproductor: ${mediaError.message} (Código ${mediaError.code})`
        : 'Error nativo desconocido en el reproductor de video.';
      onError?.(errorMsg);
    };

    // Attach native video element listeners
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleNativeError);

    // Initialize playback source
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (e.g. Safari)
      video.src = url;
      if (autoplay) {
        video.play().catch((err) => {
          console.warn('Fallo al reproducir automáticamente:', err);
        });
      }
    } else if (Hls.isSupported()) {
      // Use HLS.js
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
      });

      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoplay) {
          video.play().catch((err) => {
            console.warn('Fallo al reproducir automáticamente (HLS.js):', err);
          });
        }
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
              onError?.(`Error fatal de reproducción (HLS.js): ${data.details}`);
              break;
          }
        }
      });
    } else {
      onError?.('La reproducción HLS no está soportada en este navegador.');
    }

    return () => {
      // Cleanup events
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
  }, [url, autoplay, onPlayStateChange, onError, onBuffering]);

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
