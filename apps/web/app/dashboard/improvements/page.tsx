'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Tag, Progress, Avatar, message } from 'antd';
import {
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  EyeOutlined,
  RiseOutlined,
  FieldTimeOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { colors } from '@/lib/theme';
import api from '@/lib/api';

const AntdTable = Table as any;
const AntdButton = Button as any;
const AntdTag = Tag as any;
const AntdProgress = Progress as any;
const AntdAvatar = Avatar as any;

const priorityColors: Record<string, { bg: string; color: string }> = {
  '高': { bg: 'rgba(255, 77, 79, 0.1)', color: colors.error },
  '中': { bg: 'rgba(250, 173, 20, 0.1)', color: colors.warning },
  '低': { bg: 'rgba(82, 196, 26, 0.1)', color: colors.success },
};

const statusConfig: Record<string, { bg: string; color: string; icon: any }> = {
  '待验收': { bg: 'rgba(250, 173, 20, 0.1)', color: colors.warning, icon: FieldTimeOutlined },
  '进行中': { bg: 'rgba(24, 144, 255, 0.1)', color: colors.primary, icon: ClockCircleOutlined },
  '已完成': { bg: 'rgba(82, 196, 26, 0.1)', color: colors.success, icon: CheckCircleOutlined },
};

const originColors: Record<string, { bg: string; color: string }> = {
  '评估触发': { bg: 'rgba(114, 46, 209, 0.1)', color: '#722ed1' },
  '任务延期': { bg: 'rgba(250, 173, 20, 0.1)', color: colors.warning },
  '风险触发': { bg: 'rgba(255, 77, 79, 0.1)', color: colors.error },
};

export default function ImprovementsPage() {
  const [improvements, setImprovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.improvements.listRequirements({ page, limit: 10 });
      const mappedData = res.data.map((req: any, index: number) => ({
        key: req.id || String(index),
        id: req.id,
        title: req.title,
        description: req.description,
        origin: req.originType || '-',
        partner: req.partner?.name || '-',
        partnerInitial: (req.partner?.name || 'A').charAt(0),
        priority: req.priority || '中',
        status: req.status || '进行中',
        progress: req.progress || 0,
        deadline: req.targetDate || '-',
        responsible: req.responsibleType || '-',
      }));
      setImprovements(mappedData);
      setTotal(res.meta?.total || res.data.length);
    } catch (err: any) {
      message.error(err.message || '获取改进项列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);
  const columns = [
    {
      title: '改进项',
      key: 'info',
      width: 320,
      render: (_: any, record: any) => (
        <div>
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
      title: '来源',
      key: 'origin',
      width: 110,
      render: (_: any, record: any) => (
        <AntdTag
          style={{
            borderRadius: 6,
            background: originColors[record.origin].bg,
            color: originColors[record.origin].color,
            border: 'none',
            fontWeight: 500,
          }}
        >
          {record.origin}
        </AntdTag>
      ),
    },
    {
      title: '合作伙伴',
      key: 'partner',
      width: 130,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: colors.cardColors[parseInt(record.key) % 6].gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            {record.partnerInitial}
          </div>
          <span style={{ fontWeight: 500 }}>{record.partner}</span>
        </div>
      ),
    },
    {
      title: '负责人',
      key: 'responsible',
      width: 100,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AntdAvatar
            size={28}
            style={{
              background: colors.cardColors[(parseInt(record.key) + 1) % 6].gradient,
              fontSize: 11,
            }}
          >
            {record.responsible.charAt(0)}
          </AntdAvatar>
          <span style={{ fontSize: 13 }}>{record.responsible}</span>
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
          <WarningOutlined style={{ marginRight: 4, fontSize: 10 }} />
          {record.priority}
        </AntdTag>
      ),
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_: any, record: any) => {
        const Icon = statusConfig[record.status].icon;
        return (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 6,
              background: statusConfig[record.status].bg,
              color: statusConfig[record.status].color,
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            <Icon style={{ fontSize: 12 }} />
            {record.status}
          </div>
        );
      },
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
      key: 'deadline',
      width: 110,
      render: (_: any, record: any) => (
        <span style={{ color: colors.text.secondary, fontSize: 13 }}>{record.deadline}</span>
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
          正向改进管理
        </h1>
        <p style={{ color: colors.text.secondary, margin: 0, fontSize: 14 }}>
          跟踪和管理合作伙伴的改进项，持续提升服务质量
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {[
          { label: '全部改进项', value: total, color: colors.primary },
          { label: '进行中', value: improvements.filter(i => i.status === '进行中').length, color: colors.info },
          { label: '待验收', value: improvements.filter(i => i.status === '待验收').length, color: colors.warning },
          { label: '已完成', value: improvements.filter(i => i.status === '已完成').length, color: colors.success },
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
              <RiseOutlined />
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
            <AntdButton type="text" style={{ borderRadius: 10 }}>进行中</AntdButton>
            <AntdButton type="text" style={{ borderRadius: 10 }}>待验收</AntdButton>
            <AntdButton type="text" style={{ borderRadius: 10 }}>已完成</AntdButton>
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
            创建改进项
          </AntdButton>
        </div>

        <AntdTable
          columns={columns}
          dataSource={improvements}
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
