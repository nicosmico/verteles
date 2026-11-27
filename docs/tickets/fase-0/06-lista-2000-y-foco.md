# 06 — Lista 2000 y gestor de foco

**Tipo:** AFK + HITL · **Depende de:** 03 · **Valida:** H5

## Qué construir

El núcleo del gestor de foco (ADR-0008) para una zona de lista vertical: índice enfocado, movimiento con ↑↓, mantener la tecla repite, y recordar la posición al salir y volver a la zona. Un componente de lista virtualizada en Solid que renderiza solo las filas visibles más un margen, desplazándose con `transform`. La pantalla Lista 2000 usa 2.000 Canales sintéticos con logos reales repetidos y un medidor de FPS (promedio y peor cuadro en los últimos 10 s).

## Criterios de aceptación

- [ ] El núcleo del gestor de foco no depende de Solid ni del DOM y tiene tests unitarios (TDD).
- [ ] La cantidad de nodos de fila en el DOM queda acotada (por ejemplo, ≤ 30) sin importar el largo de la lista, verificado en un test.
- [ ] Mover el foco no lee layout.
- [ ] E2E: ↓ mueve el foco y la fila enfocada queda visible.
- [ ] **HITL:** FPS promedio y peor cuadro al mantener ↓ durante 10 s, anotados en el informe (H5).
