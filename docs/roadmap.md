# Roadmap

La web funciona en computador y en teléfono (ADR-0010).

Cada fase termina en un **lanzamiento**: versión web en GitHub Pages y `.wgt` adjunto a un GitHub Release (más adelante también `.ipk` y APK). La versión final se publicará en Firebase Hosting por su dominio.

Cada fase se trabaja así: **spec → tickets → TDD** (ver `AGENTS.md`).

| Fase | Versión | Nombre | Entrega |
|---|---|---|---|
| 0 | `v0.1.0` | Prueba de concepto | Validar en el televisor real el stack y las limitaciones duras. Spec: [`specs/fase-0-prueba-de-concepto.md`](specs/fase-0-prueba-de-concepto.md) |
| 1 | `v0.2.0` | Ver TV | Lista sugerida de Chile activa por defecto; abre en el último Canal; Zapping con ↑↓ y CH±; Banner de canal; Fuentes con respaldo automático; Canal no disponible. |
| 2 | `v0.3.0` | Navegar | Selector de canales con columna de Grupos; Favoritos como Lista activable; números del control. |
| 3 | `v0.4.0` | Mis Listas | Catálogo de Listas sugeridas por país (iptv-org); agregar por URL; eliminar; cambiar la Lista activa; ocultar Canales; Ajustes. |
| 4 | `v0.5.0` | LG | Plataforma webOS. |
| 5 | `v0.6.0` | Android TV | Wrapper nativo con adaptador `Player` sobre ExoPlayer. |
| 6 | `v0.7.0` | Buscar | Teclado propio en pantalla con resultados en vivo. |

**Después:** ordenar Listas (y con eso los Números de canal), EPG, pistas de audio y subtítulos, aspect ratio manual, calidad manual, agregar Listas con un QR desde el celular, publicación en Firebase.

## Modelo de control remoto (base para las fases 1, 2 y 6)

- La app abre en el último Canal visto, en pantalla completa.
- **↑/↓ o CH+/CH−**: Zapping con Banner de canal (3 s).
- **OK**: abre el Selector de canales con el foco en el Canal actual. ↑↓ recorre, OK sintoniza, **←** pasa a la columna de Grupos (Favoritos, Todos, Grupos de la Lista; al final *Listas* y *Ajustes*).
- **Back**: cierra lo que esté abierto; en pantalla completa, dos veces sale de la app.
- **Números**: salto directo por Número de canal.
- **Favorito**: tecla de color o mantener OK.
