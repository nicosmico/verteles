# 03 — Teclas del control

**Tipo:** AFK + HITL · **Depende de:** 01 · **Valida:** H2

## Qué construir

Teclas lógicas en `domain/`, la interfaz `RemoteKeys` y sus adaptadores. Web: flechas, Enter (OK), Escape y Backspace (Back), PageUp y PageDown (CH±), dígitos, F1–F4 (colores) y espacio (Play/Pause). Tizen: registro de teclas con `tvinputdevice`, Back = 10009. El shell del spike cambia de pantalla con las teclas de color. Diagnóstico muestra la última tecla lógica y su código crudo. Back en el shell pide confirmar la salida con `AppLifecycle`.

## Criterios de aceptación

- [ ] Las tablas de traducción crudo → lógico tienen tests unitarios por plataforma (TDD).
- [ ] Un código crudo desconocido no rompe nada y aparece en Diagnóstico.
- [ ] E2E: F1–F3 cambian de pantalla en la web.
- [ ] **HITL:** cada tecla de la lista H2 aparece correctamente en Diagnóstico en el televisor.
