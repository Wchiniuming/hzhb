'use client';

import { useEffect, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import {
  Table, Button, Input, Tag, Avatar, Tooltip, App,
  Modal, Form, Select, InputNumber, Radio, Space, Drawer,
  Popconfirm, Descriptions, Divider, DatePicker, Card, Row, Col, Dropdown,
} from 'antd';
import {
  PlusOutlined, SearchOutlined, EditOutlined, EyeOutlined,
  MailOutlined, PhoneOutlined, ReloadOutlined, DeleteOutlined,
  UserOutlined, BankOutlined, CalendarOutlined, TrophyOutlined,
  ProjectOutlined, SafetyOutlined, CloseOutlined,
} from '@ant-design/icons';
import { colors } from '@/lib/theme';
import api from '@/lib/api';


const AntdTable = Table as any;
const AntdButton = Button as any;
const AntdInput = Input as any;
const AntdTag = Tag as any;
const AntdAvatar = Avatar as any;
const AntdTooltip = Tooltip as any;
const AntdModal = Modal as any;
const AntdForm = Form as any;
const AntdSelect = Select as any;
const AntdInputNumber = InputNumber as any;
const AntdRadio = Radio as any;
const AntdSpace = Space as any;
const AntdDrawer = Drawer as any;
const AntdPopconfirm = Popconfirm as any;
const AntdDescriptions = Descriptions as any;
const AntdDivider = Divider as any;
const AntdCard = Card as any;
const AntdRow = Row as any;
const AntdCol = Col as any;
const AntdDatePicker = DatePicker as any;
const AntdDropdown = Dropdown as any;

const statusMap: Record<string, string> = {
  PENDING: '待审核',
  ACTIVE: '在职',
  INACTIVE: '离职',
  LEASED: '借调中',
};

const statusColors: Record<string, string> = {
  PENDING: colors.warning,
  ACTIVE: colors.success,
  INACTIVE: colors.error,
  LEASED: colors.warning,
};

const levelColors: Record<string, string> = {
  SENIOR: '#722ed1',
  MIDDLE: colors.primary,
  JUNIOR: colors.info,
};

const proficiencyColors: Record<string, string> = {
  BEGINNER: colors.info,
  INTERMEDIATE: colors.primary,
  ADVANCED: colors.warning,
  EXPERT: colors.success,
};

const proficiencyLabels: Record<string, string> = {
  BEGINNER: '初级',
  INTERMEDIATE: '中级',
  ADVANCED: '高级',
  EXPERT: '专家',
};

const genderOptions = [
  { value: '男', label: '男' },
  { value: '女', label: '女' },
];

const statusOptions = [
  { value: 'PENDING', label: '待审核' },
  { value: 'ACTIVE', label: '在职' },
  { value: 'INACTIVE', label: '离职' },
  { value: 'LEASED', label: '借调中' },
];

const proficiencyOptions = [
  { value: 'BEGINNER', label: '初级' },
  { value: 'INTERMEDIATE', label: '中级' },
  { value: 'ADVANCED', label: '高级' },
  { value: 'EXPERT', label: '专家' },
];

function getColorSimple(map: Record<string, string>, key: string): string {
  return map[key] || '#8c8c8c';
}

interface DeveloperFormData {
  name: string;
  partnerId: string;
  gender?: string;
  age?: number;
  email?: string;
  phone?: string;
  status?: string;
  skillIds?: string[];
}

interface ExperienceFormData {
  projectName: string;
  role?: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

interface CertificateFormData {
  name: string;
  issuingBody?: string;
  issueDate: Date;
  expireDate?: Date;
}

export default function DevelopersPage() {
  const { message } = App.useApp();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [partnerFilter, setPartnerFilter] = useState<string>('');
  const [partners, setPartners] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingDeveloper, setEditingDeveloper] = useState<any>(null);
  const [form] = AntdForm.useForm();

  const [detailVisible, setDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [skills, setSkills] = useState<any[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const [expModalVisible, setExpModalVisible] = useState(false);
  const [expForm] = AntdForm.useForm();
  const [editingExp, setEditingExp] = useState<any>(null);

  const [certModalVisible, setCertModalVisible] = useState(false);
  const [certForm] = AntdForm.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.developers.list({ page, limit: pageSize, search, status: statusFilter, partnerId: partnerFilter });
      setData(res.data.map((d: any) => ({ ...d, key: d.id })));
      setTotal(res.meta.total);
    } catch (e: any) {
      message.error(e.message || '加载失败');
    } finally {
      setLoading(false);
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

  const fetchStats = async () => {
    try {
      const res = await api.developers.getStats();
      setStats(res);
    } catch (e: any) {
      console.error('Failed to fetch stats:', e);
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await api.developers.getAllSkills();
      setSkills(res || []);
    } catch (e: any) {
      console.error('Failed to fetch skills:', e);
    }
  };

  useEffect(() => { fetchData(); }, [page, pageSize, search, statusFilter, partnerFilter]);
  useEffect(() => { fetchPartners(); fetchStats(); fetchSkills(); }, []);

  const getSkills = (skillList: any[]) => skillList?.map((s: any) => s.skillTag?.name || s.name || s.skillName || String(s)) || [];

  const handleAdd = () => {
    setEditingDeveloper(null);
    setSelectedSkills([]);
    form.resetFields();
    form.setFieldsValue({ status: 'PENDING' });
    setModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingDeveloper(record);
    setSelectedSkills(record.skills?.map((s: any) => s.skillTagId) || []);
    const contact = record.contact ? (typeof record.contact === 'string' ? JSON.parse(record.contact) : record.contact) : {};
    form.setFieldsValue({
      name: record.name,
      partnerId: record.partnerId,
      gender: record.gender,
      age: record.age,
      email: contact.email,
      phone: contact.phone,
      status: record.status,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.developers.remove(id);
      message.success('删除成功');
      fetchData();
      fetchStats();
    } catch (e: any) {
      message.error(e.message || '删除失败');
    }
  };

  const handleSoftDelete = async (id: string) => {
    try {
      await api.developers.softDelete(id);
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
      const contact = {
        email: values.email,
        phone: values.phone,
      };
      const submitData = {
        ...values,
        contact,
        skillIds: selectedSkills,
      };

      if (editingDeveloper) {
        await api.developers.update(editingDeveloper.id, submitData);
        message.success('更新成功');
      } else {
        await api.developers.create(submitData);
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
      const res = await api.developers.get(record.id);
      if (res.contact && typeof res.contact === 'string') {
        res.contact = JSON.parse(res.contact);
      }
      setDetailData(res);
    } catch (e: any) {
      message.error(e.message || '获取详情失败');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleAddSkill = async (skillTagId: string, proficiency: string) => {
    if (!detailData) return;
    try {
      await api.developers.addSkill(detailData.id, { skillIds: [skillTagId], proficiency });
      message.success('技能添加成功');
      const res = await api.developers.get(detailData.id);
      if (res.contact && typeof res.contact === 'string') {
        res.contact = JSON.parse(res.contact);
      }
      setDetailData(res);
      fetchData();
    } catch (e: any) {
      message.error(e.message || '添加失败');
    }
  };

  const handleRemoveSkill = async (skillTagId: string) => {
    if (!detailData) return;
    try {
      await api.developers.removeSkill(detailData.id, skillTagId);
      message.success('技能移除成功');
      const res = await api.developers.get(detailData.id);
      if (res.contact && typeof res.contact === 'string') {
        res.contact = JSON.parse(res.contact);
      }
      setDetailData(res);
      fetchData();
    } catch (e: any) {
      message.error(e.message || '移除失败');
    }
  };

  const handleAddExperience = async () => {
    if (!detailData) return;
    try {
      const values = await expForm.validateFields();
      await api.developers.addExperience(detailData.id, {
        ...values,
        startDate: values.startDate ? values.startDate.toDate().toISOString() : undefined,
        endDate: values.endDate ? values.endDate.toDate().toISOString() : undefined,
      });
      message.success('项目经验添加成功');
      setExpModalVisible(false);
      expForm.resetFields();
      const res = await api.developers.get(detailData.id);
      if (res.contact && typeof res.contact === 'string') {
        res.contact = JSON.parse(res.contact);
      }
      setDetailData(res);
    } catch (e: any) {
      if (e.errorFields) return;
      message.error(e.message || '添加失败');
    }
  };

  const handleAddCertificate = async () => {
    if (!detailData) return;
    try {
      const values = await certForm.validateFields();
      await api.developers.addCertificate(detailData.id, {
        ...values,
        issueDate: values.issueDate ? values.issueDate.toDate().toISOString() : undefined,
        expireDate: values.expireDate ? values.expireDate.toDate().toISOString() : undefined,
      });
      message.success('证书添加成功');
      setCertModalVisible(false);
      certForm.resetFields();
      const res = await api.developers.get(detailData.id);
      if (res.contact && typeof res.contact === 'string') {
        res.contact = JSON.parse(res.contact);
      }
      setDetailData(res);
    } catch (e: any) {
      if (e.errorFields) return;
      message.error(e.message || '添加失败');
    }
  };

  const availableSkills = useMemo(() => {
    if (!detailData) return skills;
    const usedIds = new Set(detailData.skills?.map((s: any) => s.skillTagId) || []);
    return skills.filter(s => !usedIds.has(s.id));
  }, [detailData, skills]);

  const columns = [
    {
      title: '开发人员',
      key: 'info',
      width: 220,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <AntdAvatar size={44} style={{ background: colors.cardColors[0].gradient, fontWeight: 600 }}>
            {record.name?.charAt(0) || 'D'}
          </AntdAvatar>
          <div>
            <div style={{ fontWeight: 600, color: colors.text.primary, marginBottom: 2 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: colors.text.secondary }}>{record.partner?.name || '-'}</div>
          </div>
        </div>
      ),
    },
    {
      title: '联系方式',
      key: 'contact',
      width: 180,
      render: (_: any, record: any) => {
        const contact = record.contact ? (typeof record.contact === 'string' ? JSON.parse(record.contact) : record.contact) : {};
        return (
          <div style={{ fontSize: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <MailOutlined style={{ color: colors.text.secondary }} />
              <span style={{ color: colors.text.secondary }}>{contact.email || '-'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <PhoneOutlined style={{ color: colors.text.secondary }} />
              <span style={{ color: colors.text.secondary }}>{contact.phone || '-'}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: '技能栈',
      key: 'skills',
      width: 200,
      render: (_: any, record: any) => {
        const skillList = record.skills || [];
        const displaySkills = skillList.slice(0, 2);
        const remaining = skillList.length - 2;
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {displaySkills.map((s: any, i: number) => (
              <AntdTag key={i} style={{ borderRadius: 4, background: colors.background.light, color: colors.text.primary, border: 'none', fontSize: 12 }}>
                {s.skillTag?.name || s.name || s}
              </AntdTag>
            ))}
            {remaining > 0 && (
              <AntdTooltip title={skillList.slice(2).map((s: any) => s.skillTag?.name || s.name || s).join(', ')}>
                <AntdTag style={{ borderRadius: 4, background: colors.background.light, color: colors.text.secondary, border: 'none', cursor: 'pointer', fontSize: 12 }}>
                  +{remaining}
                </AntdTag>
              </AntdTooltip>
            )}
          </div>
        );
      },
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_: any, record: any) => {
        const status = record.status || 'PENDING';
        return (
          <AntdTag style={{ borderRadius: 6, background: `${getColorSimple(statusColors, status)}15`, color: getColorSimple(statusColors, status), border: 'none', fontWeight: 500 }}>
            {statusMap[status] || status}
          </AntdTag>
        );
      },
    },
    {
      title: '入职时间',
      key: 'createdAt',
      width: 120,
      render: (_: any, record: any) => (
        <span style={{ color: colors.text.secondary, fontSize: 13 }}>
          {record.createdAt ? new Date(record.createdAt).toLocaleDateString('zh-CN') : '-'}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      render: (_: any, record: any) => (
        <AntdSpace size={4}>
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
          开发人员管理
        </h1>
        <p style={{ color: colors.text.secondary, margin: 0, fontSize: 14 }}>
          管理所有合作伙伴的开发人员信息
        </p>
      </div>

      {stats && (
        <AntdRow gutter={16} style={{ marginBottom: 24 }}>
          <AntdCol span={6}>
            <AntdCard size="small" style={{ borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${colors.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.primary }}>
                  <UserOutlined style={{ fontSize: 24 }} />
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: colors.text.primary }}>{stats.total || 0}</div>
                  <div style={{ fontSize: 13, color: colors.text.secondary }}>开发人员总数</div>
                </div>
              </div>
            </AntdCard>
          </AntdCol>
          <AntdCol span={6}>
            <AntdCard size="small" style={{ borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${colors.success}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.success }}>
                  <UserOutlined style={{ fontSize: 24 }} />
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: colors.text.primary }}>
                    {stats.byStatus?.find((s: any) => s.status === 'ACTIVE')?.count || 0}
                  </div>
                  <div style={{ fontSize: 13, color: colors.text.secondary }}>在职人员</div>
                </div>
              </div>
            </AntdCard>
          </AntdCol>
          <AntdCol span={6}>
            <AntdCard size="small" style={{ borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${colors.warning}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.warning }}>
                  <BankOutlined style={{ fontSize: 24 }} />
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: colors.text.primary }}>{stats.byPartner?.length || 0}</div>
                  <div style={{ fontSize: 13, color: colors.text.secondary }}>合作公司数量</div>
                </div>
              </div>
            </AntdCard>
          </AntdCol>
          <AntdCol span={6}>
            <AntdCard size="small" style={{ borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${colors.info}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.info }}>
                  <TrophyOutlined style={{ fontSize: 24 }} />
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: colors.text.primary }}>
                    {stats.topSkills?.[0]?.skillName || '-'}
                  </div>
                  <div style={{ fontSize: 13, color: colors.text.secondary }}>热门技能</div>
                </div>
              </div>
            </AntdCard>
          </AntdCol>
        </AntdRow>
      )}

      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${colors.border.light}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <AntdInput
              placeholder="搜索姓名..."
              prefix={<SearchOutlined style={{ color: colors.text.secondary }} />}
              style={{ width: 200, borderRadius: 8 }}
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              allowClear
            />
            <AntdSelect
              placeholder="筛选状态"
              style={{ width: 120 }}
              value={statusFilter || undefined}
              onChange={v => { setStatusFilter(v || ''); setPage(1); }}
              allowClear
            >
              {statusOptions.map(o => <AntdSelect.Option key={o.value} value={o.value}>{o.label}</AntdSelect.Option>)}
            </AntdSelect>
            <AntdSelect
              placeholder="筛选公司"
              style={{ width: 150 }}
              value={partnerFilter || undefined}
              onChange={v => { setPartnerFilter(v || ''); setPage(1); }}
              allowClear
            >
              {partners.map(p => <AntdSelect.Option key={p.id} value={p.id}>{p.name}</AntdSelect.Option>)}
            </AntdSelect>
            <AntdButton icon={<ReloadOutlined />} onClick={fetchData}>刷新</AntdButton>
          </div>
          <AntdButton
            type="primary"
            icon={<PlusOutlined />}
            style={{ borderRadius: 8, background: `linear-gradient(135deg, ${colors.primary} 0%, #764ba2 100%)`, border: 'none' }}
            onClick={handleAdd}
          >
            新增开发人员
          </AntdButton>
        </div>

        <div style={{ padding: '0 24px' }}>
          <AntdTable
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={{
              current: page,
              pageSize,
              total,
              showSizeChanger: true,
              showTotal: (t: number) => `共 ${t} 条`,
              onChange: (p, ps) => { setPage(p); setPageSize(ps || 10); },
            }}
          />
        </div>
      </div>

      <AntdModal
        title={editingDeveloper ? '编辑开发人员' : '新增开发人员'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={520}
        okText="确定"
        cancelText="取消"
      >
        <AntdForm form={form} layout="vertical" style={{ marginTop: 16 }}>
          <AntdForm.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
            <AntdInput placeholder="请输入姓名" />
          </AntdForm.Item>
          <AntdForm.Item name="partnerId" label="所属公司" rules={[{ required: true, message: '请选择所属公司' }]}>
            <AntdSelect placeholder="请选择所属公司">
              {partners.map(p => <AntdSelect.Option key={p.id} value={p.id}>{p.name}</AntdSelect.Option>)}
            </AntdSelect>
          </AntdForm.Item>
          <AntdRow gutter={12}>
            <AntdCol span={12}>
              <AntdForm.Item name="gender" label="性别">
                <AntdSelect placeholder="请选择性别" options={genderOptions} />
              </AntdForm.Item>
            </AntdCol>
            <AntdCol span={12}>
              <AntdForm.Item name="age" label="年龄">
                <AntdInputNumber placeholder="请输入年龄" min={18} max={65} style={{ width: '100%' }} />
              </AntdForm.Item>
            </AntdCol>
          </AntdRow>
          <AntdRow gutter={12}>
            <AntdCol span={12}>
              <AntdForm.Item name="email" label="邮箱">
                <AntdInput placeholder="请输入邮箱" />
              </AntdForm.Item>
            </AntdCol>
            <AntdCol span={12}>
              <AntdForm.Item name="phone" label="电话">
                <AntdInput placeholder="请输入电话" />
              </AntdForm.Item>
            </AntdCol>
          </AntdRow>
          <AntdForm.Item name="status" label="状态">
            <AntdRadio.Group>
              {statusOptions.map(o => <AntdRadio key={o.value} value={o.value}>{o.label}</AntdRadio>)}
            </AntdRadio.Group>
          </AntdForm.Item>
          <AntdForm.Item label="技能">
            <AntdSelect
              mode="multiple"
              placeholder="选择技能"
              value={selectedSkills}
              onChange={setSelectedSkills}
              style={{ width: '100%' }}
            >
              {skills.map(s => <AntdSelect.Option key={s.id} value={s.id}>{s.name}</AntdSelect.Option>)}
            </AntdSelect>
          </AntdForm.Item>
        </AntdForm>
      </AntdModal>

      <AntdDrawer
        title="开发人员详情"
        placement="right"
        width={640}
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        extra={
          <AntdButton type="primary" icon={<EditOutlined />} onClick={() => { setDetailVisible(false); handleEdit(detailData); }}>
            编辑
          </AntdButton>
        }
      >
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>加载中...</div>
        ) : detailData ? (
          <div>
            <AntdDescriptions column={2} bordered size="small">
              <AntdDescriptions.Item label="姓名" span={1}>{detailData.name}</AntdDescriptions.Item>
              <AntdDescriptions.Item label="所属公司" span={1}>{detailData.partner?.name || '-'}</AntdDescriptions.Item>
              <AntdDescriptions.Item label="性别" span={1}>{detailData.gender || '-'}</AntdDescriptions.Item>
              <AntdDescriptions.Item label="年龄" span={1}>{detailData.age || '-'}</AntdDescriptions.Item>
              <AntdDescriptions.Item label="邮箱" span={1}>{detailData.contact?.email || '-'}</AntdDescriptions.Item>
              <AntdDescriptions.Item label="电话" span={1}>{detailData.contact?.phone || '-'}</AntdDescriptions.Item>
              <AntdDescriptions.Item label="状态" span={2}>
                <AntdTag style={{ background: `${getColorSimple(statusColors, detailData.status)}15`, color: getColorSimple(statusColors, detailData.status), border: 'none' }}>
                  {statusMap[detailData.status] || detailData.status}
                </AntdTag>
              </AntdDescriptions.Item>
              <AntdDescriptions.Item label="入职时间" span={2}>{detailData.createdAt ? new Date(detailData.createdAt).toLocaleDateString('zh-CN') : '-'}</AntdDescriptions.Item>
            </AntdDescriptions>

            <AntdDivider orientation="left">
              <ProjectOutlined style={{ marginRight: 8 }} />
              项目经验
              <Button type="link" size="small" onClick={() => setExpModalVisible(true)} style={{ marginLeft: 8 }}>+ 添加</Button>
            </AntdDivider>
            {detailData.experiences?.length > 0 ? (
              detailData.experiences.map((exp: any, i: number) => (
                <AntdCard key={i} size="small" style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 600 }}>{exp.projectName}</div>
                  <div style={{ fontSize: 12, color: colors.text.secondary }}>
                    {exp.role && <span>{exp.role} | </span>}
                    {exp.startDate && <span>{new Date(exp.startDate).toLocaleDateString('zh-CN')}</span>}
                    {exp.endDate && <span> - {new Date(exp.endDate).toLocaleDateString('zh-CN')}</span>}
                    {!exp.endDate && <span> - 至今</span>}
                  </div>
                  {exp.description && <div style={{ fontSize: 13, marginTop: 4 }}>{exp.description}</div>}
                </AntdCard>
              ))
            ) : (
              <div style={{ color: colors.text.secondary, textAlign: 'center', padding: 16 }}>暂无项目经验</div>
            )}

            <AntdDivider orientation="left">
              <SafetyOutlined style={{ marginRight: 8 }} />
              证书
              <Button type="link" size="small" onClick={() => setCertModalVisible(true)} style={{ marginLeft: 8 }}>+ 添加</Button>
            </AntdDivider>
            {detailData.certificates?.length > 0 ? (
              detailData.certificates.map((cert: any, i: number) => (
                <AntdCard key={i} size="small" style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 600 }}>{cert.name}</div>
                  <div style={{ fontSize: 12, color: colors.text.secondary }}>
                    {cert.issuingBody && <span>{cert.issuingBody} | </span>}
                    颁发日期: {cert.issueDate && new Date(cert.issueDate).toLocaleDateString('zh-CN')}
                  </div>
                </AntdCard>
              ))
            ) : (
              <div style={{ color: colors.text.secondary, textAlign: 'center', padding: 16 }}>暂无证书</div>
            )}
          </div>
        ) : null}
      </AntdDrawer>

      <AntdModal
        title="添加项目经验"
        open={expModalVisible}
        onOk={handleAddExperience}
        onCancel={() => { setExpModalVisible(false); expForm.resetFields(); }}
        okText="确定"
        cancelText="取消"
      >
        <AntdForm form={expForm} layout="vertical" style={{ marginTop: 16 }}>
          <AntdForm.Item name="projectName" label="项目名称" rules={[{ required: true, message: '请输入项目名称' }]}>
            <AntdInput placeholder="请输入项目名称" />
          </AntdForm.Item>
          <AntdForm.Item name="role" label="担任角色">
            <AntdInput placeholder="请输入担任角色" />
          </AntdForm.Item>
          <AntdRow gutter={12}>
            <AntdCol span={12}>
              <AntdForm.Item name="startDate" label="开始时间" rules={[{ required: true, message: '请选择开始时间' }]}>
                <AntdDatePicker style={{ width: '100%' }} />
              </AntdForm.Item>
            </AntdCol>
            <AntdCol span={12}>
              <AntdForm.Item name="endDate" label="结束时间">
                <AntdDatePicker style={{ width: '100%' }} />
              </AntdForm.Item>
            </AntdCol>
          </AntdRow>
          <AntdForm.Item name="description" label="项目描述">
            <Input.TextArea rows={3} placeholder="请输入项目描述" />
          </AntdForm.Item>
        </AntdForm>
      </AntdModal>

      <AntdModal
        title="添加证书"
        open={certModalVisible}
        onOk={handleAddCertificate}
        onCancel={() => { setCertModalVisible(false); certForm.resetFields(); }}
        okText="确定"
        cancelText="取消"
      >
        <AntdForm form={certForm} layout="vertical" style={{ marginTop: 16 }}>
          <AntdForm.Item name="name" label="证书名称" rules={[{ required: true, message: '请输入证书名称' }]}>
            <AntdInput placeholder="请输入证书名称" />
          </AntdForm.Item>
          <AntdForm.Item name="issuingBody" label="颁发机构">
            <AntdInput placeholder="请输入颁发机构" />
          </AntdForm.Item>
          <AntdRow gutter={12}>
            <AntdCol span={12}>
              <AntdForm.Item name="issueDate" label="颁发日期" rules={[{ required: true, message: '请选择颁发日期' }]}>
                <AntdDatePicker style={{ width: '100%' }} />
              </AntdForm.Item>
            </AntdCol>
            <AntdCol span={12}>
              <AntdForm.Item name="expireDate" label="有效期至">
                <AntdDatePicker style={{ width: '100%' }} />
              </AntdForm.Item>
            </AntdCol>
          </AntdRow>
        </AntdForm>
      </AntdModal>
    </div>
  );
}
