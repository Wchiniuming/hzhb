'use client';

import { useEffect, useState } from 'react';
import {
  Table, Button, Tag, Progress, Row, Col, App,
  Modal, Form, Input, Select, Space, Popconfirm, Descriptions, Drawer, Dropdown,
} from 'antd';
import {
  PlusOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined,
  TeamOutlined, EditOutlined, EyeOutlined, AppstoreOutlined, DeleteOutlined,
  BankOutlined, CheckOutlined, StopOutlined,
} from '@ant-design/icons';
import { colors } from '@/lib/theme';
import api from '@/lib/api';

const AntdTable = Table as any;
const AntdButton = Button as any;
const AntdTag = Tag as any;
const AntdProgress = Progress as any;
const AntdModal = Modal as any;
const AntdForm = Form as any;
const AntdInput = Input as any;
const AntdSelect = Select as any;
const AntdSpace = Space as any;
const AntdPopconfirm = Popconfirm as any;
const AntdDescriptions = Descriptions as any;
const AntdDrawer = Drawer as any;
const AntdDropdown = Dropdown as any;

const statusMap: Record<string, string> = {
  ACTIVE: '合作中',
  INACTIVE: '已停用',
};

const statusColors: Record<string, string> = {
  ACTIVE: colors.success,
  INACTIVE: colors.error,
};

const defaultColor = { bg: 'rgba(0,0,0,0.04)', color: '#8c8c8c' };
function getColor(map: Record<string, { bg: string; color: string }>, key: string) {
  return map[key] || defaultColor;
}

function getStatusColor(status: string): string {
  return statusColors[status] || '#8c8c8c';
}

export default function PartnersPage() {
  const { message } = App.useApp();
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<any>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any>(null);
  const [form] = AntdForm.useForm();

  const [detailVisible, setDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.partners.list({ page, limit: pageSize });
      setPartners(res.data.map((p: any) => ({ ...p, key: p.id })));
      setTotal(res.meta.total);
    } catch (err: any) {
      message.error(err.message || '获取合作伙伴列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.partners.getStats();
      setStats(res);
    } catch (e: any) {
      console.error('Failed to fetch stats:', e);
    }
  };

  useEffect(() => { fetchData(); }, [page, pageSize]);
  useEffect(() => { fetchStats(); }, []);

  const handleAdd = () => {
    setEditingPartner(null);
    form.resetFields();
    form.setFieldsValue({ status: 'ACTIVE' });
    setModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingPartner(record);
    let contactInfo = {};
    try {
      if (record.contactInfo) {
        contactInfo = typeof record.contactInfo === 'string' ? JSON.parse(record.contactInfo) : record.contactInfo;
      }
    } catch (e) {}
    form.setFieldsValue({
      name: record.name,
      contactPerson: contactInfo.person || '',
      email: contactInfo.email || '',
      phone: contactInfo.phone || '',
      address: contactInfo.address || '',
      status: record.status,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.partners.remove(id);
      message.success('删除成功');
      fetchData();
      fetchStats();
    } catch (e: any) {
      message.error(e.message || '删除失败');
    }
  };

  const handleSoftDelete = async (id: string) => {
    try {
      await api.partners.softDelete(id);
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
      const contactInfo = {
        person: values.contactPerson,
        email: values.email,
        phone: values.phone,
        address: values.address,
      };

      if (editingPartner) {
        await api.partners.update(editingPartner.id, {
          name: values.name,
          contactInfo,
          status: values.status,
        });
        message.success('更新成功');
      } else {
        await api.partners.create({
          name: values.name,
          contactInfo,
          status: values.status,
        });
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
      const res = await api.partners.get(record.id);
      try {
        if (res.contactInfo && typeof res.contactInfo === 'string') {
          res.contactInfo = JSON.parse(res.contactInfo);
        }
      } catch (e) {}
      setDetailData(res);
    } catch (e: any) {
      message.error(e.message || '获取详情失败');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.partners.updateStatus(id, status);
      message.success('状态更新成功');
      fetchData();
      fetchStats();
      if (detailData?.id === id) {
        setDetailData({ ...detailData, status });
      }
    } catch (e: any) {
      message.error(e.message || '状态更新失败');
    }
  };

  const columns = [
    {
      title: '合作伙伴',
      key: 'info',
      width: 280,
      render: (_: any, record: any) => {
        let contactInfo = {};
        try {
          if (record.contactInfo) {
            contactInfo = typeof record.contactInfo === 'string' ? JSON.parse(record.contactInfo) : record.contactInfo;
          }
        } catch (e) {}
        return (
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
                  {contactInfo.address || '-'}
                </span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: '联系方式',
      key: 'contact',
      width: 200,
      render: (_: any, record: any) => {
        let contactInfo = {};
        try {
          if (record.contactInfo) {
            contactInfo = typeof record.contactInfo === 'string' ? JSON.parse(record.contactInfo) : record.contactInfo;
          }
        } catch (e) {}
        return (
          <div style={{ fontSize: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <MailOutlined style={{ color: colors.text.secondary }} />
              <span style={{ color: colors.text.secondary }}>{contactInfo.email || '-'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <PhoneOutlined style={{ color: colors.text.secondary }} />
              <span style={{ color: colors.text.secondary }}>{contactInfo.phone || '-'}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: '开发人员',
      key: 'developers',
      width: 100,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TeamOutlined style={{ color: colors.text.secondary }} />
          <span style={{ fontWeight: 600 }}>{record.developerCount || 0}</span>
          <span style={{ color: colors.text.secondary, fontSize: 13 }}>人</span>
        </div>
      ),
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_: any, record: any) => (
        <AntdTag
          style={{
            borderRadius: 6,
            background: `${getStatusColor(record.status)}15`,
            color: getStatusColor(record.status),
            border: 'none',
            fontWeight: 500,
          }}
        >
          {statusMap[record.status] || record.status}
        </AntdTag>
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
          合作伙伴管理
        </h1>
        <p style={{ color: colors.text.secondary, margin: 0, fontSize: 14 }}>
          管理所有合作伙伴的基本信息和合作情况
        </p>
      </div>

      {stats && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          {[
            { label: '合作伙伴总数', value: stats.total || 0, icon: AppstoreOutlined, gradient: colors.cardColors[0].gradient },
            { label: 'A级合作伙伴', value: stats.byStatus?.find((s: any) => s.status === 'A')?.count || 0, icon: CheckOutlined, gradient: colors.cardColors[1].gradient },
            { label: '合作中', value: stats.byStatus?.find((s: any) => s.status === 'ACTIVE')?.count || 0, icon: BankOutlined, gradient: colors.cardColors[2].gradient },
            { label: '已停用', value: stats.byStatus?.find((s: any) => s.status === 'INACTIVE')?.count || 0, icon: StopOutlined, gradient: colors.cardColors[3].gradient },
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
      )}

      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${colors.border.light}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 14, color: colors.text.secondary }}>
            共 {total} 个合作伙伴
          </div>
          <AntdButton
            type="primary"
            icon={<PlusOutlined />}
            style={{ borderRadius: 8, background: `linear-gradient(135deg, ${colors.primary} 0%, #764ba2 100%)`, border: 'none' }}
            onClick={handleAdd}
          >
            新增合作伙伴
          </AntdButton>
        </div>

        <div style={{ padding: '0 24px' }}>
          <AntdTable
            columns={columns}
            dataSource={partners}
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
        title={editingPartner ? '编辑合作伙伴' : '新增合作伙伴'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={480}
        okText="确定"
        cancelText="取消"
      >
        <AntdForm form={form} layout="vertical" style={{ marginTop: 16 }}>
          <AntdForm.Item name="name" label="合作伙伴名称" rules={[{ required: true, message: '请输入合作伙伴名称' }]}>
            <AntdInput placeholder="请输入合作伙伴名称" />
          </AntdForm.Item>
          <AntdForm.Item name="contactPerson" label="联系人">
            <AntdInput placeholder="请输入联系人姓名" />
          </AntdForm.Item>
          <Row gutter={12}>
            <Col span={12}>
              <AntdForm.Item name="email" label="邮箱">
                <AntdInput placeholder="请输入邮箱" />
              </AntdForm.Item>
            </Col>
            <Col span={12}>
              <AntdForm.Item name="phone" label="电话">
                <AntdInput placeholder="请输入联系电话" />
              </AntdForm.Item>
            </Col>
          </Row>
          <AntdForm.Item name="address" label="地址">
            <AntdInput placeholder="请输入公司地址" />
          </AntdForm.Item>
          <AntdForm.Item name="status" label="状态">
            <AntdSelect>
              <AntdSelect.Option value="ACTIVE">合作中</AntdSelect.Option>
              <AntdSelect.Option value="INACTIVE">已停用</AntdSelect.Option>
            </AntdSelect>
          </AntdForm.Item>
        </AntdForm>
      </AntdModal>

      <AntdDrawer
        title="合作伙伴详情"
        placement="right"
        width={560}
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
      >
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>加载中...</div>
        ) : detailData ? (
          <div>
            <AntdDescriptions column={2} bordered size="small">
              <AntdDescriptions.Item label="合作伙伴名称" span={2}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>{detailData.name}</span>
                </div>
              </AntdDescriptions.Item>
              <AntdDescriptions.Item label="联系人" span={1}>{detailData.contactInfo?.person || '-'}</AntdDescriptions.Item>
              <AntdDescriptions.Item label="状态" span={1}>
                <AntdTag style={{ background: `${getStatusColor(detailData.status)}15`, color: getStatusColor(detailData.status), border: 'none' }}>
                  {statusMap[detailData.status] || detailData.status}
                </AntdTag>
              </AntdDescriptions.Item>
              <AntdDescriptions.Item label="邮箱" span={1}>{detailData.contactInfo?.email || '-'}</AntdDescriptions.Item>
              <AntdDescriptions.Item label="电话" span={1}>{detailData.contactInfo?.phone || '-'}</AntdDescriptions.Item>
              <AntdDescriptions.Item label="地址" span={2}>{detailData.contactInfo?.address || '-'}</AntdDescriptions.Item>
              <AntdDescriptions.Item label="开发人员" span={1}>{detailData.developerCount || 0} 人</AntdDescriptions.Item>
              <AntdDescriptions.Item label="创建时间" span={1}>
                {detailData.createdAt ? new Date(detailData.createdAt).toLocaleDateString('zh-CN') : '-'}
              </AntdDescriptions.Item>
            </AntdDescriptions>

            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
              <AntdButton type="primary" icon={<EditOutlined />} onClick={() => { setDetailVisible(false); handleEdit(detailData); }}>
                编辑信息
              </AntdButton>
              {detailData.status === 'ACTIVE' ? (
                <AntdButton icon={<StopOutlined />} onClick={() => handleUpdateStatus(detailData.id, 'INACTIVE')}>
                  停用合作
                </AntdButton>
              ) : (
                <AntdButton type="primary" icon={<CheckOutlined />} onClick={() => handleUpdateStatus(detailData.id, 'ACTIVE')}>
                  恢复合作
                </AntdButton>
              )}
            </div>
          </div>
        ) : null}
      </AntdDrawer>
    </div>
  );
}
