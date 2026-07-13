import React, { useEffect } from 'react';
import type { PlayerProps } from './types';

export const TizenPlayer: React.FC<PlayerProps> = ({
  url,
  autoplay = true,
  onPlayStateChange,
  onError,
  onBuffering,
}) => {
  useEffect(() => {
    // 1. Check if Samsung WebAPIs are available
    const webapis = (window as any).webapis;
    if (!webapis || !webapis.avplay) {
      const errorMsg = 'Samsung WebAPIs o AVPlay no están disponibles en este entorno.';
      console.warn(errorMsg);
      onError?.(errorMsg);
      return;
    }

    const avplay = webapis.avplay;
    let isPrepared = false;

    console.log(`AVPlay: Inicializando reproducción para: ${url}`);

    try {
      // 2. Open stream url
      avplay.open(url);

      // 3. Set display coordinates (always based on 1920x1080 virtual resolution)
      avplay.setDisplayRect(0, 0, 1920, 1080);

      // 4. Set display method to preserve aspect ratio with letterbox (contain)
      avplay.setDisplayMethod('PLAYER_DISPLAY_MODE_LETTER_BOX');

      // 5. Configure event listeners
      avplay.setListener({
        onbufferingstart: () => {
          console.log('AVPlay: Iniciando almacenamiento en búfer');
          onBuffering?.(true);
        },
        onbufferingcomplete: () => {
          console.log('AVPlay: Almacenamiento en búfer completado');
          onBuffering?.(false);
        },
        onstreamcompleted: () => {
          console.log('AVPlay: Transmisión completada');
          onPlayStateChange?.(false);
        },
        onerror: (error: any) => {
          console.error('AVPlay Error de reproducción:', error);
          onError?.(`Error del reproductor de TV: ${error.name || 'Desconocido'}`);
        },
      });

      // 6. Prepare asynchronously (recommended non-blocking)
      onBuffering?.(true);
      avplay.prepareAsync(
        () => {
          isPrepared = true;
          console.log('AVPlay: Preparación exitosa.');
          if (autoplay) {
            try {
              avplay.play();
              onPlayStateChange?.(true);
            } catch (playError: any) {
              console.error('AVPlay: Error al iniciar play:', playError);
              onError?.(`Fallo al iniciar reproducción: ${playError.name || playError}`);
            }
          }
          onBuffering?.(false);
        },
        (error: any) => {
          console.error('AVPlay: Error en prepareAsync:', error);
          onError?.(`Error al preparar el flujo de video: ${error.name || 'Desconocido'}`);
          onBuffering?.(false);
        }
      );
    } catch (e: any) {
      console.error('AVPlay: Excepción en inicialización:', e);
      onError?.(`Error al configurar el reproductor: ${e.message || e}`);
      onBuffering?.(false);
    }

    // Teardown
    return () => {
      console.log('AVPlay: Limpiando recursos y cerrando stream.');
      try {
        // Only stop if the stream was prepared/playing
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

      onPlayStateChange?.(false);
      onBuffering?.(false);
    };
  }, [url, autoplay, onPlayStateChange, onError, onBuffering]);

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
