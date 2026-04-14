import { message } from 'antd';

interface SuccessMessageProps {
  content?: string;
  duration?: number;
  onClose?: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  content = '操作成功！',
  duration = 3,
  onClose
}) => {
  message.success(content, duration, onClose);
  return null;
};

export const showSuccess = (content?: string, duration?: number, onClose?: () => void) => {
  message.success(content || '操作成功！', duration, onClose);
};

export default SuccessMessage;
