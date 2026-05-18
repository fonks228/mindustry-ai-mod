// Resource Manager - управление сбором материалов

aiMod.ResourceManager = {
    // Приоритет сбора ресурсов (выше = важнее)
    resourcePriority: {
        "copper": 3,      // Высокий приоритет
        "lead": 3,
        "coal": 2,
        "titanium": 4,    // Самый высокий приоритет
        "thorium": 5,
        "scrap": 1        // Низкий приоритет
    },

    // Найти ближайший ресурс нужного типа
    findClosestResource: function(unit, resourceType, maxDistance) {
        let closest = null;
        let closestDist = maxDistance;

        // Поиск среди всех ore на карте
        let tiles = [];
        for (let x = 0; x < Vars.world.width(); x++) {
            for (let y = 0; y < Vars.world.height(); y++) {
                let tile = Vars.world.tile(x, y);
                if (!tile || !tile.block()) continue;

                // Проверяем блок ресурса
                let blockName = tile.block().name;
                if (blockName.contains(resourceType)) {
                    let dx = tile.drawx() - unit.x;
                    let dy = tile.drawy() - unit.y;
                    let dist = Mathf.sqrt(dx*dx + dy*dy);
                    
                    if (dist < closestDist) {
                        closestDist = dist;
                        closest = tile;
                    }
                }
            }
        }
        return closest;
    },

    // Получить ресурс с наивысшим приоритетом в зоне
    getHighestPriorityResource: function(unit, searchRadius) {
        let bestResource = null;
        let bestPriority = -1;
        let bestDist = searchRadius;

        for (let x = 0; x < Vars.world.width(); x++) {
            for (let y = 0; y < Vars.world.height(); y++) {
                let tile = Vars.world.tile(x, y);
                if (!tile || !tile.block()) continue;

                let dx = tile.drawx() - unit.x;
                let dy = tile.drawy() - unit.y;
                let dist = Mathf.sqrt(dx*dx + dy*dy);

                if (dist > searchRadius) continue;

                let blockName = tile.block().name;
                
                // Проверяем каждый тип ресурса
                for (let resource in this.resourcePriority) {
                    if (blockName.contains(resource)) {
                        let priority = this.resourcePriority[resource];
                        
                        // Выбираем ресурс с наибольшим приоритетом
                        // При равных приоритетах — ближайший
                        if (priority > bestPriority || 
                            (priority == bestPriority && dist < bestDist)) {
                            bestResource = { tile: tile, resource: resource };
                            bestPriority = priority;
                            bestDist = dist;
                        }
                    }
                }
            }
        }

        return bestResource;
    },

    // Начать сбор ресурса
    startGathering: function(unit, resourceTile) {
        if (!resourceTile) return;
        unit.setTarget(resourceTile.drawx(), resourceTile.drawy());
    },

    // Проверить инвентарь юнита
    isInventoryFull: function(unit) {
        return unit.itemCapacity && unit.item && 
               unit.item.amount >= unit.itemCapacity;
    },

    // Найти хранилище или сундук для выгрузки
    findStorage: function(unit, searchRadius) {
        let closest = null;
        let closestDist = searchRadius;

        for (let x = 0; x < Vars.world.width(); x++) {
            for (let y = 0; y < Vars.world.height(); y++) {
                let tile = Vars.world.tile(x, y);
                if (!tile || !tile.block()) continue;

                let block = tile.block();
                let blockName = block.name;

                // Проверяем это сундук или хранилище
                if (blockName.contains("storage") || blockName.contains("vault") || 
                    blockName.contains("container")) {
                    
                    let dx = tile.drawx() - unit.x;
                    let dy = tile.drawy() - unit.y;
                    let dist = Mathf.sqrt(dx*dx + dy*dy);

                    if (dist < closestDist && tile.team() == unit.team) {
                        closestDist = dist;
                        closest = tile;
                    }
                }
            }
        }

        return closest;
    }
};
