# 01 — Esqueleto y CI

**Tipo:** AFK · **Depende de:** —

## Qué construir

El proyecto vacío con las capas reales y la pantalla de Diagnóstico en su versión web: plataforma, user agent, versión de Chromium y resolución. Workflow de GitHub Actions que corre typecheck, tests y build en cada push, despliega la web en GitHub Pages en cada push a `main` y publica una preview por PR.

## Criterios de aceptación

- [x] Vite + Solid + TypeScript estricto, con `build.target: 'chrome85'`.
- [x] Carpetas `src/domain`, `src/platform/web`, `src/platform/tizen`, `src/ui`, y alias `@platform` resuelto por `--mode`.
- [x] Tokens CSS base (colores, espaciado, tipografía, estilo de foco) y lienzo de 1920×1080 escalado a la ventana.
- [x] `npm run dev`, `build`, `test`, `test:e2e` y `typecheck` funcionan.
- [x] Un test e2e verifica que la pantalla de Diagnóstico carga y muestra la versión de Chromium.
- [x] El workflow de CI pasa y el de Pages está listo para `main`.

## Notas de implementación

- GitHub Pages debe estar en *Settings → Pages → Deploy from a branch → `gh-pages` / root*. En modo "GitHub Actions" cada deploy reemplaza el sitio completo y no puede haber previews por PR. `public/.nojekyll` evita que Pages procese el build con Jekyll.
- El preset `Desktop Chrome` de Playwright falsea el user agent; el proyecto e2e usa Chromium sin preset.
- Para el ticket 02: Vite emite `<script type="module" crossorigin>`; hay que verificar que Tizen lo cargue desde el paquete local.
