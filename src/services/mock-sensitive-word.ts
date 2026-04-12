import type { SensitiveWord, CreateWordDTO, UpdateWordDTO, WordStats } from '@/types/sensitive-word';

const MOCK_DELAY = 300;

const generateId = (): string => `sw_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const formatDate = (date: Date): string => date.toISOString();

const createMockData = (): SensitiveWord[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return [
    {
      id: 'sw_001',
      word: '暴力',
      category: 'text',
      level: 'high',
      enabled: true,
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 5)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 2)),
    },
    {
      id: 'sw_002',
      word: '色情',
      category: 'text',
      level: 'high',
      enabled: true,
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 10)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 3)),
    },
    {
      id: 'sw_003',
      word: '赌博',
      category: 'text',
      level: 'high',
      enabled: true,
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 15)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 5)),
    },
    {
      id: 'sw_004',
      word: '辱骂',
      category: 'text',
      level: 'medium',
      enabled: true,
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 8)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 1)),
    },
    {
      id: 'sw_005',
      word: '血腥图片',
      category: 'image',
      level: 'high',
      enabled: true,
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 12)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 4)),
    },
    {
      id: 'sw_006',
      word: '裸露',
      category: 'image',
      level: 'medium',
      enabled: true,
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 20)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 6)),
    },
    {
      id: 'sw_007',
      word: '恐怖视频',
      category: 'video',
      level: 'high',
      enabled: true,
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 18)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 7)),
    },
    {
      id: 'sw_008',
      word: '违规广告',
      category: 'video',
      level: 'medium',
      enabled: false,
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 25)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 10)),
    },
    {
      id: 'sw_009',
      word: '低俗音频',
      category: 'audio',
      level: 'medium',
      enabled: true,
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 22)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 8)),
    },
    {
      id: 'sw_010',
      word: '噪音',
      category: 'audio',
      level: 'low',
      enabled: false,
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 30)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 12)),
    },
    {
      id: 'sw_011',
      word: '诈骗',
      category: 'text',
      level: 'high',
      enabled: true,
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 3)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 1)),
    },
    {
      id: 'sw_012',
      word: '敏感政治',
      category: 'text',
      level: 'high',
      enabled: true,
      createdAt: formatDate(today),
      updatedAt: formatDate(today),
    },
    {
      id: 'sw_013',
      word: '侵权图片',
      category: 'image',
      level: 'medium',
      enabled: true,
      createdAt: formatDate(today),
      updatedAt: formatDate(today),
    },
    {
      id: 'sw_014',
      word: '不当内容',
      category: 'text',
      level: 'low',
      enabled: false,
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 35)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 15)),
    },
    {
      id: 'sw_015',
      word: '违禁品',
      category: 'text',
      level: 'high',
      enabled: true,
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 7)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 2)),
    },
    {
      id: 'sw_016',
      word: '暴力视频',
      category: 'video',
      level: 'high',
      enabled: true,
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 14)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 5)),
    },
    {
      id: 'sw_017',
      word: '辱骂音频',
      category: 'audio',
      level: 'medium',
      enabled: true,
      createdAt: formatDate(new Date(today.getTime() - 86400000 * 9)),
      updatedAt: formatDate(new Date(today.getTime() - 86400000 * 3)),
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

    const now = formatDate(new Date());
    const newWord: SensitiveWord = {
      id: generateId(),
      word: dto.word,
      category: dto.category,
      level: dto.level,
      enabled: true,
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

    const updated: SensitiveWord = {
      ...this.data[index],
      ...(dto.word !== undefined && { word: dto.word }),
      ...(dto.category !== undefined && { category: dto.category }),
      ...(dto.level !== undefined && { level: dto.level }),
      ...(dto.enabled !== undefined && { enabled: dto.enabled }),
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

  static async toggleEnabled(id: string): Promise<void> {
    await this.delay();

    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error('敏感词不存在');
    }

    this.data[index] = {
      ...this.data[index],
      enabled: !this.data[index].enabled,
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
      byCategory: {
        text: 0,
        image: 0,
        video: 0,
        audio: 0,
      },
      byLevel: {
        high: 0,
        medium: 0,
        low: 0,
      },
      enabled: 0,
      disabled: 0,
    };

    for (const item of this.data) {
      stats.byCategory[item.category] += 1;
      stats.byLevel[item.level] += 1;
      if (item.enabled) {
        stats.enabled += 1;
      } else {
        stats.disabled += 1;
      }
    }

    return stats;
  }

  static resetMockData(): void {
    this.data = createMockData();
  }
}

export default MockSensitiveWordService;
