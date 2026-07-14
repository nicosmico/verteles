import React, { useEffect, useRef } from 'react';
import type { PlayerProps } from './types';

export const TizenPlayer: React.FC<PlayerProps> = ({
  url,
  autoplay = true,
  onPlayStateChange,
  onError,
  onBuffering,
}) => {
  // Stable refs for callbacks — prevents the main effect from re-running
  // when the parent re-renders and passes new function references.
  const onPlayStateChangeRef = useRef(onPlayStateChange);
  const onErrorRef = useRef(onError);
  const onBufferingRef = useRef(onBuffering);

  useEffect(() => {
    onPlayStateChangeRef.current = onPlayStateChange;
    onErrorRef.current = onError;
    onBufferingRef.current = onBuffering;
  });

  // Effect 1: Initialize AVPlay — only re-runs when the URL changes.
  useEffect(() => {
    const webapis = (window as any).webapis;
    if (!webapis || !webapis.avplay) {
      const errorMsg = 'Samsung WebAPIs o AVPlay no están disponibles en este entorno.';
      console.warn(errorMsg);
      onErrorRef.current?.(errorMsg);
      return;
    }

    const avplay = webapis.avplay;
    let isPrepared = false;

    console.log(`AVPlay: Inicializando reproducción para: ${url}`);

    try {
      // 1. Open stream url
      avplay.open(url);

      // 2. Set display coordinates (always based on 1920x1080 virtual resolution)
      avplay.setDisplayRect(0, 0, 1920, 1080);

      // 3. Set display method to preserve aspect ratio with letterbox (contain)
      avplay.setDisplayMethod('PLAYER_DISPLAY_MODE_LETTER_BOX');

      // 4. Configure event listeners
      avplay.setListener({
        onbufferingstart: () => {
          console.log('AVPlay: Iniciando almacenamiento en búfer');
          onBufferingRef.current?.(true);
        },
        onbufferingcomplete: () => {
          console.log('AVPlay: Almacenamiento en búfer completado');
          onBufferingRef.current?.(false);
        },
        onstreamcompleted: () => {
          console.log('AVPlay: Transmisión completada');
          onPlayStateChangeRef.current?.(false);
        },
        onerror: (error: any) => {
          console.error('AVPlay Error de reproducción:', error);
          onErrorRef.current?.(`Error del reproductor de TV: ${error.name || 'Desconocido'}`);
        },
      });

      // 5. Prepare asynchronously (recommended non-blocking)
      onBufferingRef.current?.(true);
      avplay.prepareAsync(
        () => {
          isPrepared = true;
          console.log('AVPlay: Preparación exitosa.');
          try {
            avplay.play();
            onPlayStateChangeRef.current?.(true);
          } catch (playError: any) {
            console.error('AVPlay: Error al iniciar play:', playError);
            onErrorRef.current?.(`Fallo al iniciar reproducción: ${playError.name || playError}`);
          }
          onBufferingRef.current?.(false);
        },
        (error: any) => {
          console.error('AVPlay: Error en prepareAsync:', error);
          onErrorRef.current?.(`Error al preparar el flujo de video: ${error.name || 'Desconocido'}`);
          onBufferingRef.current?.(false);
        }
      );
    } catch (e: any) {
      console.error('AVPlay: Excepción en inicialización:', e);
      onErrorRef.current?.(`Error al configurar el reproductor: ${e.message || e}`);
      onBufferingRef.current?.(false);
    }

    return () => {
      console.log('AVPlay: Limpiando recursos y cerrando stream.');
      try {
        if (isPrepared) {
          avplay.stop();
        }
      } catch (stopErr) {
        console.warn('AVPlay exception during stop():', stopErr);
      }

      try {
        avplay.close();
      } catch (closeErr) {
        console.warn('AVPlay exception during close():', closeErr);
      }

      onPlayStateChangeRef.current?.(false);
      onBufferingRef.current?.(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  // Effect 2: Handle play/pause imperatively without recreating AVPlay.
  useEffect(() => {
    const webapis = (window as any).webapis;
    if (!webapis || !webapis.avplay) return;

    const avplay = webapis.avplay;

    try {
      if (autoplay) {
        avplay.play();
        onPlayStateChangeRef.current?.(true);
      } else {
        avplay.pause();
        onPlayStateChangeRef.current?.(false);
      }
    } catch (e: any) {
      // AVPlay may throw if called before prepareAsync completes — safe to ignore
      console.warn('AVPlay play/pause control warning:', e.message || e);
    }
  }, [autoplay]);

  return (
    <object
      id="avplay"
      type="application/avplayer"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        backgroundColor: 'transparent',
      }}
    />
  );
};
