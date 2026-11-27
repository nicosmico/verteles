# 07 — Persistencia

**Tipo:** AFK + HITL · **Depende de:** 01 · **Valida:** H6

## Qué construir

La interfaz `Storage` (get, set y remove asíncronos de valores serializables) sobre IndexedDB, compartida por web y Tizen. El spike guarda un contador de aperturas y la Identidad de canal del último Canal reproducido. Diagnóstico muestra el contador.

## Criterios de aceptación

- [ ] Tests de integración del adaptador con `fake-indexeddb`.
- [ ] Si IndexedDB no está disponible, la app sigue funcionando sin persistir y lo indica en Diagnóstico.
- [ ] **HITL:** el contador sube tras cerrar y reabrir la app, y tras apagar y encender el televisor.
