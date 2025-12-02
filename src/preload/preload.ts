import { contextBridge, shell } from "electron";

// 定义暴露给渲染进程的安全 API
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
      // 调用 Electron 的 shell.openExternal 打开外部链接
      void shell.openExternal(url);
    }
  }
};

// 兼容两种访问方式：
// - window.paperEasyAPI
// - window.electron
contextBridge.exposeInMainWorld("paperEasyAPI", api);
contextBridge.exposeInMainWorld("electron", api);

declare global {
  interface Window {
    paperEasyAPI: PaperEasyAPI;
    electron: PaperEasyAPI;
  }
}
