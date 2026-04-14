import { ImprovementStatus, ApprovalStatus } from './enums';
import { User } from './auth';

/**
 * 改进进度类型
 */
export interface ImprovementProgress {
  id: string;
  planId: string;
  responsibleId: string;
  /** 进度详情 */
  details?: string;
  /** 附件ID列表 */
  attachmentIds?: string[];
  /** 更新时间 */
  updateTime: Date;
  createdAt: Date;
  updatedAt: Date;
  /** 负责人信息 */
  responsible?: User;
}

/**
 * 改进验收类型
 */
export interface ImprovementAcceptance {
  id: string;
  planId: string;
  /** 验收结果 */
  result: boolean;
  /** 验收意见 */
  comments?: string;
  /** 验收人ID */
  acceptorId: string;
  /** 验收时间 */
  acceptanceTime: Date;
  createdAt: Date;
  updatedAt: Date;
  /** 验收人信息 */
  acceptor?: User;
}

/**
 * 改进审批类型
 */
export interface ImprovementApproval {
  id: string;
  improvementPlanId: string;
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
  /** 提交人信息 */
  submitter?: User;
  /** 审批人信息 */
  approver?: User;
}

/**
 * 改进归档类型
 */
export interface ImprovementArchive {
  id: string;
  improvementId: string;
  /** 归档数据 */
  archiveData: Record<string, any>;
  /** 归档人ID */
  archivedBy: string;
  /** 归档时间 */
  archivedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  /** 归档人信息 */
  archivedByUser?: User;
}

/**
 * 改进计划类型
 */
export interface ImprovementPlan {
  id: string;
  requirementId: string;
  /** 改进步骤 */
  steps: Record<string, any>;
  /** 时间线 */
  timeline: Record<string, any>;
  /** 职责分工 */
  responsibilities: Record<string, any>;
  /** 状态 */
  status: ImprovementStatus;
  /** 审批人ID */
  approvedBy?: string;
  /** 审批时间 */
  approvalDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  /** 所属改进需求 */
  requirement?: ImprovementRequirement;
  /** 审批人信息 */
  approver?: User;
  /** 进度记录 */
  progresses?: ImprovementProgress[];
  /** 验收记录 */
  acceptance?: ImprovementAcceptance;
  /** 审批记录 */
  approvals?: ImprovementApproval[];
  /** 归档信息 */
  archive?: ImprovementArchive;
}

/**
 * 改进需求类型
 */
export interface ImprovementRequirement {
  id: string;
  /** 来源类型 */
  originType: string;
  /** 来源实体ID */
  originEntityId?: string;
  /** 需求标题 */
  title: string;
  /** 需求描述 */
  description?: string;
  /** 目标完成时间 */
  targetDate: Date;
  /** 负责人类型 */
  responsibleType: string;
  /** 负责人ID */
  responsibleId: string;
  /** 状态 */
  status: ImprovementStatus;
  /** 创建人ID */
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  /** 创建人信息 */
  creator?: User;
  /** 改进计划 */
  plan?: ImprovementPlan;
}