const { app, BrowserWindow, Menu } = require("electron");

//Menu.setApplicationMenu(null);

let win;

function createWindow() {
  win = new BrowserWindow({
    minWidth: 700,
    minHeight: 700,
    icon: __dirname + "/public/assets/icon.png",
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
    },
  });

  win.loadURL("http://localhost:3000");
  win.maximize();
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  app.quit();
  process.exit(0);
});
