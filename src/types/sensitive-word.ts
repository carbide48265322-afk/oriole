export type WordCategory = 'politics' | 'violence' | 'porn' | 'ad' | 'abuse' | 'other';
export type WordType = 'parent' | 'variant';
export type WordStatus = 'enabled' | 'pending' | 'disabled';

export const WORD_CATEGORY_LABELS: Record<WordCategory, string> = {
  politics: '政治',
  violence: '暴力',
  porn: '色情',
  ad: '广告',
  abuse: '辱骂',
  other: '其他',
};

export const WORD_STATUS_LABELS: Record<WordStatus, string> = {
  enabled: '启用',
  pending: '待审核',
  disabled: '禁用',
};

export interface SensitiveWord {
  id: string;
  word: string;
  category: WordCategory;
  type: WordType;
  parentWordId?: string;
  level: 'high' | 'medium' | 'low';
  status: WordStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWordDTO {
  word: string;
  category: WordCategory;
  type: WordType;
  parentWordId?: string;
  level: 'high' | 'medium' | 'low';
  status?: WordStatus;
}

export interface UpdateWordDTO {
  word?: string;
  category?: WordCategory;
  type?: WordType;
  parentWordId?: string;
  level?: 'high' | 'medium' | 'low';
  status?: WordStatus;
}

export interface WordStats {
  total: number;
  todayAdded: number;
  enabled: number;
  pending: number;
  disabled: number;
}
