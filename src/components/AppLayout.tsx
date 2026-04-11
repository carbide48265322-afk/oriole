'use client';

import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography } from 'antd';
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
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import { useAppConfigStore } from '@/store';

const { Sider } = Layout;
const { Text } = Typography;

const sidebarItems = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: '工作台',
  },
  {
    key: 'audit',
    icon: <AuditOutlined />,
    label: '审核任务',
  },
  {
    key: 'history',
    icon: <HistoryOutlined />,
    label: '审核历史',
  },
  {
    key: 'stats',
    icon: <BarChartOutlined />,
    label: '统计数据',
  },
];

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
  const { isAuthenticated, user, logout } = useAuth();
  const sidebarCollapsed = useAppConfigStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useAppConfigStore((state) => state.toggleSidebar);

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
      <Space className="cursor-pointer hover:opacity-80">
        <Avatar
          icon={<UserOutlined />}
          src={user?.avatar}
          style={{ backgroundColor: '#1677ff' }}
        />
        <Text className="text-gray-700">{user?.name || '未登录'}</Text>
      </Space>
    </Dropdown>
  );

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={sidebarCollapsed}
        breakpoint="lg"
        collapsedWidth="80"
        className="shadow-md"
        theme="light"
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <AuditOutlined className="text-2xl text-blue-500" />
          {!sidebarCollapsed && (
            <Text strong className="ml-2 text-lg">
              Oriole
            </Text>
          )}
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={sidebarItems}
          className="border-r-0 mt-2"
        />
      </Sider>
      <Layout>
        {/* 顶栏 */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <button
            onClick={toggleSidebar}
            className="text-lg hover:text-blue-500 transition-colors"
          >
            {sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
          {userMenu}
        </header>
        {/* 内容区 */}
        <main className="flex-1 bg-gray-50 p-6 overflow-auto">
          {children}
        </main>
      </Layout>
    </Layout>
  );
}
