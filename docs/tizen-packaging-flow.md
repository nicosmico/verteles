# Flujo de Compilación y Firma para Samsung Tizen OS (Flujo Híbrido)

Este documento detalla la arquitectura, requerimientos de seguridad, flujo de desarrollo y consideraciones para producción respecto al empaquetado e instalación de la aplicación IPTV en Smart TVs de Samsung.

---

## 1. Arquitectura de Aplicaciones en Tizen OS
Las aplicaciones para Smart TVs de Samsung (Tizen OS) son **aplicaciones web** (HTML5/CSS/JavaScript).
*   **Widget (.wgt)**: Para instalar una aplicación en una TV, todo el código web (en nuestro caso compilado en el directorio `/dist` por Vite) debe comprimirse en un archivo ZIP con extensión `.wgt`.
*   **Manifiesto (config.xml)**: Este archivo debe estar obligatoriamente en la raíz del paquete `.wgt`. Define metadatos como el ID de la app, nombre, icono, orientación de pantalla, privilegios de acceso (como conexión a Internet y captura del control remoto) y la versión mínima de Tizen requerida (v3.0+).

---

## 2. Requerimiento de Firma Criptográfica
Por motivos de seguridad, **Tizen OS prohíbe la instalación de archivos `.wgt` que no estén firmados digitalmente**.

El perfil de seguridad de firma consta de dos certificados empaquetados en archivos `.p12`:
1.  **Author Certificate (Certificado de Autor)**: Identifica de forma única al desarrollador de la aplicación y garantiza la propiedad del código. Impide que terceros puedan suplantar tu app subiendo actualizaciones maliciosas.
2.  **Distributor Certificate (Certificado de Distribuidor)**: Define las pantallas de televisión específicas autorizadas para instalar la aplicación de pruebas, asociando sus **DUID** (Device Unique ID). En desarrollo, Tizen CLI proporciona un certificado de distribuidor genérico, pero en producción es otorgado y validado directamente por la tienda oficial de Samsung.

---

## 3. ¿Por qué implementamos un Flujo Híbrido con Docker?
Las utilidades de firma de Samsung (Tizen SDK) requieren instalar **Java JDK** y un entorno SDK pesado en la máquina local.

Para mantener tu máquina principal (Mac host) limpia, aislamos este proceso en **Docker**:
*   **Docker (Compilación y Firma)**: Un contenedor ligero de Ubuntu x86_64 que encapsula Java 11, Node.js y el Tizen CLI. Este compila con Vite, genera el `.wgt` y lo firma de manera transparente.
*   **Host Mac (Instalación)**: Tu computadora sólo necesita la utilidad pequeña **`sdb`** (~5 MB) para conectarse a la TV por red (`sdb connect <IP_TV>`) e instalar el widget final firmado (`sdb install verteves.wgt`).

---

## 4. Funcionamiento en Desarrollo (Develop)
*   **Certificados de prueba automáticos**: Si no tienes un certificado en tu directorio local `./certs/`, el script de Docker genera un par de llaves privadas de desarrollador automáticamente con una contraseña genérica (`vertevesdevpwd`).
*   **Persistencia**: El certificado se copia de vuelta a la carpeta `./certs/` en tu Mac para que persista y no tengas que crearlo en cada build.
*   **Comando de construcción**:
    ```bash
    npm run build:tizen:docker
    ```

---

## 5. Consideraciones para Producción (Production)
Cuando llegue el momento de publicar la aplicación de forma oficial en la Samsung App Store (Seller Office), debes seguir las siguientes pautas de seguridad:

### ⚠️ Exclusión de Git (Seguridad de Credenciales)
*   **Certificados (`certs/`)**: Nunca subas el directorio `./certs/` a repositorios Git. Si un atacante accede a tu llave privada `author.p12`, podrá suplantar tu aplicación.
*   **Configuración local (`docker-compose.yml`)**: Debe ser ignorado por Git, ya que contiene contraseñas locales y rutas específicas de tu máquina. En su lugar, se sube una plantilla genérica llamada `docker-compose.example.yml`.

### 💾 Gestión de Certificados de Producción
*   **Creación**: El certificado de producción final se genera a través de la cuenta oficial de **Samsung Developer** usando el Certificate Manager visual de Tizen Studio (ya que requiere autenticación OAuth con los servidores de Samsung).
*   **Respaldo Seguro**: Guarda tu archivo `author.p12` de producción y sus contraseñas en un gestor de credenciales corporativo seguro (ej. 1Password, Bitwarden) o almacenes de secretos (Google/AWS Secret Manager). **Si pierdes esta llave de producción, no podrás subir nuevas actualizaciones de tu app en la tienda.**
*   **Automatización de Firma (CI/CD)**: En entornos de producción, el proceso de firma se realiza en servidores de Integración Continua (como GitHub Actions). El certificado `.p12` y la contraseña se inyectan dinámicamente como *Secrets* de GitHub, y el pipeline se encarga de firmar y publicar el entregable sin intervención humana directa.
