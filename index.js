const { app, BrowserWindow, Menu } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const http = require("http");
const handler = require("serve-handler");

const isDev = !app.isPackaged;

let win;
let server;

function startStaticServer() {
  return new Promise((resolve) => {
    server = http.createServer((req, res) => {
      return handler(req, res, { public: path.join(__dirname, "out") });
    });
    server.listen(0, () => resolve(server.address().port));
  });
}

async function createWindow() {
  Menu.setApplicationMenu(null);

  win = new BrowserWindow({
    minWidth: 700,
    minHeight: 700,
    icon: path.join(__dirname, "public/assets/icon.png"),
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:3000");
  } else {
    const port = await startStaticServer();
    win.loadURL(`http://localhost:${port}`);
  }

  win.maximize();
}

app.whenReady().then(() => {
  createWindow();
  if (!isDev) {
    autoUpdater.checkForUpdatesAndNotify();
  }
});

app.on("window-all-closed", () => {
  if (server) server.close();
  app.quit();
});
