import { Difficulty, WordItem } from '../types';
import { FALLBACK_WORDS } from '../constants';

// API not in use — words are served from the local FALLBACK_WORDS list.
export const fetchWordsFromGemini = async (difficulty: Difficulty, _count: number = 10): Promise<WordItem[]> => {
  return FALLBACK_WORDS[difficulty];
};