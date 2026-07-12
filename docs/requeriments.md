### Requerimientos del Proyecto: Reproductor IPTV Autónomo

**1. Objetivo Principal y Arquitectura**
*   **Enfoque 100% Frontend:** Aplicación del lado del cliente sin servidor central (backend) para la reproducción o gestión de contenido.
*   **Tecnologías Base:** Uso de **React** como librería principal de UI, **Zustand** para la gestión de estado global, **Tailwind CSS** para los estilos y **Vite** como empaquetador y entorno de desarrollo.
*   **Estructura de Proyecto:** Adopción de una arquitectura de carpetas **Feature-based**, agrupando componentes, hooks, estados y lógica específica por dominio funcional para garantizar la mantenibilidad.

**2. Compatibilidad y Despliegue**
*   **Versión Tizen OS (MVP Final):** Compilación empaquetada ejecutada localmente en la TV, sirviendo como prueba final sin restricciones de CORS.
*   **Versión Web (Desarrollo Local):** Uso del servidor proxy nativo de Vite (`server.proxy`) para eludir el CORS sin extensiones de navegador. (Nota: La versión web queda restringida exclusivamente al desarrollo por ahora).
*   **Compatibilidad y Transpilación (Legacy):** Configuración obligatoria de Vite con `@vitejs/plugin-legacy` orientada a soportar navegadores antiguos (Chromium >= 47) para garantizar la compatibilidad con modelos antiguos de TV (Tizen 3.0+).

**3. Gestión de Contenido y Listas M3U**
*   **Importación por URL:** Agregar múltiples listas M3U desde enlaces externos.
*   **Procesamiento de Listas:** Uso exclusivo de la librería de lógica `iptv-playlist-parser` para extraer nombre, url, logo y grupo.
*   **Guía de Programación (EPG):** Estrictamente excluido de esta iteración.
*   **Gestión Local:** Sincronización al inicio, ocultar/omitir canales, sistema de favoritos y eliminación de listas.
*   **Almacenamiento Unificado:** Uso exclusivo de **IndexedDB** (o un wrapper unificado como `localforage` con fallback a `localStorage`) tanto para Tizen OS como para la versión Web, evitando el uso de APIs de sistema de archivos propietarias para simplificar la compatibilidad y el código.

**4. Interfaz, Controles y Experiencia de Usuario (UI/UX)**
*   **Diseño:** Inspirado en Pluto TV / Zapping TV. Uso de HTML estándar sin librerías UI prefabricadas (para evitar lag) y estilos con Tailwind CSS nativo.
*   **Rendimiento y Virtualización:** Uso obligatorio de **Virtual Scrolling** (Virtualización de listas) para las listas de canales (M3U con miles de ítems) previniendo cuelgues por falta de memoria (OOM) en la TV.
*   **Lazy Loading:** Carga diferida de imágenes (logos de canales) con un *fallback* en caso de enlace caído o erróneo.
*   **Navegación Espacial:** Integración de *Norigin Spatial Navigation* para las flechas direccionales (D-pad).
*   **Mapeo Tizen (Zapping):** Teclas físicas *Channel Up / Down* para salto directo al canal anterior o siguiente.
*   **Mapeo Tizen (Navegación):** Tecla física *Return* para salir de la reproducción y volver al menú principal.
*   **Mapeo Tizen (Flujo):** Teclas *Play / Pause* para detener el stream (ahorro de red) y reanudar reconectando en vivo.
*   **Manejo de Errores y Red:** Pantalla negra con el mensaje "Canal no disponible" ante fallos del stream, permitiendo volver con el botón *Return*. Adicionalmente, detectar pérdida de conexión a Internet a nivel general de la app para mostrar un indicador de "Sin conexión".

**5. Motor de Reproducción de Video**
*   **TV (Samsung):** Uso de la API nativa **AVPlay** para máximo rendimiento de hardware.
*   **Web:** Uso de la librería **hls.js** para procesar los streams. Empaquetado gestionado por Vite según el entorno.
*   **Calidad y Ajustes de Imagen:** Por defecto, el reproductor seleccionará automáticamente la **máxima resolución disponible** (Auto).
*   **Relación de Aspecto (Aspect Ratio):** Se fijará por defecto la opción **"Fit" (o Contain)** para asegurar que el canal se vea completo sin recortarse ni deformar la imagen, añadiendo barras negras si la proporción no coincide con la TV.

**6. Estrategia de Testing y Herramientas**
*   **Pruebas End-to-End con Playwright:** Destinadas a los **flujos críticos** (Happy Path). Se probará la navegación y reproducción usando listas M3U mockeadas localmente.
*   **Pruebas de Integración con Vitest:** Destinadas a los **flujos medianamente críticos**. Se evaluarán las *Features* completas interactuando con su estado (Zustand).
*   **Pruebas Unitarias con Vitest:** Destinadas estrictamente a la **lógica pura**. Validación del estado global, funciones de almacenamiento y formateo del parser.

**7. Posibles Requerimientos Futuros (Siguientes Iteraciones)**
Dado el alcance del MVP, los siguientes aspectos quedan postergados para futuras versiones:
*   **Selector de Calidad de Video:** Permitir al usuario cambiar manualmente el *bitrate* o resolución en caso de conexiones lentas.
*   **Ajustes de Aspect Ratio:** Permitir que el usuario alterne manualmente entre *Fit, Fill, Zoom* o *Original* mediante la interfaz o el control remoto.
*   **Pistas de Audio y Subtítulos:** Selector para canales multi-idioma (si es soportado por el stream).
*   **Guía de Programación (EPG):** Integración completa de la guía electrónica.
*   **Internacionalización (i18n):** Soporte multi-idioma para la interfaz de la aplicación.
*   **Múltiples Perfiles de Usuario:** Gestión de favoritos y configuraciones por cada miembro del hogar.

**8. Lista de canales M3U (Fuente)**
https://raw.githubusercontent.com/Alplox/json-teles/refs/heads/main/channels.m3u