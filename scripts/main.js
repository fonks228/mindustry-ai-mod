// AI Mindustry Mod - Основной скрипт умного ИИ

console.log("[AI Mod] Загружен основной скрипт!");

// Кастомный контроллер ИИ
class SmartAI extends AIController {
    updateUnit() {
        super.updateUnit();
        
        // Найти ближайшего врага
        let enemy = Units.closestEnemy(unit.team, unit.x, unit.y, 400, u => u != null);
        if (enemy != null && unit.within(enemy, unit.range() + 50)) {
            unit.target = enemy;
            unit.moveTo(enemy, 0.8);
        } else if (enemy != null) {
            // Преследовать
            unit.moveTo(enemy, 1.2);
        }
    }
}

// Применяем умный ИИ к юнитам игрока
Events.on(UnitSpawnEvent, e => {
    let u = e.unit;
    if (u.team == Vars.player.team() && !u.isPlayer()) {
        u.controller = new SmartAI();
    }
});

print("[AI Mod] SmartAI загружен");