import { Modal } from 'antd';
import type { ModalProps } from 'antd';

interface ConfirmModalProps extends Omit<ModalProps, 'onOk' | 'onCancel'> {
  visible: boolean;
  title?: string;
  content?: React.ReactNode;
  onOk: () => void;
  onCancel: () => void;
  okText?: string;
  cancelText?: string;
  okType?: 'primary' | 'danger' | 'default';
  loading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title = '确认操作',
  content = '您确定要执行此操作吗？',
  onOk,
  onCancel,
  okText = '确定',
  cancelText = '取消',
  okType = 'primary',
  loading = false,
  ...rest
}) => {
  return (
    <Modal
      title={title}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      okType={okType}
      confirmLoading={loading}
      destroyOnClose
      {...rest}
    >
      {content}
    </Modal>
  );
};

export default ConfirmModal;
