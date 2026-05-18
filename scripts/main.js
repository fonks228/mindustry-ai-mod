print("[#00ff00]AI Mindustry v2.0[#ffffff] загружен!");

let currentAIMode = "None";
let menuOpen = false;

const modes = ["None", "Basic", "Aggressive", "Defensive", "Formation", "Harvester", "Builder", "Scout", "Support", "Python"];

function showAIMenu() {
    if (menuOpen) return;
    menuOpen = true;

    let dialog = new BaseDialog("AI Mindustry Control");
    
    dialog.cont.add("[#accent]AI Mindustry v2.0 - Режимы ИИ").pad(12).row();
    dialog.cont.add("Текущий: [#accent]" + currentAIMode).padBottom(20).row();

    modes.forEach(mode => {
        dialog.cont.button(mode, Styles.cleart, () => {
            currentAIMode = mode;
            Vars.ui.announce("[#accent]Режим ИИ: [] [#green]" + mode, 4);
            dialog.hide();
        }).size(340, 70).pad(6).row();
    });

    dialog.addCloseButton();
    
    dialog.hidden(() => { menuOpen = false; });
    dialog.show();
}

// Применить текущий режим к юниту
function applyAIMode(unit) {
    if (!unit || currentAIMode == "None") return;

    switch(currentAIMode) {
        case "Basic":
            if (aiMod.BasicAI) unit.controller = aiMod.BasicAI;
            break;
        case "Aggressive":
            if (aiMod.AggressiveAI) unit.controller = aiMod.AggressiveAI;
            break;
        case "Defensive":
            if (aiMod.DefensiveAI) unit.controller = aiMod.DefensiveAI;
            break;
        case "Formation":
            if (aiMod.FormationAI) unit.controller = aiMod.FormationAI;
            break;
        case "Harvester":
            if (aiMod.HarvesterAI) unit.controller = aiMod.HarvesterAI;
            break;
        case "Builder":
            if (aiMod.BuilderAI) unit.controller = aiMod.BuilderAI;
            break;
        case "Scout":
            if (aiMod.ScoutAI) unit.controller = aiMod.ScoutAI;
            break;
        case "Support":
            if (aiMod.SupportAI) unit.controller = aiMod.SupportAI;
            break;
    }
}

// Горячая клавиша P - открыть меню
Events.on(ClientLoadEvent, () => {
    let lastPress = 0;

    Events.run(Trigger.update, () => {
        if (Core.input.keyTap(KeyCode.p) && Time.time - lastPress > 20) {
            lastPress = Time.time;
            showAIMenu();
        }
    });
});

// Горячая клавиша H - Harvester
Events.on(ClientLoadEvent, () => {
    let lastPress = 0;

    Events.run(Trigger.update, () => {
        if (Core.input.keyTap(KeyCode.h) && Time.time - lastPress > 20) {
            lastPress = Time.time;
            currentAIMode = "Harvester";
            Vars.ui.announce("[#accent]Режим ИИ: [] [#green]Harvester", 3);
        }
    });
});

// Горячая клавиша B - Builder
Events.on(ClientLoadEvent, () => {
    let lastPress = 0;

    Events.run(Trigger.update, () => {
        if (Core.input.keyTap(KeyCode.b) && Time.time - lastPress > 20) {
            lastPress = Time.time;
            currentAIMode = "Builder";
            Vars.ui.announce("[#accent]Режим ИИ: [] [#green]Builder", 3);
        }
    });
});

// On-screen UI buttons for mobile (правый верхний угол)
Events.on(ClientLoadEvent, () => {
    try {
        let hudTable = new Table();
        hudTable.setFillParent(true);
        hudTable.top().right();
        Core.scene.add(hudTable);

        // Главное меню
        hudTable.button("AI", Styles.cleart, () => {
            showAIMenu();
        }).size(100, 60).pad(6);

        hudTable.row();

        // Harvester кнопка
        hudTable.button("H", Styles.cleart, () => {
            currentAIMode = "Harvester";
            Vars.ui.announce("[#accent]Режим: [] [#green]Harvester", 2);
        }).size(100, 60).pad(6);

        hudTable.row();

        // Builder кнопка
        hudTable.button("B", Styles.cleart, () => {
            currentAIMode = "Builder";
            Vars.ui.announce("[#accent]Режим: [] [#green]Builder", 2);
        }).size(100, 60).pad(6);

    } catch (e) {
        print("[red]AI HUD button error:[] " + e);
    }
});
