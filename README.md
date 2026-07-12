# Verteves IPTV

Verteves es un reproductor de IPTV autónomo y de alto rendimiento de código abierto, diseñado específicamente para **Samsung Tizen OS** (Smart TVs) y la **Web**. La aplicación está construida completamente en el lado del cliente (Frontend-only), garantizando velocidad, eficiencia y privacidad.

---

## 🚀 Tecnologías Core

*   **UI Library:** React 19 (con TypeScript)
*   **Styling:** Tailwind CSS v4
*   **State Management:** Zustand
*   **Storage:** IndexedDB (vía wrapper `localforage`)
*   **Media Engines:** Native Samsung Tizen AVPlay (para TV) y `hls.js` (para la Web)
*   **Bundler & Environment:** Vite

---

## 📂 Arquitectura de Carpetas (Feature-Based)

Para asegurar la escalabilidad del proyecto, el código se organiza siguiendo un enfoque basado en características (*Features*):

```text
src/
├── components/          # Componentes visuales globales y reutilizables
├── hooks/               # Hooks de React reutilizables a nivel global
├── services/            # Capa de servicios comunes (IndexedDB wrapper, parsers, etc.)
├── utils/               # Funciones puras de utilidad
└── features/            # Módulos de lógica y UI por dominios funcionales
    ├── player/          # Reproductor de video (AVPlay y HLS)
    ├── playlist/        # Gestión de listas M3U y persistencia
    └── navigation/      # Foco espacial D-pad (Spatial Navigation)
```

---

## 🧪 Entorno de Pruebas

El proyecto cuenta con un entorno de pruebas robusto dividido en dos niveles:
*   **Pruebas Unitarias y de Integración:** Ejecutadas con **Vitest** y `@testing-library/react`.
*   **Pruebas de Extremo a Extremo (E2E):** Ejecutadas en un navegador real usando **Playwright**.

---

## 📝 Convención de Mensajes de Commit

Para mantener un historial de control de versiones limpio y legible, utilizamos la especificación de **Conventional Commits**:

### Formato General
```text
<tipo>(<ámbito>): <descripción corta en minúsculas>
```

### Tipos de Commits
*   `feat`: Nueva funcionalidad para el usuario (ej: `feat(player): add play/pause handler`).
*   `fix`: Corrección de un fallo o bug (ej: `fix(playlist): handle empty lines in m3u parser`).
*   `docs`: Cambios únicamente en documentación (ej: `docs(readme): document test configuration`).
*   `style`: Cambios estéticos o de formateo de código que no afectan la lógica (ej: `style(player): clean up tailwind classes`).
*   `refactor`: Reorganización de código que no corrige fallos ni añade funcionalidad (ej: `refactor(navigation): simplify spatial layout hooks`).
*   `perf`: Mejoras de rendimiento (ej: `perf(playlist): virtualize channel grid renderer`).
*   `test`: Añadir o corregir pruebas existentes (ej: `test(unit): add validation tests for m3u parser`).
*   `build`: Cambios que afectan al sistema de compilación o dependencias externas (ej: `build(tizen): add legacy transpile target`).
*   `chore`: Otras tareas administrativas o de mantenimiento (ej: `chore: update gitignore`).

---

## 🛠️ Comandos de Desarrollo

*   `npm run dev`: Arranca el servidor de desarrollo local en `http://localhost:3000` con proxy para evadir CORS.
*   `npm run build`: Compila la versión de producción web.
*   `npm run build:tizen`: Compila y empaqueta la aplicación en el archivo de distribución `.wgt` para Tizen OS.
*   `npm run test:unit`: Ejecuta las pruebas unitarias.
*   `npm run test:e2e`: Ejecuta las pruebas E2E con Playwright.
