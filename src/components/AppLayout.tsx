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

interface CustomMenuGroup {
  type: 'group';
  label: React.ReactNode;
  key: string;
  children: CustomMenuItem[];
}

type CustomMenuItemType = CustomMenuGroup | CustomMenuItem;

const { Sider } = Layout;
const { Text } = Typography;

const sidebarItems: CustomMenuItemType[] = [
  {
    type: 'group',
    label: '工作台',
    key: 'dashboard-group',
    children: [
      { key: 'dashboard', icon: <DashboardOutlined />, label: '工作台', path: '/' },
    ],
  },
  {
    type: 'group',
    label: '审核配置',
    key: 'audit-config-group',
    children: [
      { key: 'audit-policy', icon: <FileTextOutlined />, label: '审核策略', path: '/audit-policy' },
      { key: 'audit-dimension', icon: <AppstoreOutlined />, label: '审核维度', path: '/audit-dimension' },
    ],
  },
  {
    type: 'group',
    label: '审核工作台',
    key: 'audit-workspace-group',
    children: [
      { key: 'tasks', icon: <FileTextOutlined />, label: '审核任务', path: '/tasks' },
      { key: 'ai-review', icon: <RobotOutlined />, label: 'AI 审核', path: '/ai-review' },
      { key: 'manual-review', icon: <UserSwitchOutlined />, label: '人工复审', path: '/manual-review' },
      { key: 'focus-review', icon: <EyeOutlined />, label: '审核沉浸页', path: '/focus-review' },
    ],
  },
  {
    type: 'group',
    label: '运营管理',
    key: 'ops-group',
    children: [
      { key: 'roles', icon: <TeamOutlined />, label: '角色权限', path: '/roles' },
      { key: 'audit-templates', icon: <AppstoreOutlined />, label: '审核模板', path: '/audit-templates' },
      { key: 'sensitive-words', icon: <WarningOutlined />, label: '敏感词库', path: '/sensitive-words' },
      { key: 'blacklist', icon: <StopOutlined />, label: '黑白名单', path: '/blacklist' },
    ],
  },
  {
    type: 'group',
    label: '审核类型',
    key: 'audit-type-group',
    children: [
      { key: 'audit-image', icon: <PictureOutlined />, label: '图片审核', path: '/audit/image' },
      { key: 'audit-audio', icon: <SoundOutlined />, label: '音频审核', path: '/audit/audio' },
      { key: 'audit-video', icon: <VideoCameraOutlined />, label: '视频审核', path: '/audit/video' },
      { key: 'audit-document', icon: <FileTextOutlined />, label: '文档审核', path: '/audit/document' },
    ],
  },
  {
    type: 'group',
    label: '数据报表',
    key: 'reports-group',
    children: [
      { key: 'stats', icon: <BarChartOutlined />, label: '统计数据', path: '/stats' },
      { key: 'quality-report', icon: <FileSearchOutlined />, label: '质检报表', path: '/reports/quality' },
    ],
  },
  {
    type: 'group',
    label: 'AI 增强',
    key: 'ai-group',
    children: [
      { key: 'agent-config', icon: <CloudServerOutlined />, label: 'Agent 配置', path: '/ai/agents' },
      { key: 'pre-review', icon: <PartitionOutlined />, label: '预审结果', path: '/ai/pre-review' },
    ],
  },
  {
    type: 'group',
    label: '其他',
    key: 'other-group',
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
          src={user?.avatar}
          style={{ backgroundColor: '#1677ff' }}
        />
        <Text style={{ color: '#374151' }}>{user?.name || '未登录'}</Text>
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
