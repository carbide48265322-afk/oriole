import {
  AuditPolicy,
  AuditDimension,
  CreatePolicyDTO,
  UpdatePolicyDTO,
  CreateDimensionDTO,
  UpdateDimensionDTO,
} from '@/types/audit';

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 模拟网络延迟
 */
function delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 模块级 Mock 数据存储
 */
let policies: AuditPolicy[] = [
  {
    id: 'policy-1',
    name: '内容安全策略',
    description: '用于审核用户生成内容的安全性',
    dimensions: ['dim-1', 'dim-2'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'policy-2',
    name: '图片审核策略',
    description: '专门用于图片内容的审核标准',
    dimensions: ['dim-3'],
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: 'policy-3',
    name: '视频审核策略',
    description: '视频内容审核规范',
    dimensions: [],
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z',
  },
];

let dimensions: AuditDimension[] = [
  {
    id: 'dim-1',
    name: '敏感词检测',
    type: 'text',
    description: '检测文本中是否包含敏感词汇',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'dim-2',
    name: '暴力内容识别',
    type: 'image',
    description: '识别图片中的暴力内容',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'dim-3',
    name: '色情内容检测',
    type: 'video',
    description: '检测视频中的色情内容',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: 'dim-4',
    name: '语音违规检测',
    type: 'audio',
    description: '检测音频中的违规内容',
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z',
  },
];

/**
 * Mock 审计服务
 */
export class MockAuditService {
  // ==================== 策略 CRUD ====================

  /**
   * 获取所有策略
   */
  static async getPolicies(): Promise<AuditPolicy[]> {
    await delay();
    return [...policies];
  }

  /**
   * 创建策略
   */
  static async createPolicy(data: CreatePolicyDTO): Promise<AuditPolicy> {
    await delay();

    // 检查名称是否重复
    if (policies.some((p) => p.name === data.name)) {
      throw new Error(`策略名称 "${data.name}" 已存在`);
    }

    const now = new Date().toISOString();
    const newPolicy: AuditPolicy = {
      id: generateId(),
      name: data.name,
      description: data.description,
      dimensions: [],
      createdAt: now,
      updatedAt: now,
    };

    policies.push(newPolicy);
    return { ...newPolicy };
  }

  /**
   * 更新策略
   */
  static async updatePolicy(id: string, data: UpdatePolicyDTO): Promise<AuditPolicy> {
    await delay();

    const index = policies.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`策略 ID "${id}" 不存在`);
    }

    // 检查名称是否与其他策略重复
    if (data.name && policies.some((p) => p.id !== id && p.name === data.name)) {
      throw new Error(`策略名称 "${data.name}" 已存在`);
    }

    const updatedPolicy: AuditPolicy = {
      ...policies[index],
      ...data,
      dimensions: data.dimensions !== undefined ? data.dimensions : policies[index].dimensions,
      updatedAt: new Date().toISOString(),
    };

    policies[index] = updatedPolicy;
    return { ...updatedPolicy };
  }

  /**
   * 删除策略
   */
  static async deletePolicy(id: string): Promise<void> {
    await delay();

    const index = policies.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`策略 ID "${id}" 不存在`);
    }

    policies.splice(index, 1);
  }

  // ==================== 维度 CRUD ====================

  /**
   * 获取所有维度
   */
  static async getDimensions(): Promise<AuditDimension[]> {
    await delay();
    return [...dimensions];
  }

  /**
   * 创建维度
   */
  static async createDimension(data: CreateDimensionDTO): Promise<AuditDimension> {
    await delay();

    // 检查名称是否重复
    if (dimensions.some((d) => d.name === data.name)) {
      throw new Error(`维度名称 "${data.name}" 已存在`);
    }

    const now = new Date().toISOString();
    const newDimension: AuditDimension = {
      id: generateId(),
      name: data.name,
      type: data.type,
      description: data.description,
      createdAt: now,
      updatedAt: now,
    };

    dimensions.push(newDimension);
    return { ...newDimension };
  }

  /**
   * 更新维度
   */
  static async updateDimension(id: string, data: UpdateDimensionDTO): Promise<AuditDimension> {
    await delay();

    const index = dimensions.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new Error(`维度 ID "${id}" 不存在`);
    }

    // 检查名称是否与其他维度重复
    if (data.name && dimensions.some((d) => d.id !== id && d.name === data.name)) {
      throw new Error(`维度名称 "${data.name}" 已存在`);
    }

    const updatedDimension: AuditDimension = {
      ...dimensions[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    dimensions[index] = updatedDimension;
    return { ...updatedDimension };
  }

  /**
   * 删除维度
   */
  static async deleteDimension(id: string): Promise<void> {
    await delay();

    const index = dimensions.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new Error(`维度 ID "${id}" 不存在`);
    }

    // 检查是否被策略关联
    const linkedPolicy = policies.find((p) => p.dimensions.includes(id));
    if (linkedPolicy) {
      throw new Error(`维度 "${dimensions[index].name}" 已被策略 "${linkedPolicy.name}" 关联，请先解除关联关系`);
    }

    dimensions.splice(index, 1);
  }

  // ==================== 关联管理 ====================

  /**
   * 关联维度到策略
   */
  static async linkDimension(policyId: string, dimensionId: string): Promise<void> {
    await delay();

    const policyIndex = policies.findIndex((p) => p.id === policyId);
    if (policyIndex === -1) {
      throw new Error(`策略 ID "${policyId}" 不存在`);
    }

    const dimensionIndex = dimensions.findIndex((d) => d.id === dimensionId);
    if (dimensionIndex === -1) {
      throw new Error(`维度 ID "${dimensionId}" 不存在`);
    }

    const policy = policies[policyIndex];
    if (policy.dimensions.includes(dimensionId)) {
      throw new Error(`维度 "${dimensions[dimensionIndex].name}" 已关联到策略 "${policy.name}"`);
    }

    policy.dimensions.push(dimensionId);
    policy.updatedAt = new Date().toISOString();
  }

  /**
   * 解除策略与维度的关联
   */
  static async unlinkDimension(policyId: string, dimensionId: string): Promise<void> {
    await delay();

    const policyIndex = policies.findIndex((p) => p.id === policyId);
    if (policyIndex === -1) {
      throw new Error(`策略 ID "${policyId}" 不存在`);
    }

    const policy = policies[policyIndex];
    const dimIndex = policy.dimensions.indexOf(dimensionId);
    if (dimIndex === -1) {
      throw new Error(`维度 ID "${dimensionId}" 未关联到策略 "${policy.name}"`);
    }

    policy.dimensions.splice(dimIndex, 1);
    policy.updatedAt = new Date().toISOString();
  }

  // ==================== 测试辅助方法 ====================

  /**
   * 重置 Mock 数据（用于测试）
   */
  static resetMockData(): void {
    policies = [
      {
        id: 'policy-1',
        name: '内容安全策略',
        description: '用于审核用户生成内容的安全性',
        dimensions: ['dim-1', 'dim-2'],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: 'policy-2',
        name: '图片审核策略',
        description: '专门用于图片内容的审核标准',
        dimensions: ['dim-3'],
        createdAt: '2024-01-02T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      },
      {
        id: 'policy-3',
        name: '视频审核策略',
        description: '视频内容审核规范',
        dimensions: [],
        createdAt: '2024-01-03T00:00:00.000Z',
        updatedAt: '2024-01-03T00:00:00.000Z',
      },
    ];

    dimensions = [
      {
        id: 'dim-1',
        name: '敏感词检测',
        type: 'text',
        description: '检测文本中是否包含敏感词汇',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: 'dim-2',
        name: '暴力内容识别',
        type: 'image',
        description: '识别图片中的暴力内容',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: 'dim-3',
        name: '色情内容检测',
        type: 'video',
        description: '检测视频中的色情内容',
        createdAt: '2024-01-02T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      },
      {
        id: 'dim-4',
        name: '语音违规检测',
        type: 'audio',
        description: '检测音频中的违规内容',
        createdAt: '2024-01-03T00:00:00.000Z',
        updatedAt: '2024-01-03T00:00:00.000Z',
      },
    ];
  }
}
