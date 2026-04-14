import { Form, Input } from 'antd';
import type { FormItemProps, InputProps } from 'antd';

interface FormInputProps extends Omit<FormItemProps, 'children'> {
  inputProps?: InputProps;
  placeholder?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  rules = [],
  required = false,
  placeholder,
  inputProps,
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
      <Input placeholder={defaultPlaceholder} {...inputProps} />
    </Form.Item>
  );
};

export default FormInput;
