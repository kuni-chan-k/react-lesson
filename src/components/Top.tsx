import { Link } from 'react-router-dom';

const Top = () => {
  const lessonData = [
    { title: "レッスン1 Hello World", path: "lesson1" },
    { title: "レッスン2 Counter", path: "lesson2" },
    { title: "レッスン3 Todo", path: "lesson3" },
    { title: "レッスン4 Timer", path: "lesson4" },
  ]

  return (
    <div className="grid h-screen w-full content-baseline bg-blue-100">
      <div className="mx-auto mt-10 grid w-5/6 gap-8 rounded-2xl bg-white p-6 drop-shadow-md md:w-4/5 md:p-8">
        <h1 className="text-3xl font-bold">
          React 100本ノック
        </h1>
        <ul className='text-blue-500 underline'>
          {
            lessonData.map((lesson) =>
              <li><Link to={lesson.path}>{lesson.title}</Link></li>
            )
          }
        </ul>
      </div>
    </div>
  )
}

export default Top
