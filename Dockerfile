FROM itzg/minecraft-bedrock-server:latest

ENV EULA=TRUE
ENV GAMEMODE=survival
ENV DIFFICULTY=normal
ENV MAX_PLAYERS=20
ENV SERVER_NAME=UZ-Minecraft-Server
ENV LEVEL_NAME=BedrockWorld
ENV VIEW_DISTANCE=8
ENV TICK_DISTANCE=4

# PlayIt.gg binary yuklab olish
RUN apt-get update && apt-get install -y curl && \
    curl -L -o /usr/local/bin/playit \
    "https://github.com/playit-cloud/playit-agent/releases/latest/download/playit-linux-amd64" && \
    chmod +x /usr/local/bin/playit && \
    rm -rf /var/lib/apt/lists/*

COPY behavior_packs/ /data/behavior_packs/

# Entrypoint faylini topib wrapper qilish
RUN ENTRY=$(which docker-entrypoint.sh 2>/dev/null || find / -name "docker-entrypoint.sh" 2>/dev/null | head -1) && \
    printf "#!/bin/bash\nplayit &\nexec $ENTRY \"\$@\"\n" > /wrapper.sh && \
    chmod +x /wrapper.sh && \
    cat /wrapper.sh

ENTRYPOINT ["/bin/bash", "/wrapper.sh"]
