import type { SensitiveWord, CreateWordDTO, UpdateWordDTO, WordStats, WordStatus } from '@/types/sensitive-word';

const MOCK_DELAY = 300;

const generateId = (): string => `sw_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const formatDate = (date: Date): string => date.toISOString();

const createMockData = (): SensitiveWord[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return [
    // 母词 - 政治类
    {
      id: 'sw_001',
      word: '敏感政治事件',
      category: 'politics',
      type: 'parent',
      level: 'high',
      status: 'enabled',
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 5)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 2)),
    },
    // 变体词 - 政治类
    {
      id: 'sw_002',
      word: '敏感政治事',
      category: 'politics',
      type: 'variant',
      parentWordId: 'sw_001',
      level: 'high',
      status: 'enabled',
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 4)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 1)),
    },
    // 母词 - 暴力类
    {
      id: 'sw_003',
      word: '暴力',
      category: 'violence',
      type: 'parent',
      level: 'high',
      status: 'enabled',
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 10)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 3)),
    },
    // 变体词 - 暴力类
    {
      id: 'sw_004',
      word: '暴力行为',
      category: 'violence',
      type: 'variant',
      parentWordId: 'sw_003',
      level: 'high',
      status: 'enabled',
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 9)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 2)),
    },
    // 母词 - 色情类
    {
      id: 'sw_005',
      word: '色情',
      category: 'porn',
      type: 'parent',
      level: 'high',
      status: 'enabled',
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 15)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 5)),
    },
    // 变体词 - 色情类
    {
      id: 'sw_006',
      word: '色情内容',
      category: 'porn',
      type: 'variant',
      parentWordId: 'sw_005',
      level: 'medium',
      status: 'pending',
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 14)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 4)),
    },
    // 母词 - 广告类
    {
      id: 'sw_007',
      word: '违规广告',
      category: 'ad',
      type: 'parent',
      level: 'medium',
      status: 'disabled',
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 20)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 6)),
    },
    // 母词 - 辱骂类
    {
      id: 'sw_008',
      word: '辱骂',
      category: 'abuse',
      type: 'parent',
      level: 'medium',
      status: 'enabled',
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 8)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 1)),
    },
    // 变体词 - 辱骂类
    {
      id: 'sw_009',
      word: '辱骂词汇',
      category: 'abuse',
      type: 'variant',
      parentWordId: 'sw_008',
      level: 'low',
      status: 'disabled',
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 7)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 2)),
    },
    // 母词 - 其他类
    {
      id: 'sw_010',
      word: '不当内容',
      category: 'other',
      type: 'parent',
      level: 'low',
      status: 'disabled',
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 35)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 15)),
    },
    // 今日新增 - 母词
    {
      id: 'sw_011',
      word: '诈骗',
      category: 'ad',
      type: 'parent',
      level: 'high',
      status: 'enabled',
      createdAt: formatDate(today),
      updatedAt: formatDate(today),
    },
    // 今日新增 - 变体词
    {
      id: 'sw_012',
      word: '诈骗信息',
      category: 'ad',
      type: 'variant',
      parentWordId: 'sw_011',
      level: 'high',
      status: 'pending',
      createdAt: formatDate(today),
      updatedAt: formatDate(today),
    },
    // 母词 - 政治类
    {
      id: 'sw_013',
      word: '违禁品',
      category: 'other',
      type: 'parent',
      level: 'high',
      status: 'enabled',
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 7)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 2)),
    },
    // 母词 - 暴力类
    {
      id: 'sw_014',
      word: '血腥',
      category: 'violence',
      type: 'parent',
      level: 'high',
      status: 'enabled',
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 12)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 4)),
    },
    // 变体词 - 暴力类
    {
      id: 'sw_015',
      word: '血腥画面',
      category: 'violence',
      type: 'variant',
      parentWordId: 'sw_014',
      level: 'medium',
      status: 'enabled',
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 11)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 3)),
    },
    // 母词 - 色情类
    {
      id: 'sw_016',
      word: '裸露',
      category: 'porn',
      type: 'parent',
      level: 'medium',
      status: 'enabled',
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 18)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 7)),
    },
    // 母词 - 广告类
    {
      id: 'sw_017',
      word: '赌博',
      category: 'ad',
      type: 'parent',
      level: 'high',
      status: 'enabled',
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 25)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 10)),
    },
  ];
};

class MockSensitiveWordService {
  private static data: SensitiveWord[] = createMockData();

  private static delay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
  }

  static async getWords(): Promise<SensitiveWord[]> {
    await this.delay();
    return [...this.data];
  }

  static async createWord(dto: CreateWordDTO): Promise<SensitiveWord> {
    await this.delay();

    const exists = this.data.some((item) => item.word === dto.word);
    if (exists) {
      throw new Error(`敏感词 "${dto.word}" 已存在`);
    }

    if (dto.type === 'variant' && !dto.parentWordId) {
      throw new Error('变体词必须关联母词');
    }

    const now = formatDate(new Date());
    const newWord: SensitiveWord = {
      id: generateId(),
      word: dto.word,
      category: dto.category,
      type: dto.type,
      parentWordId: dto.parentWordId,
      level: dto.level,
      status: dto.status ?? 'enabled',
      createdAt: now,
      updatedAt: now,
    };

    this.data.push(newWord);
    return { ...newWord };
  }

  static async updateWord(id: string, dto: UpdateWordDTO): Promise<SensitiveWord> {
    await this.delay();

    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error('敏感词不存在');
    }

    if (dto.word !== undefined) {
      const exists = this.data.some((item) => item.word === dto.word && item.id !== id);
      if (exists) {
        throw new Error(`敏感词 "${dto.word}" 已存在`);
      }
    }

    if (dto.type === 'variant' && !dto.parentWordId && !this.data[index].parentWordId) {
      throw new Error('变体词必须关联母词');
    }

    const updated: SensitiveWord = {
      ...this.data[index],
      ...(dto.word !== undefined && { word: dto.word }),
      ...(dto.category !== undefined && { category: dto.category }),
      ...(dto.type !== undefined && { type: dto.type }),
      ...(dto.parentWordId !== undefined && { parentWordId: dto.parentWordId }),
      ...(dto.level !== undefined && { level: dto.level }),
      ...(dto.status !== undefined && { status: dto.status }),
      updatedAt: formatDate(new Date()),
    };

    this.data[index] = updated;
    return { ...updated };
  }

  static async deleteWord(id: string): Promise<void> {
    await this.delay();

    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error('敏感词不存在');
    }

    this.data.splice(index, 1);
  }

  static async updateStatus(id: string, status: WordStatus): Promise<void> {
    await this.delay();

    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error('敏感词不存在');
    }

    this.data[index] = {
      ...this.data[index],
      status,
      updatedAt: formatDate(new Date()),
    };
  }

  static async getStats(): Promise<WordStats> {
    await this.delay();

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayTimestamp = today.getTime();

    const stats: WordStats = {
      total: this.data.length,
      todayAdded: this.data.filter((item) => new Date(item.createdAt).getTime() >= todayTimestamp).length,
      enabled: 0,
      pending: 0,
      disabled: 0,
    };

    for (const item of this.data) {
      if (item.status === 'enabled') {
        stats.enabled += 1;
      } else if (item.status === 'pending') {
        stats.pending += 1;
      } else {
        stats.disabled += 1;
      }
    }

    return stats;
  }

  static async createVariant(
    parentWordId: string,
    data: Omit<CreateWordDTO, 'type' | 'parentWordId'>
  ): Promise<SensitiveWord> {
    const parentWord = this.data.find((item) => item.id === parentWordId && item.type === 'parent');
    if (!parentWord) {
      throw new Error('母词不存在');
    }

    const dto: CreateWordDTO = {
      word: data.word,
      category: data.category,
      type: 'variant',
      parentWordId,
      level: data.level,
      status: data.status,
    };

    return this.createWord(dto);
  }

  static async getParentWords(): Promise<SensitiveWord[]> {
    await this.delay();
    return this.data.filter((item) => item.type === 'parent');
  }

  static async getVariants(parentWordId: string): Promise<SensitiveWord[]> {
    await this.delay();
    return this.data.filter((item) => item.type === 'variant' && item.parentWordId === parentWordId);
  }

  static resetMockData(): void {
    this.data = createMockData();
  }
}

export default MockSensitiveWordService;
