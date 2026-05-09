import { WordItem, Difficulty } from './types';

// Fallback words in case API fails or for initial load
export const FALLBACK_WORDS: Record<Difficulty, WordItem[]> = {
  [Difficulty.P1_P2]: [
    { en: "apple", zh: "蘋果", pos: "n." },
    { en: "cat", zh: "貓", pos: "n." },
    { en: "dog", zh: "狗", pos: "n." },
    { en: "book", zh: "書", pos: "n." },
    { en: "run", zh: "跑", pos: "v." },
    { en: "big", zh: "大的", pos: "adj." },
    { en: "red", zh: "紅色", pos: "n./adj." },
    { en: "eat", zh: "吃", pos: "v." },
    { en: "happy", zh: "快樂的", pos: "adj." },
    { en: "school", zh: "學校", pos: "n." }
  ],
  [Difficulty.P3_P4]: [
    { en: "breakfast", zh: "早餐", pos: "n." },
    { en: "teacher", zh: "老師", pos: "n." },
    { en: "beautiful", zh: "美麗的", pos: "adj." },
    { en: "library", zh: "圖書館", pos: "n." },
    { en: "computer", zh: "電腦", pos: "n." },
    { en: "friend", zh: "朋友", pos: "n." },
    { en: "listen", zh: "聽", pos: "v." },
    { en: "supermarket", zh: "超級市場", pos: "n." },
    { en: "weather", zh: "天氣", pos: "n." },
    { en: "dangerous", zh: "危險的", pos: "adj." }
  ],
  [Difficulty.P5_P6]: [
    { en: "environment", zh: "環境", pos: "n." },
    { en: "responsible", zh: "負責任的", pos: "adj." },
    { en: "competition", zh: "比賽", pos: "n." },
    { en: "exciting", zh: "令人興奮的", pos: "adj." },
    { en: "technology", zh: "科技", pos: "n." },
    { en: "volunteer", zh: "義工", pos: "n." },
    { en: "communicate", zh: "溝通", pos: "v." },
    { en: "successful", zh: "成功的", pos: "adj." },
    { en: "traditional", zh: "傳統的", pos: "adj." },
    { en: "challenging", zh: "具挑戰性的", pos: "adj." }
  ]
};

export const ZOMBIE_START_POS = 100;
export const PLAYER_POS = 0;
export const DAMAGE_ON_WRONG = 20; // Zombie jumps forward 20%
export const BASE_SPEED = 0.05; // Lowered speed (~20s to cross)
export const SPEED_INCREMENT = 0.01; // Reduced increment to keep it manageable