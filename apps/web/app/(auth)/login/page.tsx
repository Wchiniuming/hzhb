'use client';

import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { colors } from '@/lib/theme';
import api from '@/lib/api';

const AntdForm = Form as any;
const AntdInput = Input as any;
const AntdButton = Button as any;

export default function LoginPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const data = await api.auth.login(values);
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      message.success('登录成功，即将跳转...');
      setTimeout(() => router.push('/dashboard'), 500);
    } catch {
      message.error('用户名或密码错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorations */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }}
      />

      {/* Login container */}
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div
          style={{
            background: `linear-gradient(135deg, ${colors.primary} 0%, #764ba2 100%)`,
            padding: '40px 30px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.2)',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              fontWeight: 'bold',
              color: '#fff',
              backdropFilter: 'blur(10px)',
            }}
          >
            H
          </div>
          <h1
            style={{
              color: '#fff',
              fontSize: 24,
              fontWeight: 600,
              margin: 0,
              marginBottom: 8,
            }}
          >
            合作伙伴支撑能力全景管理平台
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: 14 }}>
            Partner Support Capability Panorama
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: '40px 30px' }}>
          <AntdForm
            form={form}
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: 8,
                  color: colors.text.primary,
                  fontWeight: 500,
                }}
              >
                用户名
              </label>
              <AntdForm.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
                style={{ marginBottom: 0 }}
              >
                <AntdInput
                  prefix={<UserOutlined style={{ color: colors.text.secondary }} />}
                  placeholder="请输入用户名"
                  style={{ height: 48, borderRadius: 10 }}
                />
              </AntdForm.Item>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: 8,
                  color: colors.text.primary,
                  fontWeight: 500,
                }}
              >
                密码
              </label>
              <AntdForm.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
                style={{ marginBottom: 0 }}
              >
                <AntdInput.Password
                  prefix={<LockOutlined style={{ color: colors.text.secondary }} />}
                  placeholder="请输入密码"
                  style={{ height: 48, borderRadius: 10 }}
                />
              </AntdForm.Item>
            </div>

            <AntdForm.Item style={{ marginBottom: 16 }}>
              <AntdButton
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{
                  height: 48,
                  borderRadius: 10,
                  fontSize: 16,
                  fontWeight: 500,
                  background: `linear-gradient(135deg, ${colors.primary} 0%, #764ba2 100%)`,
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                }}
              >
                {loading ? '登录中...' : '登 录'}
              </AntdButton>
            </AntdForm.Item>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                color: colors.text.secondary,
                fontSize: 13,
              }}
            >
              <SafetyOutlined />
              <span>系统采用SSL加密传输，保障您的信息安全</span>
            </div>
          </AntdForm>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 30px',
            background: colors.background.light,
            textAlign: 'center',
            borderTop: `1px solid ${colors.border.light}`,
          }}
        >
          <p style={{ margin: 0, color: colors.text.secondary, fontSize: 12 }}>
            默认账号: admin / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
