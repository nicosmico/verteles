# Instalar Verteles en un televisor Samsung

Guía para instalar el build de Tizen en un televisor en modo desarrollador. Los pasos 1 a 4 se hacen **una sola vez**.

> **Estado:** los comandos `tizen:*` todavía no se han probado en un televisor real (ticket 02 de la fase 0). Si un paso falla, anota el error en el ticket.

## 1. Instalar Tizen Studio

1. Descarga **Tizen Studio** (con IDE o solo CLI) desde el sitio de desarrolladores de Tizen.
2. Abre el **Package Manager** de Tizen Studio y, en la pestaña *Extension SDK*, instala **Samsung Certificate Extension** y **TV Extensions**.
3. Agrega al `PATH` las carpetas `~/tizen-studio/tools` (donde está `sdb`) y `~/tizen-studio/tools/ide/bin` (donde está `tizen`).
4. Comprueba que funcionen: `tizen version` y `sdb version`.

## 2. Activar el modo desarrollador en el televisor

1. Computador y televisor deben estar en la misma red.
2. En el televisor, abre **Apps** y presiona en el control `1` `2` `3` `4` `5`.
3. Activa **Developer mode** y escribe la IP de **tu computador** como *Host PC IP*.
4. Reinicia el televisor (apagado completo, no solo standby).
5. Anota la IP del televisor: *Configuración → General → Red → Estado de la red*.

## 3. Crear el certificado de Samsung

Un televisor solo instala apps firmadas con un certificado de autor y uno de distribuidor que incluya el **DUID** (identificador) de ese televisor.

1. Conecta el televisor: `sdb connect <IP del televisor>`. Debe aparecer en `sdb devices`.
2. En Tizen Studio abre **Certificate Manager → + → Samsung → TV**.
3. Ponle un nombre al perfil, por ejemplo `verteles`.
4. Crea el **certificado de autor**: pide iniciar sesión con una cuenta Samsung.
5. Crea el **certificado de distribuidor**, con privilegio *Public*. El DUID del televisor conectado se agrega solo; si no, agrégalo a mano (`sdb shell 0 getduid`).
6. Respalda los archivos `.p12` y sus contraseñas fuera del repo. Sin el certificado de autor no se puede actualizar la app instalada.

## 4. Configurar el proyecto

Copia `.env.example` a `.env.local` (está ignorado por git) y completa:

```bash
TV_IP=192.168.1.50      # IP del televisor
TIZEN_PROFILE=verteles  # nombre del perfil del paso 3
```

## 5. Empaquetar, instalar y abrir

```bash
npm run tizen:package   # build de Tizen + verteles.wgt firmado
npm run tizen:install   # conecta con el televisor e instala
npm run tizen:run       # abre la app en el televisor
```

La app abre en la pantalla **Diagnóstico**, que muestra el modelo, el firmware y las versiones de Tizen y Chromium del televisor.

## Problemas conocidos

- **`sdb connect` no conecta**: revisa que la *Host PC IP* del paso 2 sea la IP actual de tu computador y reinicia el televisor.
- **La instalación falla por la firma**: el DUID del televisor no está en el certificado de distribuidor. Vuelve a crearlo con el televisor conectado.
- **Pantalla negra al abrir**: el build de Tizen debe cargar JS como script clásico, no como módulo (lo cubre el e2e `e2e/tizen.spec.ts`).
