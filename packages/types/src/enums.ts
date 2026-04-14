/**
 * 审批状态枚举
 */
export enum ApprovalStatus {
  /** 草稿 */
  DRAFT = 'DRAFT',
  /** 已提交 */
  SUBMITTED = 'SUBMITTED',
  /** 审核中 */
  UNDER_REVIEW = 'UNDER_REVIEW',
  /** 已通过 */
  APPROVED = 'APPROVED',
  /** 已拒绝 */
  REJECTED = 'REJECTED',
  /** 需要修改 */
  REVISION_REQUIRED = 'REVISION_REQUIRED',
}

/**
 * 任务状态枚举
 */
export enum TaskStatus {
  /** 未开始 */
  NOT_STARTED = 'NOT_STARTED',
  /** 进行中 */
  IN_PROGRESS = 'IN_PROGRESS',
  /** 已完成 */
  COMPLETED = 'COMPLETED',
  /** 已延期 */
  DELAYED = 'DELAYED',
  /** 已取消 */
  CANCELLED = 'CANCELLED',
  /** 已验收 */
  ACCEPTED = 'ACCEPTED',
  /** 已归档 */
  ARCHIVED = 'ARCHIVED',
}

/**
 * 用户角色枚举
 */
export enum UserRole {
  /** 系统管理员 */
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  /** 业务管理员 */
  BUSINESS_ADMIN = 'BUSINESS_ADMIN',
  /** 审计员 */
  AUDITOR = 'AUDITOR',
  /** 合作伙伴管理员 */
  PARTNER_ADMIN = 'PARTNER_ADMIN',
  /** 开发人员 */
  DEVELOPER = 'DEVELOPER',
  /** 管理人员 */
  MANAGEMENT = 'MANAGEMENT',
}

/**
 * 技能熟练度枚举
 */
export enum ProficiencyLevel {
  /** 初级 */
  BEGINNER = 'BEGINNER',
  /** 中级 */
  INTERMEDIATE = 'INTERMEDIATE',
  /** 高级 */
  ADVANCED = 'ADVANCED',
  /** 专家级 */
  EXPERT = 'EXPERT',
}

/**
 * 活动类型枚举
 */
export enum ActivityType {
  /** 任务分配 */
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  /** 任务完成 */
  TASK_COMPLETED = 'TASK_COMPLETED',
  /** 收到评价 */
  EVALUATION_RECEIVED = 'EVALUATION_RECEIVED',
  /** 技能更新 */
  SKILL_UPDATED = 'SKILL_UPDATED',
  /** 证书添加 */
  CERTIFICATE_ADDED = 'CERTIFICATE_ADDED',
  /** 审批通过 */
  APPROVAL_PASSED = 'APPROVAL_PASSED',
  /** 审批拒绝 */
  APPROVAL_REJECTED = 'APPROVAL_REJECTED',
  /** 改进创建 */
  IMPROVEMENT_CREATED = 'IMPROVEMENT_CREATED',
  /** 风险识别 */
  RISK_IDENTIFIED = 'RISK_IDENTIFIED',
}

/**
 * 评估状态枚举
 */
export enum AssessmentStatus {
  /** 草稿 */
  DRAFT = 'DRAFT',
  /** 评估中 */
  IN_PROGRESS = 'IN_PROGRESS',
  /** 已完成 */
  COMPLETED = 'COMPLETED',
  /** 已发布 */
  PUBLISHED = 'PUBLISHED',
  /** 已归档 */
  ARCHIVED = 'ARCHIVED',
}

/**
 * 改进状态枚举
 */
export enum ImprovementStatus {
  /** 已识别 */
  IDENTIFIED = 'IDENTIFIED',
  /** 规划中 */
  PLANNING = 'PLANNING',
  /** 改进中 */
  IN_PROGRESS = 'IN_PROGRESS',
  /** 已完成 */
  COMPLETED = 'COMPLETED',
  /** 已验收 */
  ACCEPTED = 'ACCEPTED',
  /** 已闭环 */
  CLOSED = 'CLOSED',
}

/**
 * 风险等级枚举
 */
export enum RiskLevel {
  /** 低 */
  LOW = 'LOW',
  /** 中 */
  MEDIUM = 'MEDIUM',
  /** 高 */
  HIGH = 'HIGH',
  /** 极高 */
  CRITICAL = 'CRITICAL',
}

/**
 * 风险概率枚举
 */
export enum RiskProbability {
  /** 低概率 */
  LOW = 'LOW',
  /** 中概率 */
  MEDIUM = 'MEDIUM',
  /** 高概率 */
  HIGH = 'HIGH',
  /** 极高概率 */
  VERY_HIGH = 'VERY_HIGH',
}

/**
 * 操作类型枚举
 */
export enum OperationType {
  /** 创建 */
  CREATE = 'CREATE',
  /** 更新 */
  UPDATE = 'UPDATE',
  /** 删除 */
  DELETE = 'DELETE',
  /** 登录 */
  LOGIN = 'LOGIN',
  /** 登出 */
  LOGOUT = 'LOGOUT',
  /** 审批 */
  APPROVE = 'APPROVE',
  /** 拒绝 */
  REJECT = 'REJECT',
  /** 导出 */
  EXPORT = 'EXPORT',
  /** 导入 */
  IMPORT = 'IMPORT',
  /** 查询 */
  QUERY = 'QUERY',
}