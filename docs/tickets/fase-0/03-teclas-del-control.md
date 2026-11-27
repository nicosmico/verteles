# 03 — Teclas del control

**Tipo:** AFK + HITL · **Depende de:** 01 · **Valida:** H2

## Qué construir

Teclas lógicas en `domain/`, la interfaz `RemoteKeys` y sus adaptadores. Web: flechas, Enter (OK), Escape y Backspace (Back), PageUp y PageDown (CH±), dígitos, F1–F4 (colores) y espacio (Play/Pause). Tizen: registro de teclas con `tvinputdevice`, Back = 10009. El shell del spike cambia de pantalla con las teclas de color. Diagnóstico muestra la última tecla lógica y su código crudo. Back en el shell pide confirmar la salida con `AppLifecycle`.

## Criterios de aceptación

- [x] Las tablas de traducción crudo → lógico tienen tests unitarios por plataforma (TDD).
- [x] Un código crudo desconocido no rompe nada y aparece en Diagnóstico.
- [x] E2E: F1–F3 cambian de pantalla en la web.
- [ ] **HITL:** cada tecla de la lista H2 aparece correctamente en Diagnóstico en el televisor.

## Notas de implementación

- Teclas lógicas: `RemoteKey` en `src/domain/remote/`. Tablas por plataforma: `src/platform/web/keys.ts` (teclado) y `src/platform/tizen/keys.ts` (key codes de Samsung y nombres para `registerKey`).
- En la web: flechas, Enter = OK, Escape/Backspace = Back, PageUp/PageDown = CH±, espacio = Play/Pause, F1–F4 = colores, 0–9.
- Back dos veces en menos de 2 s sale de la app (`exitGuard`). En la web, `exit()` no hace nada: una página no puede cerrar su pestaña.
- `config.xml` agrega el privilegio `tv.inputdevice`.
- El e2e de Tizen simula `tizen.tvinputdevice` y `tizen.application`. Se verificó que falla si se quita el registro de teclas.
