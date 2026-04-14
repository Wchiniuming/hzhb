import React from 'react';
import { Breadcrumb } from 'antd';
import type { BreadcrumbItem } from '../types';

interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  extra?: React.ReactNode;
  subtitle?: string;
  onBack?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumbs,
  extra,
  subtitle,
  onBack
}) => {
  return (
    <div style={{ padding: 0, marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>{title}</h1>
          {subtitle && <span style={{ color: '#666', marginLeft: 8 }}>{subtitle}</span>}
        </div>
        {extra && <div>{extra}</div>}
      </div>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb
          items={breadcrumbs.map(item => ({
            title: item.path ? <a href={item.path}>{item.title}</a> : item.title
          }))}
        />
      )}
    </div>
  );
};

export default PageHeader;