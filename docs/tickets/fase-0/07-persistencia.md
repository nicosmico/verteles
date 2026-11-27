# 07 — Persistencia

**Tipo:** AFK + HITL · **Depende de:** 01 · **Valida:** H6

## Qué construir

La interfaz `Storage` (get, set y remove asíncronos de valores serializables) sobre IndexedDB, compartida por web y Tizen. El spike guarda un contador de aperturas y la Identidad de canal del último Canal reproducido. Diagnóstico muestra el contador.

## Criterios de aceptación

- [x] Tests de integración del adaptador con `fake-indexeddb`.
- [x] Si IndexedDB no está disponible, la app sigue funcionando sin persistir y lo indica en Diagnóstico.
- [ ] **HITL:** el contador sube tras cerrar y reabrir la app, y tras apagar y encender el televisor.

## Notas de implementación

- `Storage` (get/set/remove) sobre IndexedDB en `src/platform/shared/indexedDbStorage.ts`, igual para web y Tizen. Tests de integración con `fake-indexeddb`, incluido reabrir la base como si la app se reiniciara.
- Diagnóstico muestra *Aperturas*. El e2e recarga la página con IndexedDB real de Chromium y verifica que el contador sube. Sin IndexedDB, la app funciona y muestra "Sin persistencia".
- Guardar la Identidad de canal del último Canal reproducido se hace en el ticket 05, que es donde existe la reproducción.
