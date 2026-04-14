import { RiskLevel, RiskProbability } from './enums';
import { User } from './auth';

/**
 * 风险类型类型
 */
export interface RiskType {
  id: string;
  /** 类型名称 */
  name: string;
  /** 父类型ID */
  parentId?: string;
  /** 描述 */
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  /** 子类型列表 */
  children?: RiskType[];
}

/**
 * 风险类型
 */
export interface Risk {
  id: string;
  /** 风险名称 */
  name: string;
  /** 风险描述 */
  description?: string;
  /** 类型ID */
  typeId: string;
  /** 风险等级 */
  level: RiskLevel;
  /** 发生概率 */
  probability: RiskProbability;
  /** 影响描述 */
  impact?: string;
  /** 触发条件 */
  triggerConditions?: string;
  /** 处置措施 */
  dispositionMeasures?: string;
  /** 附件ID列表 */
  attachmentIds?: string[];
  /** 创建人ID */
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  /** 风险类型信息 */
  type?: RiskType;
  /** 创建人信息 */
  creator?: User;
}