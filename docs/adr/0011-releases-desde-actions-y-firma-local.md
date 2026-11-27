# Releases desde GitHub Actions; la firma para Tizen es local

Las versiones se publican con el workflow `Release` (disparo manual con la versión, por ejemplo `0.1.0`): crea el tag `v0.1.0` y un GitHub Release con el build de Tizen **sin firmar** (`verteles-tizen-0.1.0.zip`). La versión se ve en Diagnóstico y en el `config.xml` del paquete. La web se publica sola con cada push a `main`.

El `.wgt` no se firma en CI porque un televisor solo instala paquetes firmados con un certificado de distribuidor atado a su DUID, creado con una cuenta Samsung. Guardar esos certificados como secrets agregaría riesgo y mantenimiento para un proyecto de uso personal. Para instalar una versión: `git checkout v0.1.0 && npm run tizen:package && npm run tizen:install`.

Si la app se distribuye más allá de un televisor, se revisa esta decisión (firmar en CI con certificados en secrets).
