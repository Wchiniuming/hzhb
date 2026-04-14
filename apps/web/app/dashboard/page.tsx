'use client';

import { Row, Col, Progress } from 'antd';
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

const AntdProgress = Progress as any;

const statCards = [
  {
    title: '开发人员总数',
    value: 128,
    change: '+12%',
    trend: 'up',
    icon: TeamOutlined,
    gradient: colors.cardColors[0].gradient,
    iconBg: 'rgba(102, 126, 234, 0.15)',
    iconColor: '#667eea',
  },
  {
    title: '进行中任务',
    value: 56,
    change: '+8%',
    trend: 'up',
    icon: FileTextOutlined,
    gradient: colors.cardColors[1].gradient,
    iconBg: 'rgba(17, 153, 142, 0.15)',
    iconColor: '#11998e',
  },
  {
    title: '已完成评估',
    value: 23,
    change: '-3%',
    trend: 'down',
    icon: CheckCircleOutlined,
    gradient: colors.cardColors[2].gradient,
    iconBg: 'rgba(240, 147, 251, 0.15)',
    iconColor: '#f093fb',
  },
  {
    title: '风险项总数',
    value: 12,
    change: '-5%',
    trend: 'down',
    icon: WarningOutlined,
    gradient: colors.cardColors[3].gradient,
    iconBg: 'rgba(79, 172, 254, 0.15)',
    iconColor: '#4facfe',
  },
];

const recentTasks = [
  { name: '订单系统微服务升级', partner: '华钦科技', progress: 75, status: '进行中' },
  { name: '移动端UI优化', partner: '博雅软件', progress: 45, status: '进行中' },
  { name: '数据报表功能开发', partner: '华钦科技', progress: 100, status: '已完成' },
  { name: 'API接口重构', partner: '创新科技', progress: 30, status: '进行中' },
];

const partners = [
  { name: '华钦科技', score: 92, level: 'A级' },
  { name: '博雅软件', score: 85, level: 'B级' },
  { name: '创新科技', score: 78, level: 'B级' },
  { name: '未来数字', score: 88, level: 'A级' },
];

const riskItems = [
  { name: '人员流动风险', level: '高', count: 3 },
  { name: '技术方案风险', level: '中', count: 5 },
  { name: '进度延期风险', level: '低', count: 8 },
];

export default function DashboardPage() {
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
                  {stat.change}
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
                  共 {recentTasks.filter(t => t.status === '进行中').length} 个任务进行中
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
                }}
              >
                查看全部
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {recentTasks.map((task, index) => (
                <div
                  key={index}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    background: colors.background.light,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, color: colors.text.primary, marginBottom: 4 }}>
                      {task.name}
                    </div>
                    <div style={{ fontSize: 13, color: colors.text.secondary }}>
                      {task.partner}
                    </div>
                  </div>
                  <div style={{ width: 200, marginRight: 16 }}>
                    <AntdProgress
                      percent={task.progress}
                      size="small"
                      strokeColor={task.progress === 100 ? colors.success : colors.primary}
                      showInfo={false}
                    />
                  </div>
                  <div
                    style={{
                      padding: '4px 12px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 500,
                      background: task.status === '已完成' ? 'rgba(82, 196, 26, 0.1)' : 'rgba(24, 144, 255, 0.1)',
                      color: task.status === '已完成' ? colors.success : colors.primary,
                    }}
                  >
                    {task.status}
                  </div>
                </div>
              ))}
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
              {partners.map((partner, index) => (
                <div
                  key={index}
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    background: colors.background.light,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: colors.cardColors[index].gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      {partner.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, color: colors.text.primary, fontSize: 14 }}>
                        {partner.name}
                      </div>
                      <div style={{ fontSize: 12, color: colors.text.secondary }}>
                        {partner.level}级合作伙伴
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: colors.text.primary }}>
                      {partner.score}
                    </div>
                    <div style={{ fontSize: 12, color: colors.text.secondary }}>综合评分</div>
                  </div>
                </div>
              ))}
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
              {riskItems.map((risk, index) => (
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
                          risk.level === '高'
                            ? 'rgba(255, 77, 79, 0.1)'
                            : risk.level === '中'
                            ? 'rgba(250, 173, 20, 0.1)'
                            : 'rgba(82, 196, 26, 0.1)',
                        color:
                          risk.level === '高'
                            ? colors.error
                            : risk.level === '中'
                            ? colors.warning
                            : colors.success,
                        fontSize: 20,
                        fontWeight: 700,
                      }}
                    >
                      {risk.count}
                    </div>
                    <div style={{ fontSize: 14, color: colors.text.secondary, marginBottom: 4 }}>
                      {risk.name}
                    </div>
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        borderRadius: 10,
                        fontSize: 11,
                        fontWeight: 500,
                        background:
                          risk.level === '高'
                            ? 'rgba(255, 77, 79, 0.1)'
                            : risk.level === '中'
                            ? 'rgba(250, 173, 20, 0.1)'
                            : 'rgba(82, 196, 26, 0.1)',
                        color:
                          risk.level === '高'
                            ? colors.error
                            : risk.level === '中'
                            ? colors.warning
                            : colors.success,
                      }}
                    >
                      {risk.level}风险
                    </div>
                  </div>
                </Col>
              ))}
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
              {['新增开发人员', '创建任务', '发起评估', '添加风险项'].map((action, index) => (
                <div
                  key={index}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.15)',
                    color: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  }}
                >
                  {action}
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
