// src/pages/Home.jsx
import React from "react"
import Navbar from "../components/landing/Navbar.jsx"
import Hero   from "./test/hero.jsx"    // <-- ruta corregida

const Home = () => (
  <>
    <Navbar />
    <Hero />
    {/* otras secciones... */}
  </>
)

export default Home
