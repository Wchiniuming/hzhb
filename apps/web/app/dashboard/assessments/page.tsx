'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Tag, Progress, Tooltip, App } from 'antd';
import {
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  TrophyOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { colors } from '@/lib/theme';
import api from '@/lib/api';

const AntdTable = Table as any;
const AntdButton = Button as any;
const AntdTag = Tag as any;
const AntdProgress = Progress as any;
const AntdTooltip = Tooltip as any;

const levelColors: Record<string, { bg: string; color: string }> = {
  'A': { bg: 'rgba(82, 196, 26, 0.1)', color: colors.success },
  'B': { bg: 'rgba(24, 144, 255, 0.1)', color: colors.primary },
  'C': { bg: 'rgba(250, 173, 20, 0.1)', color: colors.warning },
  'D': { bg: 'rgba(255, 77, 79, 0.1)', color: colors.error },
  'A级': { bg: 'rgba(82, 196, 26, 0.1)', color: colors.success },
  'B级': { bg: 'rgba(24, 144, 255, 0.1)', color: colors.primary },
  'C级': { bg: 'rgba(250, 173, 20, 0.1)', color: colors.warning },
  'D级': { bg: 'rgba(255, 77, 79, 0.1)', color: colors.error },
};

const statusColors: Record<string, { bg: string; color: string; icon: any }> = {
  'COMPLETED': { bg: 'rgba(82, 196, 26, 0.1)', color: colors.success, icon: CheckCircleOutlined },
  'IN_PROGRESS': { bg: 'rgba(24, 144, 255, 0.1)', color: colors.primary, icon: ClockCircleOutlined },
  '已完成': { bg: 'rgba(82, 196, 26, 0.1)', color: colors.success, icon: CheckCircleOutlined },
  '进行中': { bg: 'rgba(24, 144, 255, 0.1)', color: colors.primary, icon: ClockCircleOutlined },
};

const defaultColor = { bg: 'rgba(0,0,0,0.04)', color: '#8c8c8c' };
function getColor(map: Record<string, { bg: string; color: string }>, key: string) {
  return map[key] || defaultColor;
}

export default function AssessmentsPage() {
  const { message } = App.useApp();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.assessments.listAssessments({ page, limit: 10 });
      const mappedData = res.data.map((assessment: any, index: number) => ({
        key: assessment.id || String(index),
        id: assessment.id,
        partner: assessment.partner?.name || '-',
        partnerInitial: (assessment.partner?.name || 'A').charAt(0),
        period: assessment.cycle || '-',
        indicators: assessment.indicators || [],
        overallScore: assessment.totalScore || assessment.overallScore || 0,
        level: assessment.level || '-',
        assessor: assessment.assessor || '管理员',
        status: assessment.status || '进行中',
        completedDate: assessment.completedDate || '-',
      }));
      setAssessments(mappedData);
      setTotal(res.meta?.total || res.data.length);
    } catch (err: any) {
      message.error(err.message || '获取评估列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);
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
              background: colors.cardColors[(parseInt(record.key) || 0) % 6].gradient,
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
            background: getColor(levelColors, record.level).bg,
            color: getColor(levelColors, record.level).color,
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
            background: getColor(statusColors, record.status).bg,
            color: getColor(statusColors, record.status).color,
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {(() => {
            const Icon = statusColors[record.status]?.icon || CheckCircleOutlined;
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
          <AntdButton type="text" icon={<EyeOutlined />} size="small" onClick={() => message.info('功能开发中')} />
          <AntdButton type="text" icon={<BarChartOutlined />} size="small" onClick={() => message.info('功能开发中')} />
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
          { label: '平均评分', value: assessments.length > 0 ? (assessments.reduce((sum, a) => sum + a.overallScore, 0) / assessments.length).toFixed(1) : '0', color: '#722ed1' },
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
            <AntdButton type="text" style={{ borderRadius: 10 }} onClick={() => message.info('功能开发中')}>已完成</AntdButton>
            <AntdButton type="text" style={{ borderRadius: 10 }} onClick={() => message.info('功能开发中')}>进行中</AntdButton>
          </div>
          <AntdButton
            type="primary"
            icon={<PlusOutlined />}
            style={{
              borderRadius: 10,
              background: `linear-gradient(135deg, ${colors.primary} 0%, #764ba2 100%)`,
              border: 'none',
            }}
            onClick={() => message.info('功能开发中')}
          >
            创建评估计划
          </AntdButton>
        </div>

        <AntdTable
          columns={columns}
          dataSource={assessments}
          loading={loading}
          pagination={{
            current: page,
            pageSize: 10,
            total,
            showSizeChanger: true,
            showTotal: (total: number) => `共 ${total} 条`,
            onChange: (p) => setPage(p),
          }}
        />
      </div>
    </div>
  );
}
