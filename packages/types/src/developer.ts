import { ApprovalStatus, ProficiencyLevel, ActivityType } from './enums';
import { Partner } from './auth';
import { Attachment } from './common';

/**
 * 技能标签类型
 */
export interface SkillTag {
  id: string;
  /** 标签名称 */
  name: string;
  /** 父标签ID */
  parentId?: string;
  /** 描述 */
  description?: string;
  /** 创建时间 */
  createdAt: Date;
  /** 更新时间 */
  updatedAt: Date;
  /** 子标签列表 */
  children?: SkillTag[];
}

/**
 * 开发人员技能关联类型
 */
export interface DeveloperSkill {
  developerId: string;
  skillTagId: string;
  /** 熟练度 */
  proficiency: ProficiencyLevel;
  createdAt: Date;
  updatedAt: Date;
  /** 技能标签信息 */
  skillTag?: SkillTag;
}

/**
 * 开发人员工作经历类型
 */
export interface DeveloperExperience {
  id: string;
  developerId: string;
  /** 项目名称 */
  projectName: string;
  /** 担任角色 */
  role: string;
  /** 开始时间 */
  startDate: Date;
  /** 结束时间 */
  endDate?: Date;
  /** 项目描述 */
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 证书类型
 */
export interface Certificate {
  id: string;
  developerId: string;
  /** 证书名称 */
  name: string;
  /** 颁发机构 */
  issuingBody: string;
  /** 颁发时间 */
  issueDate: Date;
  /** 过期时间 */
  expireDate?: Date;
  /** 附件ID */
  attachmentId?: string;
  createdAt: Date;
  updatedAt: Date;
  /** 附件信息 */
  attachment?: Attachment;
}

/**
 * 开发人员评价类型
 */
export interface DeveloperEvaluation {
  id: string;
  developerId: string;
  /** 关联任务ID */
  taskId: string;
  /** 评价人ID */
  evaluatorId: string;
  /** 评价时间 */
  evaluationDate: Date;
  /** 评分详情 */
  scores: Record<string, number>;
  /** 评价内容 */
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 开发人员轨迹类型
 */
export interface DeveloperTrajectory {
  id: string;
  developerId: string;
  /** 活动类型 */
  activityType: ActivityType;
  /** 关联实体ID */
  entityId?: string;
  /** 描述 */
  description?: string;
  /** 时间 */
  timestamp: Date;
  /** 元数据 */
  metadata?: Record<string, any>;
}

/**
 * 开发人员审批类型
 */
export interface DeveloperApproval {
  id: string;
  developerId: string;
  /** 审批状态 */
  status: ApprovalStatus;
  /** 提交人ID */
  submittedBy: string;
  /** 审批人ID */
  approvedBy?: string;
  /** 审批时间 */
  approvedAt?: Date;
  /** 审批意见 */
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 开发人员类型
 */
export interface Developer {
  id: string;
  /** 所属合作伙伴ID */
  partnerId: string;
  /** 姓名 */
  name: string;
  /** 性别 */
  gender?: string;
  /** 年龄 */
  age?: number;
  /** 联系信息 */
  contact?: Record<string, any>;
  /** 身份证号 */
  idNumber?: string;
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
  /** 所属合作伙伴信息 */
  partner?: Partner;
  /** 技能列表 */
  skills?: DeveloperSkill[];
  /** 工作经历列表 */
  experiences?: DeveloperExperience[];
  /** 证书列表 */
  certificates?: Certificate[];
  /** 评价列表 */
  evaluations?: DeveloperEvaluation[];
  /** 轨迹列表 */
  trajectories?: DeveloperTrajectory[];
  /** 审批记录列表 */
  approvals?: DeveloperApproval[];
}