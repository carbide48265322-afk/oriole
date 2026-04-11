/**
 * qiankun 子应用生命周期管理
 * 
 * 支持两种模式：
 * 1. 独立运行：直接访问 http://localhost:3000
 * 2. 子应用模式：被主应用通过 loadMicroApp 加载
 */

// 存储主应用传递的 props
let appProps: Record<string, unknown> = {};

/**
 * 初始化函数
 * 在 mount 时调用，接收主应用传递的 props
 */
function initApp(props: Record<string, unknown> = {}) {
  appProps = props;
  console.log('[Oriole] 子应用初始化，收到 props:', props);
  
  // 从 props 中获取用户信息、token 等
  const { userInfo, token, permissions } = props as {
    userInfo?: Record<string, unknown>;
    token?: string;
    permissions?: string[];
  };
  
  if (token) {
    // 存储 token（后续接入真实认证）
    localStorage.setItem('auth_token', token);
  }
  
  if (userInfo) {
    // 存储用户信息
    localStorage.setItem('user_info', JSON.stringify(userInfo));
  }
  
  console.log('[Oriole] 子应用配置完成');
}

/**
 * bootstrap 生命周期
 * 子应用初始化时执行一次
 */
export async function bootstrap() {
  console.log('[Oriole] qiankun bootstrap');
}

/**
 * mount 生命周期
 * 子应用挂载时执行
 */
export async function mount(props: Record<string, unknown>) {
  console.log('[Oriole] qiankun mount');
  initApp(props);
  
  // 通知主应用子应用已挂载完成
  const { onMounted } = props as { onMounted?: () => void };
  if (onMounted) {
    onMounted();
  }
}

/**
 * unmount 生命周期
 * 子应用卸载时执行
 */
export async function unmount(props?: Record<string, unknown>) {
  console.log('[Oriole] qiankun unmount');
  
  // 清理资源
  appProps = {};
  
  // 可选：清理 localStorage
  // localStorage.removeItem('auth_token');
  // localStorage.removeItem('user_info');
  
  console.log('[Oriole] 子应用已卸载');
}

/**
 * 更新 props
 * 主应用调用 update 时触发
 */
export async function update(props: Record<string, unknown>) {
  console.log('[Oriole] qiankun update', props);
  initApp(props);
}

// 导出供独立运行时使用
export { initApp, appProps };
