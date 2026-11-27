# 06 — Lista 2000 y gestor de foco

**Tipo:** AFK + HITL · **Depende de:** 03 · **Valida:** H5

## Qué construir

El núcleo del gestor de foco (ADR-0008) para una zona de lista vertical: índice enfocado, movimiento con ↑↓, mantener la tecla repite, y recordar la posición al salir y volver a la zona. Un componente de lista virtualizada en Solid que renderiza solo las filas visibles más un margen, desplazándose con `transform`. La pantalla Lista 2000 usa 2.000 Canales sintéticos con logos reales repetidos y un medidor de FPS (promedio y peor cuadro en los últimos 10 s).

## Criterios de aceptación

- [x] El núcleo del gestor de foco no depende de Solid ni del DOM y tiene tests unitarios (TDD).
- [x] La cantidad de nodos de fila en el DOM queda acotada (por ejemplo, ≤ 30) sin importar el largo de la lista, verificado en un test.
- [x] Mover el foco no lee layout.
- [x] E2E: ↓ mueve el foco y la fila enfocada queda visible.
- [ ] **HITL:** FPS promedio y peor cuadro al mantener ↓ durante 10 s, anotados en el informe (H5).

## Notas de implementación

- Gestor de foco: `src/ui/focus/focusMap.ts`, TypeScript puro. Zonas de lista vertical con vecinas (←/→) y memoria de posición por zona; `setCount` para cuando un filtro achica una zona. Listo para el Selector de canales de la fase 2.
- `VirtualList` mantiene en el DOM solo las filas visibles más 3 de margen (≤ 14 de 2.000) y las mueve con `transform`. `scrollToShow` desplaza lo mínimo para mantener visible el foco.
- Medidor de FPS con `requestAnimationFrame`: promedio y peor cuadro de los últimos 10 s.
- Teléfono: tocar una fila la enfoca y arrastrar desplaza la lista (pointer events).
- Los logos se piden tal como vienen en la Lista (por ejemplo, 800×800 desde Facebook) y se muestran a 64×64. Redimensionarlos requeriría un servidor; queda anotado para medir su costo en el televisor.
