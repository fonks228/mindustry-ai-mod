print("[#00ff00]AI Mindustry[#ffffff] загружен! v1.0");

let currentMode = "none";
let uiOpen = false;

const modes = [
    {name: "None", value: "none"},
    {name: "Basic", value: "basic"},
    {name: "Aggressive", value: "aggressive"},
    {name: "Defensive", value: "defensive"},
    {name: "Formation", value: "formation"},
    {name: "Python", value: "python"}
];

function openAIUI() {
    if (uiOpen) return;
    uiOpen = true;

    let table = new Table();
    table.background(Styles.black6);

    table.add("[accent]AI Mindustry - Режимы").pad(15).row();
    table.row();

    modes.forEach(m => {
        table.button(m.name, () => {
            currentMode = m.value;
            Vars.ui.hudfrag.showToast("[accent]Режим ИИ: " + m.name);
            table.remove();
            uiOpen = false;
        }).size(260, 65).pad(6).row();
    });

    table.button("[red]Закрыть", () => {
        table.remove();
        uiOpen = false;
    }).size(260, 65).pad(12);

    Vars.ui.add(table).fill().center();
}

// Правильная обработка клавиши для новых версий
Events.on(ClientLoadEvent, () => {
    Input.keyTap(KeyCode.p, () => {
        if (!uiOpen) {
            openAIUI();
        }
    });
});

print("[#00ff00]AI Mindustry[#ffffff] готов! Нажми [accent]P[]");
