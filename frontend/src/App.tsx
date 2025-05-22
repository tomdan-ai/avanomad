import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import USSDInterface from './pages/USSDInterface'
import AOS from "aos"
import 'aos/dist/aos.css'
import { useEffect } from "react"

function App() {

  useEffect(() => {
    AOS.init()
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ussd-interface" element={<USSDInterface />} />
      </Routes>
    </Router>
  )
}

export default App
