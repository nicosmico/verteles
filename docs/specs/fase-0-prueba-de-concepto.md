# Spec — Fase 0: Prueba de concepto

**Versión:** `v0.1.0` · **Estado:** propuesta

## Problema

La v0.1 anterior se construyó sin validar en el televisor real lo que más importa: que el stack rinda en una CPU de TV, que el control remoto se pueda capturar entero, que AVPlay cambie de canal rápido y que exista un camino reproducible para instalar la app. Antes de construir la app de verdad, necesitamos **evidencia medida en el televisor del usuario** (Samsung QN50QEF1AGXZS) de que las decisiones de los ADR 0002–0009 se sostienen.

## Solución

Una app mínima (el **spike**) con las capas reales (`domain/`, `platform/`, `ui/`) y tres pantallas de prueba que se cambian con las teclas de color del control (F1–F4 en el teclado de la web):

| Tecla | Pantalla | Qué mide |
|---|---|---|
| Rojo / F1 | **Diagnóstico** | Plataforma, versión de Chromium y Tizen, modelo, resolución, tiempo de arranque, conteo de aperturas, resumen de la Lista de Chile, última tecla recibida. |
| Verde / F2 | **Reproducción** | Canales de Chile en pantalla completa, Zapping con CH± y ↑↓, respaldo automático entre Fuentes y tiempo hasta el primer cuadro de cada Zapping. |
| Amarillo / F3 | **Lista 2000** | Lista virtualizada de 2.000 Canales con logos, recorrida con el gestor de foco, con medidor de FPS. |

Las pantallas son desechables. Lo que sobrevive a la fase 1 son el pipeline de build y empaquetado, los adaptadores de `platform/`, el parser y la agrupación de `domain/`, el núcleo del gestor de foco y los tokens CSS.

## Hipótesis a validar (criterios de salida)

Cada hipótesis se mide en el televisor real y el resultado se registra en `docs/specs/fase-0-resultados.md`.

| # | Hipótesis | Umbral |
|---|---|---|
| H1 | Existe un comando reproducible que genera un `.wgt` firmado e instalable en el televisor | Desde un clon limpio, con el certificado presente: un comando, sin pasos manuales en Tizen Studio |
| H2 | Se capturan todas las teclas necesarias | ↑↓←→, OK, Back, CH±, Play/Pause, 0–9 y teclas de color llegan como teclas lógicas; Back no cierra la app sin permiso |
| H3 | AVPlay hace Zapping rápido | Mediana de tecla → primer cuadro **< 1,5 s** sobre 10 Zappings entre Canales que funcionan |
| H4 | La Lista de Chile se descarga y procesa en el televisor | Descarga sin errores de CORS; parseo y agrupación de las 247 entradas **< 100 ms** |
| H5 | Solid más el gestor de foco recorren una lista grande con fluidez | Mantener ↓ durante 10 s sobre 2.000 Canales: **≥ 50 FPS de promedio** y ningún cuadro > 100 ms |
| H6 | IndexedDB persiste | Un dato guardado sobrevive a cerrar la app y a apagar el televisor |
| H7 | La app arranca rápido | Desde lanzar la app hasta el primer cuadro interactivo **< 3 s**; JS inicial **< 60 KB gzip** (sin contar hls.js en web) |

Si una hipótesis falla, se discute antes de la fase 1 y se actualiza el ADR correspondiente (por ejemplo, cambiar de framework si falla H5).

## Historias

1. Como dueño del televisor, quiero instalar la app con un solo comando para no depender de Tizen Studio cada vez.
2. Como dueño del televisor, quiero ver en una pantalla qué versión de Tizen y Chromium tengo para saber qué soporta mi televisor.
3. Como espectador, quiero cambiar de canal con CH± y ver la imagen en menos de 1,5 s.
4. Como espectador, quiero que un canal con varias Fuentes pase solo a la siguiente si la primera falla.
5. Como desarrollador, quiero ver los FPS reales al recorrer una lista larga para saber si el stack aguanta.
6. Como desarrollador, quiero probar todo en la web antes de instalar en el televisor.

## Decisiones de implementación

- **Tooling:** Vite + `vite-plugin-solid` + TypeScript estricto, `build.target: 'chrome85'`. Vitest para unit e integración, Playwright para e2e (solo web). npm.
- **Plataforma al compilar:** `vite build --mode <web|tizen>`. Un alias `@platform` resuelve a `src/platform/<modo>/`, así cada build incluye solo su adaptador (ADR-0005).
- **Interfaces de `platform/`:** `Player`, `RemoteKeys`, `Storage`, `AppLifecycle` y `SystemInfo`. `domain/` define las teclas lógicas (`Up`, `Down`, `Ok`, `Back`, `ChannelUp`, `Red`…) y cada adaptador traduce sus códigos crudos.
- **Parser M3U propio** en `domain/`, en vez de `iptv-playlist-parser`: el formato que necesitamos es pequeño, la agrupación por Identidad de canal es nuestra (ADR-0009) y evitamos una dependencia CommonJS sin mantenimiento.
- **Tizen:** AVPlay vía `webapis.avplay`; teclas con `tizen.tvinputdevice.registerKey`; salida con `tizen.application.getCurrentApplication().exit()`. El `config.xml` vive en `platform/tizen/` y se copia al build.
- **Web:** hls.js cargado solo en el build web, reutilizando la instancia entre Zappings. En desarrollo, la Lista se pide por el proxy de Vite (ADR-0004).
- **Storage:** IndexedDB con un wrapper mínimo propio, o `idb-keyval` si pesa menos de 1 KB.
- **Estilos:** CSS Modules con tokens (ADR-0006), lienzo de 1920×1080.

## Decisiones de testing

- **Unit (TDD):** parser M3U, normalización e Identidad de canal, agrupación de Fuentes, Número de canal, traducción de teclas crudas a lógicas por plataforma, núcleo del gestor de foco y política de respaldo de Fuentes. Fixture: una copia versionada de la Lista de Alplox.
- **Integración:** pantallas del spike con adaptadores falsos de `Player` y `RemoteKeys`.
- **E2E (Playwright, web):** la app arranca, F1–F3 cambian de pantalla, ↓ mueve el foco en Lista 2000.
- **En el televisor (HITL):** cada hipótesis H1–H7, con valores anotados en el informe de resultados.

## Fuera de alcance

Diseño visual definitivo, Banner de canal, Selector de canales, Favoritos, gestión de Listas, búsqueda, webOS y Android TV.

## Notas

- Instalar en un televisor físico requiere un certificado de autor y uno de distribuidor de Samsung asociado al DUID del televisor. Generarlos es un paso HITL único.
- Si firmar en GitHub Actions no es viable (por ejemplo, si el SDK no se puede descargar en CI), el `.wgt` del Release se publica sin firmar y se firma localmente. Lo decide el ticket 09.
