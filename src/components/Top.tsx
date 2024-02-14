import { Link } from 'react-router-dom';

function Top() {
  return (
    <div className="grid h-screen w-full content-baseline bg-blue-100">
      <div className="mx-auto mt-10 grid w-4/5 gap-8 rounded-2xl bg-white p-8 drop-shadow-md">
        <h1 className="text-3xl font-bold">
          React 100本ノック
        </h1>
        <ul className='text-blue-500 underline'>
          <li>
            <Link to="/lesson1">レッスン1 </Link>
          </li>
          <li>
            <Link to="/lesson2">レッスン2 </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Top
