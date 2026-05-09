import React, { useState, useCallback } from 'react';
import { StartScreen } from './components/StartScreen';
import { GameLoop } from './components/GameLoop';
import { GameOver } from './components/GameOver';
import { fetchWordsFromGemini } from './services/geminiService';
import { Difficulty, GameState, GameStats, WordItem } from './types';
import { FALLBACK_WORDS } from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.P1_P2);
  const [currentWords, setCurrentWords] = useState<WordItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [finalStats, setFinalStats] = useState<GameStats>({ score: 0, level: 1, wordsTyped: 0 });

  const handleStartGame = async (selectedDifficulty: Difficulty) => {
    setIsLoading(true);
    setDifficulty(selectedDifficulty);
    
    // Initial fetch
    try {
      const words = await fetchWordsFromGemini(selectedDifficulty, 10);
      setCurrentWords(words);
      setGameState(GameState.PLAYING);
    } catch (e) {
      console.error("Failed to start", e);
      // Fallback
      setCurrentWords(FALLBACK_WORDS[selectedDifficulty]);
      setGameState(GameState.PLAYING);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchMoreWords = useCallback(async (): Promise<WordItem[]> => {
    return await fetchWordsFromGemini(difficulty, 5);
  }, [difficulty]);

  const handleGameOver = (stats: GameStats) => {
    setFinalStats(stats);
    setGameState(GameState.GAME_OVER);
  };

  const handleRestart = () => {
    setGameState(GameState.START);
    setFinalStats({ score: 0, level: 1, wordsTyped: 0 });
    setCurrentWords([]);
  };

  return (
    <div className="antialiased text-gray-800 h-screen w-screen overflow-hidden font-sans">
      {gameState === GameState.START && (
        <StartScreen onStart={handleStartGame} loading={isLoading} />
      )}

      {gameState === GameState.PLAYING && (
        <GameLoop 
          initialWords={currentWords} 
          fetchMoreWords={handleFetchMoreWords}
          onGameOver={handleGameOver}
        />
      )}

      {gameState === GameState.GAME_OVER && (
        <GameOver stats={finalStats} onRestart={handleRestart} />
      )}
    </div>
  );
};

export default App;