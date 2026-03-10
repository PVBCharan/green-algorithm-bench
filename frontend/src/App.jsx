// App.jsx
// Main application with routing — Analyzer removed
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import StockBenchmark from './pages/StockBenchmark'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Landing />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="stocks" element={<StockBenchmark />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
