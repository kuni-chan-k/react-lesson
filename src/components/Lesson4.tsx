import { useState, useEffect, useRef, useCallback } from 'react';
import Sound from '@/assets/sound/demo.mp3';

// レッスン4 Timer
// https://qiita.com/Sicut_study/items/1e4d8ec06f1af42a47e5
// 音源 和太鼓でドドン.mp3
// https://soundeffect-lab.info/sound/anime/
const Lesson4: React.FC = () => {
  const DEFAULT_TIMER = 10; // タイマーの総時間（秒）

  const [countTime, setCountTime] = useState<number>(DEFAULT_TIMER); // 残り時間
  const [isCounting, setIsCounting] = useState<boolean>(false); // タイマーが動作中かどうか
  const [progress, setProgress] = useState<number>(0); // プログレスバーの進捗（パーセンテージ）

  const requestRef = useRef<number | null>(null); // アニメーションフレームID
  const startTimeRef = useRef<number | null>(null); // タイマー開始時刻
  const elapsedTimeRef = useRef<number>(0); // 一時停止までの経過時間

  // プログレスバーの更新とタイマーのカウントダウンを行う関数
  const updateProgressAndTime = useCallback((now: number) => {
    if (!startTimeRef.current) return;

    const elapsedTime = (now - startTimeRef.current) / 1000 + elapsedTimeRef.current; // 総経過時間
    const remainingTime = Math.max(DEFAULT_TIMER - elapsedTime, 0);
    setCountTime(Math.ceil(remainingTime));

    const progressPercentage = (elapsedTime / DEFAULT_TIMER) * 100;
    setProgress(progressPercentage);

    if (remainingTime > 0) {
      requestRef.current = requestAnimationFrame(updateProgressAndTime);
    } else {
      setIsCounting(false);
      const audio = new Audio(Sound);
      audio.play()
    }
  }, []);

  useEffect(() => {
    if (isCounting) {
      requestRef.current = requestAnimationFrame(updateProgressAndTime);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [updateProgressAndTime, isCounting]);

  const startClick = (): void => {
    if (!isCounting) {
      setIsCounting(true);
      // ここで経過時間を考慮してstartTimeRef.currentを更新
      if (startTimeRef.current === null) {
        startTimeRef.current = performance.now();
      } else {
        // 一時停止からの経過時間を考慮してstartTimeRef.currentを再計算
        startTimeRef.current = performance.now() - elapsedTimeRef.current * 1000;
      }
      elapsedTimeRef.current = 0; // 一時停止からの経過時間をリセット
      requestRef.current = requestAnimationFrame(updateProgressAndTime);
    }
  };

  const pauseClick = (): void => {
    if (isCounting) {
      setIsCounting(false);
      if (startTimeRef.current !== null) {
        // 一時停止時の経過時間を更新
        elapsedTimeRef.current += (performance.now() - startTimeRef.current) / 1000;
      }
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    }
  };

  const resetClick = (): void => {
    setIsCounting(false);
    setCountTime(DEFAULT_TIMER);
    setProgress(0);
    elapsedTimeRef.current = 0;
    startTimeRef.current = null;
  };

  return (
    <div className="grid h-screen w-full content-center bg-blue-100">
      <div className="mx-auto grid gap-16 rounded-2xl bg-white p-8 drop-shadow-md">
        <h1 className="text-center text-xl font-bold text-zinc-400">
          React Timer
        </h1>
        <div className="relative size-full">
          <svg viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
            <circle
              r={50}
              cx="60"
              cy="60"
              stroke="#4169e1"
              strokeWidth="5"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 50}
              strokeDashoffset={(1 - progress / 100) * 2 * Math.PI * 50}
            />
          </svg>
          <div className="absolute left-1/2 top-1/2 text-6xl font-bold text-blue-800" style={{ transform: 'translate(-50%, -50%)' }}>
            {countTime}
          </div>
        </div>
        <div className='flex justify-center gap-6'>
          <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700" onClick={startClick} disabled={isCounting}>スタート</button>
          <button className="rounded bg-yellow-500 px-4 py-2 font-bold text-white hover:bg-yellow-700" onClick={pauseClick} disabled={!isCounting}>一時停止</button>
          <button className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700" onClick={resetClick}>リセット</button>
        </div>
      </div>
    </div>
  );
};

export default Lesson4;