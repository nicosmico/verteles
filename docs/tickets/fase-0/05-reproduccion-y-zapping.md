# 05 — Reproducción y Zapping

**Tipo:** AFK + HITL · **Depende de:** 03, 04 · **Valida:** H3

## Qué construir

La interfaz `Player` (cargar URL, detener, eventos de reproduciendo, cargando y error) con dos adaptadores: hls.js en web (una sola instancia reutilizada) y AVPlay en Tizen. La política de respaldo de Fuentes en `domain/`: si una Fuente da error o no muestra el primer cuadro antes de un tiempo límite, se prueba la siguiente; si fallan todas, el Canal queda como Canal no disponible. La pantalla Reproducción muestra el Canal 1 de Chile en pantalla completa, hace Zapping con CH± y ↑↓, y muestra en una esquina el nombre, la Fuente en uso y el tiempo hasta el primer cuadro del último Zapping, junto con la mediana de los últimos 10.

## Criterios de aceptación

- [x] La política de respaldo tiene tests unitarios con un `Player` falso (TDD): orden, tiempo límite, Canal no disponible y Zapping que cancela un intento en curso.
- [x] Zapping rápido repetido no deja reproductores huérfanos ni eventos de un Canal anterior.
- [x] hls.js no aparece en el bundle de Tizen.
- [ ] **HITL:** mediana de 10 Zappings anotada en el informe (H3). Cuántos de los Canales de Chile reproducen en web y cuántos en el televisor (informativo).

## Notas de implementación

- `createTuner` (`src/domain/playback/tuner.ts`) prueba las Fuentes en orden: una Fuente que da error o no muestra el primer cuadro en 8 s se salta, y si ninguna funciona el Canal queda como Canal no disponible. Cada `tune()` invalida los eventos y timeouts del intento anterior (Zapping rápido). Tests con un Player y un reloj falsos.
- Web: `<video>` con HLS nativo cuando el navegador lo soporta (Safari, iPhone); si no, hls.js **light**, cargado bajo demanda y reutilizado entre Zappings (116 KB gzip, fuera del JS inicial). Si el navegador bloquea el autoplay con sonido, se reproduce en silencio.
- Tizen: AVPlay sobre `<object type="application/avplayer">`. El primer `oncurrentplaytime` cuenta como primer cuadro. Mientras Reproducción está en pantalla, la página es transparente para que se vea el plano de video. hls.js no entra en el build de Tizen.
- Se guarda la Identidad de canal del último Canal **sintonizado** (no solo del que llegó a reproducirse), y la app vuelve a él al abrir. Un e2e con IndexedDB lento encontró que el Canal inicial podía pisar un Zapping hecho durante el arranque; corregido y cubierto.
- Teléfono: botones táctiles "Canal anterior" / "Canal siguiente".
- Los e2e hacen fallar todas las Fuentes: el navegador de pruebas no decodifica H.264. El video real se verifica en el televisor (H3).
