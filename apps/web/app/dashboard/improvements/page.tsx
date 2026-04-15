'use client';

import { useEffect, useState } from 'react';
import {
  Table, Button, Tag, Progress, Avatar, App,
  Modal, Form, Input, Select, DatePicker, Row, Col, Space, Popconfirm, Descriptions, Divider, Drawer, Dropdown,
} from 'antd';
import {
  PlusOutlined, EditOutlined, EyeOutlined,
  DeleteOutlined, RiseOutlined, ClockCircleOutlined, CheckCircleOutlined, FieldTimeOutlined,
} from '@ant-design/icons';
import { colors } from '@/lib/theme';
import api from '@/lib/api';
import dayjs from 'dayjs';

const AntdTable = Table as any;
const AntdButton = Button as any;
const AntdTag = Tag as any;
const AntdProgress = Progress as any;
const AntdAvatar = Avatar as any;
const AntdModal = Modal as any;
const AntdForm = Form as any;
const AntdInput = Input as any;
const AntdSelect = Select as any;
const AntdDatePicker = DatePicker as any;
const AntdSpace = Space as any;
const AntdPopconfirm = Popconfirm as any;
const AntdDescriptions = Descriptions as any;
const AntdDivider = Divider as any;
const AntdTextArea = Input.TextArea as any;
const AntdDrawer = Drawer as any;
const AntdDropdown = Dropdown as any;

const statusMap: Record<string, string> = {
  IDENTIFIED: '已识别',
  PLANNING: '制定中',
  IN_PROGRESS: '进行中',
  COMPLETED: '已完成',
  ACCEPTED: '已验收',
};

const statusColors: Record<string, string> = {
  IDENTIFIED: colors.warning,
  PLANNING: colors.warning,
  IN_PROGRESS: colors.primary,
  COMPLETED: colors.success,
  ACCEPTED: colors.success,
};

const originMap: Record<string, string> = {
  ASSESSMENT: '评估触发',
  TASK_DELAY: '任务延期',
  RISK: '风险触发',
  AUDIT: '审计触发',
};

const responsibleTypeMap: Record<string, string> = {
  PARTNER: '合作伙伴',
  DEVELOPER: '开发人员',
  TEAM: '团队',
};

export default function ImprovementsPage() {
  const { message } = App.useApp();
  const [improvements, setImprovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<any>(null);
  const [partners, setPartners] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const [modalVisible, setModalVisible] = useState(false);
  const [editingImprovement, setEditingImprovement] = useState<any>(null);
  const [form] = AntdForm.useForm();

  const [detailVisible, setDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.improvements.listRequirements({ page, limit: pageSize, status: statusFilter });
      setImprovements(res.data.map((r: any) => ({ ...r, key: r.id })));
      setTotal(res.meta.total);
    } catch (err: any) {
      message.error(err.message || '获取改进项列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.improvements.getStats();
      setStats(res);
    } catch (e: any) {
      console.error('Failed to fetch stats:', e);
    }
  };

  const fetchPartners = async () => {
    try {
      const res = await api.partners.list({ limit: 100 });
      setPartners(res.data || []);
    } catch (e: any) {
      console.error('Failed to fetch partners:', e);
    }
  };

  useEffect(() => { fetchData(); }, [page, pageSize, statusFilter]);
  useEffect(() => { fetchStats(); fetchPartners(); }, []);

  const handleAdd = () => {
    setEditingImprovement(null);
    form.resetFields();
    form.setFieldsValue({ status: 'IDENTIFIED', responsibleType: 'PARTNER' });
    setModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingImprovement(record);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      originType: record.originType,
      targetDate: record.targetDate ? dayjs(record.targetDate) : null,
      responsibleType: record.responsibleType,
      responsibleId: record.responsibleId,
      status: record.status,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.improvements.removeRequirement(id);
      message.success('删除成功');
      fetchData();
      fetchStats();
    } catch (e: any) {
      message.error(e.message || '删除失败');
    }
  };

  const handleSoftDelete = async (id: string) => {
    try {
      await api.improvements.softDeleteRequirement(id);
      message.success('软删除成功');
      fetchData();
      fetchStats();
    } catch (e: any) {
      message.error(e.message || '软删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { targetDate, ...rest } = values;
      const submitData: any = { ...rest };
      
      if (targetDate && targetDate.isValid) {
        submitData.targetDate = targetDate.toDate().toISOString();
      }

      if (editingImprovement) {
        await api.improvements.updateRequirement(editingImprovement.id, submitData);
        message.success('更新成功');
      } else {
        await api.improvements.createRequirement(submitData);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchData();
      fetchStats();
    } catch (e: any) {
      if (e.errorFields) return;
      message.error(e.message || '操作失败');
    }
  };

  const handleViewDetail = async (record: any) => {
    setDetailLoading(true);
    setDetailVisible(true);
    try {
      const res = await api.improvements.getRequirement(record.id);
      setDetailData(res);
    } catch (e: any) {
      message.error(e.message || '获取详情失败');
    } finally {
      setDetailLoading(false);
    }
  };

  const getProgress = (record: any): number => {
    const status = record.status;
    if (status === 'COMPLETED' || status === 'ACCEPTED') return 100;
    if (status === 'IDENTIFIED') return 10;
    if (status === 'PLANNING') return 30;
    if (status === 'IN_PROGRESS') return 70;
    return 0;
  };

  const columns = [
    {
      title: '改进项',
      key: 'info',
      width: 300,
      render: (_: any, record: any) => (
        <div>
          <div style={{ fontWeight: 600, color: colors.text.primary, marginBottom: 4 }}>{record.title}</div>
          <div style={{ fontSize: 12, color: colors.text.secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 280 }}>
            {record.description}
          </div>
        </div>
      ),
    },
    {
      title: '来源',
      key: 'origin',
      width: 100,
      render: (_: any, record: any) => (
        <Tag style={{ background: colors.background.light, color: colors.text.secondary, border: 'none', borderRadius: 4, fontSize: 11 }}>
          {originMap[record.originType] || record.originType || '-'}
        </Tag>
      ),
    },
    {
      title: '负责人',
      key: 'responsible',
      width: 120,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AntdAvatar size={28} style={{ background: colors.cardColors[0].gradient, fontSize: 11 }}>
            {record.responsibleType === 'PARTNER' ? (record.partner?.name?.charAt(0) || 'P') : 'D'}
          </AntdAvatar>
          <span style={{ fontSize: 13 }}>
            {record.responsibleType === 'PARTNER' ? (record.partner?.name || '-') : responsibleTypeMap[record.responsibleType] || '-'}
          </span>
        </div>
      ),
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_: any, record: any) => (
        <Tag style={{ background: `${statusColors[record.status]}15`, color: statusColors[record.status], border: 'none', borderRadius: 4 }}>
          {statusMap[record.status] || record.status}
        </Tag>
      ),
    },
    {
      title: '进度',
      key: 'progress',
      width: 120,
      render: (_: any, record: any) => {
        const progress = getProgress(record);
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AntdProgress percent={progress} size="small" showInfo={false} style={{ width: 70 }} strokeColor={progress === 100 ? colors.success : colors.primary} />
            <span style={{ fontSize: 12, color: colors.text.secondary }}>{progress}%</span>
          </div>
        );
      },
    },
    {
      title: '截止日期',
      key: 'targetDate',
      width: 110,
      render: (_: any, record: any) => (
        <span style={{ fontSize: 12, color: colors.text.secondary }}>
          {record.targetDate ? new Date(record.targetDate).toLocaleDateString('zh-CN') : '-'}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: any) => (
        <AntdSpace size={2}>
          <AntdButton type="text" icon={<EyeOutlined />} size="small" onClick={() => handleViewDetail(record)} />
          <AntdButton type="text" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
          <AntdDropdown menu={{ items: [
            { key: 'soft', label: '软删除', onClick: () => handleSoftDelete(record.id) },
            { key: 'delete', label: '删除', danger: true, onClick: () => handleDelete(record.id) },
          ]}}>
            <AntdButton type="text" icon={<DeleteOutlined />} size="small" danger />
          </AntdDropdown>
        </AntdSpace>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, color: colors.text.primary, margin: 0, marginBottom: 4 }}>
          正向改进管理
        </h1>
        <p style={{ color: colors.text.secondary, margin: 0, fontSize: 14 }}>
          跟踪和管理合作伙伴的改进项，持续提升服务质量
        </p>
      </div>

      {stats && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          {[
            { label: '全部改进项', value: stats.total || 0, icon: RiseOutlined, color: colors.primary },
            { label: '进行中', value: stats.inProgress || 0, icon: ClockCircleOutlined, color: colors.info },
            { label: '已完成', value: stats.completed || 0, icon: CheckCircleOutlined, color: colors.success },
            { label: '待验收', value: stats.byStatus?.find((s: any) => s.status === 'ACCEPTED')?.count || 0, icon: FieldTimeOutlined, color: colors.warning },
          ].map((stat, i) => (
            <div key={i} style={{ flex: 1, padding: 16, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, fontSize: 20 }}>
                <stat.icon />
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: colors.text.primary, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: colors.text.secondary, marginTop: 2 }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: `1px solid ${colors.border.light}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AntdSelect placeholder="筛选状态" style={{ width: 120 }} allowClear value={statusFilter || undefined} onChange={v => { setStatusFilter(v || ''); setPage(1); }}>
              {Object.entries(statusMap).map(([k, v]) => <AntdSelect.Option key={k} value={k}>{v}</AntdSelect.Option>)}
            </AntdSelect>
          </div>
          <AntdButton type="primary" icon={<PlusOutlined />} style={{ borderRadius: 8, background: `linear-gradient(135deg, ${colors.primary} 0%, #764ba2 100%)`, border: 'none' }} onClick={handleAdd}>
            创建改进项
          </AntdButton>
        </div>

        <div style={{ padding: '0 24px' }}>
          <AntdTable columns={columns} dataSource={improvements} loading={loading} pagination={{
            current: page, pageSize, total,
            showSizeChanger: true, showTotal: (t: number) => `共 ${t} 条`,
            onChange: (p, ps) => { setPage(p); setPageSize(ps || 10); },
          }} />
        </div>
      </div>

      <AntdModal title={editingImprovement ? '编辑改进项' : '创建改进项'} open={modalVisible} onOk={handleSubmit} onCancel={() => setModalVisible(false)} width={560} okText="确定" cancelText="取消">
        <AntdForm form={form} layout="vertical" style={{ marginTop: 16 }}>
          <AntdForm.Item name="title" label="改进项标题" rules={[{ required: true, message: '请输入改进项标题' }]}>
            <AntdInput placeholder="请输入改进项标题" />
          </AntdForm.Item>
          <AntdForm.Item name="description" label="改进描述">
            <AntdTextArea rows={3} placeholder="请输入改进描述" />
          </AntdForm.Item>
          <Row gutter={12}>
            <Col span={12}>
              <AntdForm.Item name="originType" label="来源类型">
                <AntdSelect>{Object.entries(originMap).map(([k, v]) => <AntdSelect.Option key={k} value={k}>{v}</AntdSelect.Option>)}</AntdSelect>
              </AntdForm.Item>
            </Col>
            <Col span={12}>
              <AntdForm.Item name="targetDate" label="目标完成日期">
                <AntdDatePicker style={{ width: '100%' }} />
              </AntdForm.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <AntdForm.Item name="responsibleType" label="负责人类型">
                <AntdSelect>{Object.entries(responsibleTypeMap).map(([k, v]) => <AntdSelect.Option key={k} value={k}>{v}</AntdSelect.Option>)}</AntdSelect>
              </AntdForm.Item>
            </Col>
            <Col span={12}>
              <AntdForm.Item name="responsibleId" label="负责人">
                <AntdSelect placeholder="选择负责人" allowClear>
                  {partners.map(p => <AntdSelect.Option key={p.id} value={p.id}>{p.name}</AntdSelect.Option>)}
                </AntdSelect>
              </AntdForm.Item>
            </Col>
          </Row>
          {editingImprovement && (
            <AntdForm.Item name="status" label="状态">
              <AntdSelect>{Object.entries(statusMap).map(([k, v]) => <AntdSelect.Option key={k} value={k}>{v}</AntdSelect.Option>)}</AntdSelect>
            </AntdForm.Item>
          )}
        </AntdForm>
      </AntdModal>

      <AntdDrawer title="改进项详情" placement="right" width={560} open={detailVisible} onClose={() => setDetailVisible(false)}>
        {detailLoading ? <div style={{ textAlign: 'center', padding: 40 }}>加载中...</div> : detailData ? (
          <div>
            <AntdDescriptions column={2} bordered size="small">
              <AntdDescriptions.Item label="改进项标题" span={2}><span style={{ fontWeight: 600 }}>{detailData.title}</span></AntdDescriptions.Item>
              <AntdDescriptions.Item label="来源" span={1}>{originMap[detailData.originType] || detailData.originType || '-'}</AntdDescriptions.Item>
              <AntdDescriptions.Item label="负责人类型" span={1}>{responsibleTypeMap[detailData.responsibleType] || '-'}</AntdDescriptions.Item>
              <AntdDescriptions.Item label="负责人" span={1}>{detailData.partner?.name || '-'}</AntdDescriptions.Item>
              <AntdDescriptions.Item label="目标日期" span={1}>{detailData.targetDate ? new Date(detailData.targetDate).toLocaleDateString('zh-CN') : '-'}</AntdDescriptions.Item>
              <AntdDescriptions.Item label="状态" span={2}>
                <Tag style={{ background: `${statusColors[detailData.status]}15`, color: statusColors[detailData.status], border: 'none' }}>
                  {statusMap[detailData.status] || detailData.status}
                </Tag>
              </AntdDescriptions.Item>
              <AntdDescriptions.Item label="描述" span={2}>{detailData.description || '-'}</AntdDescriptions.Item>
            </AntdDescriptions>
            <div style={{ marginTop: 24 }}>
              <AntdButton type="primary" icon={<EditOutlined />} onClick={() => { setDetailVisible(false); handleEdit(detailData); }}>编辑改进项</AntdButton>
            </div>
          </div>
        ) : null}
      </AntdDrawer>
    </div>
  );
}
