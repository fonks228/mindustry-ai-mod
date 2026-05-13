// AI Mindustry Mod - v157.4
print("[green][AI Mindustry][] Мод успешно загружен! Нажми [accent]P[] для открытия меню ИИ");

let currentAIMode = "None";

Events.on(ClientLoadEvent, () => {
    print("[AI Mindustry] UI ready. Press P");
    
    // Hotkey P
    Core.input.keyDown(KeyCode.p, () => {
        showAIMenu();
    });
});

function showAIMenu() {
    let menu = new BaseDialog("AI Mindustry Control");
    let cont = menu.cont;
    
    cont.add("Текущий режим: " + currentAIMode).pad(10).row();
    
    ["None", "Basic", "Aggressive", "Defensive", "Formation", "Python"].forEach(m => {
        cont.button(m, Styles.default, () => {
            currentAIMode = m;
            print("[AI] Режим сменён на: " + m);
            menu.hide();
        }).size(220, 60).pad(4).row();
    });
    
    menu.show();
}

print("[AI Mindustry] Инициализация завершена!");