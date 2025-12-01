import { contextBridge } from "electron";

// Expose a very small, safe API to the renderer.
// 后续可以在这里增加与主进程通信、文件读写等能力。
contextBridge.exposeInMainWorld("paperEasyAPI", {
  ping: () => "pong"
});

declare global {
  interface Window {
    paperEasyAPI: {
      ping: () => string;
    };
  }
}

