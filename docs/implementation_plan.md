# Hito 3: Interfaz Visual Base y Navegación Espacial

Este plan de implementación describe los pasos para diseñar la interfaz de TV real, incorporando navegación espacial nativa para controles D-pad, zapping de canales y la carga dinámica de la lista M3U de `json-teles`.

## User Review Required

> [!IMPORTANT]
> **Fidelidad Visual Absoluta al Diseño de UI**: 
> La interfaz de usuario debe verse **exactamente igual** al diseño visual establecido. Se deben considerar las imágenes de la carpeta [docs/ui](file:///Users/nico/Development/Verteles%20workspace/Verteles/docs/ui/) (como [channels.png](file:///Users/nico/Development/Verteles%20workspace/Verteles/docs/ui/channels.png), [configurations.png](file:///Users/nico/Development/Verteles%20workspace/Verteles/docs/ui/configurations.png), [player.png](file:///Users/nico/Development/Verteles%20workspace/Verteles/docs/ui/player.png) y [playlists.png](file:///Users/nico/Development/Verteles%20workspace/Verteles/docs/ui/playlists.png)), que son screenshots del diseño de la aplicación, como referencia **al pie de la letra**. Recuerda usar los mismos colores, fuentes, iconos, estilos, TODO. No se permiten desviaciones estéticas. Aunque la forma de estructurar los componentes con buenas prácticas se puede modificar, visualmente debe quedar **IGUAL**.

> [!IMPORTANT]
> **Alcance del Hito 3 y Gestión de Playlists (Hacia Hito 4)**: 
> En este Hito 3 crearemos **todas las vistas** de la aplicación (incluyendo la estructura y diseño visual de la sección de playlists y configuraciones para que visualmente se vean idénticos al diseño de UI). Sin embargo, la lógica funcional de gestión de múltiples playlists (agregar, listar, eliminar y persistir en IndexedDB) se postergará al **Hito 4**. Durante el Hito 3, la aplicación cargará automáticamente y de manera exclusiva la lista por defecto (`json-teles`).
>
> Para que el Store de Zustand esté preparado para la futura expansión, lo diseñaremos desde ahora usando la siguiente estructura modular:
> ```typescript
> interface PlaylistData {
>   id: string;
>   name: string;
>   url: string;
>   channels: ParsedChannel[];
>   favoriteIds: string[]; // Favoritos específicos de esta lista
> }
> ```
> El Hito 3 se centrará en inicializar y renderizar la primera lista por defecto (`json-teles`), pero la arquitectura del Store estará completamente lista para añadir más listas en el Hito 4.
>
> **Navegación Espacial**: Para la navegación en TV (D-pad), usaremos `@noriginmedia/norigin-spatial-navigation` ya instalado en el proyecto. Registraremos el contenedor de la Sidebar y el contenedor del reproductor como focos espaciales distintos.
>
> **Mapeo de Control Remoto de Tizen**: Mapearemos las teclas físicas (`ChannelUp`, `ChannelDown`, `MediaPlayPause`, `MediaPlay`, `MediaPause` y `GoBack`) para que interactúen con el estado global de Zustand de la aplicación, llamando a la API nativa `tizen.tvinputdevice.registerKey()` para registrar estas teclas en televisores Samsung.

## Proposed Changes

---

### Componente de Gestión de Listas y Canales (Playlist Feature)

Crearemos la capa de persistencia y análisis de la lista M3U.

#### [NEW] [playlistParser.ts](file:///Users/nico/Development/Verteles%20workspace/Verteles/src/features/playlist/services/playlistParser.ts)
* Servicio encargado de descargar la lista M3U de `json-teles` a través del proxy de Vite en desarrollo local y de forma directa en Tizen.
* Usará la librería `iptv-playlist-parser` para procesar el archivo M3U y devolver una estructura limpia de canales.
* Incluirá utilidades para generar colores y letras iniciales de fallback para canales que no tengan logo o tengan logos rotos.

#### [NEW] [usePlaylistStore.ts](file:///Users/nico/Development/Verteles%20workspace/Verteles/src/features/playlist/store/usePlaylistStore.ts)
* Store de Zustand para manejar el estado global de los canales de forma extensible.
* Estados:
  * `playlists`: Registro indexado de listas de reproducción cargadas (`Record<string, PlaylistData>`).
  * `activePlaylistId`: ID de la lista activa en reproducción.
  * `currentChannel`: Canal activo de la lista actual.
  * `loading`: Indicador de carga de red/procesamiento.
  * `error`: Error si falla la descarga o procesamiento.
  * `sidebarOpen`: Flag para mostrar/ocultar el panel lateral.
  * `activeCategory`: Categoría de filtrado seleccionada (e.g. "Todos", "Favoritos", "News").
  * `searchQuery`: Texto de búsqueda de canales.
* Acciones:
  * `fetchPlaylist(id, name, url)`: Descarga, parsea y agrega una lista al registro de `playlists`.
  * `setActivePlaylistId(id)`: Selecciona la lista activa.
  * `setCurrentChannel(channel)`: Establece el canal en reproducción.
  * `setSidebarOpen(open)`: Abre o cierra el panel lateral.
  * `setActiveCategory(category)`: Filtra por categoría.
  * `setSearchQuery(query)`: Filtra por texto.
  * `toggleFavorite(channelId)`: Agrega o remueve el canal del array `favoriteIds` de la lista de reproducción activa.
  * `cycleChannel(direction)`: Cambia al canal anterior o siguiente de la lista filtrada actual (zapping).

#### [NEW] [Sidebar.tsx](file:///Users/nico/Development/Verteles%20workspace/Verteles/src/features/playlist/components/Sidebar.tsx)
* Panel lateral deslizable que muestra las categorías y los canales correspondientes de la lista activa.
* Usará el contexto de foco de Norigin Spatial Navigation para guiar el movimiento espacial dentro de la Sidebar.
* Dividido en tres secciones enfocables: cabecera (pestañas y botones), selector de categorías y lista de canales.

#### [NEW] [ChannelItem.tsx](file:///Users/nico/Development/Verteles%20workspace/Verteles/src/features/playlist/components/ChannelItem.tsx)
* Componente individual para cada canal en la Sidebar.
* Usará el hook `useFocusable` para recibir el foco espacial de Norigin, mostrando estilos visuales Premium de foco (bordes brillantes, escala y gradientes activos).
* Manejará la carga diferida (lazy loading) del logo del canal con fallbacks integrados en caso de error.

---

### Componente de Navegación y Control (Navigation Feature)

Configuración de la navegación física e inputs para control remoto.

#### [NEW] [useTvRemote.ts](file:///Users/nico/Development/Verteles%20workspace/Verteles/src/features/navigation/hooks/useTvRemote.ts)
* Hook que registra el mapeo de teclas físicas en Tizen OS y simula el mismo comportamiento en un teclado de PC.
* Registrará las teclas mediante `tizen.tvinputdevice.registerKey()` en el entorno de Samsung TV.
* Asignará `ChannelUp` / `ChannelDown` (o `PageUp` / `PageDown` en teclado de desarrollo) al zapping de canal.
* Asignará `MediaPlayPause` (o `Space` en teclado de desarrollo) a pausar/reproducir.
* Asignará `GoBack` / `Return` (o `Backspace` / `Escape` en teclado de desarrollo) para cerrar la Sidebar o la app.

---

### Cambios de Inicialización y Aplicación General (Core & Layout)

Modificaremos los archivos raíz para integrar las nuevas capas.

#### [MODIFY] [main.tsx](file:///Users/nico/Development/Verteles%20workspace/Verteles/src/main.tsx)
* Inicializará el motor de Norigin Spatial Navigation llamando a `init()` en la carga inicial de la aplicación.

#### [MODIFY] [App.tsx](file:///Users/nico/Development/Verteles%20workspace/Verteles/src/App.tsx)
* Modificará el layout principal de la aplicación para adaptarlo al flujo de TV.
* Integrará el hook `useTvRemote()` y cargará la lista de canales al montar con `fetchPlaylist()`.
* Mostrará la barra superior (Top Bar) autohide, la Sidebar enfocable con navegación espacial y el `<VideoPlayer />` dual con overlays de buffering/carga y estado de error.

## Verification Plan

### Automated Tests
* Ejecutaremos los tests unitarios existentes y añadiremos pruebas para verificar el parser de playlists.
```bash
npm run test:unit
```

### Manual Verification
1. **Carga Dinámica**: Ejecutar el servidor de desarrollo local, confirmar que se descarga la lista M3U de `json-teles` sin problemas de CORS y se parsea correctamente.
2. **Navegación Espacial**: Probar que las teclas de flechas mueven el foco visual correctamente entre el reproductor, botones y elementos de la Sidebar.
3. **Zapping y Botones**: Validar que pulsar `PageUp`/`PageDown` en el teclado cambia de canal y carga el stream correspondiente de forma inmediata.
4. **Buffering y Error**: Confirmar que los estados de carga se muestran con el aura animada del canal y que los streams rotos muestran la pantalla de error "Canal no disponible" con opción de reintentar.
