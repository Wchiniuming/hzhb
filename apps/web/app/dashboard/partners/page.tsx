'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Tag, Progress, Row, Col, message } from 'antd';
import {
  PlusOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  EditOutlined,
  EyeOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { colors } from '@/lib/theme';
import api from '@/lib/api';

const AntdTable = Table as any;
const AntdButton = Button as any;
const AntdTag = Tag as any;
const AntdProgress = Progress as any;

const levelColors: Record<string, { bg: string; color: string }> = {
  'A': { bg: 'rgba(82, 196, 26, 0.1)', color: colors.success },
  'B': { bg: 'rgba(24, 144, 255, 0.1)', color: colors.primary },
  'C': { bg: 'rgba(250, 173, 20, 0.1)', color: colors.warning },
  'A级': { bg: 'rgba(82, 196, 26, 0.1)', color: colors.success },
  'B级': { bg: 'rgba(24, 144, 255, 0.1)', color: colors.primary },
  'C级': { bg: 'rgba(250, 173, 20, 0.1)', color: colors.warning },
};

const defaultColor = { bg: 'rgba(0,0,0,0.04)', color: '#8c8c8c' };
function getColor(map: Record<string, { bg: string; color: string }>, key: string) {
  return map[key] || defaultColor;
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.partners.list({ page, limit: 10 });
      const mappedData = res.data.map((partner: any, index: number) => ({
        key: partner.id || String(index),
        id: partner.id,
        name: partner.name,
        contact: partner.contactPerson || '-',
        email: partner.email || '-',
        phone: partner.phone || '-',
        address: partner.address || '-',
        developerCount: partner.developerCount || 0,
        taskCount: partner.taskCount || 0,
        completedTaskCount: partner.completedTaskCount || 0,
        score: partner.score || 0,
        level: partner.level || '-',
        status: partner.status || '合作中',
      }));
      setPartners(mappedData);
      setTotal(res.meta?.total || res.data.length);
    } catch (err: any) {
      message.error(err.message || '获取合作伙伴列表失败');
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
      key: 'info',
      width: 280,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              background: colors.cardColors[(parseInt(record.key) || 0) % 6].gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            {record.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: colors.text.primary, marginBottom: 4 }}>
              {record.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: colors.text.secondary, fontSize: 13 }}>
              <EnvironmentOutlined style={{ fontSize: 12 }} />
              <span style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {record.address}
              </span>
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
      title: '开发人员',
      key: 'developers',
      width: 100,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TeamOutlined style={{ color: colors.text.secondary }} />
          <span style={{ fontWeight: 600 }}>{record.developerCount}</span>
          <span style={{ color: colors.text.secondary, fontSize: 13 }}>人</span>
        </div>
      ),
    },
    {
      title: '任务完成率',
      key: 'tasks',
      width: 160,
      render: (_: any, record: any) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ color: colors.text.secondary, fontSize: 13 }}>
              {record.completedTaskCount}/{record.taskCount} 个任务
            </span>
          </div>
          <AntdProgress
            percent={Math.round((record.completedTaskCount / record.taskCount) * 100)}
            size="small"
            strokeColor={colors.success}
            showInfo={false}
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
            fontSize: 13,
          }}
        >
          {record.level}
        </AntdTag>
      ),
    },
    {
      title: '综合评分',
      key: 'score',
      width: 120,
      render: (_: any, record: any) => {
        const scoreColor =
          record.score >= 90 ? colors.success :
          record.score >= 80 ? colors.primary :
          record.score >= 70 ? colors.warning : colors.error;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: `${scoreColor}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: scoreColor,
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              {record.score}
            </div>
          </div>
        );
      },
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
          合作伙伴管理
        </h1>
        <p style={{ color: colors.text.secondary, margin: 0, fontSize: 14 }}>
          管理所有合作伙伴的基本信息和合作情况
        </p>
      </div>

      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {[
          { label: '合作伙伴总数', value: total, icon: AppstoreOutlined, gradient: colors.cardColors[0].gradient },
          { label: 'A级合作伙伴', value: partners.filter(p => p.level === 'A级').length, icon: TeamOutlined, gradient: colors.cardColors[1].gradient },
          { label: '开发人员总数', value: partners.reduce((sum, p) => sum + p.developerCount, 0), icon: TeamOutlined, gradient: colors.cardColors[2].gradient },
          { label: '平均评分', value: partners.length > 0 ? Math.round(partners.reduce((sum, p) => sum + p.score, 0) / partners.length) : 0, icon: TeamOutlined, gradient: colors.cardColors[3].gradient },
        ].map((stat, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                padding: 20,
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: stat.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 24,
                }}
              >
                <stat.icon />
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: colors.text.primary, lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 13, color: colors.text.secondary, marginTop: 4 }}>
                  {stat.label}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

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
          <AntdButton
            type="primary"
            icon={<PlusOutlined />}
            style={{
              borderRadius: 10,
              background: `linear-gradient(135deg, ${colors.primary} 0%, #764ba2 100%)`,
              border: 'none',
            }}
          >
            新增合作伙伴
          </AntdButton>
        </div>

        <AntdTable
          columns={columns}
          dataSource={partners}
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
