# 🎮 Minecraft Bedrock Server — To'liq Paket

## 📁 Fayl tuzilmasi

```
minecraft-bedrock-server/
├── Dockerfile                    ← Server image
├── docker-compose.yml            ← Oson boshqaruv
├── server.properties             ← Server sozlamalari
├── allowlist.json                ← Ruxsat etilgan o'yinchilar
├── permissions.json              ← Ruxsatlar
├── setup-oracle.sh               ← Oracle Cloud o'rnatish
├── manage.sh                     ← Server boshqaruv
├── behavior_packs/
│   ├── bedwars_bp/               ← BedWars o'yini
│   │   ├── manifest.json
│   │   └── scripts/main.js
│   └── parkour_bp/               ← Parkour o'yini
│       ├── manifest.json
│       └── scripts/parkour.js
└── worlds/
    └── BedrockWorld/             ← Dunyo fayllari
```

---

## 🚀 Oracle Cloud'da o'rnatish

### 1. VM yaratish (Oracle Cloud)
1. [oracle.com/cloud/free](https://oracle.com/cloud/free) — ro'yxatdan o'ting
2. **Compute → Instances → Create Instance**
3. Tanlang: **Ubuntu 22.04** | **AMD VM.Standard.E2.1.Micro** (tekin)
4. SSH kalitini yuklab oling
5. **Create** tugmasini bosing

### 2. Firewall ochish (Oracle Console)
```
Networking → Virtual Cloud Networks → Security Lists
→ Ingress Rules → Add:
  Protocol: UDP
  Port: 19132
```

### 3. VM ga ulanish
```bash
ssh -i ~/ssh-key.key ubuntu@[VM_IP_MANZILI]
```

### 4. O'rnatish
```bash
# Fayllarni VM ga ko'chirish
scp -i ~/ssh-key.key -r minecraft-bedrock-server/ ubuntu@[IP]:~/

# VM ichida
cd minecraft-bedrock-server
chmod +x setup-oracle.sh manage.sh
./setup-oracle.sh
```

### 5. Serverni ishga tushirish
```bash
./manage.sh start
```

---

## 🎯 Mini-O'yinlar

### BedWars
Chat ichida:
- `!start` — O'yinni boshlash (4 jamoa)
- `!shop` — Do'konni ochish
- `!stats` — O'z statistikangiz

### Parkour
Chat ichida:
- `!parkour` — Parkourni boshlash
- `!top` — Rekordlar jadvali
- `!restart` — Qayta boshlash

---

## ⚙️ Server boshqaruvi

```bash
./manage.sh start      # Yoqish
./manage.sh stop       # O'chirish
./manage.sh logs       # Loglar
./manage.sh backup     # Dunyo nusxasi
./manage.sh op <ism>   # Admin berish
```

---

## 🔧 O'yinchilarga ulash manzili

```
Server IP: [VM_IP_MANZILI]
Port: 19132
```

Minecraft Bedrock → Play → Servers → Add Server → IP va Port kiriting ✅
