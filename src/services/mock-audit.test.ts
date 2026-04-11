import { describe, it, expect, beforeEach } from 'vitest';
import { MockAuditService } from './mock-audit';
import type { CreatePolicyDTO, CreateDimensionDTO } from '@/types/audit';

describe('MockAuditService', () => {
  beforeEach(() => {
    // 每个测试前重置 Mock 数据
    MockAuditService.resetMockData();
  });

  // ==================== 策略 CRUD 测试 ====================

  describe('策略 CRUD', () => {
    it('getPolicies 应返回所有策略', async () => {
      const policies = await MockAuditService.getPolicies();
      expect(policies).toHaveLength(3);
      expect(policies[0]).toHaveProperty('id', 'policy-1');
      expect(policies[0]).toHaveProperty('name', '内容安全策略');
    });

    it('createPolicy 应创建新策略', async () => {
      const dto: CreatePolicyDTO = {
        name: '新策略',
        description: '测试策略',
      };

      const policy = await MockAuditService.createPolicy(dto);

      expect(policy).toHaveProperty('id');
      expect(policy.name).toBe('新策略');
      expect(policy.description).toBe('测试策略');
      expect(policy.dimensions).toEqual([]);
      expect(policy.createdAt).toBeDefined();
      expect(policy.updatedAt).toBeDefined();

      const policies = await MockAuditService.getPolicies();
      expect(policies).toHaveLength(4);
    });

    it('createPolicy 名称重复应抛出错误', async () => {
      const dto: CreatePolicyDTO = {
        name: '内容安全策略', // 已存在
        description: '重复名称',
      };

      await expect(MockAuditService.createPolicy(dto)).rejects.toThrow(
        '策略名称 "内容安全策略" 已存在'
      );
    });

    it('updatePolicy 应更新策略', async () => {
      const updated = await MockAuditService.updatePolicy('policy-1', {
        name: '更新后的策略',
      });

      expect(updated.name).toBe('更新后的策略');
      expect(updated.id).toBe('policy-1');
      expect(updated.updatedAt).not.toBe('2024-01-01T00:00:00.000Z');

      const policies = await MockAuditService.getPolicies();
      expect(policies.find((p) => p.id === 'policy-1')?.name).toBe('更新后的策略');
    });

    it('updatePolicy 更新不存在的 ID 应抛出错误', async () => {
      await expect(
        MockAuditService.updatePolicy('non-existent', { name: 'test' })
      ).rejects.toThrow('策略 ID "non-existent" 不存在');
    });

    it('updatePolicy 更新为重复名称应抛出错误', async () => {
      await expect(
        MockAuditService.updatePolicy('policy-1', { name: '图片审核策略' })
      ).rejects.toThrow('策略名称 "图片审核策略" 已存在');
    });

    it('deletePolicy 应删除策略', async () => {
      await MockAuditService.deletePolicy('policy-1');

      const policies = await MockAuditService.getPolicies();
      expect(policies).toHaveLength(2);
      expect(policies.find((p) => p.id === 'policy-1')).toBeUndefined();
    });

    it('deletePolicy 删除不存在的 ID 应抛出错误', async () => {
      await expect(MockAuditService.deletePolicy('non-existent')).rejects.toThrow(
        '策略 ID "non-existent" 不存在'
      );
    });
  });

  // ==================== 维度 CRUD 测试 ====================

  describe('维度 CRUD', () => {
    it('getDimensions 应返回所有维度', async () => {
      const dims = await MockAuditService.getDimensions();
      expect(dims).toHaveLength(4);
      expect(dims[0]).toHaveProperty('id', 'dim-1');
      expect(dims[0]).toHaveProperty('name', '敏感词检测');
      expect(dims[0]).toHaveProperty('type', 'text');
    });

    it('createDimension 应创建新维度', async () => {
      const dto: CreateDimensionDTO = {
        name: '新维度',
        type: 'text',
        description: '测试维度',
      };

      const dim = await MockAuditService.createDimension(dto);

      expect(dim).toHaveProperty('id');
      expect(dim.name).toBe('新维度');
      expect(dim.type).toBe('text');
      expect(dim.description).toBe('测试维度');
      expect(dim.createdAt).toBeDefined();
      expect(dim.updatedAt).toBeDefined();

      const dims = await MockAuditService.getDimensions();
      expect(dims).toHaveLength(5);
    });

    it('createDimension 名称重复应抛出错误', async () => {
      const dto: CreateDimensionDTO = {
        name: '敏感词检测', // 已存在
        type: 'text',
        description: '重复名称',
      };

      await expect(MockAuditService.createDimension(dto)).rejects.toThrow(
        '维度名称 "敏感词检测" 已存在'
      );
    });

    it('updateDimension 应更新维度', async () => {
      const updated = await MockAuditService.updateDimension('dim-1', {
        name: '更新后的维度',
        type: 'image',
      });

      expect(updated.name).toBe('更新后的维度');
      expect(updated.type).toBe('image');
      expect(updated.id).toBe('dim-1');
      expect(updated.updatedAt).not.toBe('2024-01-01T00:00:00.000Z');
    });

    it('updateDimension 更新不存在的 ID 应抛出错误', async () => {
      await expect(
        MockAuditService.updateDimension('non-existent', { name: 'test' })
      ).rejects.toThrow('维度 ID "non-existent" 不存在');
    });

    it('updateDimension 更新为重复名称应抛出错误', async () => {
      await expect(
        MockAuditService.updateDimension('dim-1', { name: '暴力内容识别' })
      ).rejects.toThrow('维度名称 "暴力内容识别" 已存在');
    });

    it('deleteDimension 应删除维度', async () => {
      // dim-4 未被任何策略关联
      await MockAuditService.deleteDimension('dim-4');

      const dims = await MockAuditService.getDimensions();
      expect(dims).toHaveLength(3);
      expect(dims.find((d) => d.id === 'dim-4')).toBeUndefined();
    });

    it('deleteDimension 删除不存在的 ID 应抛出错误', async () => {
      await expect(MockAuditService.deleteDimension('non-existent')).rejects.toThrow(
        '维度 ID "non-existent" 不存在'
      );
    });

    it('deleteDimension 删除已关联的维度应抛出错误', async () => {
      // dim-1 被 policy-1 关联
      await expect(MockAuditService.deleteDimension('dim-1')).rejects.toThrow(
        '维度 "敏感词检测" 已被策略 "内容安全策略" 关联，请先解除关联关系'
      );
    });
  });

  // ==================== 关联管理测试 ====================

  describe('关联管理', () => {
    it('linkDimension 应关联维度到策略', async () => {
      await MockAuditService.linkDimension('policy-3', 'dim-4');

      const policies = await MockAuditService.getPolicies();
      const policy = policies.find((p) => p.id === 'policy-3');
      expect(policy?.dimensions).toContain('dim-4');
    });

    it('linkDimension 关联不存在的策略应抛出错误', async () => {
      await expect(
        MockAuditService.linkDimension('non-existent', 'dim-1')
      ).rejects.toThrow('策略 ID "non-existent" 不存在');
    });

    it('linkDimension 关联不存在的维度应抛出错误', async () => {
      await expect(
        MockAuditService.linkDimension('policy-1', 'non-existent')
      ).rejects.toThrow('维度 ID "non-existent" 不存在');
    });

    it('linkDimension 重复关联应抛出错误', async () => {
      // policy-1 已关联 dim-1
      await expect(
        MockAuditService.linkDimension('policy-1', 'dim-1')
      ).rejects.toThrow('维度 "敏感词检测" 已关联到策略 "内容安全策略"');
    });

    it('unlinkDimension 应解除关联', async () => {
      await MockAuditService.unlinkDimension('policy-1', 'dim-1');

      const policies = await MockAuditService.getPolicies();
      const policy = policies.find((p) => p.id === 'policy-1');
      expect(policy?.dimensions).not.toContain('dim-1');
    });

    it('unlinkDimension 解除不存在的策略关联应抛出错误', async () => {
      await expect(
        MockAuditService.unlinkDimension('non-existent', 'dim-1')
      ).rejects.toThrow('策略 ID "non-existent" 不存在');
    });

    it('unlinkDimension 解除未关联的维度应抛出错误', async () => {
      // policy-3 未关联任何维度
      await expect(
        MockAuditService.unlinkDimension('policy-3', 'dim-1')
      ).rejects.toThrow('维度 ID "dim-1" 未关联到策略 "视频审核策略"');
    });

    it('解除关联后应可删除维度', async () => {
      // 先解除 policy-1 与 dim-1 的关联
      await MockAuditService.unlinkDimension('policy-1', 'dim-1');

      // 现在 dim-1 未被关联，可以删除
      await MockAuditService.deleteDimension('dim-1');

      const dims = await MockAuditService.getDimensions();
      expect(dims.find((d) => d.id === 'dim-1')).toBeUndefined();
    });
  });
});
