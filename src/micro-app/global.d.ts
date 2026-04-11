// qiankun 全局类型声明
declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    oriole?: {
      bootstrap: () => Promise<void>;
      mount: (props: Record<string, unknown>) => Promise<void>;
      unmount: (props?: Record<string, unknown>) => Promise<void>;
      update: (props: Record<string, unknown>) => Promise<void>;
    };
  }
}

export {};
