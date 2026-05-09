import React from 'react';
import { GameStats } from '../types';

interface GameOverProps {
  stats: GameStats;
  onRestart: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ stats, onRestart }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border-b-8 border-red-600 transform scale-100 transition-transform">
        <div className="text-8xl mb-4 animate-bounce">🧟‍♂️</div>
        <h2 className="text-4xl font-black text-red-600 mb-2 uppercase tracking-wider">
          家園被攻破了！
        </h2>
        <p className="text-gray-500 mb-8 font-medium text-lg">
          喪屍闖進了你的房子...
        </p>

        <div className="bg-gray-100 rounded-2xl p-6 mb-8 grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase font-bold">總分</span>
            <span className="text-3xl font-black text-gray-800">{stats.score}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase font-bold">消滅喪屍</span>
            <span className="text-3xl font-black text-gray-800">{stats.wordsTyped}</span>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="w-full bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-2"
        >
          <span>🦸‍♂️</span>
          <span>再玩一次</span>
        </button>
      </div>
    </div>
  );
};