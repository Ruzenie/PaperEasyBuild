import { contextBridge, ipcRenderer, shell } from "electron";

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
    openExternal: (url: string) => void;
  };
  exportPreviewPdf: (options?: ExportPreviewPdfOptions) => Promise<ExportPreviewPdfResult>;
};

const api: PaperEasyAPI = {
  ping: () => "pong",
  shell: {
    openExternal: (url: string) => {
      void shell.openExternal(url);
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
