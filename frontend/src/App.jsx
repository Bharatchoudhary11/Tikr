import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Deals from './pages/Deals'
import Memo from './pages/Memo'
import SignIn from './pages/SignIn'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/memos" element={<Memo />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
