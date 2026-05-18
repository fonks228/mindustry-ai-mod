// Specialized AI Modes v2.0

// ==================================================================
// HARVESTER AI - Автоматический сбор ресурсов
// ==================================================================
aiMod.HarvesterAI = extend(UnitController, {
    update: function(unit) {
        // Ищем ресурс с наивысшим приоритетом
        let resource = aiMod.ResourceManager.getHighestPriorityResource(unit, 800);

        if (resource) {
            // Движемся к ресурсу
            unit.setTarget(resource.tile.drawx(), resource.tile.drawy());
            return;
        }

        // Если инвентарь полный - ищем хранилище
        if (aiMod.ResourceManager.isInventoryFull(unit)) {
            let storage = aiMod.ResourceManager.findStorage(unit, 600);
            if (storage) {
                unit.setTarget(storage.drawx(), storage.drawy());
            }
        }
    }
});

// ==================================================================
// BUILDER AI - Автоматическое строительство базы
// ==================================================================
aiMod.BuilderAI = extend(UnitController, {
    update: function(unit) {
        let playerUnit = Vars.player?.unit();
        if (!playerUnit) return;

        // Базовая точка — позиция игрока
        let baseX = playerUnit.x;
        let baseY = playerUnit.y;

        // Ищем площадку для стройки
        let buildSite = aiMod.BaseBuilder.findBuildSite(unit, baseX, baseY, 250);

        if (buildSite) {
            aiMod.BaseBuilder.buildStructure(unit, buildSite, "turret");
        } else {
            // Если нет площадки - патрулируем рядом �� базой
            let angle = (Time.time / 60) * Mathf.pi2;
            let patrolX = baseX + Math.cos(angle) * 150;
            let patrolY = baseY + Math.sin(angle) * 150;
            unit.moveTo(patrolX, patrolY);
        }
    }
});

// ==================================================================
// SCOUT AI - Разведчик/Патруль
// ==================================================================
aiMod.ScoutAI = extend(UnitController, {
    patrolPoints: [],
    currentPointIndex: 0,

    update: function(unit) {
        // Поиск врагов в большом радиусе
        let enemy = Units.closestEnemy(unit.team, unit.x, unit.y, 1200, u => true);

        if (enemy) {
            // Если враг найден - атакуем
            unit.setTarget(enemy);
            return;
        }

        // Патруль по точкам
        let playerUnit = Vars.player?.unit();
        if (!playerUnit) return;

        // Создаём точки патруля вокруг базы
        if (this.patrolPoints.length == 0) {
            for (let i = 0; i < 4; i++) {
                let angle = (i * 90) * Mathf.degtorad;
                this.patrolPoints.push({
                    x: playerUnit.x + Math.cos(angle) * 200,
                    y: playerUnit.y + Math.sin(angle) * 200
                });
            }
        }

        let point = this.patrolPoints[this.currentPointIndex];
        let dx = point.x - unit.x;
        let dy = point.y - unit.y;
        let dist = Mathf.sqrt(dx*dx + dy*dy);

        if (dist < 50) {
            // Достигли точки - идём к следующей
            this.currentPointIndex = (this.currentPointIndex + 1) % this.patrolPoints.length;
        }

        unit.moveTo(point.x, point.y);
    }
});

// ==================================================================
// SUPPORT AI - Поддержка союзников
// ==================================================================
aiMod.SupportAI = extend(UnitController, {
    update: function(unit) {
        let playerUnit = Vars.player?.unit();
        if (!playerUnit) return;

        // Ищем раненых союзников рядом
        let allies = Units.nearby(unit.team, unit.x, unit.y, 400, u => {
            return u.health < u.maxHealth && u !== unit;
        });

        if (allies && allies.length > 0) {
            // Движемся к раненому
            let wounded = allies[0];
            unit.setTarget(wounded.x, wounded.y);
            return;
        }

        // Если нет раненых - защищаем игрока
        let distance = Mathf.sqrt(
            Math.pow(playerUnit.x - unit.x, 2) + 
            Math.pow(playerUnit.y - unit.y, 2)
        );

        if (distance > 100) {
            // Держимся рядом с игроком
            unit.moveTo(playerUnit.x, playerUnit.y);
        }

        // Атакуем врагов рядом
        let enemy = Units.closestEnemy(unit.team, unit.x, unit.y, 600, u => true);
        if (enemy) {
            unit.setTarget(enemy);
        }
    }
});

print("[#00ff00]Specialized AI Modes v2.0 загружены![] Harvester, Builder, Scout, Support готовы");
