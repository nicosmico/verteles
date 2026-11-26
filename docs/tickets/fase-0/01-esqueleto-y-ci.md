# 01 — Esqueleto y CI

**Tipo:** AFK · **Depende de:** —

## Qué construir

El proyecto vacío con las capas reales y la pantalla de Diagnóstico en su versión web: plataforma, user agent, versión de Chromium y resolución. Workflow de GitHub Actions que corre typecheck, tests y build en cada push, y despliega la web en GitHub Pages en cada push a `main`.

## Criterios de aceptación

- [ ] Vite + Solid + TypeScript estricto, con `build.target: 'chrome85'`.
- [ ] Carpetas `src/domain`, `src/platform/web`, `src/platform/tizen`, `src/ui`, y alias `@platform` resuelto por `--mode`.
- [ ] Tokens CSS base (colores, espaciado, tipografía, estilo de foco) y lienzo de 1920×1080 escalado a la ventana.
- [ ] `npm run dev`, `build`, `test`, `test:e2e` y `typecheck` funcionan.
- [ ] Un test e2e verifica que la pantalla de Diagnóstico carga y muestra la versión de Chromium.
- [ ] El workflow de CI pasa y el de Pages está listo para `main`.
