# 02 — Build y paquete Tizen

**Tipo:** AFK + HITL · **Depende de:** 01 · **Valida:** H1

## Qué construir

`npm run build:tizen` genera `dist-tizen/` con `config.xml` e ícono, y empaqueta y firma `verteles.wgt` con el CLI de Tizen usando el perfil de certificados local. El adaptador `SystemInfo` de Tizen agrega a Diagnóstico la versión de Tizen, el modelo y la versión de firmware. Guía corta en `docs/tizen.md`: crear certificados (autor + distribuidor con DUID), conectar el televisor en modo desarrollador e instalar con `sdb`. La IP del televisor va en una variable de entorno, no en el repo.

## Criterios de aceptación

- [x] `config.xml` declara solo los privilegios usados y `required_version` acorde a ADR-0002.
- [ ] **HITL:** un comando, desde un clon limpio con el certificado presente, produce el `.wgt` firmado.
- [x] `docs/tizen.md` permite a alguien sin contexto instalar la app.
- [ ] **HITL:** la app abre en el televisor y Diagnóstico muestra la versión de Tizen y la de Chromium. Ambas se anotan en el informe.

## Notas de implementación

- Un `.wgt` se abre desde archivos locales, donde Chromium bloquea los módulos ES. El build de Tizen sale como un único script clásico (IIFE) con `defer`. Lo verifica `e2e/tizen.spec.ts`, que abre `dist-tizen/index.html` desde `file://`.
- El build de Tizen carga `$WEBAPIS/webapis/webapis.js`. Diagnóstico toma el modelo y el firmware de `webapis.productinfo`, y la versión de Tizen de `tizen.systeminfo` (con el user agent como respaldo).
- `config.xml` mantiene el id de aplicación de la v0.1 (`XoHlW9z1dM.Verteles`), así que instalar reemplaza la app vieja. Los privilegios de teclas y AVPlay se agregan en los tickets 03 y 05.
- La red de la sesión de desarrollo no llega al SDK de Tizen: empaquetar y firmar se hace en el computador del dueño del televisor (`npm run tizen:package`).
