// UI with hotkey P
Events.on(ClientLoadEvent, e => {
    let table = null;
    
    Input.keyDown(KeyCode.p, () => {
        if (table == null || !table.visible) {
            showAIMenu();
        } else {
            table.remove();
            table = null;
        }
    });
});

function showAIMenu() {
    // TODO: create UI with modes
    Vars.ui.showInfo("AI Menu opened (P key)\nModes: None, Aggressive, Defensive, Formation, Python");
}
