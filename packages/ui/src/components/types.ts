export type Status = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  role: string;
  permissions: string[];
  avatar?: string;
}

export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

export interface BreadcrumbItem {
  title: string;
  path?: string;
}
