export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  LOADING = 'LOADING'
}

export enum Difficulty {
  P1_P2 = 'P1-P2 (Junior)',
  P3_P4 = 'P3-P4 (Middle)',
  P5_P6 = 'P5-P6 (Senior)'
}

export interface WordItem {
  en: string;
  zh: string;
  pos: string; // Part of Speech
}

export interface GameStats {
  score: number;
  level: number;
  wordsTyped: number;
}