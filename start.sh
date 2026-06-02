#!/bin/bash
# PlayIt.gg background da ishga tushirish
playit &

# Minecraft server ishga tushirish
exec /usr/local/bin/docker-entrypoint.sh
