const aiMod = this;

let currentMode = "none";

const modes = ["none", "basic", "aggressive", "defensive", "formation", "python"];

Events.on(ClientLoadEvent, () => {
    let listener = extend(InputListener, {
        keyDown: function(event, keycode) {
            if (keycode === KeyCode.p) {
                showAIMenu();
                return true;
            }
            return false;
        }
    });
    
    // Add to hud
    Core.app.post(() => {
        Vars.ui.hudGroup.find("core").find("minimapTable").addListener(listener);
    });
});

function showAIMenu() {
    let dialog = new Dialog("AI Mindustry Control");
    let cont = dialog.cont;
    
    cont.add("Выбери режим ИИ").pad(10).row();
    
    modes.forEach(mode => {
        cont.button(mode.toUpperCase(), Styles.defaultt, () => {
            currentMode = mode;
            applyModeToAll(mode);
            dialog.hide();
        }).size(220, 55).pad(6).row();
    });
    
    cont.button("Закрыть", () => dialog.hide()).size(220, 55).padTop(10);
    dialog.show();
}

function applyModeToAll(mode) {
    let units = Vars.player.team().units();
    units.each(u => {
        if (!u.isPlayer()) {
            applyAIMode(u, mode);
        }
    });
    print("[AI Mod] Режим " + mode + " применён к юнитам");
}

function applyAIMode(unit, mode) {
    if (mode === "none" || mode === "basic") {
        unit.controller = unit.type.createController();
    } else {
        unit.controller = new aiMod.CustomAI(unit, mode);
    }
}

// Placeholder for custom AI
aiMod.CustomAI = extend(UnitController, {
    update: function(unit) {
        // Will be expanded later
    }
});

print("[AI Mindustry] Загружен! Нажми P для открытия меню ИИ");