import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import CategoryPage from './pages/CategoryPage';
import Admin from './pages/Admin';
import Header from './components/Header';
import { useEffect } from 'react';
// AuthProvider đã được import trong main.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  // Add title to the page
  useEffect(() => {
    document.title = 'Tuổi Trẻ News - Đọc tin tức mới nhất';
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
}

export default App;
