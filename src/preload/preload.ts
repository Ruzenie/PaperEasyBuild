import { contextBridge, ipcRenderer, shell } from "electron";
import { isSafeExternalUrl } from "./security";

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

type PaperEasyAPI = {
  ping: () => string;
  shell: {
    openExternal: (url: string) => Promise<void>;
  };
  exportPreviewPdf: (options?: ExportPreviewPdfOptions) => Promise<ExportPreviewPdfResult>;
};

const api: PaperEasyAPI = {
  ping: () => "pong",
  shell: {
    openExternal: async (url: string) => {
      if (!isSafeExternalUrl(url)) {
        throw new Error("不支持的外链协议，已阻止打开。");
      }
      await shell.openExternal(url);
    }
  },
  exportPreviewPdf: (options) => ipcRenderer.invoke("paperEasy:exportPreviewPdf", options)
};

contextBridge.exposeInMainWorld("paperEasyAPI", api);
contextBridge.exposeInMainWorld("electron", api);

declare global {
  interface Window {
    paperEasyAPI: PaperEasyAPI;
    electron: PaperEasyAPI;
  }
}
