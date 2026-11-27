# Verteles

Reproductor de TV en vivo (IPTV) para televisores y web, para uso personal. Reproduce Canales definidos en Listas M3U; no hay servidor propio.

> Glosario del dominio. Los términos van en español; entre paréntesis, el nombre que usa el código (inglés).

## Language

### Listas

**Lista** (`Playlist`):
Un conjunto ordenado de Canales que se puede activar. Hay dos tipos: Lista importada y Favoritos.
_Avoid_: playlist (en la UI), fuente

**Lista importada** (`ImportedPlaylist`):
Una Lista que se obtiene de un archivo M3U en una URL y que se puede volver a descargar.
_Avoid_: M3U (para referirse a la lista ya agregada)

**Favoritos** (`Favorites`):
La Lista que arma el usuario marcando Canales de cualquier Lista importada, en el orden en que los marcó.
_Avoid_: favoritos como filtro

**Lista activa** (`activePlaylist`):
La única Lista cuyos Canales se recorren al hacer Zapping. Siempre hay exactamente una.

**Lista sugerida** (`SuggestedPlaylist`):
Una Lista importada que la app ofrece lista para agregar, normalmente una por país. Chile viene agregada y activa por defecto.
_Avoid_: lista por defecto, preset

### Canales

**Canal** (`Channel`):
Una señal en vivo con nombre, logo opcional, Grupo opcional y una o más Fuentes. Dos entradas del M3U con el mismo nombre (salvo el sufijo `(n)`) y el mismo país son el mismo Canal.
_Avoid_: stream, señal

**Fuente** (`Source`):
Una URL de stream que reproduce un Canal. Un Canal prueba sus Fuentes en orden hasta que una funciona.
_Avoid_: stream alternativo, mirror, link

**Identidad de canal** (`channelKey`):
Lo que reconoce a un Canal aunque su Lista se vuelva a descargar: su `tvg-id` si lo trae; si no, su nombre normalizado más su país.
_Avoid_: id (a secas)

**Número de canal** (`channelNumber`):
La posición del Canal dentro de su Lista, empezando en 1.
_Avoid_: LCN, dial

**Grupo** (`Group`):
Una categoría de Canales tal como la declara la Lista (por ejemplo `news`), mostrada con su nombre en español cuando se conoce.
_Avoid_: categoría, género

**País** (`country`):
El código de país de un Canal, tomado de la etiqueta final de su nombre en el M3U (por ejemplo `[CL]`).

### Reproducción

**Zapping** (`zap`):
Pasar al Canal anterior o siguiente de la Lista activa sin salir de la pantalla completa.
_Avoid_: cambiar de canal (cuando se refiere específicamente a ↑/↓ o CH+/CH−)

**Banner de canal** (`ChannelBanner`):
El aviso breve que aparece al sintonizar un Canal, con su Número, logo, nombre y Grupo, y que desaparece solo.
_Avoid_: OSD, info bar, playback bar

**Selector de canales** (`ChannelPicker`):
El panel superpuesto que se abre con OK para elegir Canal, con una columna de Grupos y otra de Canales.
_Avoid_: sidebar, lista de canales, guía

**Canal no disponible** (`unavailable`):
El estado de un Canal cuando ninguna de sus Fuentes se puede reproducir en la Plataforma actual, sin importar la causa.
_Avoid_: error de stream, canal caído

### Plataformas

**Plataforma** (`Platform`):
Un entorno donde se distribuye la app: Web, Tizen (Samsung), webOS (LG) o Android TV.
_Avoid_: target, dispositivo
