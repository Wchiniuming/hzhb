'use client';

import { useEffect, useState } from 'react';
import {
  Table, Button, Tag, Tooltip, Avatar, message,
  Modal, Form, Input, Select, Row, Col, Space, Popconfirm, Descriptions, Divider,
} from 'antd';
import {
  PlusOutlined, EditOutlined, EyeOutlined,
  DeleteOutlined, WarningOutlined, ExclamationCircleOutlined, CheckCircleOutlined,
  SafetyOutlined, CloseCircleOutlined,
} from '@ant-design/icons';
import { colors } from '@/lib/theme';
import api from '@/lib/api';

const AntdTable = Table as any;
const AntdButton = Button as any;
const AntdTag = Tag as any;
const AntdTooltip = Tooltip as any;
const AntdAvatar = Avatar as any;
const AntdModal = Modal as any;
const AntdForm = Form as any;
const AntdInput = Input as any;
const AntdSelect = Select as any;
const AntdSpace = Space as any;
const AntdPopconfirm = Popconfirm as any;
const AntdDescriptions = Descriptions as any;
const AntdDivider = Divider as any;
const AntdTextArea = Input.TextArea as any;

const levelMap: Record<string, string> = {
  CRITICAL: '严重',
  HIGH: '高',
  MEDIUM: '中',
  LOW: '低',
};

const levelColors: Record<string, string> = {
  CRITICAL: '#ff4d4f',
  HIGH: colors.error,
  MEDIUM: colors.warning,
  LOW: colors.success,
};

const statusMap: Record<string, string> = {
  MONITORING: '监控中',
  HANDLING: '处理中',
  RESOLVED: '已解决',
  CLOSED: '已关闭',
};

const statusColors: Record<string, string> = {
  MONITORING: colors.primary,
  HANDLING: colors.warning,
  RESOLVED: colors.success,
  CLOSED: '#8c8c8c',
};

export default function RisksPage() {
  const [risks, setRisks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<any>(null);
  const [riskTypes, setRiskTypes] = useState<any[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [levelFilter, setLevelFilter] = useState<string>('');

  const [modalVisible, setModalVisible] = useState(false);
  const [editingRisk, setEditingRisk] = useState<any>(null);
  const [form] = AntdForm.useForm();

  const [detailVisible, setDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.risks.list({ page, limit: pageSize, typeId: typeFilter, level: levelFilter });
      setRisks(res.data.map((r: any) => ({ ...r, key: r.id })));
      setTotal(res.meta.total);
    } catch (err: any) {
      message.error(err.message || '获取风险列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.risks.getStats();
      setStats(res);
    } catch (e: any) {
      console.error('Failed to fetch stats:', e);
    }
  };

  const fetchRiskTypes = async () => {
    try {
      const res = await api.risks.listTypes();
      setRiskTypes(res || []);
    } catch (e: any) {
      console.error('Failed to fetch risk types:', e);
    }
  };

  useEffect(() => { fetchData(); }, [page, pageSize, typeFilter, levelFilter]);
  useEffect(() => { fetchStats(); fetchRiskTypes(); }, []);

  const handleAdd = () => {
    setEditingRisk(null);
    form.resetFields();
    form.setFieldsValue({ level: 'MEDIUM', status: 'MONITORING' });
    setModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingRisk(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      typeId: record.typeId,
      level: record.level,
      impact: record.impact,
      triggerConditions: record.triggerConditions,
      dispositionMeasures: record.dispositionMeasures,
      status: record.status,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.risks.remove(id);
      message.success('删除成功');
      fetchData();
      fetchStats();
    } catch (e: any) {
      message.error(e.message || '删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingRisk) {
        await api.risks.update(editingRisk.id, values);
        message.success('更新成功');
      } else {
        await api.risks.create(values);
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
      const res = await api.risks.get(record.id);
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
      title: '风险信息',
      key: 'info',
      width: 320,
      render: (_: any, record: any) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Tag style={{ background: `${levelColors[record.level]}15`, color: levelColors[record.level], border: 'none', fontSize: 11 }}>
              {levelMap[record.level] || record.level}
            </Tag>
            <Tag style={{ background: colors.background.light, color: colors.text.secondary, border: 'none', fontSize: 11 }}>
              {record.riskType?.name || '-'}
            </Tag>
          </div>
          <div style={{ fontWeight: 600, color: colors.text.primary, marginBottom: 2 }}>{record.name}</div>
          <div style={{ fontSize: 12, color: colors.text.secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>
            {record.description}
          </div>
        </div>
      ),
    },
    {
      title: '影响',
      key: 'impact',
      width: 160,
      render: (_: any, record: any) => (
        <Tooltip title={record.impact}>
          <span style={{ fontSize: 13, color: colors.text.secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block', maxWidth: 150 }}>
            {record.impact || '-'}
          </span>
        </Tooltip>
      ),
    },
    {
      title: '等级',
      key: 'level',
      width: 80,
      render: (_: any, record: any) => (
        <Tag style={{ background: `${levelColors[record.level]}15`, color: levelColors[record.level], border: 'none', borderRadius: 4 }}>
          {levelMap[record.level] || record.level}
        </Tag>
      ),
    },
    {
      title: '状态',
      key: 'status',
      width: 90,
      render: (_: any, record: any) => (
        <Tag style={{ background: `${statusColors[record.status]}15`, color: statusColors[record.status], border: 'none', borderRadius: 4 }}>
          {statusMap[record.status] || record.status}
        </Tag>
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
          <AntdPopconfirm title="确定删除该风险？" onConfirm={() => handleDelete(record.id)}>
            <AntdButton type="text" icon={<DeleteOutlined />} size="small" danger />
          </AntdPopconfirm>
        </AntdSpace>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, color: colors.text.primary, margin: 0, marginBottom: 4 }}>
          风险库管理
        </h1>
        <p style={{ color: colors.text.secondary, margin: 0, fontSize: 14 }}>
          识别、评估和管理项目风险，提前做好预防措施
        </p>
      </div>

      {stats && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          {[
            { label: '高风险', value: stats.byLevel?.find((s: any) => s.level === 'HIGH')?.count || 0, icon: ExclamationCircleOutlined, color: colors.error },
            { label: '中风险', value: stats.byLevel?.find((s: any) => s.level === 'MEDIUM')?.count || 0, icon: WarningOutlined, color: colors.warning },
            { label: '低风险', value: stats.byLevel?.find((s: any) => s.level === 'LOW')?.count || 0, icon: CheckCircleOutlined, color: colors.success },
            { label: '风险总数', value: stats.total || 0, icon: SafetyOutlined, color: colors.primary },
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
            <AntdSelect placeholder="风险类型" style={{ width: 140 }} allowClear value={typeFilter || undefined} onChange={v => { setTypeFilter(v || ''); setPage(1); }}>
              {riskTypes.map(t => <AntdSelect.Option key={t.id} value={t.id}>{t.name}</AntdSelect.Option>)}
            </AntdSelect>
            <AntdSelect placeholder="风险等级" style={{ width: 100 }} allowClear value={levelFilter || undefined} onChange={v => { setLevelFilter(v || ''); setPage(1); }}>
              {Object.entries(levelMap).map(([k, v]) => <AntdSelect.Option key={k} value={k}>{v}</AntdSelect.Option>)}
            </AntdSelect>
          </div>
          <AntdButton type="primary" icon={<PlusOutlined />} style={{ borderRadius: 8, background: `linear-gradient(135deg, ${colors.primary} 0%, #764ba2 100%)`, border: 'none' }} onClick={handleAdd}>
            新增风险
          </AntdButton>
        </div>

        <div style={{ padding: '0 24px' }}>
          <AntdTable columns={columns} dataSource={risks} loading={loading} pagination={{
            current: page, pageSize, total,
            showSizeChanger: true, showTotal: (t: number) => `共 ${t} 条`,
            onChange: (p, ps) => { setPage(p); setPageSize(ps || 10); },
          }} />
        </div>
      </div>

      <AntdModal title={editingRisk ? '编辑风险' : '新增风险'} open={modalVisible} onOk={handleSubmit} onCancel={() => setModalVisible(false)} width={560} okText="确定" cancelText="取消">
        <AntdForm form={form} layout="vertical" style={{ marginTop: 16 }}>
          <AntdForm.Item name="name" label="风险名称" rules={[{ required: true, message: '请输入风险名称' }]}>
            <AntdInput placeholder="请输入风险名称" />
          </AntdForm.Item>
          <Row gutter={12}>
            <Col span={12}>
              <AntdForm.Item name="typeId" label="风险类型" rules={[{ required: true, message: '请选择风险类型' }]}>
                <AntdSelect placeholder="选择风险类型">
                  {riskTypes.map(t => <AntdSelect.Option key={t.id} value={t.id}>{t.name}</AntdSelect.Option>)}
                </AntdSelect>
              </AntdForm.Item>
            </Col>
            <Col span={12}>
              <AntdForm.Item name="level" label="风险等级">
                <AntdSelect>{Object.entries(levelMap).map(([k, v]) => <AntdSelect.Option key={k} value={k}>{v}</AntdSelect.Option>)}</AntdSelect>
              </AntdForm.Item>
            </Col>
          </Row>
          <AntdForm.Item name="impact" label="影响描述">
            <AntdTextArea rows={2} placeholder="请输入影响描述" />
          </AntdForm.Item>
          <AntdForm.Item name="triggerConditions" label="触发条件">
            <AntdTextArea rows={2} placeholder="请输入触发条件" />
          </AntdForm.Item>
          <AntdForm.Item name="dispositionMeasures" label="处置措施">
            <AntdTextArea rows={2} placeholder="请输入处置措施" />
          </AntdForm.Item>
          {editingRisk && (
            <AntdForm.Item name="status" label="状态">
              <AntdSelect>{Object.entries(statusMap).map(([k, v]) => <AntdSelect.Option key={k} value={k}>{v}</AntdSelect.Option>)}</AntdSelect>
            </AntdForm.Item>
          )}
        </AntdForm>
      </AntdModal>

      <AntdDrawer title="风险详情" placement="right" width={560} open={detailVisible} onClose={() => setDetailVisible(false)}>
        {detailLoading ? <div style={{ textAlign: 'center', padding: 40 }}>加载中...</div> : detailData ? (
          <div>
            <AntdDescriptions column={2} bordered size="small">
              <AntdDescriptions.Item label="风险名称" span={2}><span style={{ fontWeight: 600 }}>{detailData.name}</span></AntdDescriptions.Item>
              <AntdDescriptions.Item label="风险类型" span={1}>{detailData.riskType?.name || '-'}</AntdDescriptions.Item>
              <AntdDescriptions.Item label="风险等级" span={1}>
                <Tag style={{ background: `${levelColors[detailData.level]}15`, color: levelColors[detailData.level], border: 'none' }}>
                  {levelMap[detailData.level] || detailData.level}
                </Tag>
              </AntdDescriptions.Item>
              <AntdDescriptions.Item label="状态" span={1}>
                <Tag style={{ background: `${statusColors[detailData.status]}15`, color: statusColors[detailData.status], border: 'none' }}>
                  {statusMap[detailData.status] || detailData.status}
                </Tag>
              </AntdDescriptions.Item>
              <AntdDescriptions.Item label="影响描述" span={2}>{detailData.impact || '-'}</AntdDescriptions.Item>
              <AntdDescriptions.Item label="触发条件" span={2}>{detailData.triggerConditions || '-'}</AntdDescriptions.Item>
              <AntdDescriptions.Item label="处置措施" span={2}>{detailData.dispositionMeasures || '-'}</AntdDescriptions.Item>
              <AntdDescriptions.Item label="描述" span={2}>{detailData.description || '-'}</AntdDescriptions.Item>
            </AntdDescriptions>
            <div style={{ marginTop: 24 }}>
              <AntdButton type="primary" icon={<EditOutlined />} onClick={() => { setDetailVisible(false); handleEdit(detailData); }}>编辑风险</AntdButton>
            </div>
          </div>
        ) : null}
      </AntdDrawer>
    </div>
  );
}
