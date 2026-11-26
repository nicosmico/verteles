# Verteles — guía para agentes

App IPTV para televisores de bajos recursos. **Rendimiento en el televisor** es el criterio que decide los empates.

## Antes de trabajar

- Usa el vocabulario de `CONTEXT.md` en código, tests, commits y conversación. Si un término nuevo aparece o uno existente cambia, actualiza `CONTEXT.md` en el momento (skill `domain-modeling`).
- Lee los ADR de `docs/adr/` que toquen el área. Una decisión difícil de revertir y con alternativas reales se registra como ADR nuevo.

## Flujo de trabajo: spec → tickets → TDD

1. **Spec**: cada fase tiene una spec en `docs/specs/` con problema, solución, historias, decisiones de implementación, decisiones de testing y fuera de alcance.
2. **Tickets**: la spec se corta en tickets en `docs/tickets/<fase>/`, cada uno una *tracer bullet* vertical (atraviesa domain → platform → ui y se puede demostrar). Cada ticket declara tipo (**AFK**: lo cierra un agente; **HITL**: necesita a una persona, por ejemplo probar en el televisor), de qué tickets depende y sus criterios de aceptación.
3. **TDD**: cada ticket se implementa con la skill `tdd` (red → green → refactor), con tests a través de interfaces públicas. Un ticket está terminado cuando todos sus criterios de aceptación se cumplen y los tests, el typecheck y el build pasan.

## Reglas de arquitectura

- Capas `domain/` → `platform/` → `ui/` (ADR-0005). `domain/` es TypeScript puro: sin Solid, sin DOM, sin `fetch`.
- La plataforma se elige al compilar; cada build incluye solo su adaptador.
- Todo el código y las dependencias deben correr en **Chromium 85 / ES2020** (ADR-0002).

## Reglas de rendimiento

- Anima solo `transform` y `opacity`.
- Los manejadores de teclas no leen layout (`getBoundingClientRect`, `offsetTop`, etc.); el foco es explícito (ADR-0008).
- Toda lista que pueda superar ~30 elementos se virtualiza.
- Las imágenes se piden y se muestran a su tamaño final, con `decoding="async"`.

## Convenciones

- Docs en español. Código, identificadores y commits en inglés.
- Commits con Conventional Commits: `<tipo>(<ámbito>): <descripción>`.
