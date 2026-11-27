# La web también se usa en teléfono

La versión web no es solo para desarrollo: también se usa en teléfono. La app sigue siendo **una sola interfaz** diseñada primero para el televisor, con dos agregados:

- **Dos modos de entrada.** Control remoto o teclado, a través del gestor de foco (ADR-0008), y toque o puntero. Todo lo que se hace con el control se puede hacer tocando. El televisor ignora los eventos táctiles.
- **Dos lienzos.** En horizontal (televisor, computador, teléfono de lado) se usa el lienzo de 1920×1080 del televisor. En vertical (teléfono derecho) se usa un lienzo de 720 px de ancho y alto variable, para que el texto se lea al escalar. Cada pantalla se adapta con `[data-orientation]`.

Descartamos un diseño responsive independiente para teléfono: duplicaría pantallas y alejaría la web de lo que se ve en el televisor, que es el objetivo principal.

## Consequences

- Cada pantalla nueva necesita un e2e en viewport de teléfono (vertical, táctil).
- Los objetivos táctiles miden al menos ~44 px CSS reales.
