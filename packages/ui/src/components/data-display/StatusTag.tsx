import { Tag } from 'antd';
import type { Status } from '../types';

interface StatusTagProps {
  status: Status;
  customText?: string;
}

const statusConfig: Record<Status, { color: string; text: string }> = {
  DRAFT: { color: 'default', text: '草稿' },
  PENDING_APPROVAL: { color: 'orange', text: '待审批' },
  APPROVED: { color: 'success', text: '已通过' },
  REJECTED: { color: 'error', text: '已驳回' },
  IN_PROGRESS: { color: 'processing', text: '进行中' },
  COMPLETED: { color: 'success', text: '已完成' },
  DELAYED: { color: 'error', text: '已延期' },
  CANCELLED: { color: 'default', text: '已取消' }
};

const StatusTag: React.FC<StatusTagProps> = ({ status, customText }) => {
  const config = statusConfig[status] || { color: 'default', text: status };
  return <Tag color={config.color}>{customText || config.text}</Tag>;
};

export default StatusTag;
