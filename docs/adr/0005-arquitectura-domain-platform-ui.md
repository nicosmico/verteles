# Arquitectura en tres capas con plataforma elegida al compilar

Para reutilizar el máximo de código entre Web, Tizen, webOS y Android TV, la app es **una sola base de código (sin monorepo)** con tres capas:

- `domain/`: TypeScript puro, sin framework ni APIs del navegador. Modelos (Lista, Canal, Grupo), parser M3U y reglas (Zapping, Favoritos).
- `platform/`: adaptadores detrás de interfaces comunes: `Player` (hls.js / AVPlay / `<video>` nativo), `RemoteKeys`, `Storage` y `AppLifecycle`.
- `ui/`: pantallas y componentes. Solo dependen de `domain` y de las interfaces de `platform`.

La plataforma se elige **al compilar**, no al ejecutar: hay un build por plataforma (web, `.wgt`, `.ipk`) y cada paquete incluye solo su adaptador. Así se evita cargar código muerto en el televisor, a cambio de no poder detectar la plataforma dinámicamente. Android TV reutilizará el build web dentro de un wrapper con un adaptador `Player` nativo (ExoPlayer).
