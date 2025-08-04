// src/App.jsx
import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Loader from "./components/Loader.jsx"
import Home from "./pages/Home.jsx"
import Contacto from "./pages/test/contacto.jsx"
import Login from "./pages/test/login.jsx"
import AuthPage from "./pages/auth/authPage.jsx"
import Test from "./components/test/page.jsx"

function App() {
  return (
    <>


      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/test" element={<Test />} />

        </Routes>
      </Router>
    </>
  )
}

export default App
