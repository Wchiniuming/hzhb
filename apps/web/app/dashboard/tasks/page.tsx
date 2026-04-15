'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Table, Button, Tag, Progress, Tooltip, Avatar, App,
  Modal, Form, Input, Select, InputNumber, DatePicker, Row, Col, Space, Popconfirm, Descriptions, Divider, Drawer, Dropdown,
} from 'antd';
import {
  PlusOutlined, CalendarOutlined, EditOutlined, EyeOutlined,
  FileTextOutlined, TeamOutlined, DeleteOutlined, CheckCircleOutlined, ClockCircleOutlined,
} from '@ant-design/icons';
import { colors } from '@/lib/theme';
import api from '@/lib/api';
import dayjs from 'dayjs';

const AntdTable = Table as any;
const AntdButton = Button as any;
const AntdTag = Tag as any;
const AntdProgress = Progress as any;
const AntdTooltip = Tooltip as any;
const AntdAvatar = Avatar as any;
const AntdModal = Modal as any;
const AntdForm = Form as any;
const AntdInput = Input as any;
const AntdSelect = Select as any;
const AntdInputNumber = InputNumber as any;
const AntdDatePicker = DatePicker as any;
const AntdSpace = Space as any;
const AntdPopconfirm = Popconfirm as any;
const AntdDescriptions = Descriptions as any;
const AntdDivider = Divider as any;
const AntdTextArea = Input.TextArea as any;
const AntdDrawer = Drawer as any;
const AntdApp = App as any;
const AntdDropdown = Dropdown as any;

const priorityMap: Record<string, string> = {
  URGENT: '紧急',
  HIGH: '高',
  MEDIUM: '中',
  LOW: '低',
};

const priorityColors: Record<string, string> = {
  URGENT: colors.error,
  HIGH: colors.error,
  MEDIUM: colors.warning,
  LOW: colors.success,
};

const statusMap: Record<string, string> = {
  NOT_STARTED: '未开始',
  IN_PROGRESS: '进行中',
  COMPLETED: '已完成',
  DELAYED: '已延期',
  ACCEPTED: '已验收',
  CANCELLED: '已取消',
};

const statusColors: Record<string, string> = {
  NOT_STARTED: '#8c8c8c',
  IN_PROGRESS: colors.primary,
  COMPLETED: colors.success,
  DELAYED: colors.error,
  ACCEPTED: colors.success,
  CANCELLED: '#8c8c8c',
};

const taskTypeOptions = [
  { value: 'DEVELOPMENT', label: '开发' },
  { value: 'OPTIMIZATION', label: '优化' },
  { value: 'REFACTOR', label: '重构' },
  { value: 'SECURITY', label: '安全' },
];

const priorityOptions = [
  { value: 'URGENT', label: '紧急' },
  { value: 'HIGH', label: '高' },
  { value: 'MEDIUM', label: '中' },
  { value: 'LOW', label: '低' },
];

export default function TasksPage() {
  const { message } = AntdApp.useApp();
  const searchParams = useSearchParams();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<any>(null);
  const [partners, setPartners] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [form] = AntdForm.useForm();

  const [detailVisible, setDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.tasks.list({ page, limit: pageSize, status: statusFilter });
      setTasks(res.data.map((t: any) => ({ ...t, key: t.id })));
      setTotal(res.meta.total);
    } catch (err: any) {
      message.error(err.message || '获取任务列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.tasks.getStats();
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

  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      handleAdd();
      window.history.replaceState({}, '', '/dashboard/tasks');
    }
  }, [searchParams]);

  const handleAdd = () => {
    setEditingTask(null);
    form.resetFields();
    form.setFieldsValue({ status: 'NOT_STARTED', priority: 'MEDIUM', type: 'DEVELOPMENT' });
    setModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingTask(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      type: record.type,
      deliveryStandard: record.deliveryStandard,
      partnerId: record.partnerId,
      priority: record.priority,
      budget: record.budget,
      startDate: record.startDate ? dayjs(record.startDate) : null,
      endDate: record.endDate ? dayjs(record.endDate) : null,
      status: record.status,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.tasks.remove(id);
      message.success('删除成功');
      fetchData();
      fetchStats();
    } catch (e: any) {
      message.error(e.message || '删除失败');
    }
  };

  const handleSoftDelete = async (id: string) => {
    try {
      await api.tasks.softDelete(id);
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
      const { startDate, endDate, ...rest } = values;
      const submitData: any = { ...rest };
      
      if (startDate && startDate.isValid) {
        submitData.startDate = startDate.toDate().toISOString();
      }
      if (endDate && endDate.isValid) {
        submitData.endDate = endDate.toDate().toISOString();
      }

      if (editingTask) {
        await api.tasks.update(editingTask.id, submitData);
        message.success('更新成功');
      } else {
        await api.tasks.create(submitData);
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
      const res = await api.tasks.get(record.id);
      setDetailData(res);
    } catch (e: any) {
      message.error(e.message || '获取详情失败');
    } finally {
      setDetailLoading(false);
    }
  };

  const safeIndex = (key: string | number, i: number): number => {
    const n = parseInt(String(key), 10);
    return isNaN(n) ? i % 6 : (n + i) % 6;
  };

  const columns = [
    {
      title: '任务信息',
      key: 'info',
      width: 300,
      render: (_: any, record: any) => (
        <div>
          <div style={{ fontWeight: 600, color: colors.text.primary, marginBottom: 4 }}>
            {record.name}
          </div>
          <div style={{ fontSize: 12, color: colors.text.secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 280 }}>
            {record.description}
          </div>
        </div>
      ),
    },
    {
      title: '合作伙伴',
      key: 'partner',
      width: 120,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 28, height: 28, borderRadius: 6,
              background: colors.cardColors[safeIndex(record.key, 0)].gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 600, fontSize: 11,
            }}
          >
            {record.partner?.name?.charAt(0) || '-'}
          </div>
          <span style={{ fontSize: 13 }}>{record.partner?.name || '-'}</span>
        </div>
      ),
    },
    {
      title: '优先级',
      key: 'priority',
      width: 80,
      render: (_: any, record: any) => (
        <Tag style={{ background: `${priorityColors[record.priority]}15`, color: priorityColors[record.priority], border: 'none', borderRadius: 4 }}>
          {priorityMap[record.priority] || record.priority}
        </Tag>
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
      title: '截止日期',
      key: 'dates',
      width: 110,
      render: (_: any, record: any) => (
        <span style={{ fontSize: 12, color: colors.text.secondary }}>
          {record.endDate ? new Date(record.endDate).toLocaleDateString('zh-CN') : '-'}
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
          任务登记管理
        </h1>
        <p style={{ color: colors.text.secondary, margin: 0, fontSize: 14 }}>
          跟踪和管理所有合作伙伴的任务进度
        </p>
      </div>

      {stats && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          {[
            { label: '全部任务', value: stats.total || 0, icon: FileTextOutlined, color: colors.primary },
            { label: '进行中', value: stats.byStatus?.find((s: any) => s.status === 'IN_PROGRESS')?.count || 0, icon: ClockCircleOutlined, color: colors.info },
            { label: '已完成', value: stats.byStatus?.find((s: any) => s.status === 'COMPLETED')?.count || 0, icon: CheckCircleOutlined, color: colors.success },
            { label: '已延期', value: stats.byStatus?.find((s: any) => s.status === 'DELAYED')?.count || 0, icon: ClockCircleOutlined, color: colors.error },
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
            创建任务
          </AntdButton>
        </div>

        <div style={{ padding: '0 24px' }}>
          <AntdTable columns={columns} dataSource={tasks} loading={loading} pagination={{
            current: page, pageSize, total,
            showSizeChanger: true, showTotal: (t: number) => `共 ${t} 条`,
            onChange: (p, ps) => { setPage(p); setPageSize(ps || 10); },
          }} />
        </div>
      </div>

      <AntdModal title={editingTask ? '编辑任务' : '创建任务'} open={modalVisible} onOk={handleSubmit} onCancel={() => setModalVisible(false)} width={600} okText="确定" cancelText="取消">
        <AntdForm form={form} layout="vertical" style={{ marginTop: 16 }}>
          <AntdForm.Item name="name" label="任务名称" rules={[{ required: true, message: '请输入任务名称' }]}>
            <AntdInput placeholder="请输入任务名称" />
          </AntdForm.Item>
          <AntdForm.Item name="description" label="任务描述">
            <AntdTextArea rows={2} placeholder="请输入任务描述" />
          </AntdForm.Item>
          <Row gutter={12}>
            <Col span={12}>
              <AntdForm.Item name="partnerId" label="合作伙伴" rules={[{ required: true, message: '请选择合作伙伴' }]}>
                <AntdSelect placeholder="选择合作伙伴">
                  {partners.map(p => <AntdSelect.Option key={p.id} value={p.id}>{p.name}</AntdSelect.Option>)}
                </AntdSelect>
              </AntdForm.Item>
            </Col>
            <Col span={12}>
              <AntdForm.Item name="type" label="任务类型">
                <AntdSelect>{taskTypeOptions.map(o => <AntdSelect.Option key={o.value} value={o.value}>{o.label}</AntdSelect.Option>)}</AntdSelect>
              </AntdForm.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <AntdForm.Item name="priority" label="优先级">
                <AntdSelect>{priorityOptions.map(o => <AntdSelect.Option key={o.value} value={o.value}>{o.label}</AntdSelect.Option>)}</AntdSelect>
              </AntdForm.Item>
            </Col>
            <Col span={12}>
              <AntdForm.Item name="budget" label="预算">
                <AntdInputNumber style={{ width: '100%' }} placeholder="请输入预算" min={0} />
              </AntdForm.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <AntdForm.Item name="startDate" label="开始日期">
                <AntdDatePicker style={{ width: '100%' }} />
              </AntdForm.Item>
            </Col>
            <Col span={12}>
              <AntdForm.Item name="endDate" label="结束日期">
                <AntdDatePicker style={{ width: '100%' }} />
              </AntdForm.Item>
            </Col>
          </Row>
          <AntdForm.Item name="deliveryStandard" label="交付标准">
            <AntdTextArea rows={2} placeholder="请输入交付标准" />
          </AntdForm.Item>
          {editingTask && (
            <AntdForm.Item name="status" label="状态">
              <AntdSelect>{Object.entries(statusMap).map(([k, v]) => <AntdSelect.Option key={k} value={k}>{v}</AntdSelect.Option>)}</AntdSelect>
            </AntdForm.Item>
          )}
        </AntdForm>
      </AntdModal>

      <AntdDrawer title="任务详情" placement="right" width={600} open={detailVisible} onClose={() => setDetailVisible(false)}>
        {detailLoading ? <div style={{ textAlign: 'center', padding: 40 }}>加载中...</div> : detailData ? (
          <div>
            <AntdDescriptions column={2} bordered size="small">
              <AntdDescriptions.Item label="任务名称" span={2}><span style={{ fontWeight: 600 }}>{detailData.name}</span></AntdDescriptions.Item>
              <AntdDescriptions.Item label="合作伙伴" span={1}>{detailData.partner?.name || '-'}</AntdDescriptions.Item>
              <AntdDescriptions.Item label="任务类型" span={1}>{detailData.type}</AntdDescriptions.Item>
              <AntdDescriptions.Item label="优先级" span={1}>
                <Tag style={{ background: `${priorityColors[detailData.priority]}15`, color: priorityColors[detailData.priority], border: 'none' }}>
                  {priorityMap[detailData.priority] || detailData.priority}
                </Tag>
              </AntdDescriptions.Item>
              <AntdDescriptions.Item label="状态" span={1}>
                <Tag style={{ background: `${statusColors[detailData.status]}15`, color: statusColors[detailData.status], border: 'none' }}>
                  {statusMap[detailData.status] || detailData.status}
                </Tag>
              </AntdDescriptions.Item>
              <AntdDescriptions.Item label="开始日期" span={1}>{detailData.startDate ? new Date(detailData.startDate).toLocaleDateString('zh-CN') : '-'}</AntdDescriptions.Item>
              <AntdDescriptions.Item label="结束日期" span={1}>{detailData.endDate ? new Date(detailData.endDate).toLocaleDateString('zh-CN') : '-'}</AntdDescriptions.Item>
              <AntdDescriptions.Item label="预算" span={2}>{detailData.budget ? `¥${detailData.budget}` : '-'}</AntdDescriptions.Item>
              <AntdDescriptions.Item label="描述" span={2}>{detailData.description || '-'}</AntdDescriptions.Item>
              <AntdDescriptions.Item label="交付标准" span={2}>{detailData.deliveryStandard || '-'}</AntdDescriptions.Item>
            </AntdDescriptions>
            <div style={{ marginTop: 24 }}>
              <AntdButton type="primary" icon={<EditOutlined />} onClick={() => { setDetailVisible(false); handleEdit(detailData); }}>编辑任务</AntdButton>
            </div>
          </div>
        ) : null}
      </AntdDrawer>
    </div>
  );
}
