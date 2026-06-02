#!/bin/bash
# ═══════════════════════════════════════
#   SERVER BOSHQARUV SKRIPTI
#   Ishlatish: ./manage.sh [buyruq]
# ═══════════════════════════════════════

case "$1" in
  start)
    echo "▶ Server ishga tushirilmoqda..."
    docker compose up -d
    echo "✅ Server yoqildi! Port: 19132"
    ;;
  stop)
    echo "▶ Server to'xtatilmoqda..."
    docker compose down
    echo "✅ Server o'chirildi."
    ;;
  restart)
    echo "▶ Server qayta ishga tushirilmoqda..."
    docker compose restart
    ;;
  logs)
    echo "▶ Server loglari:"
    docker compose logs -f --tail=50
    ;;
  console)
    echo "▶ Server konsoliga kirilmoqda (chiqish: Ctrl+P, Ctrl+Q)..."
    docker attach bedrock-minecraft
    ;;
  backup)
    echo "▶ Dunyo backup qilinmoqda..."
    DATE=$(date +%Y%m%d_%H%M%S)
    tar -czf "backup_$DATE.tar.gz" worlds/
    echo "✅ Backup: backup_$DATE.tar.gz"
    ;;
  status)
    echo "▶ Server holati:"
    docker ps | grep bedrock-minecraft
    ;;
  op)
    if [ -z "$2" ]; then
      echo "Ishlatish: ./manage.sh op <ism>"
    else
      docker exec bedrock-minecraft ./bedrock_server "op $2"
      echo "✅ $2 admin bo'ldi!"
    fi
    ;;
  *)
    echo "═══════════════════════════════"
    echo "  MINECRAFT BEDROCK MANAGER"
    echo "═══════════════════════════════"
    echo "  start    — Serverni yoqish"
    echo "  stop     — Serverni o'chirish"
    echo "  restart  — Qayta ishga tushirish"
    echo "  logs     — Loglarni ko'rish"
    echo "  console  — Konsolga kirish"
    echo "  backup   — Dunyoni saqlash"
    echo "  status   — Holat tekshirish"
    echo "  op <ism> — Admin berish"
    echo "═══════════════════════════════"
    ;;
esac
