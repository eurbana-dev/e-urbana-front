import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/test/home.jsx"
// Puedes ir agregando más páginas: Dashboard, Login, etc.

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
