# Flujo de Compilación y Firma para Samsung Tizen OS

Este documento detalla la arquitectura, los requerimientos de seguridad, los flujos de desarrollo (Docker y Extensión de VS Code) y las consideraciones para producción respecto al empaquetado y firma de la aplicación IPTV en Smart TVs de Samsung.

---

## 1. Arquitectura de Aplicaciones en Tizen OS
Las aplicaciones para Smart TVs de Samsung son **aplicaciones web** (HTML5/CSS/JavaScript).
* **Widget (.wgt)**: Para instalar una aplicación en una TV, todo el código web (compilado en el directorio `/dist` por Vite) debe comprimirse en un archivo ZIP con extensión `.wgt`.
* **Manifiesto (config.xml)**: Este archivo debe estar obligatoriamente en la raíz del paquete `.wgt`. Define metadatos como el ID de la app, nombre, icono, orientación de pantalla, privilegios de acceso (como conexión a Internet y captura del control remoto) y la versión mínima de Tizen requerida (v3.0+).

---

## 2. Requerimiento de Firma Criptográfica
Por motivos de seguridad, **Tizen OS prohíbe la instalación de archivos `.wgt` que no estén firmados digitalmente**.

El perfil de seguridad de firma consta de dos certificados empaquetados en archivos `.p12`:
1. **Author Certificate (Certificado de Autor)**: Identifica de forma única al desarrollador de la aplicación y garantiza la propiedad del código. Impide que terceros puedan suplantar tu app subiendo actualizaciones maliciosas.
2. **Distributor Certificate (Certificado de Distribuidor)**: Define las pantallas de televisión específicas autorizadas para instalar la aplicación de pruebas, asociando sus **DUID** (Device Unique ID). En desarrollo, Tizen CLI proporciona un certificado de distribuidor genérico (solo para emulador), pero para TVs físicas reales debes registrar tus DUIDs en el certificado usando una cuenta de desarrollador Samsung.

---

## 3. Integración con la Extensión de VS Code (Recomendado)
Para integrar el desarrollo ágil de React con la herramienta oficial de empaquetado de la extensión de VS Code:
* **Copias Automáticas en la carpeta `/dist`**: Colocamos los archivos de metadata del proyecto Tizen (`.project`, `.tproject`, `config.xml`, `icon.png` y `tizen_web_project.yaml`) en la carpeta `/public`.
* Al compilar con Vite (`npm run build`), estos archivos se copian automáticamente a `/dist`.
* **Comodines dinámicos (Wildcards)**: Configuramos `tizen_web_project.yaml` usando comodines para los assets (`assets/*`). Esto evita tener que actualizar el manifiesto del empaquetador cada vez que Vite re-compila los bundles de JS/CSS con diferentes hashes.
* **Firma Automática**: La extensión de VS Code detecta la carpeta `dist/` como el proyecto Tizen (`Project: dist`) y firma el paquete directamente usando el perfil de firmas que tengas activo en VS Code.

---

## 4. Flujo Alternativo con Docker
Si prefieres no usar VS Code, implementamos un flujo aislado en un contenedor ligero de Ubuntu x86_64:
* El script de Docker (`scripts/docker-sign.sh`) genera de forma transparente certificados de pruebas autorizados, compila con Vite, empaqueta el `.wgt` y lo firma con tu perfil local.
* **Soporte para Certificados Distribuidos**: El script de Docker está configurado para buscar el archivo `distributor.p12` (si lo has respaldado en tu carpeta `./certs/`) para registrarlo en el perfil de seguridad en Tizen CLI antes de firmar la compilación.

---

## 5. Consideraciones para Producción (Production)
Cuando llegue el momento de publicar la aplicación de forma oficial en la Samsung App Store (Seller Office), debes seguir las siguientes pautas de seguridad:

### ⚠️ Exclusión de Git (Seguridad de Credenciales)
* **Certificados (`certs/`)**: Nunca subas el directorio `./certs/` a repositorios Git. Si un atacante accede a tu llave privada `author.p12`, podrá suplantar tu aplicación.
* **Configuración local (`docker-compose.yml`)**: Debe ser ignorado por Git, ya que contiene contraseñas locales y rutas específicas de tu máquina. En su lugar, se sube una plantilla genérica llamada `docker-compose.example.yml`.

### 💾 Gestión de Certificados de Producción
* **Creación**: El certificado de producción final se genera a través de la cuenta oficial de **Samsung Developer** usando el Certificate Manager visual.
* **Respaldo Seguro**: Guarda tu archivo `author.p12` de producción y sus contraseñas en un gestor de credenciales corporativo seguro (ej. 1Password, Bitwarden) o almacenes de secretos (Google/AWS Secret Manager). **Si pierdes esta llave de producción, no podrás subir nuevas actualizaciones de tu app en la tienda.**
* **Automatización de Firma (CI/CD)**: En entornos de producción, el proceso de firma se realiza en servidores de Integración Continua (como GitHub Actions). El certificado `.p12` y la contraseña se inyectan dinámicamente como *Secrets* de GitHub, y el pipeline se encarga de firmar y publicar el entregable sin intervención humana directa.
