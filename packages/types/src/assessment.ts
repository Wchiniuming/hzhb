import { AssessmentStatus, ApprovalStatus } from './enums';
import { Partner, User } from './auth';

/**
 * 评估指标类型
 */
export interface AssessmentIndicator {
  id: string;
  /** 指标名称 */
  name: string;
  /** 父指标ID */
  parentId?: string;
  /** 权重 */
  weight: number;
  /** 评分标准 */
  scoringCriteria?: string;
  /** 描述 */
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  /** 子指标列表 */
  children?: AssessmentIndicator[];
}

/**
 * 评估得分类型
 */
export interface AssessmentScore {
  id: string;
  assessmentId: string;
  indicatorId: string;
  /** 自动评分 */
  autoScore?: number;
  /** 人工评分 */
  manualScore?: number;
  /** 最终得分 */
  finalScore: number;
  /** 评分说明 */
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
  /** 指标信息 */
  indicator?: AssessmentIndicator;
}

/**
 * 评估报告类型
 */
export interface AssessmentReport {
  id: string;
  assessmentId: string;
  /** 报告内容 */
  content: Record<string, any>;
  /** 报告文件路径 */
  filePath?: string;
  /** 审批状态 */
  status: ApprovalStatus;
  /** 审批时间 */
  approvalDate?: Date;
  /** 发布时间 */
  publishedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 评估审批类型
 */
export interface AssessmentApproval {
  id: string;
  assessmentPlanId: string;
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
 * 评估类型
 */
export interface Assessment {
  id: string;
  planId: string;
  partnerId: string;
  /** 评估状态 */
  status: AssessmentStatus;
  /** 开始时间 */
  startDate: Date;
  /** 结束时间 */
  endDate?: Date;
  /** 总体得分 */
  overallScore?: number;
  createdAt: Date;
  updatedAt: Date;
  /** 所属评估计划 */
  plan?: AssessmentPlan;
  /** 所属合作伙伴 */
  partner?: Partner;
  /** 得分列表 */
  scores?: AssessmentScore[];
  /** 评估报告 */
  report?: AssessmentReport;
}

/**
 * 评估计划类型
 */
export interface AssessmentPlan {
  id: string;
  /** 计划名称 */
  name: string;
  /** 目标合作伙伴列表 */
  targetPartners?: string[];
  /** 评估周期 */
  cycle: string;
  /** 评估人列表 */
  assessors?: string[];
  /** 开始时间 */
  startDate: Date;
  /** 结束时间 */
  endDate: Date;
  /** 评估方式 */
  method: string;
  /** 状态 */
  status: AssessmentStatus;
  /** 创建人ID */
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  /** 创建人信息 */
  creator?: User;
  /** 评估列表 */
  assessments?: Assessment[];
  /** 审批记录 */
  approvals?: AssessmentApproval[];
}