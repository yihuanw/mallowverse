const { app, BrowserWindow, Menu } = require("electron");

Menu.setApplicationMenu(null);

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 600,
    minWidth: 600,
    minHeight: 600,
    icon: __dirname + '/assets/icon.png',
    useContentSize: true,
    webPreferences: {
      contextIsolation: true
    }
  });

  win.loadFile("index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});