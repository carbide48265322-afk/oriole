// Electron 全局类型声明
interface ElectronAPI {
  getVersion: () => Promise<string>;
  getPlatform: () => string;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
