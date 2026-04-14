import { Form, Input } from 'antd';

interface FormTextAreaProps extends Omit<React.ComponentProps<typeof Form.Item>, 'children'> {
  textAreaProps?: React.ComponentProps<typeof Input.TextArea>;
  placeholder?: string;
  rows?: number;
}

const FormTextArea: React.FC<FormTextAreaProps> = ({
  name,
  label,
  rules = [],
  required = false,
  placeholder,
  rows = 4,
  textAreaProps,
  ...rest
}) => {
  const defaultPlaceholder = placeholder || `请输入${label}`;
  
  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      required={required}
      {...rest}
    >
      <Input.TextArea rows={rows} placeholder={defaultPlaceholder} {...textAreaProps} />
    </Form.Item>
  );
};

export default FormTextArea;