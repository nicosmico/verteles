# Hitos del proyecto

## Hito 1: Configuración del Proyecto y Entorno [COMPLETADO]
Instalación de librerías base (React, Zustand, Tailwind, Vite). Configuración inicial del entorno de testing (Vitest y Playwright con un test dummy/básico). Definición de estructura de carpetas Feature-based, Git y Readme. Generación y empaquetado del primer `.wgt` ejecutable para verificar el flujo de despliegue en Tizen.

## Hito 2: MVP de Reproducción Dual (Hola Mundo) [COMPLETADO]
Creación de componente de abstracción `<VideoPlayer />` que diferencie dinámicamente entre Web (`hls.js`) y Tizen OS (`AVPlay`). Configuración del proxy de Vite para evadir CORS local. Reproducción exitosa del stream en vivo de "Chilevisión [CL]" de la lista M3U de prueba en ambas plataformas.

## Hito 3: Interfaz Visual Base y Navegación Espacial
Definición de UI base inspirada en TV (Layout de TV, Sidebar, grilla de canales). Creación de componentes UI reutilizables y carga diferida (lazy loading) básica de logos.

## Hito 4: Navegación Espacial
Integración de *Norigin Spatial Navigation* para el manejo del foco con el D-pad y registro de teclas físicas de Tizen (Return, Play/Pause, Channel Up/Down) para el zapping básico.

## Hito 5: Gestión de Listas M3U y Persistencia
Implementación de vistas para agregar, listar y eliminar listas M3U. Integración de la librería `iptv-playlist-parser` para el procesado de canales. Almacenamiento persistente unificado en `IndexedDB` (usando un wrapper como `localforage`), filtros de búsqueda por grupo y sistema de favoritos/canales ocultos. Desarrollo de tests unitarios y de integración correspondientes para la lógica del parser y storage.

## Hito 6: Mejoras de Rendimiento y Virtualización
Implementación obligatoria de *Virtual Scrolling* (virtualización de listas) para manejar listas M3U con miles de canales sin causar desbordamiento de memoria (OOM) en la TV. Optimización del renderizado de componentes y del estado en Zustand. Carga diferida robusta con imágenes fallback para logos caídos.

## Hito 7: Testing Completo y QA
Desarrollo de la suite de pruebas End-to-End (E2E) con Playwright simulando flujos críticos del usuario (Happy Path). Cobertura final de tests de integración para los flujos del estado global (Zustand) y pruebas unitarias de lógica pura en Vitest. Validación final de instalación y ejecución en simulador/TV física.
