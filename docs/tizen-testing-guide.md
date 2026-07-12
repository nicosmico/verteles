# Guía Rápida de Instalación en Samsung Smart TV (Tizen OS)

Este flujo utiliza **Docker** al 100% para evitar tener que instalar Java, el Tizen SDK o cualquier otra herramienta (incluyendo `sdb`) en tu Mac. Todo el proceso de compilación, firma y despliegue se ejecuta dentro del contenedor de Docker.

---

## 1. Prerrequisitos
* Tu Mac y la TV en la **misma red local** (Wi-Fi o cable Ethernet).
* **Docker Desktop** ejecutándose en tu Mac.
* *¡No necesitas instalar nada más en macOS!*

---

## 2. Activar Developer Mode en la TV
1. En la TV, entra a la sección de **Apps**.
2. Desplázate (scroll) hasta el final de la pantalla y entra en la sección **Configuración de Apps** (o en la barra de configuración superior).
3. Con el control remoto de la TV, presiona la secuencia: **`1` `2` `3` `4` `5`** de forma consecutiva.
4. En la ventana emergente, cambia el interruptor a **ON** e ingresa la **IP local de tu Mac**.
   * *Puedes ver la IP de tu Mac en Ajustes del Sistema -> Red.*
5. **Reinicio físico obligatorio:** Mantén pulsado el botón **Power** del control remoto durante 5 segundos (hasta que se apague y encienda mostrando el logo de Tizen) o desconecta la TV de la corriente por 10 segundos.

---

## 3. Compilar y Firmar (.wgt)
En la terminal de la Mac, en la raíz del proyecto, ejecuta:
```bash
npm run build:tizen:docker
```
*Este comando compila la aplicación y genera el instalador firmado `./verteles.wgt` en la raíz de tu proyecto usando Docker.*

---

## 4. Conectar e Instalar en la TV (Vía Docker)

### A. Ejecutar el despliegue directo (Recomendado)
Como hemos configurado tu IP en el proyecto, puedes hacer el despliegue completo con un solo comando simplificado:
```bash
npm run tizen:deploy:tv
```

### B. Ejecutar despliegue a una IP manual o diferente
Si alguna vez cambia la IP de tu TV o quieres probar en otra pantalla:
1. Ve en la televisión a: **Ajustes > General > Red > Estado de Red > Ajustes de IP** (ej. `198.168.18.7`).
2. Ejecuta el script general especificando la IP con `--`:
   ```bash
   npm run tizen:deploy -- <IP_DE_LA_TV>
   ```
   *Ejemplo: `npm run tizen:deploy -- 198.168.18.7`*

#### ¿Qué hace este comando en segundo plano?
1. Levanta temporalmente un contenedor Docker con la herramienta `sdb` integrada.
2. Se conecta a la IP de tu TV (`198.168.18.7`).
3. **Revisa la TV:** Si es la primera vez que te conectas, aparecerá una alerta en la pantalla de la TV preguntando si deseas permitir la depuración. **Acéptala inmediatamente con el control remoto** para que el comando continúe.
4. Sube e instala el widget `verteles.wgt` directamente en tu televisor.
5. Al terminar, verás el mensaje `Success` y la app **Verteles** estará disponible en el Smart Hub de tu TV.

---

## 5. Comandos Útiles de Depuración en Docker
Si necesitas ejecutar tareas adicionales de depuración sin instalar nada localmente, puedes correr los siguientes comandos:

* **Ver los logs de la TV en tiempo real:**
  ```bash
  docker compose run --rm tizen-signer sdb dlog
  ```
* **Desinstalar la aplicación de la TV:**
  ```bash
  docker compose run --rm tizen-signer sdb uninstall XoHlW9z1dM.Verteles
  ```
* **Ver dispositivos conectados:**
  ```bash
  docker compose run --rm tizen-signer sdb devices
  ```
