#!/bin/bash
# ═══════════════════════════════════════════════════════
#   ORACLE CLOUD - BEDROCK SERVER O'RNATISH SKRIPTI
#   Ubuntu 22.04 uchun - Bir marta ishga tushiring!
# ═══════════════════════════════════════════════════════

set -e
echo "╔══════════════════════════════════════╗"
echo "║   Bedrock Server O'rnatish Boshlanди  ║"
echo "╚══════════════════════════════════════╝"

# ─── 1. Tizimni yangilash ─────────────
echo "▶ Tizim yangilanmoqda..."
sudo apt-get update -y && sudo apt-get upgrade -y

# ─── 2. Docker o'rnatish ──────────────
echo "▶ Docker o'rnatilmoqda..."
sudo apt-get install -y ca-certificates curl gnupg lsb-release

sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker $USER

# ─── 3. Firewall sozlash ──────────────
echo "▶ Firewall sozlanmoqda (UDP 19132)..."
sudo iptables -I INPUT -p udp --dport 19132 -j ACCEPT
sudo iptables -I INPUT -p udp --dport 19133 -j ACCEPT
sudo netfilter-persistent save 2>/dev/null || \
    sudo apt-get install -y iptables-persistent && sudo netfilter-persistent save

# ─── 4. Server papkasini yaratish ─────
echo "▶ Server papkasi tayyorlanmoqda..."
mkdir -p ~/minecraft-server
cd ~/minecraft-server

# ─── 5. Fayllarni ko'chirish ──────────
echo "▶ Server fayllarni ko'chiring va keyin:"
echo "   docker build -t bedrock-server ."
echo "   docker run -d --name minecraft \\"
echo "     -p 19132:19132/udp \\"
echo "     -p 19133:19133/udp \\"
echo "     -v \$(pwd)/worlds:/server/worlds \\"
echo "     --restart unless-stopped \\"
echo "     bedrock-server"

echo ""
echo "╔══════════════════════════════════════╗"
echo "║  O'rnatish tugadi! Serveringiz tayyor ║"
echo "╚══════════════════════════════════════╝"
