'use client';

import { Table, Button, Tag, Progress, Tooltip, Avatar } from 'antd';
import {
  PlusOutlined,
  CalendarOutlined,
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { colors } from '@/lib/theme';

const AntdTable = Table as any;
const AntdButton = Button as any;
const AntdTag = Tag as any;
const AntdProgress = Progress as any;
const AntdTooltip = Tooltip as any;
const AntdAvatar = Avatar as any;

const tasks = [
  {
    key: '1',
    title: '订单系统微服务升级',
    description: '对现有订单系统进行微服务架构升级，提升系统性能和可用性',
    partner: '华钦科技',
    partnerColor: colors.cardColors[0].gradient,
    developer: ['张三', '李四'],
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    priority: '高',
    status: '进行中',
    progress: 75,
  },
  {
    key: '2',
    title: '移动端UI优化',
    description: '优化APP界面交互体验，提升用户满意度',
    partner: '博雅软件',
    partnerColor: colors.cardColors[1].gradient,
    developer: ['王五'],
    startDate: '2024-02-01',
    endDate: '2024-02-20',
    priority: '中',
    status: '进行中',
    progress: 45,
  },
  {
    key: '3',
    title: '数据报表功能开发',
    description: '开发季度数据统计报表，支持多维度数据分析',
    partner: '创新科技',
    partnerColor: colors.cardColors[2].gradient,
    developer: ['赵六', '钱七'],
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    priority: '低',
    status: '已完成',
    progress: 100,
  },
  {
    key: '4',
    title: 'API接口重构',
    description: '重构现有API接口，优化数据结构',
    partner: '未来数字',
    partnerColor: colors.cardColors[3].gradient,
    developer: ['孙八'],
    startDate: '2024-02-10',
    endDate: '2024-03-10',
    priority: '高',
    status: '待分配',
    progress: 0,
  },
];

const priorityColors: Record<string, { bg: string; color: string }> = {
  '高': { bg: 'rgba(255, 77, 79, 0.1)', color: colors.error },
  '中': { bg: 'rgba(250, 173, 20, 0.1)', color: colors.warning },
  '低': { bg: 'rgba(82, 196, 26, 0.1)', color: colors.success },
};

const statusColors: Record<string, { bg: string; color: string }> = {
  '待分配': { bg: 'rgba(0, 0, 0, 0.04)', color: '#8c8c8c' },
  '进行中': { bg: 'rgba(24, 144, 255, 0.1)', color: colors.primary },
  '待验收': { bg: 'rgba(250, 173, 20, 0.1)', color: colors.warning },
  '已完成': { bg: 'rgba(82, 196, 26, 0.1)', color: colors.success },
};

export default function TasksPage() {
  const columns = [
    {
      title: '任务信息',
      key: 'info',
      width: 350,
      render: (_: any, record: any) => (
        <div>
          <div style={{ fontWeight: 600, color: colors.text.primary, marginBottom: 6 }}>
            {record.title}
          </div>
          <div
            style={{
              fontSize: 13,
              color: colors.text.secondary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 320,
            }}
          >
            {record.description}
          </div>
        </div>
      ),
    },
    {
      title: '合作伙伴',
      key: 'partner',
      width: 140,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: record.partnerColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            {record.partner.charAt(0)}
          </div>
          <span style={{ fontWeight: 500 }}>{record.partner}</span>
        </div>
      ),
    },
    {
      title: '开发人员',
      key: 'developer',
      width: 120,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {record.developer.slice(0, 2).map((name: string, i: number) => (
            <AntdAvatar
              key={i}
              size={28}
              style={{
                background: colors.cardColors[(parseInt(record.key) + i) % 6].gradient,
                fontSize: 11,
                marginLeft: i > 0 ? -8 : 0,
                border: '2px solid #fff',
              }}
            >
              {name.charAt(0)}
            </AntdAvatar>
          ))}
          {record.developer.length > 2 && (
            <AntdTooltip title={record.developer.slice(2).join(', ')}>
              <AntdAvatar
                size={28}
                style={{
                  background: colors.text.secondary,
                  fontSize: 10,
                  marginLeft: -8,
                  border: '2px solid #fff',
                }}
              >
                +{record.developer.length - 2}
              </AntdAvatar>
            </AntdTooltip>
          )}
        </div>
      ),
    },
    {
      title: '优先级',
      key: 'priority',
      width: 90,
      render: (_: any, record: any) => (
        <AntdTag
          style={{
            borderRadius: 6,
            background: priorityColors[record.priority].bg,
            color: priorityColors[record.priority].color,
            border: 'none',
            fontWeight: 500,
          }}
        >
          {record.priority}
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
            background: statusColors[record.status].bg,
            color: statusColors[record.status].color,
            border: 'none',
            fontWeight: 500,
          }}
        >
          {record.status}
        </AntdTag>
      ),
    },
    {
      title: '进度',
      key: 'progress',
      width: 160,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <AntdProgress
            percent={record.progress}
            size="small"
            strokeColor={record.progress === 100 ? colors.success : colors.primary}
            showInfo={false}
            style={{ width: 100, margin: 0 }}
          />
          <span style={{ fontSize: 13, color: colors.text.secondary, minWidth: 35 }}>
            {record.progress}%
          </span>
        </div>
      ),
    },
    {
      title: '截止日期',
      key: 'dates',
      width: 120,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: colors.text.secondary, fontSize: 13 }}>
          <CalendarOutlined />
          <span>{record.endDate}</span>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: () => (
        <div style={{ display: 'flex', gap: 4 }}>
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
          任务登记管理
        </h1>
        <p style={{ color: colors.text.secondary, margin: 0, fontSize: 14 }}>
          跟踪和管理所有合作伙伴的任务进度
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {[
          { label: '全部任务', value: tasks.length, color: colors.primary },
          { label: '进行中', value: tasks.filter(t => t.status === '进行中').length, color: colors.success },
          { label: '待验收', value: tasks.filter(t => t.status === '待验收').length, color: colors.warning },
          { label: '已完成', value: tasks.filter(t => t.status === '已完成').length, color: '#722ed1' },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              padding: 16,
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: `${stat.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stat.color,
                fontSize: 20,
              }}
            >
              <FileTextOutlined />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: colors.text.primary, lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 13, color: colors.text.secondary, marginTop: 2 }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
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
            <AntdButton
              type="primary"
              ghost
              style={{ borderRadius: 10 }}
            >
              全部
            </AntdButton>
            <AntdButton type="text" style={{ borderRadius: 10 }}>进行中</AntdButton>
            <AntdButton type="text" style={{ borderRadius: 10 }}>待验收</AntdButton>
            <AntdButton type="text" style={{ borderRadius: 10 }}>已完成</AntdButton>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AntdButton
              type="primary"
              icon={<PlusOutlined />}
              style={{
                borderRadius: 10,
                background: `linear-gradient(135deg, ${colors.primary} 0%, #764ba2 100%)`,
                border: 'none',
              }}
            >
              创建任务
            </AntdButton>
          </div>
        </div>

        <AntdTable
          columns={columns}
          dataSource={tasks}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total: number) => `共 ${total} 条`,
          }}
        />
      </div>
    </div>
  );
}
