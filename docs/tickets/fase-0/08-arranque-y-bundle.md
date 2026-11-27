# 08 — Arranque y presupuesto de bundle

**Tipo:** AFK + HITL · **Depende de:** 02 · **Valida:** H7

## Qué construir

Medición del tiempo desde el origen de navegación hasta el primer cuadro interactivo, mostrada en Diagnóstico. Un paso de CI que falla si el JS inicial del build de Tizen supera 60 KB gzip y reporta el tamaño en cada build.

## Criterios de aceptación

- [x] El presupuesto de bundle se verifica en CI.
- [ ] **HITL:** tiempo de arranque en frío anotado en el informe (promedio de 3 lanzamientos).

## Notas de implementación

- *Arranque* en Diagnóstico: desde el inicio de la navegación hasta el primer cuadro pintado después del render (dos `requestAnimationFrame`). En el televisor no incluye el tiempo que el sistema tarda en lanzar la app antes de navegar: para H7, cronometrar también a mano desde que se presiona el ícono.
- `npm run size` (`scripts/bundle-size.mjs`) mide el gzip de los scripts que carga `index.html`, sin contar los chunks diferidos como hls.js, y falla sobre 60 KiB. Corre en CI para web y Tizen.
- Al cerrar el ticket: web 13,3 KiB y Tizen 14,2 KiB.
