'use client';

import { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import {
  TeamOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  RiseOutlined,
  ArrowUpOutlined,
  CalendarOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { colors } from '@/lib/theme';
import api from '@/lib/api';

interface DashboardStats {
  developers: { total: number };
  tasks: { total: number; delayed: number };
  assessments: { totalAssessments: number; completedAssessments: number };
  risks: { total: number };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.developers.getStats(),
      api.tasks.getStats(),
      api.assessments.getStats(),
      api.risks.getStats(),
    ]).then(([developers, tasks, assessments, risks]) => {
      setStats({ developers, tasks, assessments, risks });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <div style={{ color: colors.text.secondary }}>加载中...</div>
      </div>
    );
  }

  const statCards = [
    {
      title: '开发人员总数',
      value: stats.developers.total,
      trend: 'up' as const,
      icon: TeamOutlined,
      iconBg: 'rgba(102, 126, 234, 0.15)',
      iconColor: '#667eea',
    },
    {
      title: '进行中任务',
      value: stats.tasks.total,
      trend: 'up' as const,
      icon: FileTextOutlined,
      iconBg: 'rgba(17, 153, 142, 0.15)',
      iconColor: '#11998e',
    },
    {
      title: '已完成评估',
      value: stats.assessments.completedAssessments,
      trend: 'up' as const,
      icon: CheckCircleOutlined,
      iconBg: 'rgba(240, 147, 251, 0.15)',
      iconColor: '#f093fb',
    },
    {
      title: '风险项总数',
      value: stats.risks.total,
      trend: 'down' as const,
      icon: WarningOutlined,
      iconBg: 'rgba(79, 172, 254, 0.15)',
      iconColor: '#4facfe',
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: colors.text.primary,
            margin: 0,
            marginBottom: 4,
          }}
        >
          仪表盘
        </h1>
        <p style={{ color: colors.text.secondary, margin: 0, fontSize: 14 }}>
          欢迎回来，这里是您的数据概览
        </p>
      </div>

      {/* Stats Cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        {statCards.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                padding: 20,
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                transition: 'all 0.3s',
                cursor: 'pointer',
                height: '100%',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: stat.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    color: stat.iconColor,
                  }}
                >
                  <stat.icon />
                </div>
                <div
                  style={{
                    padding: '4px 10px',
                    borderRadius: 20,
                    background: stat.trend === 'up' ? 'rgba(82, 196, 26, 0.1)' : 'rgba(250, 173, 20, 0.1)',
                    color: stat.trend === 'up' ? colors.success : colors.warning,
                    fontSize: 12,
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  {stat.trend === 'up' ? <ArrowUpOutlined /> : <RiseOutlined style={{ transform: 'rotate(180deg)' }} />}
                  {stat.trend === 'up' ? '增长' : '下降'}
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: colors.text.primary, lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ color: colors.text.secondary, fontSize: 14, marginTop: 4 }}>
                  {stat.title}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Main Content */}
      <Row gutter={[20, 20]}>
        {/* Recent Tasks */}
        <Col xs={24} lg={14}>
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: colors.text.primary }}>
                  进行中的任务
                </h3>
                <p style={{ margin: 0, color: colors.text.secondary, fontSize: 13, marginTop: 2 }}>
                  共 {stats.tasks.delayed} 个任务延期中
                </p>
              </div>
              <div
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  background: 'rgba(24, 144, 255, 0.1)',
                  color: colors.primary,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
                onClick={() => window.location.href = '/dashboard/tasks'}
              >
                查看全部
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {stats.tasks.total > 0 ? (
                <div style={{ padding: 16, borderRadius: 12, background: colors.background.light }}>
                  <div style={{ fontWeight: 500, color: colors.text.primary, marginBottom: 4 }}>
                    任务总数: {stats.tasks.total}
                  </div>
                  <div style={{ fontSize: 13, color: colors.text.secondary }}>
                    延期任务: {stats.tasks.delayed}
                  </div>
                </div>
              ) : (
                <div style={{ padding: 16, color: colors.text.secondary, textAlign: 'center' }}>暂无任务数据</div>
              )}
            </div>
          </div>
        </Col>

        {/* Partner Assessment */}
        <Col xs={24} lg={10}>
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              marginBottom: 20,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: colors.text.primary }}>
                  合作伙伴评估
                </h3>
                <p style={{ margin: 0, color: colors.text.secondary, fontSize: 13, marginTop: 2 }}>
                  本季度评估结果
                </p>
              </div>
              <CalendarOutlined style={{ color: colors.text.secondary, fontSize: 20 }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ padding: 16, borderRadius: 12, background: colors.background.light }}>
                <div style={{ fontWeight: 500, color: colors.text.primary, marginBottom: 4 }}>
                  评估总数: {stats.assessments.totalAssessments}
                </div>
                <div style={{ fontSize: 13, color: colors.text.secondary }}>
                  已完成: {stats.assessments.completedAssessments}
                </div>
              </div>
            </div>
          </div>
        </Col>

        {/* Risk Overview */}
        <Col xs={24} lg={14}>
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: colors.text.primary }}>
                  风险概览
                </h3>
                <p style={{ margin: 0, color: colors.text.secondary, fontSize: 13, marginTop: 2 }}>
                  各类型风险统计
                </p>
              </div>
              <ThunderboltOutlined style={{ color: colors.warning, fontSize: 20 }} />
            </div>

            <Row gutter={16}>
              {stats.risks.byLevel ? stats.risks.byLevel.map((level: any, index: number) => (
                <Col span={8} key={index}>
                  <div
                    style={{
                      padding: 20,
                      borderRadius: 12,
                      background: colors.background.light,
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        margin: '0 auto 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background:
                          level.level === 'HIGH'
                            ? 'rgba(255, 77, 79, 0.1)'
                            : level.level === 'MEDIUM'
                            ? 'rgba(250, 173, 20, 0.1)'
                            : 'rgba(82, 196, 26, 0.1)',
                        color:
                          level.level === 'HIGH'
                            ? colors.error
                            : level.level === 'MEDIUM'
                            ? colors.warning
                            : colors.success,
                        fontSize: 20,
                        fontWeight: 700,
                      }}
                    >
                      {level.count}
                    </div>
                    <div style={{ fontSize: 14, color: colors.text.secondary, marginBottom: 4 }}>
                      {level.level === 'HIGH' ? '高风险' : level.level === 'MEDIUM' ? '中风险' : '低风险'}
                    </div>
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        borderRadius: 10,
                        fontSize: 11,
                        fontWeight: 500,
                        background:
                          level.level === 'HIGH'
                            ? 'rgba(255, 77, 79, 0.1)'
                            : level.level === 'MEDIUM'
                            ? 'rgba(250, 173, 20, 0.1)'
                            : 'rgba(82, 196, 26, 0.1)',
                        color:
                          level.level === 'HIGH'
                            ? colors.error
                            : level.level === 'MEDIUM'
                            ? colors.warning
                            : colors.success,
                      }}
                    >
                      {level.level}级
                    </div>
                  </div>
                </Col>
              )) : (
                <Col span={24}>
                  <div style={{ padding: 20, textAlign: 'center', color: colors.text.secondary }}>
                    共 {stats.risks.total} 个风险项
                  </div>
                </Col>
              )}
            </Row>
          </div>
        </Col>

        {/* Quick Actions */}
        <Col xs={24} lg={10}>
          <div
            style={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, #764ba2 100%)`,
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              height: '100%',
            }}
          >
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 16 }}>
              快捷操作
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: '新增开发人员', href: '/dashboard/developers' },
                { label: '创建任务', href: '/dashboard/tasks' },
                { label: '发起评估', href: '/dashboard/assessments' },
                { label: '添加风险项', href: '/dashboard/risks' },
              ].map((action) => (
                <div
                  key={action.label}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.15)',
                    color: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontWeight: 500,
                  }}
                  onClick={() => window.location.href = action.href}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  }}
                >
                  {action.label}
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
