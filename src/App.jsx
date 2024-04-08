import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import './App.css'
import Page404 from './Paginas/Page404'
import Login from './Paginas/Login'
import Dashboard from './Paginas/Dashboard'
import Espacios from './Paginas/Espacios'
import EspaciosUser from './Paginas/EspaciosUser'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<Page404 />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/espacios" element={<EspaciosUser />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
