// 布局组件
export { default as AppLayout } from './components/layout/AppLayout';
export { default as AuthLayout } from './components/layout/AuthLayout';
export { default as PageHeader } from './components/layout/PageHeader';

// 数据展示组件
export { default as DataTable } from './components/data-display/DataTable';
export { default as StatusTag } from './components/data-display/StatusTag';
export { default as DescriptionList } from './components/data-display/DescriptionList';

// 表单组件
export { default as FormWrapper } from './components/form/FormWrapper';
export { default as FormInput } from './components/form/FormInput';
export { default as FormSelect } from './components/form/FormSelect';
export { default as FormDatePicker } from './components/form/FormDatePicker';
export { default as FormTextArea } from './components/form/FormTextArea';
export { default as FormUpload } from './components/form/FormUpload';

// 反馈组件
export { default as ConfirmModal } from './components/feedback/ConfirmModal';
export { default as SuccessMessage } from './components/feedback/SuccessMessage';
export { default as ErrorMessage } from './components/feedback/ErrorMessage';

// 权限组件
export { default as ProtectedRoute } from './components/auth/ProtectedRoute';
export { default as PermissionGuard } from './components/auth/PermissionGuard';

// 类型导出
export type * from './components/types';
