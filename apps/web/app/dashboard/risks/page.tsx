'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Tag, Avatar, Tooltip, message } from 'antd';
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
import api from '@/lib/api';

const AntdTable = Table as any;
const AntdButton = Button as any;
const AntdTag = Tag as any;
const AntdAvatar = Avatar as any;
const AntdTooltip = Tooltip as any;

const levelConfig: Record<string, { bg: string; color: string; icon: any }> = {
  'HIGH': { bg: 'rgba(255, 77, 79, 0.1)', color: colors.error, icon: ExclamationCircleOutlined },
  'MEDIUM': { bg: 'rgba(250, 173, 20, 0.1)', color: colors.warning, icon: WarningOutlined },
  'LOW': { bg: 'rgba(82, 196, 26, 0.1)', color: colors.success, icon: CheckCircleOutlined },
  '高': { bg: 'rgba(255, 77, 79, 0.1)', color: colors.error, icon: ExclamationCircleOutlined },
  '中': { bg: 'rgba(250, 173, 20, 0.1)', color: colors.warning, icon: WarningOutlined },
  '低': { bg: 'rgba(82, 196, 26, 0.1)', color: colors.success, icon: CheckCircleOutlined },
};

const statusConfig: Record<string, { bg: string; color: string }> = {
  'MONITORING': { bg: 'rgba(24, 144, 255, 0.1)', color: colors.primary },
  'HANDLING': { bg: 'rgba(250, 173, 20, 0.1)', color: colors.warning },
  'RESOLVED': { bg: 'rgba(82, 196, 26, 0.1)', color: colors.success },
  'CLOSED': { bg: 'rgba(0, 0, 0, 0.04)', color: colors.text.secondary },
  '监控中': { bg: 'rgba(24, 144, 255, 0.1)', color: colors.primary },
  '处理中': { bg: 'rgba(250, 173, 20, 0.1)', color: colors.warning },
  '已处理': { bg: 'rgba(82, 196, 26, 0.1)', color: colors.success },
  '已关闭': { bg: 'rgba(0, 0, 0, 0.04)', color: colors.text.secondary },
};

const categoryIcons: Record<string, { bg: string; color: string }> = {
  'PERSONNEL': { bg: 'rgba(114, 46, 209, 0.1)', color: '#722ed1' },
  'TECHNICAL': { bg: 'rgba(24, 144, 255, 0.1)', color: colors.primary },
  'MANAGEMENT': { bg: 'rgba(250, 173, 20, 0.1)', color: colors.warning },
  'SECURITY': { bg: 'rgba(255, 77, 79, 0.1)', color: colors.error },
  'COMPLIANCE': { bg: 'rgba(19, 194, 194, 0.1)', color: colors.info },
  'FINANCIAL': { bg: 'rgba(82, 196, 26, 0.1)', color: colors.success },
  '人员风险': { bg: 'rgba(114, 46, 209, 0.1)', color: '#722ed1' },
  '技术风险': { bg: 'rgba(24, 144, 255, 0.1)', color: colors.primary },
  '管理风险': { bg: 'rgba(250, 173, 20, 0.1)', color: colors.warning },
  '安全风险': { bg: 'rgba(255, 77, 79, 0.1)', color: colors.error },
  '合规风险': { bg: 'rgba(19, 194, 194, 0.1)', color: colors.info },
  '财务风险': { bg: 'rgba(82, 196, 26, 0.1)', color: colors.success },
};

const defaultColor = { bg: 'rgba(0,0,0,0.04)', color: '#8c8c8c' };
function getColor(map: Record<string, { bg: string; color: string }>, key: string) {
  return map[key] || defaultColor;
}

export default function RisksPage() {
  const [risks, setRisks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.risks.list({ page, limit: 10 });
      const mappedData = res.data.map((risk: any, index: number) => ({
        key: risk.id || String(index),
        id: risk.id,
        title: risk.name,
        description: risk.description,
        category: risk.typeId || risk.category || '-',
        level: risk.level || '中',
        impact: risk.impact || '-',
        triggerConditions: risk.triggerConditions || '-',
        dispositionMeasures: risk.dispositionMeasures || '-',
        status: risk.status || '监控中',
        discoverDate: risk.discoverDate || risk.createdAt?.split('T')[0] || '-',
        owner: risk.owner || '-',
        ownerInitial: (risk.owner || 'A').charAt(0),
        partner: risk.partner?.name || '-',
      }));
      setRisks(mappedData);
      setTotal(res.meta?.total || res.data.length);
    } catch (err: any) {
      message.error(err.message || '获取风险列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);
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
            background: getColor(statusConfig, record.status).bg,
            color: getColor(statusConfig, record.status).color,
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
              background: colors.cardColors[(parseInt(record.key) || 0) % 6].gradient,
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
