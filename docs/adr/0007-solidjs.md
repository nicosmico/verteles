# SolidJS como framework de UI

El cuello de botella en un televisor es el trabajo de CPU por cada tecla presionada. React vuelve a ejecutar componentes y compara un DOM virtual en cada cambio de estado; Solid ejecuta cada componente una sola vez y actualiza directamente el nodo del DOM afectado, con un runtime de ~7 KB. Elegimos **SolidJS** sobre React, Preact y Lightning.js (canvas WebGL). Lightning se descartó porque abandona HTML y CSS y complica testear la web con Playwright. La fase 0 valida esta elección en el televisor real antes de construir sobre ella.

## Consequences

- Las librerías exclusivas de React (incluida Norigin Spatial Navigation) no se pueden usar.
- El estado global se maneja con stores y signals de Solid; no se usa Zustand.
- Partimos con **Solid 1.9**. Solid 2.0 salió en noviembre de 2026, pero su plugin de Vite sigue en pre-release; migramos cuando sea estable.
