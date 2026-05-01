import { createAllyFriends } from './allyfriend.js'; // ⬅️ Penting biar ally punya personality & behavior

// 🌍 Ukuran dunia
export const world = { width: 3000, height: 2000 };

// 🧍 Pemain utama
export const player = {
  x: 100,
  y: 100,
  w: 40,
  h: 40,
  color: "#00ffcc",
  speed: 5,
  active: true // ✅ Supaya army nggak ngejar player kalau udah mati
};

// 🫂 Pasukan sekutu
export let allies = createAllyFriends(10, world.width, world.height);

// 🔥 Generate musuh dengan bentuk dan perilaku random
export function createEnemies(count, worldWidth, worldHeight) {
  const enemies = [];
  for (let i = 0; i < count; i++) {
    enemies.push({
      x: Math.random() * worldWidth,
      y: Math.random() * worldHeight,
      w: 30,
      h: 30,
      color: "red",
      speed: 1.5 + Math.random() * 2,
      shape: Math.random() < 0.5 ? "square" : "circle",
      smart: Math.random() < 0.7,
      direction: Math.random() < 0.5 ? 1 : -1,
      stuckTimer: 0 // ⏱️ Tambahan untuk deteksi stuck
    });
  }
  return enemies;
}

// 🧠 Update posisi musuh berdasarkan AI
export function updateEnemies(enemies, targets, worldWidth, worldHeight) {
  const validTargets = targets.filter(t => t.active !== false);

  enemies.forEach(enemy => {
    if (enemy.smart && validTargets.length > 0) {
      let closest = validTargets[0];
      let minDist = distance(enemy, closest);

      validTargets.forEach(t => {
        const d = distance(enemy, t);
        if (d < minDist) {
          minDist = d;
          closest = t;
        }
      });

      const dx = closest.x - enemy.x;
      const dy = closest.y - enemy.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 0.1) {
        enemy.x += (dx / dist) * enemy.speed;
        enemy.y += (dy / dist) * enemy.speed;
        enemy.stuckTimer = 0; // reset timer kalau bergerak
      } else {
        // 🚨 Deteksi stuck: terlalu dekat tapi nggak bisa gerak
        enemy.stuckTimer++;
        if (enemy.stuckTimer > 30) {
          // ⛓️ Fallback: geser acak biar lepas dari posisi
          enemy.x += (Math.random() - 0.5) * 20;
          enemy.y += (Math.random() - 0.5) * 20;
          enemy.stuckTimer = 0;
        }
      }
    } else {
      // 🚶 Musuh bodoh: gerak horizontal bolak-balik
      enemy.x += enemy.speed * enemy.direction;
      if (enemy.x < 0 || enemy.x + enemy.w > worldWidth) {
        enemy.direction *= -1;
      }
    }
  });
}

// 🎯 Gambar musuh sesuai bentuk
export function drawEnemy(ctx, enemy, camera) {
  ctx.fillStyle = enemy.color;
  const x = enemy.x - camera.x;
  const y = enemy.y - camera.y;

  if (enemy.shape === "circle") {
    ctx.beginPath();
    ctx.arc(x + enemy.w / 2, y + enemy.h / 2, enemy.w / 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillRect(x, y, enemy.w, enemy.h);
  }
}

// 🔍 Fungsi bantu jarak
export function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}