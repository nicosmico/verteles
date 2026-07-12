FROM --platform=linux/amd64 ubuntu:20.04

# Evitar diálogos interactivos durante la instalación
ENV DEBIAN_FRONTEND=noninteractive

# Instalar dependencias esenciales, Java JDK 11, zip, curl, wget y pciutils (para lspci)
RUN apt-get update && apt-get install -y --no-install-recommends \
    openjdk-11-jdk-headless \
    wget \
    curl \
    zip \
    unzip \
    ca-certificates \
    libglib2.0-0 \
    gnupg \
    build-essential \
    pciutils \
    sudo \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar Node.js v20 (LTS) desde NodeSource
RUN mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Crear un usuario sin privilegios 'tizen' para instalar el SDK
RUN useradd -m -s /bin/bash tizen \
    && echo "tizen:tizen" | chpasswd \
    && adduser tizen sudo

# Definir el directorio de instalación dentro de home de tizen
ENV TIZEN_STUDIO_HOME=/home/tizen/tizen-studio

# Cambiar al usuario tizen
USER tizen
WORKDIR /home/tizen

# Descargar e instalar Tizen Web CLI
RUN wget --no-verbose https://download.tizen.org/sdk/Installer/tizen-studio_5.5/web-cli_Tizen_Studio_5.5_ubuntu-64.bin \
    && chmod +x web-cli_Tizen_Studio_5.5_ubuntu-64.bin \
    && ./web-cli_Tizen_Studio_5.5_ubuntu-64.bin --accept-license ${TIZEN_STUDIO_HOME} \
    && rm web-cli_Tizen_Studio_5.5_ubuntu-64.bin

# Definir variables de entorno para Tizen
ENV PATH="${TIZEN_STUDIO_HOME}/tools/ide/bin:${TIZEN_STUDIO_HOME}/tools:${PATH}"

# Directorio de trabajo
WORKDIR /workspace

# Copiar el script de firma como root para establecer permisos y luego cambiar de usuario
USER root
COPY scripts/docker-sign.sh /usr/local/bin/docker-sign.sh
RUN chmod +x /usr/local/bin/docker-sign.sh && chown tizen:tizen /usr/local/bin/docker-sign.sh

# Volver a cambiar al usuario tizen para la ejecución
USER tizen

# Por defecto, ejecuta el script de firma
CMD ["/usr/local/bin/docker-sign.sh"]
