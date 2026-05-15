print("[#00ff00]AI Mindustry v1.3[#ffffff] загружен!");

let currentAIMode = "None";
let menuOpen = false;

const modes = ["None", "Basic", "Aggressive", "Defensive", "Formation", "Python"];

function showAIMenu() {
    if (menuOpen) return;
    menuOpen = true;

    let dialog = new BaseDialog("AI Mindustry Control");
    
    dialog.cont.add("[#accent]AI Mindustry - Режимы ИИ").pad(12).row();
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

// Горячая клавиша P
Events.on(ClientLoadEvent, () => {
    let lastPress = 0;

    Events.run(Trigger.update, () => {
        if (Core.input.keyTap(KeyCode.p) && Time.time - lastPress > 20) {
            lastPress = Time.time;
            showAIMenu();
        }
    });
});