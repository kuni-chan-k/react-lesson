import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Error404 from './pages/404';
import TopPage from './pages/TopPage';
import LessonPage1 from './pages/LessonPage1';
import LessonPage2 from './pages/LessonPage2';

function App() {
  return (
    <BrowserRouter basename="/react/">
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="lesson1" element={<LessonPage1 />} />
        <Route path="lesson2" element={<LessonPage2 />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;