import { Form, Select } from 'antd';
import type { FormItemProps, SelectProps } from 'antd';

interface FormSelectProps extends Omit<FormItemProps, 'children'> {
  selectProps?: SelectProps;
  options: { label: string; value: any }[];
  placeholder?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  rules = [],
  required = false,
  options,
  placeholder,
  selectProps,
  ...rest
}) => {
  const defaultPlaceholder = placeholder || `请选择${label}`;
  
  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      required={required}
      {...rest}
    >
      <Select placeholder={defaultPlaceholder} options={options} {...selectProps} />
    </Form.Item>
  );
};

export default FormSelect;
