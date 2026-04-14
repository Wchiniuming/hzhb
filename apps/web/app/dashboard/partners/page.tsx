'use client';

import { Table, Button, Tag, Progress, Row, Col } from 'antd';
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

const AntdTable = Table as any;
const AntdButton = Button as any;
const AntdTag = Tag as any;
const AntdProgress = Progress as any;

const partners = [
  {
    key: '1',
    name: '华钦科技',
    contact: '王经理',
    email: 'contact@huaqin.com',
    phone: '400-123-4567',
    address: '上海市浦东新区张江高科技园区',
    developerCount: 32,
    taskCount: 15,
    completedTaskCount: 10,
    score: 92,
    level: 'A级',
    status: '合作中',
  },
  {
    key: '2',
    name: '博雅软件',
    contact: '赵经理',
    email: 'contact@boya.com',
    phone: '400-234-5678',
    address: '北京市海淀区中关村软件园',
    developerCount: 28,
    taskCount: 12,
    completedTaskCount: 8,
    score: 85,
    level: 'B级',
    status: '合作中',
  },
  {
    key: '3',
    name: '创新科技',
    contact: '李经理',
    email: 'contact@cxkj.com',
    phone: '400-345-6789',
    address: '深圳市南山区科技园',
    developerCount: 25,
    taskCount: 10,
    completedTaskCount: 6,
    score: 78,
    level: 'B级',
    status: '合作中',
  },
  {
    key: '4',
    name: '未来数字',
    contact: '孙经理',
    email: 'contact@wlsz.com',
    phone: '400-456-7890',
    address: '杭州市滨江区海创基地',
    developerCount: 20,
    taskCount: 8,
    completedTaskCount: 5,
    score: 88,
    level: 'A级',
    status: '合作中',
  },
];

const levelColors: Record<string, { bg: string; color: string }> = {
  'A级': { bg: 'rgba(82, 196, 26, 0.1)', color: colors.success },
  'B级': { bg: 'rgba(24, 144, 255, 0.1)', color: colors.primary },
  'C级': { bg: 'rgba(250, 173, 20, 0.1)', color: colors.warning },
};

export default function PartnersPage() {
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
              background: colors.cardColors[parseInt(record.key) % 6].gradient,
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
            background: levelColors[record.level].bg,
            color: levelColors[record.level].color,
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
          { label: '合作伙伴总数', value: partners.length, icon: AppstoreOutlined, gradient: colors.cardColors[0].gradient },
          { label: 'A级合作伙伴', value: partners.filter(p => p.level === 'A级').length, icon: TeamOutlined, gradient: colors.cardColors[1].gradient },
          { label: '开发人员总数', value: partners.reduce((sum, p) => sum + p.developerCount, 0), icon: TeamOutlined, gradient: colors.cardColors[2].gradient },
          { label: '平均评分', value: Math.round(partners.reduce((sum, p) => sum + p.score, 0) / partners.length), icon: TeamOutlined, gradient: colors.cardColors[3].gradient },
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
