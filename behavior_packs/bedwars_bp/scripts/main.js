
import * as mc from "@minecraft/server";

// ═══════════════════════════════════════
//   BEDWARS MINI-O'YIN SKRIPTI
//   4 jamoa: Qizil, Ko'k, Yashil, Sariq
// ═══════════════════════════════════════

const TEAMS = {
  red:    { name: "Qizil",   color: "§c", spawnX: 100, spawnY: 65, spawnZ: 100, bedX: 102, bedY: 64, bedZ: 100 },
  blue:   { name: "Ko'k",    color: "§9", spawnX: -100, spawnY: 65, spawnZ: 100, bedX: -102, bedY: 64, bedZ: 100 },
  green:  { name: "Yashil",  color: "§a", spawnX: 100, spawnY: 65, spawnZ: -100, bedX: 102, bedY: 64, bedZ: -100 },
  yellow: { name: "Sariq",   color: "§e", spawnX: -100, spawnY: 65, spawnZ: -100, bedX: -102, bedY: 64, bedZ: -100 }
};

const SHOP_ITEMS = {
  "iron_sword":    { price: 10, currency: "iron_ingot" },
  "bow":           { price: 12, currency: "iron_ingot" },
  "wool":          { price: 4,  currency: "iron_ingot" },
  "iron_chestplate": { price: 24, currency: "iron_ingot" },
  "golden_apple":  { price: 3,  currency: "gold_ingot" }
};

// O'yinchilar holati
const playerData = new Map();
let gameActive = false;
let gameTimer = 0;

// ─── O'yin boshlash ───────────────────
function startGame() {
  gameActive = true;
  gameTimer = 0;

  const world = mc.world;
  world.sendMessage("§6§l╔══════════════════════════╗");
  world.sendMessage("§6§l║    BEDWARS BOSHLANDI!     ║");
  world.sendMessage("§6§l║  To'shangizni himoya qiling ║");
  world.sendMessage("§6§l╚══════════════════════════╝");

  // O'yinchilarni jamoalarga bo'lish
  const players = [...world.getPlayers()];
  const teamKeys = Object.keys(TEAMS);
  players.forEach((player, i) => {
    const teamKey = teamKeys[i % teamKeys.length];
    const team = TEAMS[teamKey];
    playerData.set(player.name, { team: teamKey, alive: true });

    player.teleport({ x: team.spawnX, y: team.spawnY, z: team.spawnZ });
    player.sendMessage(`${team.color}§lSiz ${team.name} jamoasidasiz!`);
    player.sendMessage("§eMaqsad: Dushmanning to'shagini buzin va ularni o'ldir!");
  });
}

// ─── Generator (resurs berish) ────────
function runGenerators() {
  const world = mc.world;

  // Har 5 sekundda temir berish
  world.getPlayers().forEach(player => {
    const data = playerData.get(player.name);
    if (!data || !data.alive) return;

    player.runCommand("give @s iron_ingot 2");

    // Har 30 sekundda oltin
    if (gameTimer % 30 === 0) {
      player.runCommand("give @s gold_ingot 1");
      player.sendMessage("§6+1 Oltin ingot!");
    }
  });
}

// ─── O'lim tekshirish ─────────────────
function checkDeaths() {
  mc.world.getPlayers().forEach(player => {
    const data = playerData.get(player.name);
    if (!data) return;

    if (player.location.y < 0) {
      const team = TEAMS[data.team];

      // To'shak bor-yo'qligini tekshirish (soddalashtirilgan)
      if (data.hasBed !== false) {
        // Respawn
        player.teleport({ x: team.spawnX, y: team.spawnY, z: team.spawnZ });
        player.sendMessage("§cO'ldingiz! To'shagingiz bor, qaytdingiz.");
        mc.world.sendMessage(`${team.color}${player.name} §7o'ldi - lekin to'shagi bor!`);
      } else {
        // Yakuniy o'lim
        data.alive = false;
        player.sendMessage("§c§lSiz ELIMIN bo'ldingiz! To'shagingiz yo'q edi.");
        mc.world.sendMessage(`${team.color}${player.name} §7butunlay elimin bo'ldi!`);
        checkWin();
      }
    }
  });
}

// ─── G'alaba tekshirish ───────────────
function checkWin() {
  const aliveTeams = new Set();
  playerData.forEach((data, name) => {
    if (data.alive) aliveTeams.add(data.team);
  });

  if (aliveTeams.size === 1) {
    const winnerTeam = TEAMS[[...aliveTeams][0]];
    mc.world.sendMessage(`§6§l🏆 ${winnerTeam.color}${winnerTeam.name} jamoasi G'ALABA QOZONDI! 🏆`);
    gameActive = false;
  }
}

// ─── Chat buyruqlari ──────────────────
mc.world.beforeEvents.chatSend.subscribe(event => {
  const msg = event.message;
  const player = event.sender;

  if (msg === "!start" && !gameActive) {
    event.cancel = true;
    startGame();
  }

  if (msg === "!shop") {
    event.cancel = true;
    let shopMsg = "§6═══ DO'KON ═══\n";
    Object.entries(SHOP_ITEMS).forEach(([item, info]) => {
      shopMsg += `§f${item}: §e${info.price}x ${info.currency}\n`;
    });
    player.sendMessage(shopMsg);
  }

  if (msg === "!stats") {
    event.cancel = true;
    const data = playerData.get(player.name);
    if (data) {
      const team = TEAMS[data.team];
      player.sendMessage(`§6Jamoa: ${team.color}${team.name}`);
      player.sendMessage(`§6Holat: ${data.alive ? "§aTimsol" : "§cElimin"}`);
    }
  }
});

// ─── Asosiy game loop ─────────────────
mc.system.runInterval(() => {
  if (!gameActive) return;
  gameTimer++;

  if (gameTimer % 5 === 0) {
    runGenerators();
    checkDeaths();
  }

  // Vaqt e'loni
  if (gameTimer % 60 === 0) {
    const minutes = Math.floor(gameTimer / 60);
    mc.world.sendMessage(`§7O'yin vaqti: §f${minutes} daqiqa`);
  }
}, 20); // Har sekund

// ─── O'yin tugaganda ──────────────────
mc.world.afterEvents.playerSpawn.subscribe(({ player }) => {
  if (!gameActive) {
    player.sendMessage("§aXush kelibsiz! O'yin hali boshlanmagan.");
    player.sendMessage("§e!start — O'yinni boshlash");
    player.sendMessage("§e!shop  — Do'kon");
  }
});
