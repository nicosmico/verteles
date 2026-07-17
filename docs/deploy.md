# Deploy Guide

Documentación de los flujos de despliegue disponibles en el proyecto.

> [!NOTE]
> Por ahora solo están configurados deploys de **desarrollo**. Los entornos de staging y producción se definirán en iteraciones posteriores.

---

## Firebase Hosting (Entorno de Desarrollo / Preview)

Usado para compartir builds de prueba o validar la app web antes de producción.

### Pre-requisitos

- Tener `firebase-tools` instalado (ya incluido en `devDependencies`)
- Haber autenticado la CLI: `npx firebase login`
- Tener un proyecto Firebase configurado en `firebase.json`

### Comando

```bash
npm run deploy:firebase:dev
```

Ejecuta `npm run build` (TypeScript + Vite) y luego `npx firebase deploy` en un solo paso.

### Notas

- Este entorno apunta al **proyecto Firebase de desarrollo** — no es producción.
- El archivo `.firebase/` (caché local de la CLI) está excluido del repositorio vía `.gitignore`.
- El canal de deploy se define en `firebase.json`. Para usar canales de preview separados:

  ```bash
  npx firebase hosting:channel:deploy preview-branch
  ```

---

## Tizen OS (TV física / Simulador)

Ver [`tizen-packaging-flow.md`](./tizen-packaging-flow.md) y [`tizen-testing-guide.md`](./tizen-testing-guide.md).

| Script | Descripción |
|---|---|
| `npm run build` | Genera el bundle de producción en `dist/` |
| `npm run tizen:run` | Conecta por SDB y lanza la app en la TV |
| `npm run tizen:logs` | Muestra logs de la TV en tiempo real |
| `npm run tizen:uninstall` | Desinstala la app de la TV |
