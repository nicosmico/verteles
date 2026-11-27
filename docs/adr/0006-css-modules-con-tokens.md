# CSS Modules con tokens en vez de Tailwind

Tailwind v4 no funciona en Chromium 85 (ver ADR-0002). En un televisor con pocas pantallas y lienzo fijo de 1920×1080, la velocidad de iteración de Tailwind importa menos que controlar exactamente qué propiedades se animan. Usamos **CSS Modules** más **design tokens** en variables CSS (colores, espaciado, tipografía, estilo de foco) y un conjunto de componentes base reutilizables. Solo se animan `transform` y `opacity`.
