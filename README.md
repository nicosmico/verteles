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

## ⚙️ Prerrequisitos y Flujo de Desarrollo (Flujo Híbrido con Docker)

Para desarrollar e instalar esta aplicación en tu Smart TV Samsung física, utilizamos un **Flujo Híbrido**:
1. **Docker (Compilación y Firma)**: Se encarga de correr Node, compilar Vite, empaquetar el `.wgt` y firmarlo criptográficamente de manera automática usando el SDK de Tizen en un contenedor. De esta forma, **no necesitas instalar Java JDK ni Tizen Studio en tu Mac**.
2. **Mac Host (Despliegue)**: Solo requiere la utilidad ligera `sdb` (Smart Development Bridge) para conectar y subir el widget firmado a tu televisión.

### 🛠️ Requisitos en tu Mac (Host)
*   **Node.js (v18+)** (Ya instalado): Para desarrollo local con `npm run dev`.
*   **Docker / Docker Desktop**: Para compilar y firmar el instalador `.wgt` sin instalar dependencias de Tizen localmente.
*   **SDB (Smart Development Bridge)**: Una pequeña utilidad de línea de comandos de pocos megabytes para enviar la aplicación a la TV.

---

## 🔑 Configuración del Certificado (Primera Vez)
Para instalar aplicaciones en la TV, deben estar firmadas por un certificado de desarrollador. El contenedor de Docker genera y configura esto automáticamente por ti.

1. La primera vez que compiles con Docker, el script generará automáticamente las llaves privadas `author.p12` en el directorio local `./certs` de tu proyecto.
2. Almacena este directorio `./certs` con cuidado, ya que contiene tu firma de desarrollador única.

---

## 📦 Compilación y Firma de la Aplicación

Para compilar la aplicación, generar el archivo `.wgt` y firmarlo usando el entorno virtualizado de Docker, ejecuta:
```bash
npm run build:tizen:docker
```
Este comando:
1. Iniciará el contenedor de Docker.
2. Instalará las dependencias de Node.js en un volumen limpio.
3. Compilará el proyecto web (`npm run build`).
4. Creará el archivo `/workspace/verteves.wgt`.
5. Firmará el widget `.wgt` usando el certificado montado en `./certs`.
6. El archivo final firmado quedará guardado en la raíz del proyecto listo para su instalación: `./verteves.wgt`.

---

## 📺 Despliegue en la Smart TV (Zapping)

Una vez que tengas el archivo `verteves.wgt` firmado en tu directorio raíz:

1. **Activa el Developer Mode en la TV**:
   * Abre la sección **Apps** en tu Smart TV.
   * Presiona la combinación **`1` `2` `3` `4` `5`** en el control remoto.
   * Activa el **Developer Mode** en `ON`.
   * Ingresa la IP local de tu computadora.
   * Reinicia la TV manteniendo presionado el botón de encendido hasta que se apague y aparezca el logo.
2. **Conecta tu Mac a la TV**:
   * Abre la terminal en tu Mac y ejecuta:
     ```bash
     sdb connect <IP_DE_LA_TV>
     ```
   * Valida la conexión ejecutando `sdb devices`. Si dice `unauthorized`, acepta el mensaje en la pantalla del televisor.
3. **Instala el archivo `.wgt`**:
   * Instala el widget firmado ejecutando en tu terminal local:
     ```bash
     sdb install verteves.wgt
     ```

---

## 🛠️ Comandos de Desarrollo

*   `npm run dev`: Arranca el servidor de desarrollo local en `http://localhost:3000` con proxy para evadir CORS.
*   `npm run build`: Compila la versión de producción web.
*   `npm run build:tizen`: Compila y empaqueta la aplicación en el archivo de distribución `.wgt` para Tizen OS localmente (requiere Tizen CLI nativo).
*   `npm run build:tizen:docker`: Ejecuta el flujo híbrido de compilación y firma automatizado en Docker.
*   `npm run test:unit`: Ejecuta las pruebas unitarias locales.
*   `npm run test:e2e`: Ejecuta las pruebas E2E con Playwright.
