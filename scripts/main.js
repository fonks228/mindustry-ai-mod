// AI Mindustry v2.0 - Main Entry Point

print("[#00ff00]AI Mindustry v2.0[#ffffff] загружается...");

// Инициализируем главный объект мода
let aiMod = aiMod || {};

let currentAIMode = "None";
let menuOpen = false;
let selectedUnit = null;

const modes = ["None", "Basic", "Aggressive", "Defensive", "Formation", "Harvester", "Builder", "Scout", "Support"];

function showAIMenu() {
    if (menuOpen) return;
    menuOpen = true;

    let dialog = new BaseDialog("AI Mindustry Control v2.0");
    
    dialog.cont.add("[#accent]AI Mindustry - Режимы ИИ").pad(12).row();
    dialog.cont.add("Текущий: [#accent]" + currentAIMode).padBottom(20).row();

    modes.forEach(mode => {
        dialog.cont.button(mode, Styles.cleart, () => {
            currentAIMode = mode;
            Vars.ui.announce("[#accent]Режим: [] [#green]" + mode, 4);
            applyModeToSelectedUnit();
            dialog.hide();
        }).size(340, 70).pad(6).row();
    });

    dialog.addCloseButton();
    
    dialog.hidden(() => { menuOpen = false; });
    dialog.show();
}

// Применить режим к выбранному юниту
function applyModeToSelectedUnit() {
    let unit = Vars.player?.unit();
    if (!unit) return;

    switch(currentAIMode) {
        case "Basic":
            unit.controller = aiMod.BasicAI || new BaseUnitController();
            break;
        case "Aggressive":
            unit.controller = aiMod.AggressiveAI || new BaseUnitController();
            break;
        case "Defensive":
            unit.controller = aiMod.DefensiveAI || new BaseUnitController();
            break;
        case "Formation":
            unit.controller = aiMod.FormationAI || new BaseUnitController();
            break;
        case "Harvester":
            unit.controller = aiMod.HarvesterAI || new BaseUnitController();
            print("[#00ff00]Harvester режим активирован!");
            break;
        case "Builder":
            unit.controller = aiMod.BuilderAI || new BaseUnitController();
            print("[#00ff00]Builder режим активирован!");
            break;
        case "Scout":
            unit.controller = aiMod.ScoutAI || new BaseUnitController();
            print("[#00ff00]Scout режим активирован!");
            break;
        case "Support":
            unit.controller = aiMod.SupportAI || new BaseUnitController();
            print("[#00ff00]Support режим активирован!");
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

        // Горячая клавиша H - Harvester
        if (Core.input.keyTap(KeyCode.h) && Time.time - lastPress > 20) {
            lastPress = Time.time;
            currentAIMode = "Harvester";
            applyModeToSelectedUnit();
            Vars.ui.announce("[#accent]Режим: [] [#green]Harvester", 3);
        }

        // Горячая клавиша B - Builder
        if (Core.input.keyTap(KeyCode.b) && Time.time - lastPress > 20) {
            lastPress = Time.time;
            currentAIMode = "Builder";
            applyModeToSelectedUnit();
            Vars.ui.announce("[#accent]Режим: [] [#green]Builder", 3);
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
            applyModeToSelectedUnit();
            Vars.ui.announce("[#accent]Режим: [] [#green]Harvester", 2);
        }).size(100, 60).pad(6);

        hudTable.row();

        // Builder кнопка
        hudTable.button("B", Styles.cleart, () => {
            currentAIMode = "Builder";
            applyModeToSelectedUnit();
            Vars.ui.announce("[#accent]Режим: [] [#green]Builder", 2);
        }).size(100, 60).pad(6);

    } catch (e) {
        print("[red]AI HUD button error:[] " + e);
    }
});

print("[#00ff00]✓ AI Mindustry v2.0 загружен успешно![]");
