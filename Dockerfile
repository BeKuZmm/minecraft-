FROM itzg/minecraft-bedrock-server:latest

ENV EULA=TRUE
ENV GAMEMODE=survival
ENV DIFFICULTY=normal
ENV MAX_PLAYERS=20
ENV SERVER_NAME=UZ-Minecraft-Server
ENV LEVEL_NAME=BedrockWorld
ENV VIEW_DISTANCE=8
ENV TICK_DISTANCE=4

# PlayIt.gg o'rnatish
RUN apt-get update && apt-get install -y curl gpg && \
    curl -SsL https://playit-cloud.github.io/ppa/key.gpg | \
    gpg --dearmor > /etc/apt/trusted.gpg.d/playit.gpg && \
    echo "deb [signed-by=/etc/apt/trusted.gpg.d/playit.gpg] https://playit-cloud.github.io/ppa/v2 ." \
    > /etc/apt/sources.list.d/playit-cloud.list && \
    apt-get update && apt-get install -y playit && \
    rm -rf /var/lib/apt/lists/*

COPY behavior_packs/ /data/behavior_packs/
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 19132/udp
EXPOSE 19133/udp

CMD ["/start.sh"]
