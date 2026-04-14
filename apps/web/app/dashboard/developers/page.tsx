'use client';

import { Table, Button, Input, Tag, Avatar, Tooltip } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { colors } from '@/lib/theme';

const AntdTable = Table as any;
const AntdButton = Button as any;
const AntdInput = Input as any;
const AntdTag = Tag as any;
const AntdAvatar = Avatar as any;
const AntdTooltip = Tooltip as any;

const developers = [
  {
    key: '1',
    name: '张三',
    avatar: 'Z',
    company: '华钦科技',
    email: 'zhangsan@huaqin.com',
    phone: '138****8001',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    status: '在职',
    level: '高级',
    joinedDate: '2022-03-15',
  },
  {
    key: '2',
    name: '李四',
    avatar: 'L',
    company: '博雅软件',
    email: 'lisi@boya.com',
    phone: '138****8002',
    skills: ['Python', 'Django', 'Docker', 'K8s'],
    status: '在职',
    level: '中级',
    joinedDate: '2023-06-20',
  },
  {
    key: '3',
    name: '王五',
    avatar: 'W',
    company: '创新科技',
    email: 'wangwu@cxkj.com',
    phone: '138****8003',
    skills: ['Vue', 'Spring Boot', 'MySQL'],
    status: '借调中',
    level: '高级',
    joinedDate: '2021-09-01',
  },
  {
    key: '4',
    name: '赵六',
    avatar: 'Z',
    company: '未来数字',
    email: 'zhaoliu@wlsz.com',
    phone: '138****8004',
    skills: ['React Native', 'Flutter', 'iOS'],
    status: '在职',
    level: '中级',
    joinedDate: '2023-01-10',
  },
];

const statusColors: Record<string, string> = {
  '在职': colors.success,
  '借调中': colors.warning,
  '离职': colors.error,
};

const levelColors: Record<string, string> = {
  '高级': '#722ed1',
  '中级': colors.primary,
  '初级': colors.info,
};

export default function DevelopersPage() {
  const columns = [
    {
      title: '开发人员',
      key: 'info',
      width: 280,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <AntdAvatar
            size={44}
            style={{
              background: colors.cardColors[parseInt(record.key) % 6].gradient,
              fontWeight: 600,
            }}
          >
            {record.avatar}
          </AntdAvatar>
          <div>
            <div style={{ fontWeight: 600, color: colors.text.primary, marginBottom: 2 }}>
              {record.name}
            </div>
            <div style={{ fontSize: 12, color: colors.text.secondary }}>
              {record.company}
            </div>
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
            <span style={{ color: colors.text.secondary }}>{record.email}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <PhoneOutlined style={{ color: colors.text.secondary }} />
            <span style={{ color: colors.text.secondary }}>{record.phone}</span>
          </div>
        </div>
      ),
    },
    {
      title: '技能栈',
      key: 'skills',
      width: 280,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {record.skills.slice(0, 3).map((skill: string, i: number) => (
            <AntdTag
              key={i}
              style={{
                borderRadius: 6,
                background: colors.background.light,
                color: colors.text.primary,
                border: 'none',
                margin: 0,
              }}
            >
              {skill}
            </AntdTag>
          ))}
          {record.skills.length > 3 && (
            <AntdTooltip title={record.skills.slice(3).join(', ')}>
              <AntdTag
                style={{
                  borderRadius: 6,
                  background: colors.background.light,
                  color: colors.text.secondary,
                  border: 'none',
                  cursor: 'pointer',
                  margin: 0,
                }}
              >
                +{record.skills.length - 3}
              </AntdTag>
            </AntdTooltip>
          )}
        </div>
      ),
    },
    {
      title: '等级',
      key: 'level',
      width: 100,
      render: (_: any, record: any) => (
        <AntdTag
          style={{
            borderRadius: 6,
            background: `${levelColors[record.level]}15`,
            color: levelColors[record.level],
            border: 'none',
            fontWeight: 500,
          }}
        >
          {record.level}
        </AntdTag>
      ),
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_: any, record: any) => (
        <AntdTag
          style={{
            borderRadius: 6,
            background: `${statusColors[record.status]}15`,
            color: statusColors[record.status],
            border: 'none',
            fontWeight: 500,
          }}
        >
          {record.status}
        </AntdTag>
      ),
    },
    {
      title: '入职时间',
      key: 'joinedDate',
      width: 120,
      render: (_: any, record: any) => (
        <span style={{ color: colors.text.secondary, fontSize: 13 }}>
          {record.joinedDate}
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
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, color: colors.text.primary, margin: 0, marginBottom: 4 }}>
          开发人员管理
        </h1>
        <p style={{ color: colors.text.secondary, margin: 0, fontSize: 14 }}>
          管理所有合作伙伴的开发人员信息
        </p>
      </div>

      {/* Table Card */}
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Table Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: `1px solid ${colors.border.light}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <AntdInput
              placeholder="搜索姓名、公司、技能..."
              prefix={<SearchOutlined style={{ color: colors.text.secondary }} />}
              style={{ width: 280, borderRadius: 10 }}
            />
            <div
              style={{
                padding: '8px 16px',
                borderRadius: 10,
                background: colors.background.light,
                fontSize: 13,
                color: colors.text.secondary,
              }}
            >
              共 {developers.length} 人
            </div>
          </div>
          <AntdButton
            type="primary"
            icon={<PlusOutlined />}
            style={{
              borderRadius: 10,
              background: `linear-gradient(135deg, ${colors.primary} 0%, #764ba2 100%)`,
              border: 'none',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
            }}
          >
            新增开发人员
          </AntdButton>
        </div>

        {/* Table */}
        <AntdTable
          columns={columns}
          dataSource={developers}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total: number) => `共 ${total} 条`,
          }}
          style={{ padding: '0 24px' }}
        />
      </div>
    </div>
  );
}
