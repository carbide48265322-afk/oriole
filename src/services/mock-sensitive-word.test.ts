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
      expect(words[0]).toHaveProperty('level');
      expect(words[0]).toHaveProperty('enabled');
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
    it('应该成功创建新敏感词', async () => {
      const dto: CreateWordDTO = {
        word: '测试敏感词',
        category: 'text',
        level: 'medium',
      };

      const promise = MockSensitiveWordService.createWord(dto);
      await flushTimers();
      const result = await promise;

      expect(result.word).toBe('测试敏感词');
      expect(result.category).toBe('text');
      expect(result.level).toBe('medium');
      expect(result.enabled).toBe(true);
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });

    it('创建重复敏感词应该抛出错误', async () => {
      const dto: CreateWordDTO = {
        word: '暴力',
        category: 'text',
        level: 'medium',
      };

      const promise = MockSensitiveWordService.createWord(dto);
      await flushTimers();

      await expect(promise).rejects.toThrow('敏感词 "暴力" 已存在');
    });

    it('创建后应该能查询到新词', async () => {
      const dto: CreateWordDTO = {
        word: '新测试词',
        category: 'image',
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

      const dto: UpdateWordDTO = { word: '色情' };

      const promise = MockSensitiveWordService.updateWord(targetWord.id, dto);
      await flushTimers();

      await expect(promise).rejects.toThrow('敏感词 "色情" 已存在');
    });

    it('应该更新 enabled 状态', async () => {
      const getPromise = MockSensitiveWordService.getWords();
      await flushTimers();
      const words = await getPromise;
      const targetWord = words.find((w) => w.enabled === true)!;

      const dto: UpdateWordDTO = { enabled: false };

      const updatePromise = MockSensitiveWordService.updateWord(targetWord.id, dto);
      await flushTimers();
      const result = await updatePromise;

      expect(result.enabled).toBe(false);
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

  describe('toggleEnabled', () => {
    it('应该切换启用状态', async () => {
      const getPromise = MockSensitiveWordService.getWords();
      await flushTimers();
      const words = await getPromise;
      const enabledWord = words.find((w) => w.enabled === true)!;

      const togglePromise = MockSensitiveWordService.toggleEnabled(enabledWord.id);
      await flushTimers();
      await togglePromise;

      const getPromise2 = MockSensitiveWordService.getWords();
      await flushTimers();
      const wordsAfter = await getPromise2;
      const updatedWord = wordsAfter.find((w) => w.id === enabledWord.id)!;

      expect(updatedWord.enabled).toBe(false);
    });

    it('切换不存在的词应该抛出错误', async () => {
      const promise = MockSensitiveWordService.toggleEnabled('non_existent_id');
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
      expect(stats.byCategory).toHaveProperty('text');
      expect(stats.byCategory).toHaveProperty('image');
      expect(stats.byCategory).toHaveProperty('video');
      expect(stats.byCategory).toHaveProperty('audio');
      expect(stats.byLevel).toHaveProperty('high');
      expect(stats.byLevel).toHaveProperty('medium');
      expect(stats.byLevel).toHaveProperty('low');
      expect(stats.enabled + stats.disabled).toBe(stats.total);
    });

    it('分类统计应该正确', async () => {
      const promise = MockSensitiveWordService.getStats();
      await flushTimers();
      const stats = await promise;

      expect(stats.byCategory.text).toBeGreaterThan(0);
      expect(stats.byCategory.image).toBeGreaterThan(0);
      expect(stats.byCategory.video).toBeGreaterThan(0);
      expect(stats.byCategory.audio).toBeGreaterThan(0);

      const totalFromCategories =
        stats.byCategory.text +
        stats.byCategory.image +
        stats.byCategory.video +
        stats.byCategory.audio;

      expect(totalFromCategories).toBe(stats.total);
    });

    it('级别统计应该正确', async () => {
      const promise = MockSensitiveWordService.getStats();
      await flushTimers();
      const stats = await promise;

      expect(stats.byLevel.high).toBeGreaterThan(0);
      expect(stats.byLevel.medium).toBeGreaterThan(0);
      expect(stats.byLevel.low).toBeGreaterThan(0);

      const totalFromLevels = stats.byLevel.high + stats.byLevel.medium + stats.byLevel.low;

      expect(totalFromLevels).toBe(stats.total);
    });

    it('创建新词后统计应该更新', async () => {
      const getStatsPromise = MockSensitiveWordService.getStats();
      await flushTimers();
      const statsBefore = await getStatsPromise;

      const dto: CreateWordDTO = {
        word: '新统计词',
        category: 'audio',
        level: 'low',
      };

      const createPromise = MockSensitiveWordService.createWord(dto);
      await flushTimers();
      await createPromise;

      const getStatsPromise2 = MockSensitiveWordService.getStats();
      await flushTimers();
      const statsAfter = await getStatsPromise2;

      expect(statsAfter.total).toBe(statsBefore.total + 1);
      expect(statsAfter.byCategory.audio).toBe(statsBefore.byCategory.audio + 1);
      expect(statsAfter.byLevel.low).toBe(statsBefore.byLevel.low + 1);
      expect(statsAfter.enabled).toBe(statsBefore.enabled + 1);
    });
  });
});
