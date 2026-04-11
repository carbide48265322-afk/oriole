/**
 * Electron Preload 脚本
 * 
 * 在渲染进程加载前执行，用于安全地暴露 API 给渲染进程
 */

import { contextBridge, ipcRenderer } from 'electron';

// 暴露安全的 API 到渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 获取应用版本
  getVersion: () => ipcRenderer.invoke('get-version'),
  
  // 获取平台信息
  getPlatform: () => process.platform,
  
  // 示例：调用主进程的方法
  // 后续可以添加更多 IPC 通信方法
});

// 监听主进程发送的消息
ipcRenderer.on('main-message', (_event, message) => {
  console.log('[Preload] 收到主进程消息:', message);
});
