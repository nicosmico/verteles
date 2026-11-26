# Verteles

Reproductor de TV en vivo (IPTV) para televisores y web, para uso personal. Reproduce canales definidos en listas M3U que el usuario agrega; no hay servidor propio.

> Glosario del dominio. Los términos se escriben en español; entre paréntesis va el nombre que usa el código (inglés).

## Language

### Contenido

**Lista** (`Playlist`):
Una fuente de canales que el usuario agregó, identificada por la URL de un archivo M3U.
_Avoid_: playlist (en la UI), M3U (para referirse a la lista ya agregada), fuente

**Canal** (`Channel`):
Una señal en vivo reproducible que pertenece a una Lista, con nombre, logo opcional y Grupo opcional.
_Avoid_: stream (el stream es la URL técnica del canal, no el canal), señal

**Grupo** (`Group`):
Una categoría de Canales tal como la declara la Lista (por ejemplo "Noticias" o "Deportes").
_Avoid_: categoría, género

**Favorito** (`Favorite`):
Un Canal que el usuario marcó para encontrarlo rápido.

### Reproducción

**Zapping** (`zap`):
Cambiar al Canal anterior o siguiente sin salir de la pantalla completa.
_Avoid_: cambiar de canal (cuando se refiere específicamente a ↑/↓ o CH+/CH−)

**Banner de canal** (`ChannelBanner`):
El aviso breve que aparece al sintonizar un Canal, con su número, logo, nombre y Grupo, y que desaparece solo.
_Avoid_: OSD, info bar, playback bar

**Canal no disponible** (`unavailable`):
El estado de un Canal que no se puede reproducir en la plataforma actual, sin importar la causa (caído, bloqueado por CORS, formato no soportado).
_Avoid_: error de stream, canal caído

### Plataformas

**Plataforma** (`Platform`):
Un entorno donde se distribuye la app: Web, Tizen (Samsung), webOS (LG) o Android TV.
_Avoid_: target, dispositivo
