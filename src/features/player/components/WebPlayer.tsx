import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { VolumeX } from 'lucide-react';
import type { PlayerProps } from './types';

export const WebPlayer: React.FC<PlayerProps> = ({
  url,
  onError,
  onBuffering,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Stable refs for callbacks — prevents stale closures and avoids HLS
  // being destroyed/recreated whenever the parent re-renders.
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
    let hls: Hls | null = null;

    const handlePlaying = () => {
      onBufferingRef.current?.(false);
    };

    const handleWaiting = () => {
      onBufferingRef.current?.(true);
    };

    const handleCanPlay = () => {
      onBufferingRef.current?.(false);
    };

    const handlePlay = () => {
      setIsPaused(false);
    };

    const handlePause = () => {
      setIsPaused(true);
    };

    const handleVolumeChange = () => {
      setIsMuted(video.muted);
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
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleNativeError);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);

    // Try to autoplay muted
    const tryAutoplay = async () => {
      try {
        video.muted = true;
        await video.play();
      } catch (err) {
        console.warn('Fallo al reproducir automáticamente:', err);
      }
    };

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (e.g. Safari)
      video.src = url;
      tryAutoplay();
    } else if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
      });

      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        tryAutoplay();
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
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleNativeError);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);

      if (hls) {
        hls.destroy();
      }
      video.src = '';
    };
  }, [url]);

  const handlePlayerClick = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.muted) {
      video.muted = false;
    } else {
      if (video.paused) {
        video.play().catch((err) => {
          console.warn('Fallo al reproducir al hacer clic:', err);
        });
      } else {
        video.pause();
      }
    }
  };

  return (
    <div 
      onClick={handlePlayerClick}
      className="relative w-full h-full cursor-pointer flex items-center justify-center"
    >
      <video
        ref={videoRef}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          backgroundColor: 'black',
        }}
        playsInline
        muted
      />
      {!isPaused && isMuted && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/75 border border-white/10 rounded-full px-4 py-2 text-white shadow-lg animate-fade-in hover:scale-105 transition-transform">
          <VolumeX className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-semibold select-none">
            Silenciado (Haz clic para activar sonido)
          </span>
        </div>
      )}
    </div>
  );
};
