import { message } from 'antd';

interface ErrorMessageProps {
  content?: string;
  duration?: number;
  onClose?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  content = '操作失败，请稍后重试！',
  duration = 3,
  onClose
}) => {
  message.error(content, duration, onClose);
  return null;
};

export const showError = (content?: string, duration?: number, onClose?: () => void) => {
  message.error(content || '操作失败，请稍后重试！', duration, onClose);
};

export default ErrorMessage;
