# Gestor de foco propio, explícito y no geométrico

Navegar con el control remoto es la función central de la app. Las librerías de navegación espacial (como Norigin) eligen el siguiente elemento midiendo posiciones en pantalla. Eso fuerza a recalcular el layout en cada tecla, lo que es caro en un televisor, y produce saltos de foco poco predecibles. Escribimos un **gestor de foco propio** donde cada zona declara su forma (lista vertical, fila, grilla) y sus vecinas, y recuerda el último elemento enfocado. No mide el DOM y se testea con unit tests.
