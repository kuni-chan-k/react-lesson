import { useState, useCallback } from 'react';

// レッスン2 Counter
// https://qiita.com/Sicut_study/items/82059f9cbb5b2996e5b3
function Lesson2() {
  const [count, setCount] = useState(0);
  const increaseButtonClick = useCallback(() => {
    if (count < 101) {
      setCount(count + 1)
    }
  }, [count]);
  const decreaseButtonClick = useCallback(() => {
    if (count > 0) {
      setCount(count - 1)
    }
  }, [count]);

  return (
    <div className="grid h-screen w-full content-center bg-blue-100">
      <div className="mx-auto grid gap-16 rounded-2xl bg-white p-8 drop-shadow-md">
        <h1 className="text-center text-xl font-bold text-zinc-400">
          React Counter
        </h1>

        <div className='text-center text-6xl font-bold text-blue-800'>
          {count}
        </div>

        <div className='flex justify-center gap-6'>
          <button
            className="size-12 rounded-full bg-blue-800 hover:bg-blue-500"
            onClick={increaseButtonClick}
          >
            <span className="text-2xl text-white">+</span>
          </button>
          <button
            className="size-12 rounded-full border-2 border-indigo-500 bg-white hover:bg-blue-100"
            onClick={decreaseButtonClick}
          >
            <span className="text-2xl text-blue-800">-</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Lesson2