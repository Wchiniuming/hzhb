import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

interface AuthLayoutProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  title = '合作伙伴支撑能力全景管理平台',
  subtitle = '请登录您的账号继续',
  children
}) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: 24
    }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2} style={{ color: '#fff', marginBottom: 8 }}>{title}</Title>
        <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 16 }}>{subtitle}</p>
      </div>
      <Card
        style={{
          width: '100%',
          maxWidth: 480,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
      >
        {children}
      </Card>
    </div>
  );
};

export default AuthLayout;
