FROM itzg/minecraft-bedrock-server:latest

ENV EULA=TRUE
ENV GAMEMODE=survival
ENV DIFFICULTY=normal
ENV MAX_PLAYERS=20
ENV SERVER_NAME=UZ Minecraft Server
ENV LEVEL_NAME=BedrockWorld
ENV VIEW_DISTANCE=8
ENV TICK_DISTANCE=4

# Behavior Pack'larni ko'chirish
COPY behavior_packs/ /data/behavior_packs/

EXPOSE 19132/udp
EXPOSE 19133/udp
