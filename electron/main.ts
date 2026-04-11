/**
 * Electron 主进程
 * 
 * 负责创建和管理应用窗口
 */

import { app, BrowserWindow } from 'electron';
import path from 'path';

// 开发环境 URL (Next.js 开发服务器)
const DEV_URL = 'http://localhost:3000';
// 生产环境 URL (本地构建的 HTML)
const PROD_URL = `file://${path.join(__dirname, '../out/index.html')}`;

// 保持窗口引用，防止被垃圾回收
let mainWindow: BrowserWindow | null = null;

/**
 * 创建主窗口
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'default',
    show: false,
  });

  // 加载页面
  const url = process.env.NODE_ENV === 'development' ? DEV_URL : PROD_URL;
  mainWindow.loadURL(url);

  // 窗口准备好后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // 开发环境打开 DevTools
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // 窗口关闭时清空引用
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 应用准备好后创建窗口
app.whenReady().then(() => {
  createWindow();

  // macOS: 点击 Dock 图标重新创建窗口
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 所有窗口关闭时退出应用（Windows/Linux）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
