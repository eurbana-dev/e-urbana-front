// src/App.jsx
import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Loader   from "./components/Loader.jsx"
import Home     from "./pages/Home.jsx"
import Contacto from "./pages/test/contacto.jsx"
import Login    from "./pages/test/login.jsx"

function App() {
  return (
    <>
      {/* Loader con fade-out */}
      <Loader />

      <Router>
        <Routes>
          <Route path="/"         element={<Home     />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login"    element={<Login    />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
