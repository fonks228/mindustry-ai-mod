print("[#00ff00]AI Mindustry v1.2[#ffffff] успешно загружен!");

let currentAIMode = "None";
let menuOpen = false;

const modes = ["None", "Basic", "Aggressive", "Defensive", "Formation", "Python"];

function showAIMenu() {
    if (menuOpen) return;
    menuOpen = true;

    let dialog = new BaseDialog("AI Mindustry Control");
    
    dialog.cont.add("[accent]AI Mindustry - Выбор режима").pad(12).row();
    dialog.cont.add("Текущий режим: [accent]" + currentAIMode).padBottom(20).row();

    modes.forEach(mode => {
        dialog.cont.button(mode, Styles.cleart, () => {
            currentAIMode = mode;
            Vars.ui.announce("[accent]Режим ИИ изменён на: [green]" + mode, 4);
            dialog.hide();
        }).size(320, 65).pad(5).row();
    });

    dialog.addCloseButton();
    
    dialog.hidden(() => menuOpen = false);
    dialog.show();
}

// Обработка клавиши P
Events.on(ClientLoadEvent, () => {
    let lastTime = 0;

    Events.run(Trigger.update, () => {
        if (Core.input.keyTap(KeyCode.p)) {
            if (Time.time - lastTime > 20 && !Vars.ui.chatfield.shown()) {
                lastTime = Time.time;
                showAIMenu();
            }
        }
    });
});

print("[#00ff00]Нажми P для открытия меню ИИ[]");