import { contextBridge, shell } from "electron";

type PaperEasyAPI = {
  ping: () => string;
  shell: {
    openExternal: (url: string) => void;
  };
};

const api: PaperEasyAPI = {
  ping: () => "pong",
  shell: {
    openExternal: (url: string) => {
      void shell.openExternal(url);
    }
  }
};

contextBridge.exposeInMainWorld("paperEasyAPI", api);
contextBridge.exposeInMainWorld("electron", api);

declare global {
  interface Window {
    paperEasyAPI: PaperEasyAPI;
    electron: PaperEasyAPI;
  }
}
