import { Form } from 'antd';
import type { FormProps } from 'antd';

interface FormWrapperProps<T = Record<string, any>> extends FormProps<T> {
  onSubmit: (values: T) => void;
  layout?: 'horizontal' | 'vertical' | 'inline';
  labelCol?: { span: number };
  wrapperCol?: { span: number };
  children: React.ReactNode;
}

const FormWrapper = <T extends Record<string, any>>({
  onSubmit,
  layout = 'horizontal',
  labelCol = { span: 6 },
  wrapperCol = { span: 18 },
  children,
  ...rest
}: FormWrapperProps<T>) => {
  return (
    <Form
      layout={layout}
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      onFinish={onSubmit}
      validateMessages={{
        required: '${label}是必填项',
        types: {
          email: '请输入有效的邮箱地址',
          number: '请输入有效的数字',
          date: '请选择有效的日期'
        },
        pattern: {
          mismatch: '${label}格式不正确'
        }
      }}
      {...rest}
    >
      {children}
    </Form>
  );
};

export default FormWrapper;
