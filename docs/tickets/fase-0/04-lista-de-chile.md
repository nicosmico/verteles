# 04 — Lista de Chile: parser y Fuentes

**Tipo:** AFK + HITL · **Depende de:** 01 · **Valida:** H4

## Qué construir

En `domain/`: parser M3U (atributos `#EXTINF`, nombre, logo, Grupo, País), normalización e Identidad de canal, agrupación de entradas en Canales con Fuentes, filtro por País y Número de canal por posición (ADR-0009). En `platform/`: `fetchText` (directo en Tizen, por el proxy de Vite en desarrollo web). Diagnóstico muestra: entradas leídas, Canales de Chile, Fuentes totales y tiempos de descarga y de procesamiento.

## Criterios de aceptación

- [ ] Fixture versionado de la Lista de Alplox. Tests unitarios escritos primero (TDD) para: `Atacama TV (1) [CL]` + `(2)` + `(3)` → un Canal con 3 Fuentes en orden; nombres con tildes y mayúsculas; entradas sin logo o sin Grupo; `tvg-id` presente gana sobre el nombre; líneas basura ignoradas.
- [ ] El filtro `[CL]` sobre el fixture da un número estable de Canales, verificado en un test.
- [ ] `domain/` no importa nada de `platform/` ni de `ui/`.
- [ ] **HITL:** en el televisor, la Lista se descarga sin error y el tiempo de procesamiento queda anotado en el informe.
