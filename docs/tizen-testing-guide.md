# Guía Rápida de Instalación en Samsung Smart TV (Tizen OS)

Esta guía detalla el flujo de trabajo recomendado para instalar, ejecutar y probar la aplicación **Verteles** en tu Smart TV Samsung física utilizando la **Extensión de VS Code** y comandos directos de la terminal (sin Docker).

---

## 1. Prerrequisitos
* Tu Mac y la TV deben estar conectados a la **misma red local** (Wi-Fi o cable Ethernet).
* La TV debe tener activado el **Developer Mode** (Modo Desarrollador) apuntando a la IP de tu Mac.
* Conocer el **DUID (Device Unique ID)** de tu TV (puedes consultarlo en la TV entrando a: `Menú > Soporte > Contactar con Samsung`).

### Cómo Activar Developer Mode en la TV:
1. En la TV, entra en la sección de **Apps**.
2. Presiona de forma consecutiva la secuencia **`1` `2` `3` `4` `5`** en el control remoto.
3. En la ventana emergente, cambia el interruptor a **ON** e introduce la **IP local de tu Mac**.
   * *Puedes ver la IP de tu Mac en Ajustes del Sistema > Red.*
4. **Reinicio obligatorio de la TV**: Mantén pulsado el botón de **Apagado/Power** del control remoto durante 5 segundos (hasta que la TV se apague y se encienda mostrando el logo de Tizen) o desenchúfala de la corriente por 10 segundos.

---

## Flujo de Trabajo en Desarrollo (VS Code Extension)

Este método te permite compilar, firmar, desplegar y abrir la aplicación directamente en la televisión con un solo clic desde tu editor de código.

### Paso 1: Configurar tu Certificado de Desarrollador
1. Instala la extensión **Tizen TV** oficial en VS Code.
2. Sigue las instrucciones de la extensión para generar tu **Samsung Developer Certificate** (menú `Create Certificate` en la barra lateral de Tizen).
   * Necesitarás iniciar sesión en tu cuenta de Samsung y proporcionar el **DUID** de tu TV (`SHCPLROPH3PCC`) para generar el certificado de distribuidor.

### Paso 2: Compilar el código React
Corre el comando de compilación en tu terminal dentro de la carpeta `verteles_`:
```bash
npm run build
```
*Este paso compilará la aplicación y copiará automáticamente los archivos necesarios para la extensión Tizen (`.project`, `.tproject`, `config.xml` y `tizen_web_project.yaml`) al directorio `/dist`.*

### Paso 3: Lanzar e Instalar en la TV
En la pestaña de la extensión de Tizen en VS Code, configura tus objetivos activos (**Active Targets**):
* **Project**: Selecciona la carpeta `dist` (la cual es detectada automáticamente como proyecto Tizen gracias a los archivos que Vite copia allí).
* **Device**: Selecciona tu TV (`QN50QEF1AGXZS`).
* **Certificate**: Selecciona el perfil de certificados de Samsung que creaste en el Paso 1.

Haz clic en **Run Project** en las acciones rápidas de la extensión. La extensión empaquetará el `.wgt`, lo firmará con tu certificado, lo instalará en la TV (quedando guardado en tu hub de apps de desarrollador) y lo abrirá en la TV.

---

## Comandos Rápidos desde la Terminal (Locales)

Dado que la instalación del SDK de Tizen incluye la herramienta **`sdb`** (Smart Development Bridge) en tu Mac, hemos preconfigurado accesos rápidos en `package.json` para facilitar las tareas de depuración desde la terminal de tu Mac sin usar Docker:

* **Abrir la app en la TV:**
  ```bash
  npm run tizen:run
  ```
* **Ver los logs de consola de la app en tiempo real (TV):**
  ```bash
  npm run tizen:logs
  ```
* **Desinstalar la aplicación de la TV:**
  ```bash
  npm run tizen:uninstall
  ```
