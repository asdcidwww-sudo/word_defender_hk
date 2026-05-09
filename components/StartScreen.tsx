import React from 'react';
import { Difficulty } from '../types';

interface StartScreenProps {
  onStart: (difficulty: Difficulty) => void;
  loading: boolean;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, loading }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl">🧟</div>
        <div className="absolute bottom-20 right-20 text-6xl">🏠</div>
        <div className="absolute top-40 right-10 text-4xl">🦸‍♂️</div>
      </div>

      <div className="z-10 bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border-4 border-green-500 max-w-lg w-full text-center">
        <h1 className="text-4xl md:text-5xl font-black text-green-700 mb-2 tracking-wide drop-shadow-sm">
          WORD DEFENDER
        </h1>
        <h2 className="text-xl text-green-600 mb-8 font-bold">
          保衛家園！ 🏠
        </h2>
        
        <div className="space-y-4">
          <p className="text-gray-600 mb-4 font-medium">請選擇年級難度：</p>
          
          {(Object.values(Difficulty) as Difficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() => onStart(diff)}
              disabled={loading}
              className="w-full py-4 px-6 bg-white border-2 border-green-400 text-green-700 rounded-xl text-lg font-bold hover:bg-green-500 hover:text-white hover:scale-105 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between group"
            >
              <span>
                {diff.includes('P1') ? '初小 (P1-P2)' : diff.includes('P3') ? '中小 (P3-P4)' : '高小 (P5-P6)'}
              </span>
              <span className="text-2xl group-hover:animate-bounce">
                {diff.includes('P1') ? '🌱' : diff.includes('P3') ? '🌻' : '🌳'}
              </span>
            </button>
          ))}
        </div>

        {loading && (
          <div className="mt-6 flex items-center justify-center space-x-2 text-green-600 font-bold">
            <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>正在召喚喪屍...</span>
          </div>
        )}
      </div>
      
      <div className="mt-8 text-sm text-green-800 font-semibold bg-green-200 px-4 py-2 rounded-full shadow-sm border border-green-300">
        提示：輸入正確單詞發射魔法，若答錯喪屍會加速前進！
      </div>
    </div>
  );
};