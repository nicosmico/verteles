# 04 — Lista de Chile: parser y Fuentes

**Tipo:** AFK + HITL · **Depende de:** 01 · **Valida:** H4

## Qué construir

En `domain/`: parser M3U (atributos `#EXTINF`, nombre, logo, Grupo, País), normalización e Identidad de canal, agrupación de entradas en Canales con Fuentes, filtro por País y Número de canal por posición (ADR-0009). En `platform/`: `fetchText` (directo en Tizen, por el proxy de Vite en desarrollo web). Diagnóstico muestra: entradas leídas, Canales de Chile, Fuentes totales y tiempos de descarga y de procesamiento.

## Criterios de aceptación

- [x] Fixture versionado de la Lista de Alplox. Tests unitarios escritos primero (TDD) para: `Atacama TV (1) [CL]` + `(2)` + `(3)` → un Canal con 3 Fuentes en orden; nombres con tildes y mayúsculas; entradas sin logo o sin Grupo; `tvg-id` presente gana sobre el nombre; líneas basura ignoradas.
- [x] El filtro `[CL]` sobre el fixture da un número estable de Canales, verificado en un test.
- [x] `domain/` no importa nada de `platform/` ni de `ui/`.
- [ ] **HITL:** en el televisor, la Lista se descarga sin error y el tiempo de procesamiento queda anotado en el informe.

## Notas de implementación

- `importPlaylist(text, { country })` en `src/domain/playlist/` es el único seam: parsea, agrupa Fuentes por Identidad de canal, filtra por País y numera.
- Fixture: `src/domain/playlist/fixtures/alplox-2026-11-26.m3u`. **188 entradas chilenas → 106 Canales.** Los valores esperados se calcularon con herramientas de shell, independientes del código.
- El parser tolera BOM, CRLF, comentarios, `#EXTVLCOPT`, entradas sin URL, URLs sin `#EXTINF` y comas dentro de atributos (`tvg-name="Mega, el canal"`).
- `raw.githubusercontent.com` responde con `access-control-allow-origin: *`, así que la web descarga la Lista sin proxy.
- Los e2e interceptan la descarga con el fixture, así que no dependen de internet.
