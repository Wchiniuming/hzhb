import { UserRole } from './enums';

/**
 * 权限类型
 */
export interface Permission {
  id: string;
  /** 权限名称 */
  name: string;
  /** 所属模块 */
  module: string;
  /** 操作动作 */
  action: string;
  /** 描述 */
  description?: string;
}

/**
 * 角色类型
 */
export interface Role {
  id: string;
  /** 角色名称 */
  name: UserRole;
  /** 描述 */
  description?: string;
  /** 创建时间 */
  createdAt: Date;
  /** 更新时间 */
  updatedAt: Date;
  /** 角色权限列表 */
  permissions?: Permission[];
}

/**
 * 角色权限关联类型
 */
export interface RolePermission {
  roleId: string;
  permissionId: string;
  createdAt: Date;
}

/**
 * 用户类型
 */
export interface User {
  id: string;
  /** 用户名 */
  username: string;
  /** 密码哈希 */
  passwordHash: string;
  /** 联系信息 */
  contactInfo?: Record<string, any>;
  /** 角色ID */
  roleId: string;
  /** 是否启用 */
  enabled: boolean;
  /** 创建时间 */
  createdAt: Date;
  /** 更新时间 */
  updatedAt: Date;
  /** 删除时间 */
  deletedAt?: Date;
  /** 删除人ID */
  deletedBy?: string;
  /** 角色信息 */
  role?: Role;
}

/**
 * 合作伙伴类型
 */
export interface Partner {
  id: string;
  /** 合作伙伴名称 */
  name: string;
  /** 联系信息 */
  contactInfo?: Record<string, any>;
  /** 状态 */
  status: boolean;
  /** 创建时间 */
  createdAt: Date;
  /** 更新时间 */
  updatedAt: Date;
  /** 删除时间 */
  deletedAt?: Date;
  /** 删除人ID */
  deletedBy?: string;
}

/**
 * 登录日志类型
 */
export interface LoginLog {
  id: string;
  /** 用户ID */
  userId: string;
  /** 登录时间 */
  loginTime: Date;
  /** IP地址 */
  ip: string;
  /** 是否成功 */
  success: boolean;
  /** 用户代理 */
  userAgent?: string;
}

/**
 * 登录请求参数
 */
export interface LoginRequest {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 验证码 */
  captcha?: string;
  /** 验证码ID */
  captchaId?: string;
}

/**
 * 登录响应结果
 */
export interface LoginResponse {
  /** 访问令牌 */
  accessToken: string;
  /** 刷新令牌 */
  refreshToken: string;
  /** 过期时间（秒） */
  expiresIn: number;
  /** 用户信息 */
  user: Omit<User, 'passwordHash'>;
  /** 权限列表 */
  permissions: string[];
}