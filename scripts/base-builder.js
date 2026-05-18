// Base Builder - автоматическое строительство

aiMod.BaseBuilder = {
    // Приоритет строительства
    buildPriority: {
        "turret": 4,           // Защита — высокий приоритет
        "vault": 3,            // Хранилище
        "core": 5,             // Ядро/хранилище
        "router": 2,           // Роутеры
        "drill": 3,            // Бурильные установки
        "reactor": 4,          // Реактор
        "battery": 2           // Батарейки
    },

    // Площадка для стройки (простая сетка вокруг точки)
    findBuildSite: function(unit, baseX, baseY, searchRadius) {
        let buildGrid = [];
        let gridSize = 8; // Размер клетки сетки в тайлах
        
        // Расчистка площадки вокруг базы
        for (let x = baseX - searchRadius; x < baseX + searchRadius; x += gridSize) {
            for (let y = baseY - searchRadius; y < baseY + searchRadius; y += gridSize) {
                let dx = x - unit.x;
                let dy = y - unit.y;
                let dist = Mathf.sqrt(dx*dx + dy*dy);
                
                buildGrid.push({
                    x: x,
                    y: y,
                    dist: dist
                });
            }
        }

        // Сортируем по расстоянию
        buildGrid.sort((a, b) => a.dist - b.dist);
        return buildGrid.length > 0 ? buildGrid[0] : null;
    },

    // Найти подходящее место для строительства конкретного блока
    findPlacementForBlock: function(unit, blockName, baseX, baseY, searchRadius) {
        let validSites = [];

        for (let x = baseX - searchRadius; x < baseX + searchRadius; x += 8) {
            for (let y = baseY - searchRadius; y < baseY + searchRadius; y += 8) {
                let tile = Vars.world.tile(x >> 3, y >> 3);
                if (!tile) continue;

                // Проверяем можно ли здес�� строить (плоская, пустая земля)
                if (tile.block().id == 0 && tile.floor().id > 0) {
                    let dx = x - unit.x;
                    let dy = y - unit.y;
                    let dist = Mathf.sqrt(dx*dx + dy*dy);
                    
                    validSites.push({
                        x: x,
                        y: y,
                        dist: dist
                    });
                }
            }
        }

        if (validSites.length == 0) return null;
        validSites.sort((a, b) => a.dist - b.dist);
        return validSites[0];
    },

    // Получить конструктор (строитель) из инвентаря
    hasBuilder: function(unit) {
        // Проверяем есть ли нужные материалы
        return unit.item != null && unit.item.amount > 0;
    },

    // Начать строительство структуры
    buildStructure: function(unit, buildSite, structureName) {
        if (!buildSite) return false;
        
        // Движемся на площадку
        let distance = Mathf.sqrt(
            Math.pow(buildSite.x - unit.x, 2) + 
            Math.pow(buildSite.y - unit.y, 2)
        );

        if (distance > 40) {
            // Еще в пути
            unit.moveTo(buildSite.x, buildSite.y);
            return false;
        }

        // На месте - можно начинать строить
        unit.setTarget(buildSite.x, buildSite.y);
        return true;
    },

    // Автоматическое распределение строительства
    autoDeployBuilders: function(units, baseX, baseY) {
        let buildersPerTask = 2; // 2 юнита на одну постройку
        let index = 0;

        for (let i = 0; i < units.length && index < this.buildPriority.length; i++) {
            if (i % buildersPerTask == 0) {
                index++;
            }

            let unit = units[i];
            // Логика распределения юнитов по задачам
            this.assignBuildTask(unit, baseX, baseY);
        }
    },

    // Назначить юниту задачу постройки
    assignBuildTask: function(unit, baseX, baseY) {
        // Данный метод будет расширен при интеграции с main.js
        let buildSite = this.findBuildSite(unit, baseX, baseY, 300);
        if (buildSite) {
            this.buildStructure(unit, buildSite, "turret");
        }
    }
};
