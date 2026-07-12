# Implementation Plan - Hito 1: Configuración del Proyecto y Entorno (Aprobado)

Este plan detalla los pasos para inicializar el proyecto, configurar el entorno de desarrollo y pruebas, definir la estructura de archivos e implementar el empaquetado para Tizen OS.

## Decisiones de Diseño Confirmadas
*   **Lenguaje:** React + TypeScript (usando el template `react-ts` de Vite).
*   **Estilos:** Tailwind CSS v4 (integrado vía CSS imports).
*   **Tizen Widget configuration:** ID inicial `XoHlW9z1dM.Verteves`.

---

## Proposed Changes

### Project Initialization & Setup

#### [NEW] [package.json](file:///Users/nico/Development/verteves/package.json)
Creación del archivo `package.json` con scripts para:
*   `dev`: Ejecutar servidor local con soporte de proxy para CORS.
*   `build`: Construir la versión web con transpilación legacy.
*   `build:tizen`: Construir y generar el archivo empaquetado `.wgt`.
*   `test:unit`: Ejecutar pruebas con Vitest.
*   `test:e2e`: Ejecutar pruebas con Playwright.

#### [NEW] [vite.config.ts](file:///Users/nico/Development/verteves/vite.config.ts)
Configuración de Vite con:
*   `@vitejs/plugin-react` o `@vitejs/plugin-react-swc`.
*   `@vitejs/plugin-legacy` apuntando a `chrome >= 47` (Tizen 3.0+) y polyfills necesarios.
*   Servidor proxy local (`server.proxy`) para redirigir peticiones de streams M3U y saltarse restricciones de CORS en entorno de desarrollo.

#### [NEW] [src/index.css](file:///Users/nico/Development/verteves/src/index.css)
Configuración de Tailwind CSS v4 (`@import "tailwindcss";`).

---

### Folder Structure (Feature-Based)

Crearemos la estructura de carpetas basada en características (Features) para organizar la lógica de manera modular y escalable.

#### [NEW] Carpetas base
*   `src/components/`: Componentes globales compartidos.
*   `src/hooks/`: Hooks globales y utilidades de React compartidas.
*   `src/services/`: Capa de servicios compartidos (e.g. wrapper de IndexedDB, parser).
*   `src/utils/`: Funciones de utilidad pura.
*   `src/features/`: Módulos principales:
    *   `src/features/player/`: Lógica del reproductor de video (avplay, hls.js).
    *   `src/features/playlist/`: Gestión e importación de listas M3U y IndexedDB.
    *   `src/features/navigation/`: Control de foco D-pad y Spatial Navigation.

---

### Testing Environment Setup

#### [NEW] [tsconfig.json](file:///Users/nico/Development/verteves/tsconfig.json) y tsconfig complementarios
Configuraciones de TypeScript para el proyecto, Vitest y Playwright.

#### [NEW] [vitest.config.ts](file:///Users/nico/Development/verteves/vitest.config.ts)
Configuración del entorno de pruebas unitarias y de integración utilizando `vitest`, `jsdom` y `@testing-library/react`.

#### [NEW] [src/__tests__/dummy.test.tsx](file:///Users/nico/Development/verteves/src/__tests__/dummy.test.tsx)
Test unitario de prueba inicial para validar el setup de Vitest.

#### [NEW] [playwright.config.ts](file:///Users/nico/Development/verteves/playwright.config.ts)
Configuración básica de Playwright para pruebas E2E.

#### [NEW] [e2e/dummy.spec.ts](file:///Users/nico/Development/verteves/e2e/dummy.spec.ts)
Test E2E básico inicial para validar que Playwright levanta el entorno correctamente.

---

### Tizen Config & Packaging Pipeline

#### [NEW] [config.xml](file:///Users/nico/Development/verteves/config.xml)
Manifest inicial necesario para empaquetar una aplicación web para Tizen OS. Define metadatos, permisos de red, orientación de pantalla (`landscape`) y el punto de entrada (`index.html`).

#### [NEW] [scripts/package-tizen.js](file:///Users/nico/Development/verteves/scripts/package-tizen.js)
Script en Node.js que se encarga de empaquetar el directorio `dist` compilado en un archivo comprimido `verteves.wgt`.

---

## Verification Plan

### Automated Tests
*   Ejecutar `npm run test:unit` para validar que el test dummy de Vitest pase.
*   Ejecutar `npm run test:e2e` para validar que el test dummy de Playwright pase.

### Manual Verification
*   Iniciar servidor local (`npm run dev`) y verificar en el navegador que el template React cargue adecuadamente con estilos de Tailwind CSS.
*   Ejecutar `npm run build:tizen` para generar el bundle final.
*   Verificar que se genera el archivo `verteves.wgt` en el directorio raíz y que contiene el manifest `config.xml` y los assets transpilados.
