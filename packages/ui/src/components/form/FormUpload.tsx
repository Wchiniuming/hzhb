import { Form, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { FormItemProps, UploadProps } from 'antd';

interface FormUploadProps extends Omit<FormItemProps, 'children'> {
  uploadProps?: UploadProps;
  multiple?: boolean;
  drag?: boolean;
  accept?: string;
  maxCount?: number;
  tip?: string;
}

const FormUpload: React.FC<FormUploadProps> = ({
  name,
  label,
  rules = [],
  required = false,
  multiple = false,
  drag = false,
  accept,
  maxCount,
  tip,
  uploadProps,
  ...rest
}) => {
  const uploadComponent = drag ? (
    <Upload.Dragger
      name="file"
      multiple={multiple}
      accept={accept}
      maxCount={maxCount}
      {...uploadProps}
    >
      <p className="ant-upload-drag-icon">
        <UploadOutlined />
      </p>
      <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
      <p className="ant-upload-hint">
        {tip || `支持单个或多个文件上传，最大数量${maxCount || '不限'}`}
      </p>
    </Upload.Dragger>
  ) : (
    <Upload
      name="file"
      multiple={multiple}
      accept={accept}
      maxCount={maxCount}
      {...uploadProps}
    >
      <Button icon={<UploadOutlined />}>点击上传文件</Button>
      {tip && <div style={{ marginTop: 8, color: '#666', fontSize: 12 }}>{tip}</div>}
    </Upload>
  );

  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      required={required}
      valuePropName="fileList"
      getValueFromEvent={(e: { fileList: any[] }) => e.fileList}
      {...rest}
    >
      {uploadComponent}
    </Form.Item>
  );
};

export default FormUpload;
