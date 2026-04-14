import { OperationType } from './enums';

/**
 * 附件类型
 */
export interface Attachment {
  id: string;
  /** 原始文件名 */
  originalFilename: string;
  /** 存储文件名 */
  storedFilename: string;
  /** 文件内容类型 */
  contentType: string;
  /** 文件大小（字节） */
  fileSize: number;
  /** 存储key */
  storageKey: string;
  /** 状态 */
  status: boolean;
  /** 关联实体类型 */
  entityType: string;
  /** 关联实体ID */
  entityId: string;
  /** 上传人ID */
  uploadedBy: string;
  /** 上传时间 */
  uploadTime: Date;
  /** 删除时间 */
  deletedAt?: Date;
  /** 删除人ID */
  deletedBy?: string;
}

/**
 * 审计日志类型
 */
export interface AuditLog {
  id: string;
  /** 表名 */
  tableName: string;
  /** 记录ID */
  recordId: string;
  /** 字段名 */
  fieldName?: string;
  /** 旧值 */
  oldValue?: string;
  /** 新值 */
  newValue?: string;
  /** 变更字段列表 */
  changedFields?: Record<string, any>;
  /** 操作类型 */
  operation: OperationType;
  /** 变更时间 */
  changedAt: Date;
  /** 变更人ID */
  changedBy: string;
  /** IP地址 */
  ipAddress: string;
  /** 元数据 */
  metadata?: Record<string, any>;
}

/**
 * 操作日志类型
 */
export interface OperationLog {
  id: string;
  /** 用户ID */
  userId: string;
  /** 操作时间 */
  operationTime: Date;
  /** 模块 */
  module: string;
  /** 操作动作 */
  action: string;
  /** 关联实体ID */
  entityId?: string;
  /** 变更内容 */
  changes?: Record<string, any>;
  /** IP地址 */
  ipAddress: string;
  /** 用户代理 */
  userAgent?: string;
  /** 是否成功 */
  success: boolean;
  /** 错误信息 */
  errorMessage?: string;
}

/**
 * 分页请求参数
 */
export interface PaginationRequest {
  /** 页码，从1开始 */
  page: number;
  /** 每页数量 */
  pageSize: number;
  /** 排序字段 */
  sortBy?: string;
  /** 排序方向 */
  sortOrder?: 'asc' | 'desc';
}

/**
 * 分页响应结果
 */
export interface PaginationResponse<T> {
  /** 数据列表 */
  list: T[];
  /** 总条数 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
  /** 总页数 */
  totalPages: number;
}

/**
 * API统一响应格式
 */
export interface ApiResponse<T = any> {
  /** 响应码，0表示成功，非0表示失败 */
  code: number;
  /** 响应消息 */
  message: string;
  /** 响应数据 */
  data?: T;
  /** 错误详情 */
  errors?: Record<string, string[]>;
}