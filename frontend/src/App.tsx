import './App.css';
import { Link, Route, Routes } from 'react-router';
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import PostCreatePage from './pages/PostCreatePage';
import PostListPage from './pages/PostListPage';
import SignupPage from './pages/SignupPage';
import UserPage from './pages/UserPage';

function App() {
  return (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link> {' | '}
          <Link to="/signup">회원가입</Link> {' | '}
          <Link to="/login">로그인</Link> {' | '}
          <Link to="/posts">운동 기록</Link> {' | '}
          <Link to="/posts/new">기록 작성</Link> {' | '}
          <Link to="/about">About</Link> {' | '}
          <Link to="/users">Users</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/signup' element={<SignupPage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path="/posts" element={<PostListPage />} />
        <Route path="/posts/new" element={<PostCreatePage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/users" element={<UserPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;