export type WordCategory = 'text' | 'image' | 'video' | 'audio';
export type WordLevel = 'high' | 'medium' | 'low';

export interface SensitiveWord {
  id: string;
  word: string;
  category: WordCategory;
  level: WordLevel;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWordDTO {
  word: string;
  category: WordCategory;
  level: WordLevel;
}

export interface UpdateWordDTO {
  word?: string;
  category?: WordCategory;
  level?: WordLevel;
  enabled?: boolean;
}

export interface WordStats {
  total: number;
  todayAdded: number;
  byCategory: Record<WordCategory, number>;
  byLevel: Record<WordLevel, number>;
  enabled: number;
  disabled: number;
}
