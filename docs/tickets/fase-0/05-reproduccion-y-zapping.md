# 05 — Reproducción y Zapping

**Tipo:** AFK + HITL · **Depende de:** 03, 04 · **Valida:** H3

## Qué construir

La interfaz `Player` (cargar URL, detener, eventos de reproduciendo, cargando y error) con dos adaptadores: hls.js en web (una sola instancia reutilizada) y AVPlay en Tizen. La política de respaldo de Fuentes en `domain/`: si una Fuente da error o no muestra el primer cuadro antes de un tiempo límite, se prueba la siguiente; si fallan todas, el Canal queda como Canal no disponible. La pantalla Reproducción muestra el Canal 1 de Chile en pantalla completa, hace Zapping con CH± y ↑↓, y muestra en una esquina el nombre, la Fuente en uso y el tiempo hasta el primer cuadro del último Zapping, junto con la mediana de los últimos 10.

## Criterios de aceptación

- [ ] La política de respaldo tiene tests unitarios con un `Player` falso (TDD): orden, tiempo límite, Canal no disponible y Zapping que cancela un intento en curso.
- [ ] Zapping rápido repetido no deja reproductores huérfanos ni eventos de un Canal anterior.
- [ ] hls.js no aparece en el bundle de Tizen.
- [ ] **HITL:** mediana de 10 Zappings anotada en el informe (H3). Cuántos de los Canales de Chile reproducen en web y cuántos en el televisor (informativo).
