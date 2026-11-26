# 09 — Lanzamiento v0.1.0

**Tipo:** AFK + HITL · **Depende de:** 02

## Qué construir

Workflow `release` que se dispara manualmente (`workflow_dispatch`, con la versión como input) o al crear un tag `v*`. Si se dispara a mano, crea el tag desde Actions; así un agente puede lanzar una versión sin pushear tags. El workflow construye la web y la publica en GitHub Pages, construye el `.wgt` y crea un GitHub Release con el paquete adjunto. Investigar si el CLI de Tizen se puede instalar en GitHub Actions y si se puede firmar con los certificados guardados como secrets. Si no es viable, el Release adjunta el `.wgt` sin firmar y `docs/tizen.md` explica cómo firmarlo localmente. La decisión queda en un ADR.

## Criterios de aceptación

- [ ] Disparar el workflow con `0.1.0` (o pushear el tag `v0.1.0`) produce un Release con el `.wgt` y la web publicada.
- [ ] Ningún certificado ni contraseña queda en el repo.
- [ ] **HITL:** el dueño del repo configura Pages y, si aplica, los secrets de firma.
