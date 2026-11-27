# Piso de compatibilidad: televisores 2022 en adelante (Chromium 85)

La app se usa en un televisor Samsung propio, y soportar modelos más antiguos (Tizen 3–5, Chromium 47–69) obligaría a transpilar CSS y JS de forma agresiva y a renunciar a APIs modernas. El piso es Samsung Tizen 6.5 / LG webOS 22, es decir **Chromium 85 y ES2020**. No usamos `@vitejs/plugin-legacy`. Ninguna dependencia ni regla CSS puede exigir más que Chromium 85.

## Consequences

- Tailwind v4 queda descartado (requiere Chrome 111+: `oklch`, `color-mix`, cascade layers).
- El televisor del usuario (Samsung QN50QEF1AGXZS, serie 2025, gama de entrada) supera este piso holgadamente. El piso se mantiene en 2022 a propósito, para no depender de APIs que solo existen en ese modelo; como su CPU es modesta, el rendimiento sigue siendo prioridad.
