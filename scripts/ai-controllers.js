// Advanced AI Controllers

aiMod.AggressiveAI = extend(UnitController, {
    update: function(unit) {
        // Find nearest enemy and attack aggressively
        let target = Units.closestEnemy(unit.team, unit.x, unit.y, 9999, u => true);
        if (target) unit.setTarget(target);
    }
});

// More controllers will be added here