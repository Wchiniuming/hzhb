import { TaskStatus, ApprovalStatus } from './enums';
import { Partner, User } from './auth';
import { Developer } from './developer';

/**
 * 任务分配类型
 */
export interface TaskAssignment {
  id: string;
  taskId: string;
  developerId: string;
  /** 担任角色 */
  role: string;
  /** 职责描述 */
  responsibilities?: string;
  /** 交付节点 */
  deliveryNode?: Date;
  createdAt: Date;
  updatedAt: Date;
  /** 开发人员信息 */
  developer?: Developer;
}

/**
 * 任务进度类型
 */
export interface TaskProgress {
  id: string;
  taskId: string;
  developerId: string;
  /** 状态 */
  status: string;
  /** 详情描述 */
  details?: string;
  /** 附件ID列表 */
  attachmentIds?: string[];
  /** 更新时间 */
  updateTime: Date;
  createdAt: Date;
  updatedAt: Date;
  /** 开发人员信息 */
  developer?: Developer;
}

/**
 * 任务延期申请类型
 */
export interface TaskDelayRequest {
  id: string;
  taskId: string;
  /** 延期原因 */
  reason: string;
  /** 新的截止时间 */
  newEndDate: Date;
  /** 审批状态 */
  status: ApprovalStatus;
  /** 审批人ID */
  approverId?: string;
  /** 审批时间 */
  approvalTime?: Date;
  /** 审批意见 */
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
  /** 审批人信息 */
  approver?: User;
}

/**
 * 任务交付物类型
 */
export interface TaskDeliverable {
  id: string;
  taskId: string;
  developerId: string;
  /** 描述 */
  description?: string;
  /** 附件ID列表 */
  attachmentIds?: string[];
  /** 提交时间 */
  submissionTime: Date;
  createdAt: Date;
  updatedAt: Date;
  /** 开发人员信息 */
  developer?: Developer;
  /** 验收记录 */
  acceptances?: TaskAcceptance[];
}

/**
 * 任务验收类型
 */
export interface TaskAcceptance {
  id: string;
  taskId: string;
  deliverableId: string;
  acceptorId: string;
  /** 验收结果 */
  result: boolean;
  /** 验收意见 */
  comments?: string;
  /** 验收时间 */
  acceptanceTime: Date;
  createdAt: Date;
  updatedAt: Date;
  /** 验收人信息 */
  acceptor?: User;
}

/**
 * 任务审批类型
 */
export interface TaskApproval {
  id: string;
  taskId: string;
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
 * 任务归档类型
 */
export interface TaskArchive {
  id: string;
  taskId: string;
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
 * 任务类型
 */
export interface Task {
  id: string;
  /** 任务名称 */
  name: string;
  /** 任务描述 */
  description?: string;
  /** 任务类型 */
  type: string;
  /** 交付标准 */
  deliveryStandard?: string;
  /** 开始时间 */
  startDate: Date;
  /** 结束时间 */
  endDate: Date;
  /** 优先级 */
  priority: string;
  /** 预算 */
  budget?: number;
  /** 任务状态 */
  status: TaskStatus;
  /** 所属合作伙伴ID */
  partnerId: string;
  /** 创建人ID */
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deletedBy?: string;
  /** 所属合作伙伴信息 */
  partner?: Partner;
  /** 创建人信息 */
  creator?: User;
  /** 分配列表 */
  assignments?: TaskAssignment[];
  /** 进度记录 */
  progresses?: TaskProgress[];
  /** 延期申请 */
  delayRequests?: TaskDelayRequest[];
  /** 交付物列表 */
  deliverables?: TaskDeliverable[];
  /** 验收记录 */
  acceptances?: TaskAcceptance[];
  /** 审批记录 */
  approvals?: TaskApproval[];
  /** 归档信息 */
  archive?: TaskArchive;
}