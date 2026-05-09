import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WordItem, GameStats } from '../types';
import { ZOMBIE_START_POS, PLAYER_POS, DAMAGE_ON_WRONG, BASE_SPEED, SPEED_INCREMENT } from '../constants';

interface GameLoopProps {
  initialWords: WordItem[];
  fetchMoreWords: () => Promise<WordItem[]>;
  onGameOver: (stats: GameStats) => void;
}

const ZOMBIE_SKINS = ['🧟', '🧟‍♂️', '🧟‍♀️', '🧛', '🧙‍♀️', '🦸‍♂️', '🦹', '🤖', '👻', '👺', '👾'];

export const GameLoop: React.FC<GameLoopProps> = ({ initialWords, fetchMoreWords, onGameOver }) => {
  const [wordsQueue, setWordsQueue] = useState<WordItem[]>(initialWords);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [input, setInput] = useState('');
  const [zombiePos, setZombiePos] = useState(ZOMBIE_START_POS);
  const [stats, setStats] = useState<GameStats>({ score: 0, level: 1, wordsTyped: 0 });
  const [isShaking, setIsShaking] = useState(false);
  const [feedback, setFeedback] = useState<'none' | 'hit' | 'kill'>('none');
  const [zombieSkin, setZombieSkin] = useState(ZOMBIE_SKINS[0]);
  
  // Shooting mechanic states
  const [isFiring, setIsFiring] = useState(false);
  const [projectilePos, setProjectilePos] = useState<number | null>(null); // % position
  
  const tickRef = useRef<number | null>(null);
  const speedRef = useRef(BASE_SPEED);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentWord = wordsQueue[currentWordIndex];

  // Game Loop Ticker
  useEffect(() => {
    let lastTime = performance.now();
    
    const tick = (time: number) => {
      setZombiePos((prev) => {
        // Game over check condition
        if (prev <= PLAYER_POS) return PLAYER_POS; 
        
        // Move zombie
        const newPos = prev - speedRef.current;
        return newPos < PLAYER_POS ? PLAYER_POS : newPos;
      });
      
      tickRef.current = requestAnimationFrame(tick);
    };

    tickRef.current = requestAnimationFrame(tick);

    return () => {
      if (tickRef.current) cancelAnimationFrame(tickRef.current);
    };
  }, []);

  // Check Game Over
  useEffect(() => {
    if (zombiePos <= PLAYER_POS) {
      if (tickRef.current) cancelAnimationFrame(tickRef.current);
      onGameOver(stats);
    }
  }, [zombiePos, onGameOver, stats]);

  // Focus Input on mount and keep focus
  useEffect(() => {
    const focusInterval = setInterval(() => {
        if(inputRef.current) inputRef.current.focus();
    }, 1000);
    return () => clearInterval(focusInterval);
  }, []);

  // Word Queue Management
  useEffect(() => {
    if (wordsQueue.length - currentWordIndex < 5) {
      fetchMoreWords().then(newWords => {
        setWordsQueue(prev => [...prev, ...newWords]);
      });
    }
  }, [currentWordIndex, wordsQueue.length, fetchMoreWords]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Prevent typing if game is effectively over or projectile is firing
    if (zombiePos <= PLAYER_POS || isFiring) return;
    
    setInput(val);
  };

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    if (!currentWord || zombiePos <= PLAYER_POS || isFiring) return;

    if (input.trim().toLowerCase() === currentWord.en.toLowerCase()) {
      // Correct! Initiate Shooting Sequence
      setIsFiring(true);
      setInput(''); 
      
      // Capture target pos at moment of firing
      const targetPos = zombiePos;

      // 1. Start projectile at player
      setProjectilePos(0);

      // 2. Animate to Zombie Position
      setTimeout(() => {
        setProjectilePos(targetPos);
      }, 20);

      // 3. Impact logic
      setTimeout(() => {
        // Impact!
        setStats(prev => ({
          score: prev.score + 10 * prev.level,
          wordsTyped: prev.wordsTyped + 1,
          level: Math.floor((prev.wordsTyped + 1) / 5) + 1
        }));
        
        // Increase speed
        if ((stats.wordsTyped + 1) % 5 === 0) {
          speedRef.current += SPEED_INCREMENT;
        }

        // Kill Feedback
        setFeedback('kill');
        
        // Reset Zombie Position instantly to Start
        setZombiePos(ZOMBIE_START_POS);

        // Change Skin
        setZombieSkin(ZOMBIE_SKINS[Math.floor(Math.random() * ZOMBIE_SKINS.length)]);
        
        // Reset Projectile
        setProjectilePos(null);
        setIsFiring(false);

        // Next Word
        setCurrentWordIndex(prev => prev + 1);

        // Clear feedback after a moment
        setTimeout(() => setFeedback('none'), 300);
      }, 400); // Projectile travel time

    } else {
      // Wrong!
      setIsShaking(true);
      setFeedback('hit');
      setTimeout(() => {
        setIsShaking(false);
        setFeedback('none');
      }, 500);

      // Zombie jumps forward instantly
      setZombiePos(prev => Math.max(PLAYER_POS, prev - DAMAGE_ON_WRONG));
      setInput(''); 
    }
  }, [input, currentWord, zombiePos, stats.wordsTyped, isFiring]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!currentWord) return <div>Loading...</div>;

  const isDanger = zombiePos < 30;
  const bgColor = isDanger ? 'bg-red-50' : 'bg-green-50';

  return (
    <div className={`flex flex-col h-screen ${bgColor} transition-colors duration-1000 select-none`}>
      {/* Top Bar: Stats */}
      <div className="flex justify-between items-center p-4 bg-white/80 backdrop-blur shadow-sm z-20">
        <div className="flex items-center space-x-4">
          <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-bold shadow-sm border-b-2 border-yellow-500">
            分數: {stats.score}
          </div>
          <div className="bg-blue-400 text-blue-900 px-3 py-1 rounded-full font-bold shadow-sm border-b-2 border-blue-500">
            關卡: {stats.level}
          </div>
        </div>
        <div className="text-gray-500 font-medium">已消滅: <span className="text-gray-800 font-bold">{stats.wordsTyped}</span> 隻喪屍</div>
      </div>

      {/* Main Game Lane */}
      <div className="flex-1 relative flex flex-col justify-center overflow-hidden">
        
        {/* The Lane */}
        <div className="absolute top-1/2 left-0 w-full h-32 -translate-y-1/2 bg-green-200 border-y-4 border-green-300">
           {/* Grass patterns */}
           <div className="w-full h-full opacity-30" style={{ backgroundImage: 'radial-gradient(#4ade80 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
        </div>

        {/* Characters Container */}
        <div className="relative w-full max-w-5xl mx-auto h-32 pointer-events-none">
          
          {/* Player (House + Hero) */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-transform duration-300" style={{ transform: `translateY(-50%) scale(${isDanger ? 1.05 : 1})` }}>
             {/* House Background */}
             <div className="text-8xl drop-shadow-2xl relative z-10">
               🏠
               {isDanger && <div className="absolute -top-6 -right-6 text-5xl animate-bounce z-30">⚠️</div>}
             </div>
             {/* Hero Character */}
          </div>

          {/* Projectile (Ball/Magic) */}
          {projectilePos !== null && (
            <div 
              className="absolute top-1/2 -translate-y-1/2 z-10 will-change-[left]"
              style={{ 
                left: `calc(7rem + ${projectilePos * 0.8}%)`, 
                width: '24px',
                height: '24px',
                backgroundColor: '#3b82f6', // Blue magic ball
                borderRadius: '50%',
                boxShadow: '0 0 15px #60a5fa',
                transform: 'translateY(15px)',
                transition: 'left 0.38s linear'
              }}
            />
          )}

          {/* Zombie */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 will-change-transform z-10 transition-transform duration-200"
            style={{ 
              left: `${10 + (zombiePos * 0.8)}%`, 
              transform: `translateY(-50%) ${feedback === 'hit' ? 'scale(1.2)' : 'scale(1)'}`
            }}
          >
            <div className="relative">
              <div className="text-7xl drop-shadow-xl transform scale-x-[-1] grayscale-[20%]">
                {zombieSkin}
              </div>
              
              {/* Hit Feedback Text */}
              {feedback === 'hit' && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-red-600 font-black text-3xl animate-bounce whitespace-nowrap drop-shadow-white">
                  接近中!!
                </div>
              )}
              
              {/* Word Balloon above Zombie */}
              <div className={`absolute -top-28 left-1/2 -translate-x-1/2 bg-white/90 border-4 ${isFiring ? 'opacity-0 scale-90' : 'opacity-100 scale-100'} transition-all duration-300 border-gray-800 px-6 py-3 rounded-2xl whitespace-nowrap shadow-lg flex flex-col items-center min-w-[180px]`}>
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">{currentWord.pos}</span>
                <span className="text-3xl font-black text-gray-800 font-sans tracking-wide mb-1">{currentWord.zh}</span>
                {/* Triangular pointer */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-t-[12px] border-t-gray-800 border-r-[10px] border-r-transparent"></div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Control Area (Bottom) */}
      <div className="bg-white p-6 pb-10 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-20">
        <div className="max-w-2xl mx-auto w-full">
          <div className={`relative ${isShaking ? 'shake' : ''}`}>
            {/* Wrong Answer Overlay Message */}
            {feedback === 'hit' && (
               <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-red-500 font-black text-xl animate-pulse tracking-widest bg-white/90 px-4 py-2 rounded-full border-2 border-red-200 shadow-lg">
                 錯誤！ 喪屍加速！
               </div>
            )}

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isFiring}
              className={`w-full text-center text-4xl font-bold py-4 rounded-2xl border-4 outline-none transition-all shadow-inner tracking-widest
                ${feedback === 'hit' 
                  ? 'border-red-500 bg-red-900 text-white placeholder-red-300' 
                  : 'border-slate-600 focus:border-blue-500 bg-slate-800 text-white placeholder-slate-500'}
                ${isFiring ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              placeholder={isFiring ? "發射中..." : "輸入英文單詞..."}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm hidden md:block">
              按 ENTER 發射
            </div>
          </div>
          
          <div className="mt-4 flex justify-center items-center space-x-2">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${isDanger ? 'bg-red-500' : 'bg-green-500'}`} 
                style={{ width: `${zombiePos}%` }}
              />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase w-20 text-right">距離</span>
          </div>
        </div>
      </div>
      
      {/* Screen Flash on Hit */}
      {feedback === 'hit' && (
        <div className="absolute inset-0 bg-red-500/10 pointer-events-none z-50 animate-pulse" />
      )}
    </div>
  );
};