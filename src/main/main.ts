import { app, BrowserWindow } from "electron";
import path from "node:path";

const isDev = !app.isPackaged;

let mainWindow: BrowserWindow | null = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 640,
    webPreferences: {
      // Use a preload script and keep the renderer sandboxed.
      preload: path.join(__dirname, "../preload/preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (isDev) {
    // In dev mode we expect the Vite dev server to be running.
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built index.html from Vite.
    const indexHtml = path.join(__dirname, "../renderer/index.html");
    mainWindow.loadFile(indexHtml);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
