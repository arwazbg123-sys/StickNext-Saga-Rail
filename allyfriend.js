import { interactWithLootBox } from './lootbox.js';

export function createAllyFriends(count, worldWidth, worldHeight) {
  const allies = [];
  for (let i = 0; i < count; i++) {
    allies.push({
      x: Math.random() * worldWidth,
      y: Math.random() * worldHeight,
      w: 30,
      h: 30,
      color: "#00ffcc",
      speed: 2 + Math.random(),
      friend: true,
      state: "normal",
      behavior: Math.random() < 0.5 ? "patrol" : "support",
      idleOffset: Math.random() * 1000,
      personality: ["leader", "follower", "coward", "aggressive", "lonewolf"][Math.floor(Math.random() * 5)],
      groupId: Math.floor(Math.random() * 3),
      goalType: "loot",
      active: true,
      deadTime: null,
      freezeTime: null,
      lastX: null,
      lastY: null,
      spawnTime: Date.now()
    });
  }
  return allies;
}

export function updateAllyFriends(allies, enemies, player, worldWidth, lootBoxes, showNotification) {
  for (let ally of allies) {
    if (!ally.active) continue;

    if (!ally.spawnTime) ally.spawnTime = Date.now();
    if (Date.now() - ally.spawnTime < 3000) continue;

    if (!ally.freezeTime) ally.freezeTime = Date.now();
    const dx = Math.abs(ally.x - (ally.lastX ?? ally.x));
    const dy = Math.abs(ally.y - (ally.lastY ?? ally.y));
    const movedRecently = dx + dy > 1.2;

    if (movedRecently) {
      ally.freezeTime = Date.now();
      ally.color = "#00ffcc";
    }

    if (Date.now() - ally.freezeTime > 1500 && Date.now() - ally.freezeTime < 3000) {
      ally.color = "#999";
    }

    if (Date.now() - ally.freezeTime > 3000 && ally.active) {
      showNotification(`🧊 ${ally.personality} membeku dan gugur karena tidak bergerak`);
      console.log(`💀 ${ally.personality} gugur karena freeze. Posisi: (${ally.x.toFixed(1)}, ${ally.y.toFixed(1)})`);
      ally.active = false;
      ally.deadTime = Date.now();
      continue;
    }

    for (let enemy of enemies) {
      const isHit = (
        ally.x < enemy.x + enemy.w &&
        ally.x + ally.w > enemy.x &&
        ally.y < enemy.y + enemy.h &&
        ally.y + ally.h > enemy.y
      );
      if (isHit) {
        showNotification(`☠️ ${ally.personality} gugur saat menabrak musuh!`);
        ally.active = false;
        ally.deadTime = Date.now();
        break;
      }
    }

    const nearestEnemy = getNearest(e => e.active, ally, enemies);
    const dangerDist = Math.hypot(ally.x - nearestEnemy.x, ally.y - nearestEnemy.y);

    if (dangerDist < 100 && ally.state === "normal") {
      ally.state = ally.personality === "coward" ? "panic" : "rage";
      console.log(`⚠️ ${ally.personality} berubah jadi ${ally.state}`);
    }

    if (ally.state === "panic") {
      const dx = ally.x - nearestEnemy.x;
      const dy = ally.y - nearestEnemy.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 0) {
        ally.x += (dx / dist) * ally.speed;
        ally.y += (dy / dist) * ally.speed;
      }

      // 🛡️ Coward cari perlindungan ke ally agresif satu grup
      const protector = allies.find(a =>
        a.personality === "aggressive" &&
        a.groupId === ally.groupId &&
        a.active
      );
      if (protector) {
        const pdx = protector.x - ally.x;
        const pdy = protector.y - ally.y;
        const pdist = Math.hypot(pdx, pdy);
        if (pdist > 50) {
          ally.x += (pdx / pdist) * ally.speed * 0.5;
          ally.y += (pdy / pdist) * ally.speed * 0.5;
        }
      }

      ally.lastX = ally.x;
      ally.lastY = ally.y;
      continue;
    }

    if (ally.state === "rage") {
      shootAtEnemy(ally, enemies);
      ally.lastX = ally.x;
      ally.lastY = ally.y;
      continue;
    }

    // 🎯 Fokus ke loot box hanya jika aman
    if (dangerDist > 120) {
      interactWithLootBox(ally, lootBoxes, showNotification);
    }

    ally.lastX = ally.x;
    ally.lastY = ally.y;
  }

  for (let i = allies.length - 1; i >= 0; i--) {
    const ally = allies[i];
    if (!ally.active && ally.deadTime) {
      const timePassed = Date.now() - ally.deadTime;
      if (timePassed > 2000) {
        allies.splice(i, 1);
      }
    }
  }
}

export function getNearest(filterFn, source, targets) {
  const filtered = targets.filter(filterFn);
  if (filtered.length === 0) return source;
  return filtered.reduce((closest, t) =>
    Math.hypot(source.x - t.x, source.y - t.y) <
    Math.hypot(source.x - closest.x, source.y - closest.y)
      ? t : closest
  );
}

export function shootAtEnemy(ally, enemies) {
  const target = getNearest(e => e.active, ally, enemies);
  const dx = target.x - ally.x;
  const dy = target.y - ally.y;
  const dist = Math.hypot(dx, dy);

  if (dist < 100) {
    target.color = "#555";
    target.speed *= 0.5;
    target.hitTime = Date.now();
  }
}