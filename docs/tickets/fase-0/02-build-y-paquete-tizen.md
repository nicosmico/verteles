# 02 — Build y paquete Tizen

**Tipo:** AFK + HITL · **Depende de:** 01 · **Valida:** H1

## Qué construir

`npm run build:tizen` genera `dist-tizen/` con `config.xml` e ícono, y empaqueta y firma `verteles.wgt` con el CLI de Tizen usando el perfil de certificados local. El adaptador `SystemInfo` de Tizen agrega a Diagnóstico la versión de Tizen, el modelo y la versión de firmware. Guía corta en `docs/tizen.md`: crear certificados (autor + distribuidor con DUID), conectar el televisor en modo desarrollador e instalar con `sdb`. La IP del televisor va en una variable de entorno, no en el repo.

## Criterios de aceptación

- [ ] `config.xml` declara solo los privilegios usados y `required_version` acorde a ADR-0002.
- [ ] Un comando, desde un clon limpio con el certificado presente, produce el `.wgt` firmado.
- [ ] `docs/tizen.md` permite a alguien sin contexto instalar la app.
- [ ] **HITL:** la app abre en el televisor y Diagnóstico muestra la versión de Tizen y la de Chromium. Ambas se anotan en el informe.
