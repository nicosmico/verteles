# 08 — Arranque y presupuesto de bundle

**Tipo:** AFK + HITL · **Depende de:** 02 · **Valida:** H7

## Qué construir

Medición del tiempo desde el origen de navegación hasta el primer cuadro interactivo, mostrada en Diagnóstico. Un paso de CI que falla si el JS inicial del build de Tizen supera 60 KB gzip y reporta el tamaño en cada build.

## Criterios de aceptación

- [ ] El presupuesto de bundle se verifica en CI.
- [ ] **HITL:** tiempo de arranque en frío anotado en el informe (promedio de 3 lanzamientos).
