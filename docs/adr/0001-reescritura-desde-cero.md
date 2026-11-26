# Reescribir la app desde cero

El código de la v0.1 (React + Tailwind v4) no tenía navegación con control remoto ni persistencia, y su stack de estilos no funciona en los televisores objetivo. Decidimos reescribir la app en vez de refactorizarla, rescatando solo piezas puntuales (parser M3U, abstracción del reproductor, proxy de desarrollo, notas de empaquetado Tizen). El estado anterior es el commit `b879f95` de `main` (tag local `legacy-v0.1`) y se elimina del árbol de trabajo. Para consultar algo del código viejo: `git show b879f95:<ruta>`.
