import { Form, DatePicker } from 'antd';
import type { FormItemProps, DatePickerProps } from 'antd';
import dayjs from 'dayjs';

interface FormDatePickerProps extends Omit<FormItemProps, 'children'> {
  datePickerProps?: DatePickerProps;
  placeholder?: string;
  format?: string;
}

const FormDatePicker: React.FC<FormDatePickerProps> = ({
  name,
  label,
  rules = [],
  required = false,
  placeholder,
  format = 'YYYY-MM-DD',
  datePickerProps,
  ...rest
}) => {
  const defaultPlaceholder = placeholder || `请选择${label}`;
  
  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      required={required}
      getValueProps={(value: string | undefined) => ({ value: value ? dayjs(value) : undefined })}
      {...rest}
    >
      <DatePicker placeholder={defaultPlaceholder} format={format} style={{ width: '100%' }} {...datePickerProps} />
    </Form.Item>
  );
};

export default FormDatePicker;
