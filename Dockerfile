FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV LD_LIBRARY_PATH=.

WORKDIR /server

# Kerakli kutubxonalar
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    libcurl4 \
    libssl3 \
    screen \
    && rm -rf /var/lib/apt/lists/*

# Bedrock Server yuklab olish (1.21.x)
RUN curl -L -o bedrock.zip \
    "https://minecraft.azureedge.net/bin-linux/bedrock-server-1.21.0.03.zip" && \
    unzip bedrock.zip && \
    rm bedrock.zip && \
    chmod +x bedrock_server

# Config fayllarini ko'chirish
COPY server.properties .
COPY allowlist.json .
COPY ops.json .
COPY permissions.json .

# Behavior Pack'larni ko'chirish
COPY behavior_packs/ ./behavior_packs/

# Worlds va resource_packs papkalarini yaratish
RUN mkdir -p ./worlds ./resource_packs

# Port (UDP)
EXPOSE 19132/udp
EXPOSE 19133/udp

# Serverni ishga tushirish
CMD ["./bedrock_server"]
