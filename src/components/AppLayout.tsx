'use client';

import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import {
  AuditOutlined,
  DashboardOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  HistoryOutlined,
  BarChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileTextOutlined,
  RobotOutlined,
  UserSwitchOutlined,
  EyeOutlined,
  TeamOutlined,
  AppstoreOutlined,
  WarningOutlined,
  StopOutlined,
  FileSearchOutlined,
  CloudServerOutlined,
  PartitionOutlined,
  PictureOutlined,
  SoundOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { MenuItemType } from 'antd/es/menu/interface';
import { useAuth } from '@/hooks/useAuth';
import { useAppConfigStore } from '@/store';

// 扩展 MenuItemType 添加自定义 path 属性
interface CustomMenuItem extends Omit<MenuItemType, 'path'> {
  path?: string;
}

interface CustomMenuSubmenu {
  key: string;
  icon: React.ReactNode;
  label: React.ReactNode;
  children: CustomMenuItem[];
}

type CustomMenuItemType = CustomMenuSubmenu | CustomMenuItem;

const { Sider } = Layout;
const { Text } = Typography;

const sidebarItems: CustomMenuItemType[] = [
  // 普通菜单项（工作台）
  { key: 'dashboard', icon: <DashboardOutlined />, label: '工作台', path: '/' },

  // SubMenu（可折叠）- 审核配置
  {
    key: 'audit-config',
    icon: <SettingOutlined />,
    label: '审核配置',
    children: [
      { key: 'audit-policy', icon: <FileTextOutlined />, label: '审核策略', path: '/audit-policy' },
      { key: 'audit-dimension', icon: <AppstoreOutlined />, label: '审核维度', path: '/audit-dimension' },
    ],
  },

  // SubMenu（可折叠）- 审核工作台
  {
    key: 'audit-workspace',
    icon: <FileTextOutlined />,
    label: '审核工作台',
    children: [
      { key: 'tasks', icon: <FileTextOutlined />, label: '审核任务', path: '/tasks' },
      { key: 'ai-review', icon: <RobotOutlined />, label: 'AI 审核', path: '/ai-review' },
      { key: 'manual-review', icon: <UserSwitchOutlined />, label: '人工复审', path: '/manual-review' },
      { key: 'focus-review', icon: <EyeOutlined />, label: '审核沉浸页', path: '/focus-review' },
    ],
  },

  // SubMenu（可折叠）- 运营管理
  {
    key: 'ops',
    icon: <TeamOutlined />,
    label: '运营管理',
    children: [
      { key: 'roles', icon: <TeamOutlined />, label: '角色权限', path: '/roles' },
      { key: 'audit-templates', icon: <AppstoreOutlined />, label: '审核模板', path: '/audit-templates' },
      { key: 'sensitive-words', icon: <WarningOutlined />, label: '敏感词库', path: '/sensitive-words' },
      { key: 'blacklist', icon: <StopOutlined />, label: '黑白名单', path: '/blacklist' },
    ],
  },

  // SubMenu（可折叠）- 审核类型
  {
    key: 'audit-type',
    icon: <PictureOutlined />,
    label: '审核类型',
    children: [
      { key: 'audit-image', icon: <PictureOutlined />, label: '图片审核', path: '/audit/image' },
      { key: 'audit-audio', icon: <SoundOutlined />, label: '音频审核', path: '/audit/audio' },
      { key: 'audit-video', icon: <VideoCameraOutlined />, label: '视频审核', path: '/audit/video' },
      { key: 'audit-document', icon: <FileTextOutlined />, label: '文档审核', path: '/audit/document' },
    ],
  },

  // SubMenu（可折叠）- 数据报表
  {
    key: 'reports',
    icon: <BarChartOutlined />,
    label: '数据报表',
    children: [
      { key: 'stats', icon: <BarChartOutlined />, label: '统计数据', path: '/stats' },
      { key: 'quality-report', icon: <FileSearchOutlined />, label: '质检报表', path: '/reports/quality' },
    ],
  },

  // SubMenu（可折叠）- AI 增强
  {
    key: 'ai',
    icon: <CloudServerOutlined />,
    label: 'AI 增强',
    children: [
      { key: 'agent-config', icon: <CloudServerOutlined />, label: 'Agent 配置', path: '/ai/agents' },
      { key: 'pre-review', icon: <PartitionOutlined />, label: '预审结果', path: '/ai/pre-review' },
    ],
  },

  // SubMenu（可折叠）- 其他
  {
    key: 'other',
    icon: <SettingOutlined />,
    label: '其他',
    children: [
      { key: 'history', icon: <HistoryOutlined />, label: '审核历史', path: '/history' },
      { key: 'settings', icon: <SettingOutlined />, label: '设置', path: '/settings' },
    ],
  },
] as const;

// 路由映射：pathname → menu key
const pathToKeyMap: Record<string, string> = {
  '/': 'dashboard',
  '/main': 'dashboard',
  '/audit-policy': 'audit-policy',
  '/audit-dimension': 'audit-dimension',
  '/tasks': 'tasks',
  '/ai-review': 'ai-review',
  '/manual-review': 'manual-review',
  '/focus-review': 'focus-review',
  '/history': 'history',
  '/stats': 'stats',
  '/settings': 'settings',
  // 新增
  '/roles': 'roles',
  '/audit-templates': 'audit-templates',
  '/sensitive-words': 'sensitive-words',
  '/blacklist': 'blacklist',
  '/audit/image': 'audit-image',
  '/audit/audio': 'audit-audio',
  '/audit/video': 'audit-video',
  '/audit/document': 'audit-document',
  '/reports/quality': 'quality-report',
  '/ai/agents': 'agent-config',
  '/ai/pre-review': 'pre-review',
};

// 菜单 key → 路由映射（用于点击跳转）
const keyToPathMap: Record<string, string> = {
  dashboard: '/',
  'audit-policy': '/audit-policy',
  'audit-dimension': '/audit-dimension',
  tasks: '/tasks',
  'ai-review': '/ai-review',
  'manual-review': '/manual-review',
  'focus-review': '/focus-review',
  history: '/history',
  stats: '/stats',
  settings: '/settings',
  // 新增
  roles: '/roles',
  'audit-templates': '/audit-templates',
  'sensitive-words': '/sensitive-words',
  blacklist: '/blacklist',
  'audit-image': '/audit/image',
  'audit-audio': '/audit/audio',
  'audit-video': '/audit/video',
  'audit-document': '/audit/document',
  'quality-report': '/reports/quality',
  'agent-config': '/ai/agents',
  'pre-review': '/ai/pre-review',
};

const userMenuItems: MenuProps['items'] = [
  {
    key: 'profile',
    icon: <UserOutlined />,
    label: '个人资料',
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: '设置',
  },
  {
    type: 'divider',
  },
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: '退出登录',
    danger: true,
  },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const sidebarCollapsed = useAppConfigStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useAppConfigStore((state) => state.toggleSidebar);
  const pathname = usePathname();
  const router = useRouter();

  // SubMenu 展开/收起状态
  const [openKeys, setOpenKeys] = React.useState<string[]>([
    'audit-config',
    'audit-workspace',
    'ops',
    'audit-type',
    'reports',
    'ai',
    'other',
  ]);

  // 根据当前 pathname 计算 selectedKeys
  const selectedKeys = React.useMemo(() => {
    const key = pathToKeyMap[pathname] || 'dashboard';
    return [key];
  }, [pathname]);

  // 菜单点击处理函数
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    const path = keyToPathMap[key];
    if (path) {
      router.push(path);
    }
  };

  // SubMenu 展开/收起处理
  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    setOpenKeys(keys);
  };

  const handleLogout = () => {
    logout();
    // 后续添加跳转逻辑
  };

  // 更新用户菜单，添加登出处理
  const userMenu = (
    <Dropdown
      menu={{
        items: userMenuItems,
        onClick: ({ key }) => {
          if (key === 'logout') {
            handleLogout();
          }
        },
      }}
      placement="bottomRight"
    >
      <Space style={{ cursor: 'pointer' }}>
        <Avatar
          icon={<UserOutlined />}
          style={{ backgroundColor: '#1677ff' }}
        />
        <Text style={{ color: '#374151' }}>{user?.email || '未登录'}</Text>
      </Space>
    </Dropdown>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={sidebarCollapsed}
        breakpoint="lg"
        collapsedWidth="80"
        style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
        theme="light"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 64, borderBottom: '1px solid #e5e7eb' }}>
          <AuditOutlined style={{ fontSize: 24, color: '#1677ff' }} />
          {!sidebarCollapsed && (
            <Text strong style={{ marginLeft: 8, fontSize: 18 }}>
              Oriole
            </Text>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          openKeys={sidebarCollapsed ? [] : openKeys}
          onOpenChange={onOpenChange}
          items={sidebarItems as MenuProps['items']}
          onClick={handleMenuClick}
          style={{ borderRight: 'none', marginTop: 8 }}
        />
      </Sider>
      <Layout>
        {/* 顶栏 */}
        <header style={{ background: '#fff', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
          <button
            onClick={toggleSidebar}
            style={{ fontSize: 18, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
          {userMenu}
        </header>
        {/* 内容区 */}
        <main style={{ flex: 1, background: '#f9fafb', padding: 24, overflow: 'auto' }}>
          {children}
        </main>
      </Layout>
    </Layout>
  );
}
