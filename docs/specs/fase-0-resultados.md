# Fase 0: resultados en el televisor

Mediciones de las hipótesis de la [spec](fase-0-prueba-de-concepto.md) en el televisor real (Samsung QN50QEF1AGXZS). Completa la tabla siguiendo la guía de abajo; con eso se cierra el ticket 10 y se decide si la fase 1 sigue tal cual.

## Resultados

| # | Hipótesis | Umbral | Medido | ¿Cumple? |
|---|---|---|---|---|
| H1 | Instalación reproducible | Un comando desde un clon limpio | | |
| H2 | Todas las teclas llegan | ↑↓←→, OK, Back, CH±, Play/Pause, 0–9, colores | | |
| H3 | Zapping rápido | Mediana < 1,5 s (10 Zappings) | | |
| H4 | Lista de Chile en el televisor | Sin errores; procesamiento < 100 ms | | |
| H5 | Lista fluida | ≥ 50 FPS promedio; ningún cuadro > 100 ms | | |
| H6 | Persistencia | Sobrevive a cerrar la app y a apagar el televisor | | |
| H7 | Arranque rápido | < 3 s hasta poder usarla; JS inicial < 60 KiB | Web 13,3 KiB · Tizen 14,2 KiB (CI) | |

**Datos del televisor** (de Diagnóstico): Versión · Tizen · Chromium · Modelo · Firmware · Resolución.

**Canales de Chile que muestran video:** __ de los primeros 20 en el televisor.

**Veredicto:** _(seguir con la fase 1 tal cual, o con qué cambios)_

## Guía de la sesión (≈ 1 hora)

Antes, una sola vez: pasos 1 a 4 de [`docs/tizen.md`](../tizen.md) (Tizen Studio, modo desarrollador, certificado y `.env.local`).

1. **H1 · Instalar.** En un clon limpio: `git checkout v0.1.0 && npm ci && npm run tizen:package && npm run tizen:install`. Anota si funcionó sin pasos manuales y cualquier error. La app abre en **Diagnóstico**.
2. **Datos del televisor.** Anota Versión, Tizen, Chromium, Modelo, Firmware y Resolución.
3. **H4 · Lista.** Anota la fila *Lista de Chile*: Canales, Fuentes, descarga y procesamiento.
4. **H2 · Teclas.** Presiona cada tecla de la tabla y mira *Última tecla*: debe decir su nombre (por ejemplo `ChannelUp (427)`). Anota cualquiera que no llegue o que haga otra cosa (por ejemplo, abrir un menú del televisor). Al final, Back dos veces debe cerrar la app.
5. **H7 · Arranque.** Abre la app tres veces desde el ícono, cronometrando hasta ver Diagnóstico. Anota los tres tiempos y el valor de *Arranque*.
6. **H6 · Persistencia.** *Aperturas* debe haber subido con cada apertura. Apaga el televisor por completo (desenchufado 10 s), enciéndelo, abre la app: debe seguir subiendo.
7. **H3 · Zapping.** Tecla **verde** (Reproducción). Haz CH+ diez veces, esperando a ver imagen en cada canal, y anota la *mediana* que aparece. Cuenta cuántos de los primeros 20 canales muestran video y cuántos quedan en *Canal no disponible*.
8. **H5 · Lista.** Tecla **amarilla** (Lista 2000). Mantén ↓ presionado unos 10 s y anota *FPS* y *peor cuadro*.

Si algo falla o se ve raro, una foto de la pantalla sirve más que una descripción.
