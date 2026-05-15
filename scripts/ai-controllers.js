// AI Controllers for Mindustry AI Mod

let currentAIMode = "None";

// Basic AI fallback
function basicAI(unit) {
  if (!unit || unit.dead) return;
  // Simple follow and attack logic
  unit.approach(Vars.player.unit().pos(), 4);
}

function aggressiveAI(unit) {
  if (!unit || unit.dead) return;
  // Aggressive logic placeholder
  unit.approach(Vars.player.unit().pos(), 10);
}

function defensiveAI(unit) {
  if (!unit || unit.dead) return;
  // Defensive placeholder
  basicAI(unit);
}

function formationAI(unit) {
  if (!unit || unit.dead) return;
  // Formation placeholder
  basicAI(unit);
}

// Python AI Stub
function pythonAI(unit) {
  // TODO: Python AI stub. Пока fallback на basic/defensive поведение.
  // В будущем внешний Python-процесс будет читать состояние юнитов из файла и
  // записывать команды обратно (файловый мост).
  basicAI(unit);

  // Пример файлового моста (описание формата ниже).
  // Не реализуем синхронный мост тут — это пример формата данных, который
  // внешняя программа должна читать/писывать в mods/ai_bridge.json.
}

// Формат JSON для моста (пример):
// [
//   { "id": 123, "x": 320.5, "y": 512.0, "team": 0, "health": 450, "mode": "Python" },
//   ...
// ]
//
// Внешняя программа:
// - читает mods/ai_bridge.json (последнее состояние юнитов),
// - рассчитывает команды и пишет их в mods/ai_commands.json

print("[AI Controllers] Loaded");