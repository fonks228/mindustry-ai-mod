// AI Controllers - Реальная логика

let aiMod = this;

// Helper functions
function applyAIMode(unit, mode) {
    if (mode === "None") return;

    if (mode === "Aggressive") {
        aggressiveAI(unit);
    } else if (mode === "Defensive") {
        defensiveAI(unit);
    } else if (mode === "Formation") {
        formationAI(unit);
    } else if (mode === "Basic") {
        basicAI(unit);
    }
}

function aggressiveAI(unit) {
    let target = Units.closestEnemy(unit.team, unit.x, unit.y, 800, u => true);
    if (target) {
        unit.setTarget(target);
        unit.moveTo(target.x, target.y, 0.8);
    }
}

function defensiveAI(unit) {
    let player = Vars.player.unit();
    if (player) {
        let dist = unit.dst(player);
        if (dist > 200) {
            unit.moveTo(player.x, player.y, 0.9);
        }
    }
    // Attack nearby enemies
    let enemy = Units.closestEnemy(unit.team, unit.x, unit.y, 400, u => true);
    if (enemy) unit.setTarget(enemy);
}

function formationAI(unit) {
    let player = Vars.player.unit();
    if (!player) return;

    let angle = unit.id * 25 % 360;
    let radius = 120 + (unit.id % 5) * 15;
    let targetX = player.x + Mathf.cosDeg(angle) * radius;
    let targetY = player.y + Mathf.sinDeg(angle) * radius;

    unit.moveTo(targetX, targetY, 0.85);
}

function basicAI(unit) {
    let target = Units.closestEnemy(unit.team, unit.x, unit.y, 600, u => true);
    if (target) {
        unit.setTarget(target);
    }
}

print("[#cyan]AI Controllers загружены[]");