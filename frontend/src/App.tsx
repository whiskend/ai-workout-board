
import './App.css'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import UserPage from './pages/UserPage'
import NotFoundPage from './pages/NotFoundPage'

import {Link, Route, Routes } from 'react-router'

function App() {
  return (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link> {" | "}
          <Link to="/about">About</Link> {" | "}
          <Link to="/users">Users</Link>
        </nav>
      </header>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/about' element={<AboutPage/>} />
        <Route path='/users' element={<UserPage/>} />
        <Route path='*' element={<NotFoundPage/>} />
      </Routes>
    </>
  )
}

export default App
