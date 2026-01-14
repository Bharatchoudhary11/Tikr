import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Deals from './pages/Deals'
import SignIn from './pages/SignIn'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
