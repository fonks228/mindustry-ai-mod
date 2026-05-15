// Advanced AI Controllers

// Aggressive AI - атакует ближайшую цель
aiMod.AggressiveAI = extend(UnitController, {
    update: function(unit) {
        let target = Units.closestEnemy(unit.team, unit.x, unit.y, 9999, u => true);
        if (target) unit.setTarget(target);
    }
});

// Basic AI - простое поведение: ищет ближайшего врага в радиусе 600
aiMod.BasicAI = extend(UnitController, {
    update: function(unit) {
        let target = Units.closestEnemy(unit.team, unit.x, unit.y, 600, u => true);
        if (target) {
            unit.setTarget(target);
        } else {
            // патруль или стоянка на месте
            unit.setTarget(null);
        }
    }
});

// Defensive AI - защищает заданную точку (например, игрока/базу)
aiMod.DefensiveAI = extend(UnitController, {
    // defenseTarget: {x, y} можно задать извне
    update: function(unit) {
        let defenseRadius = 400;
        let defenseX = this.defenseX || unit.x;
        let defenseY = this.defenseY || unit.y;

        // Приоритет: атаковать врагов рядом с точкой защиты
        let target = Units.closestEnemy(unit.team, defenseX, defenseY, defenseRadius, u => true);
        if (target) {
            unit.setTarget(target);
            return;
        }

        // Если врагов нет — возвращаемся к позиции защиты
        let dx = defenseX - unit.x;
        let dy = defenseY - unit.y;
        let dist = Mathf.sqrt(dx*dx + dy*dy);
        if (dist > 20) {
            unit.setTarget(null);
            unit.moveTo(defenseX, defenseY);
        }
    }
});

// Formation AI - формирование/строй вокруг лидера (например, игрока)
aiMod.FormationAI = extend(UnitController, {
    // index в форме и расстояние между юнитами можно задать
    update: function(unit) {
        // Попробуем найти игрока как лидера
        let playerUnit = Vars.player?.unit();
        if (!playerUnit) return;

        // Простая схема: размещаем юнита в круговой форме вокруг игрока
        // Если у юнита нет customIndex, пытаемся присвоить 0
        let idx = unit.customIndex || 0;
        let spacing = 40; // расстояние между юнитами
        let angle = (idx * 60) * Mathf.degtorad;
        let tx = playerUnit.x + Math.cos(angle) * spacing;
        let ty = playerUnit.y + Math.sin(angle) * spacing;

        // Если есть враг в зоне — атакуем
        let enemy = Units.closestEnemy(unit.team, unit.x, unit.y, 800, u => true);
        if (enemy) {
            unit.setTarget(enemy);
            return;
        }

        // Иначе перемещаемся на позицию в строю
        unit.setTarget(null);
        unit.moveTo(tx, ty);
    }
});

// ==================================================================
// Python AI STUB & File-bridge instructions (TODO for Grok)
// ==================================================================
// Пока Python-режим — заглушка. Ниже — инструкция по файловому мосту
// между модом (JS) и внешним Python-процессом. Grok, реализуй реальную
// логику pythonAI и IO по этим рекомендациям или используй как шаблон.
//
// Рекомендации:
// 1) Место хранения файлов: папка mods/ (например mods/ai_bridge.json и mods/ai_commands.json)
// 2) Формат состояния (ai_bridge.json) — массив объектов с состоянием юнитов:
// [
//   { "id": 123, "x": 320.5, "y": 512.0, "team": 0, "health": 450, "mode": "Python" },
//   ...
// ]
//
// 3) Формат команд (ai_commands.json) — внешняя программа пишет команды:
// [
//   { "id": 123, "command": "move", "x": 400, "y": 600 },
//   { "id": 456, "command": "attack", "targetId": 789 }
// ]
//
// 4) Синхронизация (простая стратегия):
// - Мод периодически (каждое N тиков) записывает текущее состояние юнитов в ai_bridge.json.
// - Внешний процесс читает ai_bridge.json, высчитывает команды и записывает ai_commands.json.
// - Мод периодически читает ai_commands.json и применяет команды к юнитам.
//
// 5) Замечания по реализации:
// - Использовать простую блокировку/флаг (например, файл .ready или timestamp) чтобы не читать в момент записи.
// - Можно использовать временные файлы: ai_commands.tmp -> переименовать в ai_commands.json после записи.
// - Формат JSON прост и удобен для отладки.
//
// 6) Пример stub-функции — временно fallback на basic/defensive:
// function pythonAI(unit) {
//     // Пока fallback: basic или defensive поведение
//     aiMod.BasicAI.update.call(aiMod.BasicAI, unit);
//     // TODO: записывать состояние в mods/ai_bridge.json и читать команды из mods/ai_commands.json
// }
//
// 7) Если среда запуска мода не позволяет прямой доступ к файловой системе,
//    вместо файлового моста можно использовать локальный HTTP-сервер или другой IPC.
//
// Grok: после реализации pythonAI и моста — дай знать, проверю репо и дам советы по отладке.
