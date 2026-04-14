'use client';

import { Table, Button, Tag, Avatar, Tooltip } from 'antd';
import {
  PlusOutlined,
  WarningOutlined,
  EyeOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { colors } from '@/lib/theme';

const AntdTable = Table as any;
const AntdButton = Button as any;
const AntdTag = Tag as any;
const AntdAvatar = Avatar as any;
const AntdTooltip = Tooltip as any;

const risks = [
  {
    key: '1',
    title: '核心开发人员离职风险',
    description: '核心开发人员提出离职，可能导致项目进度受阻',
    category: '人员风险',
    level: '高',
    impact: '影响项目进度，可能导致延期',
    triggerConditions: '核心开发人员提出离职',
    dispositionMeasures: '建立AB角机制，定期备份项目文档',
    status: '监控中',
    discoverDate: '2024-01-15',
    owner: '王经理',
    ownerInitial: '王',
    partner: '华钦科技',
  },
  {
    key: '2',
    title: '技术方案架构缺陷',
    description: '架构设计存在缺陷或性能瓶颈，影响系统可扩展性',
    category: '技术风险',
    level: '中',
    impact: '影响系统性能和可扩展性',
    triggerConditions: '架构设计评审发现问题',
    dispositionMeasures: '技术方案评审，引入专家咨询',
    status: '已处理',
    discoverDate: '2024-01-10',
    owner: '李经理',
    ownerInitial: '李',
    partner: '博雅软件',
  },
  {
    key: '3',
    title: '需求变更频繁',
    description: '客户需求不明确，频繁变更导致项目范围蔓延',
    category: '管理风险',
    level: '中',
    impact: '影响项目质量和进度',
    triggerConditions: '需求评审会议提出变更',
    dispositionMeasures: '需求确认机制，变更控制流程',
    status: '处理中',
    discoverDate: '2024-01-08',
    owner: '赵经理',
    ownerInitial: '赵',
    partner: '创新科技',
  },
  {
    key: '4',
    title: '数据泄露风险',
    description: '安全措施不到位，数据访问控制不严',
    category: '安全风险',
    level: '高',
    impact: '造成数据安全事故，影响公司声誉',
    triggerConditions: '安全审计发现问题',
    dispositionMeasures: '安全审计，数据加密，权限控制',
    status: '已处理',
    discoverDate: '2024-01-05',
    owner: '孙经理',
    ownerInitial: '孙',
    partner: '未来数字',
  },
];

const levelConfig: Record<string, { bg: string; color: string; icon: any }> = {
  '高': { bg: 'rgba(255, 77, 79, 0.1)', color: colors.error, icon: ExclamationCircleOutlined },
  '中': { bg: 'rgba(250, 173, 20, 0.1)', color: colors.warning, icon: WarningOutlined },
  '低': { bg: 'rgba(82, 196, 26, 0.1)', color: colors.success, icon: CheckCircleOutlined },
};

const statusConfig: Record<string, { bg: string; color: string }> = {
  '监控中': { bg: 'rgba(24, 144, 255, 0.1)', color: colors.primary },
  '处理中': { bg: 'rgba(250, 173, 20, 0.1)', color: colors.warning },
  '已处理': { bg: 'rgba(82, 196, 26, 0.1)', color: colors.success },
  '已关闭': { bg: 'rgba(0, 0, 0, 0.04)', color: colors.text.secondary },
};

const categoryIcons: Record<string, { bg: string; color: string }> = {
  '人员风险': { bg: 'rgba(114, 46, 209, 0.1)', color: '#722ed1' },
  '技术风险': { bg: 'rgba(24, 144, 255, 0.1)', color: colors.primary },
  '管理风险': { bg: 'rgba(250, 173, 20, 0.1)', color: colors.warning },
  '安全风险': { bg: 'rgba(255, 77, 79, 0.1)', color: colors.error },
  '合规风险': { bg: 'rgba(19, 194, 194, 0.1)', color: colors.info },
  '财务风险': { bg: 'rgba(82, 196, 26, 0.1)', color: colors.success },
};

export default function RisksPage() {
  const columns = [
    {
      title: '风险信息',
      key: 'info',
      width: 320,
      render: (_: any, record: any) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div
              style={{
                padding: '2px 8px',
                borderRadius: 6,
                background: categoryIcons[record.category]?.bg || 'rgba(0,0,0,0.04)',
                color: categoryIcons[record.category]?.color || colors.text.secondary,
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              {record.category}
            </div>
          </div>
          <div style={{ fontWeight: 600, color: colors.text.primary, marginBottom: 4 }}>
            {record.title}
          </div>
          <div
            style={{
              fontSize: 13,
              color: colors.text.secondary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 300,
            }}
          >
            {record.description}
          </div>
        </div>
      ),
    },
    {
      title: '影响',
      key: 'impact',
      width: 200,
      render: (_: any, record: any) => (
        <AntdTooltip title={record.impact}>
          <div
            style={{
              fontSize: 13,
              color: colors.text.secondary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 180,
            }}
          >
            {record.impact}
          </div>
        </AntdTooltip>
      ),
    },
    {
      title: '等级',
      key: 'level',
      width: 100,
      render: (_: any, record: any) => {
        const Icon = levelConfig[record.level].icon;
        return (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              borderRadius: 8,
              background: levelConfig[record.level].bg,
              color: levelConfig[record.level].color,
              fontWeight: 600,
            }}
          >
            <Icon style={{ fontSize: 14 }} />
            {record.level}
          </div>
        );
      },
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_: any, record: any) => (
        <AntdTag
          style={{
            borderRadius: 6,
            background: statusConfig[record.status].bg,
            color: statusConfig[record.status].color,
            border: 'none',
            fontWeight: 500,
          }}
        >
          {record.status}
        </AntdTag>
      ),
    },
    {
      title: '负责人',
      key: 'owner',
      width: 110,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AntdAvatar
            size={28}
            style={{
              background: colors.cardColors[(parseInt(record.key) + 2) % 6].gradient,
              fontSize: 11,
            }}
          >
            {record.ownerInitial}
          </AntdAvatar>
          <span style={{ fontSize: 13 }}>{record.owner}</span>
        </div>
      ),
    },
    {
      title: '发现日期',
      key: 'discoverDate',
      width: 110,
      render: (_: any, record: any) => (
        <span style={{ color: colors.text.secondary, fontSize: 13 }}>{record.discoverDate}</span>
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
          <AntdButton type="text" icon={<DeleteOutlined />} size="small" danger />
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, color: colors.text.primary, margin: 0, marginBottom: 4 }}>
          风险库管理
        </h1>
        <p style={{ color: colors.text.secondary, margin: 0, fontSize: 14 }}>
          识别、评估和管理项目风险，提前做好预防措施
        </p>
      </div>

      {/* Risk Level Summary */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {[
          { label: '高风险', value: risks.filter(r => r.level === '高').length, color: colors.error, icon: ExclamationCircleOutlined },
          { label: '中风险', value: risks.filter(r => r.level === '中').length, color: colors.warning, icon: WarningOutlined },
          { label: '低风险', value: risks.filter(r => r.level === '低').length, color: colors.success, icon: CheckCircleOutlined },
          { label: '已处理', value: risks.filter(r => r.status === '已处理').length, color: colors.primary, icon: SafetyOutlined },
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
              <stat.icon />
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
          <div style={{ display: 'flex', gap: 8 }}>
            <AntdButton type="primary" style={{ borderRadius: 10 }}>全部</AntdButton>
            <AntdButton type="text" style={{ borderRadius: 10 }}>监控中</AntdButton>
            <AntdButton type="text" style={{ borderRadius: 10 }}>处理中</AntdButton>
            <AntdButton type="text" style={{ borderRadius: 10 }}>已处理</AntdButton>
          </div>
          <AntdButton
            type="primary"
            icon={<PlusOutlined />}
            style={{
              borderRadius: 10,
              background: `linear-gradient(135deg, ${colors.primary} 0%, #764ba2 100%)`,
              border: 'none',
            }}
          >
            新增风险
          </AntdButton>
        </div>

        <AntdTable
          columns={columns}
          dataSource={risks}
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
