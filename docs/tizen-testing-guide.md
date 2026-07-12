# Guía Rápida de Instalación en Samsung Smart TV (Tizen OS)

Esta guía detalla los dos flujos disponibles para instalar y probar la aplicación **Verteles** en tu Smart TV Samsung física: el flujo recomendado mediante la **Extensión de VS Code** y el flujo alternativo mediante **Docker CLI** (para terminal/automatización).

---

## 1. Prerrequisitos Comunes
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

## Método A: Extensión de VS Code (Recomendado para Desarrollo Diario)

Este método te permite compilar, firmar, desplegar y abrir la aplicación directamente en la televisión con un solo clic desde tu editor de código.

### Paso 1: Configurar la Extensión en VS Code
1. Instala la extensión **Tizen TV** oficial en VS Code.
2. Sigue las instrucciones de la extensión para generar tu **Samsung Developer Certificate** (menú `Create Certificate` en la barra lateral de Tizen).
   * Necesitarás iniciar sesión en tu cuenta de Samsung y proporcionar el **DUID** de tu TV (el que obtuviste en el paso anterior) para generar el certificado de distribuidor.

### Paso 2: Compilar el código React
Corre el comando de compilación en tu terminal dentro de la carpeta `verteles_`:
```bash
npm run build
```
*Este paso compilará la aplicación y copiará automáticamente los archivos necesarios para la extensión Tizen (`.project`, `.tproject`, `config.xml` y `tizen_web_project.yaml`) al directorio `/dist`.*

### Paso 3: Lanzar en la TV
En la pestaña de la extensión de Tizen en VS Code, configura tus objetivos activos (**Active Targets**):
* **Project**: Selecciona la carpeta `dist` (la cual es detectada automáticamente como proyecto Tizen gracias a los archivos que Vite copió allí).
* **Device**: Selecciona tu TV (`QN50QEF1AGXZS`).
* **Certificate**: Selecciona el perfil de certificados de Samsung que creaste en el Paso 1.

Haz clic en **Run Project** en las acciones rápidas de la extensión. La extensión empaquetará el `.wgt`, lo firmará con tu certificado y lo abrirá en la TV.

---

## Método B: Despliegue Mediante Docker CLI (Independiente del Editor)

Este método aísla el empaquetado, la firma y el despliegue dentro de un contenedor Docker Ubuntu, ideal para automatización de builds o si no deseas utilizar la extensión de VS Code.

### Paso 1: Instalar y Firmar (.wgt)
Genera el paquete firmado ejecutando lo siguiente en la raíz del proyecto `verteles_`:
```bash
npm run build:tizen:docker
```
*Este comando compila la app de React y ejecuta un contenedor Docker para generar y firmar el archivo `./verteles.wgt` en tu raíz utilizando tus certificados locales (`/certs`).*

> [!NOTE]
> Si tienes tus archivos `author.p12` y `distributor.p12` generados localmente, colócalos en la carpeta `./certs/` del proyecto. El script `docker-sign.sh` los detectará y los usará de manera automática.

### Paso 2: Conectar y Desplegar
Puedes desplegar el widget a tu TV con el comando rápido configurado para tu IP:
```bash
npm run tizen:deploy:tv
```
*Si la IP de tu TV cambia, puedes pasarla manualmente al comando general:*
```bash
npm run tizen:deploy -- <IP_DE_LA_TV>
# Ejemplo: npm run tizen:deploy -- 192.168.18.7
```

### Paso 3: Abrir la App en la TV
Una vez instalada en la TV, puedes abrirla inmediatamente sin tocar el control remoto ejecutando:
```bash
npm run tizen:run:tv
```

---

## Comandos Útiles de Depuración (Docker)

Los siguientes scripts ejecutan comandos `sdb` (Smart Development Bridge) utilizando el contenedor Docker para que no necesites instalar nada en tu macOS local:

* **Ver los logs de consola de la app en tiempo real (TV):**
  ```bash
  npm run tizen:logs
  ```
* **Desinstalar la aplicación de la TV:**
  ```bash
  npm run tizen:uninstall
  ```
