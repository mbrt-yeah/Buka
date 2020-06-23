const {
    app,
    electron,
    BrowserWindow,
    ipcMain
} = require('electron');

let win;

function createWindow() {
    const _width = 1200;
    const _height = 800;

    win = new BrowserWindow({
        width: _width,
        height: _height,
        minWidth: 800,
        minHeight: 600,
        icon: './assets/img/icon.png'
    });

    win.webContents.openDevTools();

    try {
        const screenSize = electron.screen.getPrimaryDisplay().size;
        win.setPosition( (screenSize.width - _width) / 2, (screenSize.height - _height) / 2);
    }
    catch(error) {
        win.center();
    }

    win.setMenu(null);

    win.loadURL(`file://${__dirname}/dist/index.html`);

    win.on("closed", () => {
        win = null;
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    app.quit();
});

app.on("activate", () => {
    if (win === null) {
        createWindow();
    }
});