import * as mc from "@minecraft/server";

// ═══════════════════════════════════════
//   PARKOUR MINI-O'YIN SKRIPTI
//   Checkpoint tizimi + Vaqt o'lchash
// ═══════════════════════════════════════

// Checkpoint koordinatalari (o'zingiz sozlang)
const CHECKPOINTS = [
  { id: 0, x: 0,   y: 65, z: 0,   name: "Bosh" },
  { id: 1, x: 20,  y: 70, z: 0,   name: "1-checkpoint" },
  { id: 2, x: 40,  y: 75, z: 10,  name: "2-checkpoint" },
  { id: 3, x: 60,  y: 80, z: -10, name: "3-checkpoint" },
  { id: 4, x: 80,  y: 85, z: 0,   name: "4-checkpoint" },
  { id: 5, x: 100, y: 90, z: 0,   name: "FINISH! 🏁" }
];

const CHECKPOINT_RADIUS = 3; // Blok masofasi

// O'yinchi ma'lumotlari
const parkourPlayers = new Map();
const leaderboard = [];

// ─── O'yinni boshlash ─────────────────
function startParkour(player) {
  parkourPlayers.set(player.name, {
    checkpoint: 0,
    startTime: Date.now(),
    bestTime: parkourPlayers.get(player.name)?.bestTime || null
  });

  const spawn = CHECKPOINTS[0];
  player.teleport({ x: spawn.x, y: spawn.y, z: spawn.z });
  player.runCommand("effect @s speed 1 255 true");
  player.runCommand("gamemode adventure @s");

  player.sendMessage("§a§l✦ PARKOUR BOSHLANDI! ✦");
  player.sendMessage("§eCheckpointlarga yeting va rekord qo'ying!");
  showBossBar(player, 0);
}

// ─── BossBar ko'rsatish ───────────────
function showBossBar(player, checkpoint) {
  const progress = checkpoint / (CHECKPOINTS.length - 1);
  const filled = Math.floor(progress * 20);
  const bar = "§a" + "█".repeat(filled) + "§7" + "█".repeat(20 - filled);
  player.onScreenDisplay.setActionBar(
    `§6Checkpoint: §f${checkpoint}/${CHECKPOINTS.length - 1}  ${bar}`
  );
}

// ─── Vaqtni formatlash ────────────────
function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  const millis = ms % 1000;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2,'0')}.${millis.toString().padStart(3,'0')}`;
}

// ─── Checkpoint tekshirish ────────────
function checkCheckpoints() {
  mc.world.getPlayers().forEach(player => {
    const data = parkourPlayers.get(player.name);
    if (!data) return;

    const nextCp = CHECKPOINTS[data.checkpoint + 1];
    if (!nextCp) return;

    const loc = player.location;
    const dist = Math.sqrt(
      Math.pow(loc.x - nextCp.x, 2) +
      Math.pow(loc.y - nextCp.y, 2) +
      Math.pow(loc.z - nextCp.z, 2)
    );

    if (dist <= CHECKPOINT_RADIUS) {
      data.checkpoint++;
      showBossBar(player, data.checkpoint);

      // Finish!
      if (data.checkpoint === CHECKPOINTS.length - 1) {
        const time = Date.now() - data.startTime;
        const timeStr = formatTime(time);

        player.sendMessage(`§6§l🏆 FINISH! Vaqtingiz: §f${timeStr}`);
        player.runCommand("playsound random.levelup @s");
        player.runCommand("particle minecraft:totem_particle ~~~");

        // Rekord
        if (!data.bestTime || time < data.bestTime) {
          data.bestTime = time;
          player.sendMessage(`§a§l★ YANGI REKORD! ${timeStr} ★`);
          mc.world.sendMessage(`§6${player.name} §aparkourda yangi rekord qo'ydi: §f${timeStr}!`);
        }

        // Liderbord
        updateLeaderboard(player.name, time);
        data.checkpoint = 0;

      } else {
        player.sendMessage(`§a✓ ${nextCp.name} — ${formatTime(Date.now() - data.startTime)}`);
        player.runCommand("playsound note.pling @s");
      }
    }

    // Qulab ketdi
    if (loc.y < 50) {
      const cp = CHECKPOINTS[data.checkpoint];
      player.teleport({ x: cp.x, y: cp.y, z: cp.z });
      player.sendMessage("§c✗ Qulab ketdingiz! Oxirgi checkpointdan qaytdingiz.");
    }
  });
}

// ─── Liderbord ───────────────────────
function updateLeaderboard(name, time) {
  const existing = leaderboard.findIndex(e => e.name === name);
  if (existing !== -1) {
    if (time < leaderboard[existing].time) {
      leaderboard[existing].time = time;
    }
  } else {
    leaderboard.push({ name, time });
  }
  leaderboard.sort((a, b) => a.time - b.time);
}

function showLeaderboard(player) {
  if (leaderboard.length === 0) {
    player.sendMessage("§7Hali hech kim finish qilmadi!");
    return;
  }
  player.sendMessage("§6§l═══ PARKOUR REKORDLARI ═══");
  leaderboard.slice(0, 10).forEach((entry, i) => {
    const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i+1}.`;
    player.sendMessage(`${medal} §f${entry.name}: §e${formatTime(entry.time)}`);
  });
}

// ─── Chat buyruqlari ──────────────────
mc.world.beforeEvents.chatSend.subscribe(event => {
  const msg = event.message;
  const player = event.sender;

  if (msg === "!parkour") {
    event.cancel = true;
    startParkour(player);
  }

  if (msg === "!top") {
    event.cancel = true;
    showLeaderboard(player);
  }

  if (msg === "!restart") {
    event.cancel = true;
    startParkour(player);
  }
});

// ─── Asosiy loop ──────────────────────
mc.system.runInterval(() => {
  checkCheckpoints();

  // Vaqtni ko'rsatish
  parkourPlayers.forEach((data, name) => {
    const player = mc.world.getPlayers().find(p => p.name === name);
    if (player && data.checkpoint > 0) {
      const elapsed = formatTime(Date.now() - data.startTime);
      showBossBar(player, data.checkpoint);
    }
  });
}, 5);

// ─── Kirish xabari ────────────────────
mc.world.afterEvents.playerSpawn.subscribe(({ player }) => {
  player.sendMessage("§b§l⚡ PARKOUR serveriga xush kelibsiz!");
  player.sendMessage("§e!parkour — Boshlash  |  §e!top — Rekordlar");
});
