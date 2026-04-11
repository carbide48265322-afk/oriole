/**
 * qiankun 子应用入口
 * 
 * 这个文件是 qiankun 主应用加载子应用的入口点
 * 通过 window.orioule 暴露生命周期函数
 */

import { bootstrap, mount, unmount, update } from './lifecycle';

// 判断是否在 qiankun 环境中
const isQiankunEnv = () => {
  return typeof window !== 'undefined' && window.__POWERED_BY_QIANKUN__;
};

// 导出生命周期函数供 qiankun 使用
if (typeof window !== 'undefined') {
  // 将生命周期函数挂载到 window 上
  // 这样主应用可以通过 importEntry 加载
  (window as any).orioule = {
    bootstrap,
    mount,
    unmount,
    update,
  };
}

// 如果是独立运行（非 qiankun 环境），直接初始化
if (!isQiankunEnv()) {
  console.log('[Oriole] 独立运行模式');
}

export { bootstrap, mount, unmount, update };
