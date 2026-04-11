/**
 * 审核维度类型
 */
export type DimensionType = 'text' | 'image' | 'video' | 'audio';

/**
 * 审核策略
 */
export interface AuditPolicy {
  id: string;
  name: string;
  description: string;
  dimensions: string[]; // 关联的维度 ID 列表
  createdAt: string;
  updatedAt: string;
}

/**
 * 审核维度
 */
export interface AuditDimension {
  id: string;
  name: string;
  type: DimensionType;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建策略 DTO
 */
export interface CreatePolicyDTO {
  name: string;
  description: string;
}

/**
 * 更新策略 DTO
 */
export interface UpdatePolicyDTO {
  name?: string;
  description?: string;
  dimensions?: string[];
}

/**
 * 创建维度 DTO
 */
export interface CreateDimensionDTO {
  name: string;
  type: DimensionType;
  description: string;
}

/**
 * 更新维度 DTO
 */
export interface UpdateDimensionDTO {
  name?: string;
  type?: DimensionType;
  description?: string;
}
