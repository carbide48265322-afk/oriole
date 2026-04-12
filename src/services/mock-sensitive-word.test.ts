import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import MockSensitiveWordService from './mock-sensitive-word';
import type { CreateWordDTO, UpdateWordDTO } from '@/types/sensitive-word';

describe('MockSensitiveWordService', () => {
  beforeEach(() => {
    MockSensitiveWordService.resetMockData();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const flushTimers = async () => {
    vi.advanceTimersByTime(300);
    await Promise.resolve();
  };

  describe('getWords', () => {
    it('应该返回所有敏感词', async () => {
      const promise = MockSensitiveWordService.getWords();
      await flushTimers();
      const words = await promise;

      expect(words.length).toBe(17);
      expect(words[0]).toHaveProperty('id');
      expect(words[0]).toHaveProperty('word');
      expect(words[0]).toHaveProperty('category');
      expect(words[0]).toHaveProperty('type');
      expect(words[0]).toHaveProperty('status');
    });

    it('应该返回副本而不是原始引用', async () => {
      const promise1 = MockSensitiveWordService.getWords();
      await flushTimers();
      const words1 = await promise1;

      const promise2 = MockSensitiveWordService.getWords();
      await flushTimers();
      const words2 = await promise2;

      expect(words1).not.toBe(words2);
      expect(words1).toEqual(words2);
    });
  });

  describe('createWord', () => {
    it('应该成功创建母词', async () => {
      const dto: CreateWordDTO = {
        word: '测试母词',
        category: 'politics',
        type: 'parent',
        level: 'medium',
      };

      const promise = MockSensitiveWordService.createWord(dto);
      await flushTimers();
      const result = await promise;

      expect(result.word).toBe('测试母词');
      expect(result.category).toBe('politics');
      expect(result.type).toBe('parent');
      expect(result.level).toBe('medium');
      expect(result.status).toBe('enabled');
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });

    it('应该成功创建变体词', async () => {
      const dto: CreateWordDTO = {
        word: '测试变体词',
        category: 'violence',
        type: 'variant',
        parentWordId: 'sw_001',
        level: 'low',
      };

      const promise = MockSensitiveWordService.createWord(dto);
      await flushTimers();
      const result = await promise;

      expect(result.word).toBe('测试变体词');
      expect(result.category).toBe('violence');
      expect(result.type).toBe('variant');
      expect(result.parentWordId).toBe('sw_001');
      expect(result.level).toBe('low');
    });

    it('创建变体词不带 parentWordId 应该抛出错误', async () => {
      const dto: CreateWordDTO = {
        word: '无效变体词',
        category: 'porn',
        type: 'variant',
        level: 'medium',
      };

      const promise = MockSensitiveWordService.createWord(dto);
      await flushTimers();

      await expect(promise).rejects.toThrow('变体词必须关联母词');
    });

    it('创建重复敏感词应该抛出错误', async () => {
      const dto: CreateWordDTO = {
        word: '暴力',
        category: 'violence',
        type: 'parent',
        level: 'medium',
      };

      const promise = MockSensitiveWordService.createWord(dto);
      await flushTimers();

      await expect(promise).rejects.toThrow('敏感词 "暴力" 已存在');
    });

    it('创建后应该能查询到新词', async () => {
      const dto: CreateWordDTO = {
        word: '新测试词',
        category: 'ad',
        type: 'parent',
        level: 'low',
      };

      const createPromise = MockSensitiveWordService.createWord(dto);
      await flushTimers();
      await createPromise;

      const getPromise = MockSensitiveWordService.getWords();
      await flushTimers();
      const words = await getPromise;

      expect(words.some((w) => w.word === '新测试词')).toBe(true);
    });
  });

  describe('updateWord', () => {
    it('应该成功更新敏感词', async () => {
      const getPromise = MockSensitiveWordService.getWords();
      await flushTimers();
      const words = await getPromise;
      const targetWord = words[0];

      const dto: UpdateWordDTO = {
        word: '更新后的词',
        level: 'low',
      };

      const updatePromise = MockSensitiveWordService.updateWord(targetWord.id, dto);
      await flushTimers();
      const result = await updatePromise;

      expect(result.word).toBe('更新后的词');
      expect(result.level).toBe('low');
      expect(result.category).toBe(targetWord.category);
      expect(result.id).toBe(targetWord.id);
    });

    it('更新不存在的词应该抛出错误', async () => {
      const dto: UpdateWordDTO = { word: '新词' };

      const promise = MockSensitiveWordService.updateWord('non_existent_id', dto);
      await flushTimers();

      await expect(promise).rejects.toThrow('敏感词不存在');
    });

    it('更新为重复词应该抛出错误', async () => {
      const getPromise = MockSensitiveWordService.getWords();
      await flushTimers();
      const words = await getPromise;
      const targetWord = words[0];

      const dto: UpdateWordDTO = { word: '暴力' };

      const promise = MockSensitiveWordService.updateWord(targetWord.id, dto);
      await flushTimers();

      await expect(promise).rejects.toThrow('敏感词 "暴力" 已存在');
    });

    it('应该更新 status 状态', async () => {
      const getPromise = MockSensitiveWordService.getWords();
      await flushTimers();
      const words = await getPromise;
      const targetWord = words.find((w) => w.status === 'enabled')!;

      const dto: UpdateWordDTO = { status: 'disabled' };

      const updatePromise = MockSensitiveWordService.updateWord(targetWord.id, dto);
      await flushTimers();
      const result = await updatePromise;

      expect(result.status).toBe('disabled');
    });

    it('更新变体词类型不带 parentWordId 应该抛出错误', async () => {
      const getPromise = MockSensitiveWordService.getWords();
      await flushTimers();
      const words = await getPromise;
      const parentWord = words.find((w) => w.type === 'parent')!;

      const dto: UpdateWordDTO = { type: 'variant' };

      const promise = MockSensitiveWordService.updateWord(parentWord.id, dto);
      await flushTimers();

      await expect(promise).rejects.toThrow('变体词必须关联母词');
    });
  });

  describe('deleteWord', () => {
    it('应该成功删除敏感词', async () => {
      const getPromise = MockSensitiveWordService.getWords();
      await flushTimers();
      const words = await getPromise;
      const targetId = words[0].id;

      const deletePromise = MockSensitiveWordService.deleteWord(targetId);
      await flushTimers();
      await deletePromise;

      const getPromise2 = MockSensitiveWordService.getWords();
      await flushTimers();
      const wordsAfter = await getPromise2;

      expect(wordsAfter.some((w) => w.id === targetId)).toBe(false);
      expect(wordsAfter.length).toBe(16);
    });

    it('删除不存在的词应该抛出错误', async () => {
      const promise = MockSensitiveWordService.deleteWord('non_existent_id');
      await flushTimers();

      await expect(promise).rejects.toThrow('敏感词不存在');
    });
  });

  describe('updateStatus', () => {
    it('应该更新状态为 pending', async () => {
      const getPromise = MockSensitiveWordService.getWords();
      await flushTimers();
      const words = await getPromise;
      const enabledWord = words.find((w) => w.status === 'enabled')!;

      const promise = MockSensitiveWordService.updateStatus(enabledWord.id, 'pending');
      await flushTimers();
      await promise;

      const getPromise2 = MockSensitiveWordService.getWords();
      await flushTimers();
      const wordsAfter = await getPromise2;
      const updatedWord = wordsAfter.find((w) => w.id === enabledWord.id)!;

      expect(updatedWord.status).toBe('pending');
    });

    it('应该更新状态为 disabled', async () => {
      const getPromise = MockSensitiveWordService.getWords();
      await flushTimers();
      const words = await getPromise;
      const enabledWord = words.find((w) => w.status === 'enabled')!;

      const promise = MockSensitiveWordService.updateStatus(enabledWord.id, 'disabled');
      await flushTimers();
      await promise;

      const getPromise2 = MockSensitiveWordService.getWords();
      await flushTimers();
      const wordsAfter = await getPromise2;
      const updatedWord = wordsAfter.find((w) => w.id === enabledWord.id)!;

      expect(updatedWord.status).toBe('disabled');
    });

    it('更新不存在的词应该抛出错误', async () => {
      const promise = MockSensitiveWordService.updateStatus('non_existent_id', 'disabled');
      await flushTimers();

      await expect(promise).rejects.toThrow('敏感词不存在');
    });
  });

  describe('getStats', () => {
    it('应该返回正确的统计数据', async () => {
      const promise = MockSensitiveWordService.getStats();
      await flushTimers();
      const stats = await promise;

      expect(stats.total).toBe(17);
      expect(stats.enabled + stats.pending + stats.disabled).toBe(stats.total);
      expect(stats.todayAdded).toBeGreaterThan(0);
    });

    it('不应该包含 byCategory 和 byLevel 字段', async () => {
      const promise = MockSensitiveWordService.getStats();
      await flushTimers();
      const stats = await promise;

      expect(stats).not.toHaveProperty('byCategory');
      expect(stats).not.toHaveProperty('byLevel');
    });

    it('应该包含 enabled, pending, disabled 字段', async () => {
      const promise = MockSensitiveWordService.getStats();
      await flushTimers();
      const stats = await promise;

      expect(stats).toHaveProperty('enabled');
      expect(stats).toHaveProperty('pending');
      expect(stats).toHaveProperty('disabled');
    });

    it('创建新词后统计应该更新', async () => {
      const getStatsPromise = MockSensitiveWordService.getStats();
      await flushTimers();
      const statsBefore = await getStatsPromise;

      const dto: CreateWordDTO = {
        word: '新统计词',
        category: 'ad',
        type: 'parent',
        level: 'low',
      };

      const createPromise = MockSensitiveWordService.createWord(dto);
      await flushTimers();
      await createPromise;

      const getStatsPromise2 = MockSensitiveWordService.getStats();
      await flushTimers();
      const statsAfter = await getStatsPromise2;

      expect(statsAfter.total).toBe(statsBefore.total + 1);
      expect(statsAfter.enabled).toBe(statsBefore.enabled + 1);
    });
  });

  describe('createVariant', () => {
    it('应该成功为母词创建变体词', async () => {
      const parentWordsPromise = MockSensitiveWordService.getParentWords();
      await flushTimers();
      const parentWords = await parentWordsPromise;
      const parentWord = parentWords[0];

      const promise = MockSensitiveWordService.createVariant(parentWord.id, {
        word: '新变体词',
        category: parentWord.category,
        level: 'medium',
      });
      await flushTimers();
      const result = await promise;

      expect(result.word).toBe('新变体词');
      expect(result.type).toBe('variant');
      expect(result.parentWordId).toBe(parentWord.id);
      expect(result.status).toBe('enabled');
    });

    it('创建变体词时母词不存在应该抛出错误', async () => {
      const promise = MockSensitiveWordService.createVariant('non_existent_id', {
        word: '无效变体词',
        category: 'politics',
        level: 'low',
      });
      await flushTimers();

      await expect(promise).rejects.toThrow('母词不存在');
    });

    it('创建重复变体词应该抛出错误', async () => {
      const parentWordsPromise = MockSensitiveWordService.getParentWords();
      await flushTimers();
      const parentWords = await parentWordsPromise;
      const parentWord = parentWords[0];

      const promise = MockSensitiveWordService.createVariant(parentWord.id, {
        word: '敏感政治事', // 已存在的词
        category: 'politics',
        level: 'low',
      });
      await flushTimers();

      await expect(promise).rejects.toThrow('敏感词 "敏感政治事" 已存在');
    });
  });

  describe('getParentWords', () => {
    it('应该返回所有母词', async () => {
      const promise = MockSensitiveWordService.getParentWords();
      await flushTimers();
      const parentWords = await promise;

      expect(parentWords.length).toBeGreaterThan(0);
      parentWords.forEach((word) => {
        expect(word.type).toBe('parent');
      });
    });
  });

  describe('getVariants', () => {
    it('应该返回指定母词的变体词', async () => {
      const parentWordsPromise = MockSensitiveWordService.getParentWords();
      await flushTimers();
      const parentWords = await parentWordsPromise;

      const parentWordId = parentWords[0].id;

      const variantsPromise = MockSensitiveWordService.getVariants(parentWordId);
      await flushTimers();
      const variants = await variantsPromise;

      variants.forEach((word) => {
        expect(word.type).toBe('variant');
        expect(word.parentWordId).toBe(parentWordId);
      });
    });

    it('没有变体词时应该返回空数组', async () => {
      const promise = MockSensitiveWordService.getVariants('non_existent_parent_id');
      await flushTimers();
      const variants = await promise;

      expect(variants).toEqual([]);
    });
  });
});
