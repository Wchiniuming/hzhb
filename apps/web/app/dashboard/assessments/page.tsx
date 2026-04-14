'use client';

import { Table, Button, Tag, Progress, Tooltip } from 'antd';
import {
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  TrophyOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { colors } from '@/lib/theme';

const AntdTable = Table as any;
const AntdButton = Button as any;
const AntdTag = Tag as any;
const AntdProgress = Progress as any;
const AntdTooltip = Tooltip as any;

const assessments = [
  {
    key: '1',
    partner: '华钦科技',
    partnerInitial: '华',
    period: '2024 Q1',
    indicators: [
      { name: '技术能力', score: 92, weight: 0.25 },
      { name: '交付质量', score: 88, weight: 0.25 },
      { name: '服务响应', score: 95, weight: 0.20 },
      { name: '人员素质', score: 90, weight: 0.15 },
      { name: '合规性', score: 94, weight: 0.15 },
    ],
    overallScore: 91.6,
    level: 'A级',
    assessor: '管理员',
    status: '已完成',
    completedDate: '2024-01-31',
  },
  {
    key: '2',
    partner: '博雅软件',
    partnerInitial: '博',
    period: '2024 Q1',
    indicators: [
      { name: '技术能力', score: 78, weight: 0.25 },
      { name: '交付质量', score: 82, weight: 0.25 },
      { name: '服务响应', score: 75, weight: 0.20 },
      { name: '人员素质', score: 80, weight: 0.15 },
      { name: '合规性', score: 85, weight: 0.15 },
    ],
    overallScore: 79.6,
    level: 'B级',
    assessor: '管理员',
    status: '进行中',
    completedDate: '-',
  },
  {
    key: '3',
    partner: '创新科技',
    partnerInitial: '创',
    period: '2024 Q1',
    indicators: [
      { name: '技术能力', score: 72, weight: 0.25 },
      { name: '交付质量', score: 75, weight: 0.25 },
      { name: '服务响应', score: 80, weight: 0.20 },
      { name: '人员素质', score: 78, weight: 0.15 },
      { name: '合规性', score: 82, weight: 0.15 },
    ],
    overallScore: 76.9,
    level: 'B级',
    assessor: '管理员',
    status: '已完成',
    completedDate: '2024-01-28',
  },
  {
    key: '4',
    partner: '未来数字',
    partnerInitial: '未',
    period: '2024 Q1',
    indicators: [
      { name: '技术能力', score: 85, weight: 0.25 },
      { name: '交付质量', score: 88, weight: 0.25 },
      { name: '服务响应', score: 90, weight: 0.20 },
      { name: '人员素质', score: 87, weight: 0.15 },
      { name: '合规性', score: 92, weight: 0.15 },
    ],
    overallScore: 88.0,
    level: 'A级',
    assessor: '管理员',
    status: '已完成',
    completedDate: '2024-01-30',
  },
];

const levelColors: Record<string, { bg: string; color: string }> = {
  'A级': { bg: 'rgba(82, 196, 26, 0.1)', color: colors.success },
  'B级': { bg: 'rgba(24, 144, 255, 0.1)', color: colors.primary },
  'C级': { bg: 'rgba(250, 173, 20, 0.1)', color: colors.warning },
  'D级': { bg: 'rgba(255, 77, 79, 0.1)', color: colors.error },
};

const statusColors: Record<string, { bg: string; color: string; icon: any }> = {
  '已完成': { bg: 'rgba(82, 196, 26, 0.1)', color: colors.success, icon: CheckCircleOutlined },
  '进行中': { bg: 'rgba(24, 144, 255, 0.1)', color: colors.primary, icon: ClockCircleOutlined },
};

export default function AssessmentsPage() {
  const columns = [
    {
      title: '合作伙伴',
      key: 'partner',
      width: 180,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: colors.cardColors[parseInt(record.key) % 6].gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            {record.partnerInitial}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: colors.text.primary }}>{record.partner}</div>
            <div style={{ fontSize: 12, color: colors.text.secondary }}>{record.period}</div>
          </div>
        </div>
      ),
    },
    {
      title: '各项评分',
      key: 'indicators',
      width: 280,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {record.indicators.slice(0, 3).map((ind: any, i: number) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: colors.text.secondary, width: 60 }}>
                {ind.name}
              </span>
              <AntdProgress
                percent={ind.score}
                size="small"
                strokeColor={
                  ind.score >= 90 ? colors.success :
                  ind.score >= 80 ? colors.primary :
                  ind.score >= 70 ? colors.warning : colors.error
                }
                showInfo={false}
                style={{ width: 100, margin: 0 }}
              />
              <span style={{ fontSize: 12, fontWeight: 500, color: colors.text.primary, width: 30 }}>
                {ind.score}
              </span>
            </div>
          ))}
          {record.indicators.length > 3 && (
            <AntdTooltip
              title={
                <div>
                  {record.indicators.slice(3).map((ind: any, i: number) => (
                    <div key={i}>{ind.name}: {ind.score}</div>
                  ))}
                </div>
              }
            >
              <span style={{ fontSize: 12, color: colors.primary, cursor: 'pointer' }}>
                +{record.indicators.length - 3} 更多
              </span>
            </AntdTooltip>
          )}
        </div>
      ),
    },
    {
      title: '综合评分',
      key: 'overallScore',
      width: 120,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <AntdProgress
            type="circle"
            percent={record.overallScore}
            size={50}
            strokeColor={
              record.overallScore >= 90 ? colors.success :
              record.overallScore >= 80 ? colors.primary :
              record.overallScore >= 70 ? colors.warning : colors.error
            }
            format={(percent: number) => <span style={{ fontSize: 12, fontWeight: 600 }}>{percent}</span>}
          />
        </div>
      ),
    },
    {
      title: '等级',
      key: 'level',
      width: 90,
      render: (_: any, record: any) => (
        <AntdTag
          style={{
            borderRadius: 6,
            background: levelColors[record.level].bg,
            color: levelColors[record.level].color,
            border: 'none',
            fontWeight: 600,
          }}
        >
          <TrophyOutlined style={{ marginRight: 4 }} />
          {record.level}
        </AntdTag>
      ),
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_: any, record: any) => (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 6,
            background: statusColors[record.status].bg,
            color: statusColors[record.status].color,
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {(() => {
            const Icon = statusColors[record.status].icon;
            return <Icon style={{ fontSize: 12 }} />;
          })()}
          {record.status}
        </div>
      ),
    },
    {
      title: '完成日期',
      key: 'completedDate',
      width: 110,
      render: (_: any, record: any) => (
        <span style={{ color: colors.text.secondary, fontSize: 13 }}>{record.completedDate}</span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: () => (
        <div style={{ display: 'flex', gap: 4 }}>
          <AntdButton type="text" icon={<EyeOutlined />} size="small" />
          <AntdButton type="text" icon={<BarChartOutlined />} size="small" />
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, color: colors.text.primary, margin: 0, marginBottom: 4 }}>
          厂商能力评估
        </h1>
        <p style={{ color: colors.text.secondary, margin: 0, fontSize: 14 }}>
          对合作伙伴进行综合能力评估和等级划分
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'A级合作伙伴', value: assessments.filter(a => a.level === 'A级').length, color: colors.success },
          { label: 'B级合作伙伴', value: assessments.filter(a => a.level === 'B级').length, color: colors.primary },
          { label: '进行中评估', value: assessments.filter(a => a.status === '进行中').length, color: colors.warning },
          { label: '平均评分', value: (assessments.reduce((sum, a) => sum + a.overallScore, 0) / assessments.length).toFixed(1), color: '#722ed1' },
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
              <TrophyOutlined />
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
            <AntdButton type="text" style={{ borderRadius: 10 }}>已完成</AntdButton>
            <AntdButton type="text" style={{ borderRadius: 10 }}>进行中</AntdButton>
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
            创建评估计划
          </AntdButton>
        </div>

        <AntdTable
          columns={columns}
          dataSource={assessments}
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
