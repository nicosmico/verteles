#!/bin/bash
set -e

echo "🐳 Starting Tizen build and signature pipeline inside Docker..."

# 1. Verificar o generar certificado de prueba (usando variables de entorno o valores por defecto)
CERT_DIR="${CERT_DIR:-/certs}"
TIZEN_PROFILE_NAME="${TIZEN_PROFILE_NAME:-VertevesProfile}"
TIZEN_CERTIFICATE_PASSWORD="${TIZEN_CERTIFICATE_PASSWORD:-vertevesdevpwd}"
AUTHOR_P12="${AUTHOR_P12:-$CERT_DIR/author.p12}"

if [ ! -d "${CERT_DIR}" ]; then
    echo "⚠️ Cert directory ${CERT_DIR} not mounted. Creating a local cert folder."
    mkdir -p "${CERT_DIR}"
fi

if [ ! -f "${AUTHOR_P12}" ]; then
    echo "🔑 No certificate found at ${AUTHOR_P12}. Generating a new one..."
    # Generar en la ruta por defecto del keystore de Tizen
    tizen certificate -a VertevesDev -p "${TIZEN_CERTIFICATE_PASSWORD}" -c CL -s Santiago -ct Santiago -o Verteves -u Dev -n Nico -e nico@example.com -f author
    # Copiar a la carpeta montada para que persista en el host
    cp /home/tizen/tizen-studio-data/keystore/author/author.p12 "${AUTHOR_P12}"
    echo "✅ Certificate generated and saved to ${AUTHOR_P12}."
else
    echo "🔑 Existing certificate found at ${AUTHOR_P12}."
fi

# 2. Registrar el perfil de seguridad en Tizen CLI
echo "📝 Registering security profile '${TIZEN_PROFILE_NAME}'..."
# Borramos el perfil si ya existe para evitar errores de duplicado
tizen security-profiles remove -n "${TIZEN_PROFILE_NAME}" 2>/dev/null || true
tizen security-profiles add -n "${TIZEN_PROFILE_NAME}" -a "${AUTHOR_P12}" -p "${TIZEN_CERTIFICATE_PASSWORD}"

# 3. Compilar la aplicación React y empaquetar .wgt
echo "📦 Building and packaging IPTV app..."
echo "Installing/checking npm dependencies for Linux..."
npm install --os=linux --cpu=x64

# Ejecutamos el build local que compila y zipea el wgt
npm run build:tizen

# 4. Firmar el widget .wgt
echo "⚡ Signing verteves.wgt..."
tizen package -t wgt -s "${TIZEN_PROFILE_NAME}" -- /workspace/verteves.wgt

echo "✅ App packaged and signed successfully! File is located at: /workspace/verteves.wgt"
