# Reglas y Contexto del Proyecto: Reproductor IPTV Autónomo

Este archivo define las reglas de desarrollo, la arquitectura y los requisitos específicos para el proyecto.

## 1. Objetivo Principal y Arquitectura
*   **Enfoque 100% Frontend:** Aplicación del lado del cliente sin backend para la reproducción o gestión de contenido.
*   **Tecnologías Base:** Uso de **React** como librería principal de UI, **Zustand** para la gestión de estado global, **Tailwind CSS** para los estilos y **Vite** como empaquetador y entorno de desarrollo.
*   **Estructura de Proyecto:** Adopción de una arquitectura de carpetas **Feature-based**, agrupando componentes, hooks, estados y lógica específica por dominio funcional bajo `src/features/` para garantizar la mantenibilidad.
*   **Estructura de Carpetas Base:**
    *   `src/components/`: Componentes globales compartidos.
    *   `src/hooks/`: Hooks globales y utilidades de React compartidas.
    *   `src/services/`: Capa de servicios compartidos (e.g. wrapper de IndexedDB, parser).
    *   `src/utils/`: Funciones de utilidad pura.
    *   `src/features/`: Módulos principales:
        *   `src/features/player/`: Lógica del reproductor de video (avplay, hls.js).
        *   `src/features/playlist/`: Gestión e importación de listas M3U y IndexedDB.
        *   `src/features/navigation/`: Control de foco D-pad y Spatial Navigation.

## 2. Compatibilidad y Despliegue
*   **Versión Tizen OS (MVP Final):** Compilación empaquetada ejecutada localmente en la TV, sirviendo como prueba final sin restricciones de CORS.
*   **Versión Web (Desarrollo Local):** Uso del servidor proxy nativo de Vite (`server.proxy`) para eludir el CORS sin extensiones de navegador. (La versión web queda restringida exclusivamente al desarrollo por ahora).
*   **Compatibilidad y Transpilación (Legacy):** Configuración obligatoria de Vite con `@vitejs/plugin-legacy` orientada a soportar navegadores antiguos (Chromium >= 47) para garantizar la compatibilidad con modelos antiguos de TV (Tizen 3.0+).
*   **Tizen Config & Packaging:** Manifest inicial en `config.xml` (ID inicial `XoHlW9z1dM.Verteles`) y script de empaquetado `scripts/package-tizen.js` para generar `verteles.wgt`.

## 3. Gestión de Contenido y Listas M3U
*   **Importación por URL:** Agregar múltiples listas M3U desde enlaces externos.
*   **Procesamiento de Listas:** Uso exclusivo de la librería de lógica `iptv-playlist-parser` para extraer nombre, url, logo y grupo.
*   **Guía de Programación (EPG):** Estrictamente excluido de esta iteración.
*   **Gestión Local:** Sincronización al inicio, ocultar/omitir canales, sistema de favoritos y eliminación de listas.
*   **Almacenamiento Unificado:** Uso exclusivo de **IndexedDB** (o un wrapper unificado como `localforage` con fallback a `localStorage`) tanto para Tizen OS como para la versión Web, evitando el uso de APIs de sistema de archivos propietarias.
*   **Lista de canales M3U (Fuente por defecto):** `https://raw.githubusercontent.com/Alplox/json-teles/refs/heads/main/channels.m3u`

## 4. Interfaz, Controles y Experiencia de Usuario (UI/UX)
*   **Diseño:** Inspirado en Pluto TV / Zapping TV. Uso de HTML estándar sin librerías UI prefabricadas (para evitar lag) y estilos con Tailwind CSS nativo.
*   **Rendimiento y Virtualización:** Uso obligatorio de **Virtual Scrolling** (Virtualización de listas) para las listas de canales (M3U con miles de ítems) previniendo cuelgues por falta de memoria (OOM) en la TV.
*   **Lazy Loading:** Carga diferida de imágenes (logos de canales) con un *fallback* en caso de enlace caído o erróneo.
*   **Navegación Espacial:** Integración de *Norigin Spatial Navigation* para las flechas direccionales (D-pad).
*   **Mapeo Tizen (Zapping):** Teclas físicas *Channel Up / Down* para salto directo al canal anterior o siguiente.
*   **Mapeo Tizen (Navegación):** Tecla física *Return* para salir de la reproducción y volver al menú principal.
*   **Mapeo Tizen (Flujo):** Teclas *Play / Pause* para detener el stream (ahorro de red) y reanudar reconectando en vivo.
*   **Manejo de Errores y Red:** Pantalla negra con el mensaje "Canal no disponible" ante fallos del stream, permitiendo volver con el botón *Return*. Indicador general de "Sin conexión" si se pierde acceso a Internet.

## 5. Motor de Reproducción de Video
*   **TV (Samsung):** Uso de la API nativa **AVPlay** para máximo rendimiento de hardware.
*   **Web:** Uso de la librería **hls.js** para procesar los streams. Empaquetado gestionado por Vite según el entorno.
*   **Calidad y Ajustes de Imagen:** Auto-selección de la máxima resolución disponible. Relación de aspecto fija en "Fit" (Contain) con barras negras si la proporción no coincide.

## 7. Buenas Prácticas de Desarrollo y Seguridad
*   **Seguridad de Firmas y Certificados**: Nunca subir archivos `.p12`, firmas criptográficas o contraseñas al repositorio Git. Excluir siempre la carpeta de certificados (`certs/`) en el `.gitignore`.
*   **Gestión de Entornos Locales**: Omitir los archivos locales de orquestación (como `docker-compose.yml`) de los repositorios de Git y proveer en su lugar plantillas públicas del tipo `docker-compose.example.yml` para evitar la filtración de contraseñas o rutas privadas.
*   **Variables de Configuración Explícitas**: Evitar nombres genéricos de variables como `PASSWORD` o `PROFILE_NAME` para configuraciones del sistema. Utilizar nombres explícitos y auto-documentados como `TIZEN_PROFILE_NAME` y `TIZEN_CERTIFICATE_PASSWORD` para denotar claramente su contexto.
*   **Aislamiento y Emulación de Plataforma**: Diseñar los flujos de compilación/firma de forma aislada en Docker para no ensuciar la máquina local del desarrollador. Asegurar la compatibilidad multiplataforma especificando la emulación correcta (`platform: linux/amd64` en Macs Apple Silicon) y resolviendo dependencias de compilación nativas mediante `npm install --os=linux --cpu=x64`.

---

## Plan de Hitos del Proyecto

### Hito 1: Configuración del Proyecto y Entorno
Instalación de librerías base (React, Zustand, Tailwind, Vite). Configuración inicial del entorno de testing (Vitest y Playwright con un test dummy/básico). Definición de estructura de carpetas Feature-based, Git y Readme. Generación y empaquetado del primer `.wgt` ejecutable para verificar el flujo de despliegue en Tizen.

### Hito 2: MVP de Reproducción Dual (Hola Mundo)
Creación de componente de abstracción `<VideoPlayer />` que diferencie dinámicamente entre Web (`hls.js`) y Tizen OS (`AVPlay`). Configuración del proxy de Vite para evadir CORS local. Reproducción exitosa del stream en vivo de "Chilevisión [CL]" de la lista M3U de prueba en ambas plataformas.

### Hito 3: Interfaz Visual Base y Navegación Espacial
Definición de UI base inspirada en TV (Layout de TV, Sidebar, grilla de canales). Integración de *Norigin Spatial Navigation* para el manejo del foco con el D-pad y registro de teclas físicas de Tizen (Return, Play/Pause, Channel Up/Down) para el zapping básico. Creación de componentes UI reutilizables y carga diferida (lazy loading) básica de logos.

### Hito 4: Gestión de Listas M3U y Persistencia
Implementación de vistas para agregar, listar y eliminar listas M3U. Integración de la librería `iptv-playlist-parser` para el procesado de canales. Almacenamiento persistente unificado en `IndexedDB` (usando un wrapper como `localforage`), filtros de búsqueda por grupo y sistema de favoritos/canales ocultos. Desarrollo de tests unitarios y de integración correspondientes para la lógica del parser y storage.

### Hito 5: Mejoras de Rendimiento y Virtualización
Implementación obligatoria de *Virtual Scrolling* (virtualización de listas) para manejar listas M3U con miles de canales sin causar desbordamiento de memoria (OOM) en la TV. Optimización del renderizado de componentes y del estado en Zustand. Carga diferida robusta con imágenes fallback para logos caídos.

### Hito 6: Testing Completo y QA
Desarrollo de la suite de pruebas End-to-End (E2E) con Playwright simulando flujos críticos del usuario (Happy Path). Cobertura final de tests de integración para los flujos del estado global (Zustand) y pruebas unitarias de lógica pura en Vitest. Validación final de instalación y ejecución en simulador/TV física.
