'use client';

import { ConfigProvider, App as AntdApp, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import type { ReactNode } from 'react';
import { themeConfig } from '@/lib/theme';

export default function AntdProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        ...themeConfig,
      }}
    >
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
}
