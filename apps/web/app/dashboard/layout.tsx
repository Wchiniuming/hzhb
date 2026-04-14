'use client';

import { useState, useEffect } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Badge } from 'antd';
import {
  TeamOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { colors } from '@/lib/theme';

const AntdLayout = Layout as any;
const AntdMenu = Menu as any;
const AntdButton = Button as any;
const AntdDropdown = Dropdown as any;
const AntdAvatar = Avatar as any;
const AntdBadge = Badge as any;

const { Header, Sider, Content } = AntdLayout;

const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: '仪表盘',
  },
  {
    key: '/dashboard/developers',
    icon: <TeamOutlined />,
    label: '开发人员管理',
  },
  {
    key: '/dashboard/tasks',
    icon: <FileTextOutlined />,
    label: '任务登记管理',
  },
  {
    key: '/dashboard/partners',
    icon: <AppstoreOutlined />,
    label: '合作伙伴管理',
  },
  {
    key: '/dashboard/assessments',
    icon: <CheckCircleOutlined />,
    label: '厂商能力评估',
  },
  {
    key: '/dashboard/improvements',
    icon: <CheckCircleOutlined />,
    label: '正向改进管理',
  },
  {
    key: '/dashboard/risks',
    icon: <WarningOutlined />,
    label: '风险库管理',
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token) {
      router.replace('/login');
      return;
    }
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    setCurrentDate(new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }));
  }, [router]);

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key);
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  return (
    <AntdLayout style={{ minHeight: '100vh', background: colors.background.light }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          background: colors.background.card,
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          overflow: 'auto',
          transition: 'all 0.2s',
        }}
        trigger={null}
        width={220}
        collapsedWidth={70}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: `1px solid ${colors.border.light}`,
            background: colors.primary,
            margin: '-1px -1px 0',
          }}
        >
          {collapsed ? (
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 18,
              }}
            >
              H
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}
              >
                H
              </div>
              <span style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>
                能力全景
              </span>
            </div>
          )}
        </div>
        
        <div
          style={{
            padding: '16px 8px',
          }}
        >
          <AntdMenu
            mode="inline"
            selectedKeys={[pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{
              border: 'none',
              background: 'transparent',
            }}
          />
        </div>
      </Sider>
      
      <AntdLayout style={{ marginLeft: collapsed ? 70 : 220, transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: colors.background.card,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 99,
            height: 64,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <AntdButton
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 16 }}
            />
            <span style={{ color: colors.text.secondary, fontSize: 14 }}>
              {currentDate}
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <AntdBadge count={3} size="small">
              <AntdButton type="text" icon={<BellOutlined />} style={{ fontSize: 18 }} />
            </AntdBadge>
            
            <AntdDropdown
              menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
              placement="bottomRight"
              trigger={['click']}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: 8,
                  transition: 'background 0.3s',
                }}
              >
                <AntdAvatar
                  size={36}
                  style={{ background: colors.primary }}
                  icon={<UserOutlined />}
                />
                <div style={{ lineHeight: 1.3 }}>
                  <div style={{ fontWeight: 500, color: colors.text.primary, fontSize: 14 }}>
                    {user?.name || user?.username || '管理员'}
                  </div>
                  <div style={{ color: colors.text.secondary, fontSize: 12 }}>
                    {user?.role?.name || 'USER'}
                  </div>
                </div>
              </div>
            </AntdDropdown>
          </div>
        </Header>
        
        <Content
          style={{
            margin: 24,
            minHeight: 'calc(100vh - 112px)',
          }}
        >
          {children}
        </Content>
      </AntdLayout>
    </AntdLayout>
  );
}
