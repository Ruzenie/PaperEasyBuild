import { app, BrowserWindow, dialog, ipcMain } from "electron";
import fs from "node:fs/promises";
import path from "node:path";

const isDev = !app.isPackaged;

let mainWindow: BrowserWindow | null = null;

const IPC_EXPORT_PREVIEW_PDF = "paperEasy:exportPreviewPdf";

type ExportPreviewPdfOptions = {
  suggestedFileName?: string;
  pageSize?: "A4" | "A5" | "Letter";
  landscape?: boolean;
};

type ExportPreviewPdfResult =
  | {
      canceled: true;
    }
  | {
      canceled: false;
      filePath: string;
    };

function sanitizeFilename(value: string) {
  const trimmed = value.trim() || "试卷";
  return trimmed.replace(/[\\/:*?"<>|]+/g, "_");
}

function registerIpcHandlers() {
  ipcMain.handle(
    IPC_EXPORT_PREVIEW_PDF,
    async (event, options: ExportPreviewPdfOptions = {}): Promise<ExportPreviewPdfResult> => {
      const targetWindow = BrowserWindow.fromWebContents(event.sender) ?? mainWindow;
      if (!targetWindow) {
        throw new Error("无法获取窗口实例，导出 PDF 失败。");
      }

      const baseName = sanitizeFilename(options.suggestedFileName ?? "试卷");
      const fileName = baseName.toLowerCase().endsWith(".pdf") ? baseName : `${baseName}.pdf`;
      const defaultPath = path.join(app.getPath("downloads"), fileName);

      const saveResult = await dialog.showSaveDialog(targetWindow, {
        title: "导出试卷为 PDF",
        defaultPath,
        filters: [{ name: "PDF", extensions: ["pdf"] }]
      });

      if (saveResult.canceled || !saveResult.filePath) {
        return { canceled: true };
      }

      const pdfData = await targetWindow.webContents.printToPDF({
        printBackground: true,
        preferCSSPageSize: true,
        pageSize: options.pageSize ?? "A4",
        landscape: Boolean(options.landscape)
      });

      await fs.writeFile(saveResult.filePath, pdfData);
      return { canceled: false, filePath: saveResult.filePath };
    }
  );
}

function createMainWindow() {
  const iconPath = path.join(app.getAppPath(), "src/assets/PaperEasyBuild.png");

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 640,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    const indexHtml = path.join(__dirname, "../renderer/index.html");
    mainWindow.loadFile(indexHtml);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  registerIpcHandlers();
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
