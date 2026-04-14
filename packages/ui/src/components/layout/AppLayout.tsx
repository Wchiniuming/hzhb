import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import type { User } from '../types';

const { Header, Sider, Content } = Layout;

interface AppLayoutProps {
  menuItems: Array<{
    key: string;
    icon?: React.ReactNode;
    label: React.ReactNode;
    children?: Array<{ key: string; icon?: React.ReactNode; label: React.ReactNode }>;
  }>;
  user: User;
  activeKey?: string;
  onMenuClick?: (key: string) => void;
  onLogout?: () => void;
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  menuItems,
  user,
  activeKey,
  onMenuClick,
  onLogout,
  children
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置'
    },
    {
      type: 'divider' as const
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: onLogout
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', borderBottom: '1px solid #f0f0f0' }}>
          {collapsed ? <h3>HS</h3> : <h2>合作伙伴管理平台</h2>}
        </div>
        <Menu
          mode="inline"
          selectedKeys={activeKey ? [activeKey] : undefined}
          items={menuItems}
          onClick={({ key }: { key: string }) => onMenuClick?.(key)}
          style={{ border: 'none' }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: '#fff', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} src={user.avatar} />
              <span>{user.name}</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: '24px', padding: 24, background: '#fff', minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;