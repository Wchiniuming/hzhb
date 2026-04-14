'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Input, Tag, Avatar, Tooltip, message } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  MailOutlined,
  PhoneOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { colors } from '@/lib/theme';
import api from '@/lib/api';

const AntdTable = Table as any;
const AntdButton = Button as any;
const AntdInput = Input as any;
const AntdTag = Tag as any;
const AntdAvatar = Avatar as any;
const AntdTooltip = Tooltip as any;

const statusMap: Record<string, string> = {
  ACTIVE: '在职',
  INACTIVE: '离职',
  LEASED: '借调中',
};

const statusColors: Record<string, string> = {
  ACTIVE: colors.success,
  INACTIVE: colors.error,
  LEASED: colors.warning,
};

const levelColors: Record<string, string> = {
  SENIOR: '#722ed1',
  MIDDLE: colors.primary,
  JUNIOR: colors.info,
};

function getColorSimple(map: Record<string, string>, key: string): string {
  return map[key] || '#8c8c8c';
}

const levelMap: Record<string, string> = {
  SENIOR: '高级',
  MIDDLE: '中级',
  JUNIOR: '初级',
};

export default function DevelopersPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.developers.list({ page, limit: 10 });
      setData(res.data.map((d: any) => ({ ...d, key: d.id })));
      setTotal(res.meta.total);
    } catch {
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  const getSkills = (skills: any[]) => skills?.map((s: any) => s.name || s.skillName || s) || [];

  const columns = [
    {
      title: '开发人员',
      key: 'info',
      width: 280,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <AntdAvatar size={44} style={{ background: colors.cardColors[0].gradient, fontWeight: 600 }}>
            {record.name?.charAt(0) || 'D'}
          </AntdAvatar>
          <div>
            <div style={{ fontWeight: 600, color: colors.text.primary, marginBottom: 2 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: colors.text.secondary }}>{record.partner?.name || '-'}</div>
          </div>
        </div>
      ),
    },
    {
      title: '联系方式',
      key: 'contact',
      width: 200,
      render: (_: any, record: any) => (
        <div style={{ fontSize: 13 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <MailOutlined style={{ color: colors.text.secondary }} />
            <span style={{ color: colors.text.secondary }}>{record.email || '-'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <PhoneOutlined style={{ color: colors.text.secondary }} />
            <span style={{ color: colors.text.secondary }}>{record.phone || '-'}</span>
          </div>
        </div>
      ),
    },
    {
      title: '技能栈',
      key: 'skills',
      width: 280,
      render: (_: any, record: any) => {
        const skills = getSkills(record.skills || []);
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {skills.slice(0, 3).map((skill: string, i: number) => (
              <AntdTag key={i} style={{ borderRadius: 6, background: colors.background.light, color: colors.text.primary, border: 'none', margin: 0 }}>
                {skill}
              </AntdTag>
            ))}
            {skills.length > 3 && (
              <AntdTooltip title={skills.slice(3).join(', ')}>
                <AntdTag style={{ borderRadius: 6, background: colors.background.light, color: colors.text.secondary, border: 'none', cursor: 'pointer', margin: 0 }}>
                  +{skills.length - 3}
                </AntdTag>
              </AntdTooltip>
            )}
          </div>
        );
      },
    },
    {
      title: '等级',
      key: 'level',
      width: 100,
      render: (_: any, record: any) => {
        const level = record.level || 'MIDDLE';
        return (
          <AntdTag style={{ borderRadius: 6, background: `${getColorSimple(levelColors, level)}15`, color: getColorSimple(levelColors, level), border: 'none', fontWeight: 500 }}>
            {levelMap[level] || level}
          </AntdTag>
        );
      },
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_: any, record: any) => {
        const status = record.status || 'ACTIVE';
        return (
          <AntdTag style={{ borderRadius: 6, background: `${getColorSimple(statusColors, status)}15`, color: getColorSimple(statusColors, status), border: 'none', fontWeight: 500 }}>
            {statusMap[status] || status}
          </AntdTag>
        );
      },
    },
    {
      title: '入职时间',
      key: 'joinedDate',
      width: 120,
      render: (_: any, record: any) => (
        <span style={{ color: colors.text.secondary, fontSize: 13 }}>
          {record.joinDate ? new Date(record.joinDate).toLocaleDateString('zh-CN') : '-'}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: () => (
        <div style={{ display: 'flex', gap: 8 }}>
          <AntdButton type="text" icon={<EyeOutlined />} size="small" />
          <AntdButton type="text" icon={<EditOutlined />} size="small" />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, color: colors.text.primary, margin: 0, marginBottom: 4 }}>
          开发人员管理
        </h1>
        <p style={{ color: colors.text.secondary, margin: 0, fontSize: 14 }}>
          管理所有合作伙伴的开发人员信息
        </p>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${colors.border.light}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <AntdInput
              placeholder="搜索姓名、公司、技能..."
              prefix={<SearchOutlined style={{ color: colors.text.secondary }} />}
              style={{ width: 280, borderRadius: 10 }}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onPressEnter={fetchData}
            />
            <AntdButton icon={<ReloadOutlined />} onClick={fetchData}>刷新</AntdButton>
            <div style={{ padding: '8px 16px', borderRadius: 10, background: colors.background.light, fontSize: 13, color: colors.text.secondary }}>
              共 {total} 人
            </div>
          </div>
          <AntdButton
            type="primary"
            icon={<PlusOutlined />}
            style={{ borderRadius: 10, background: `linear-gradient(135deg, ${colors.primary} 0%, #764ba2 100%)`, border: 'none', boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)' }}
          >
            新增开发人员
          </AntdButton>
        </div>

        <AntdTable
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            current: page,
            pageSize: 10,
            total,
            showSizeChanger: true,
            showTotal: (t: number) => `共 ${t} 条`,
            onChange: (p: number) => setPage(p),
          }}
          style={{ padding: '0 24px' }}
        />
      </div>
    </div>
  );
}
