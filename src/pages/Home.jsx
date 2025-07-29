// src/pages/Home.jsx
import React from "react"
import Navbar          from "../components/landing/Navbar.jsx"
import Hero            from "../components/landing/hero.jsx"
import ServicesSection from "../components/landing/ServicesSection.jsx"
import WhyChooseUsSection from "../components/landing/WhyChooseUsSection.jsx"
import AboutUsSection from "../components/landing/AboutUsSection.jsx"
import Footer          from "../components/landing/Footer.jsx"

const Home = () => (
  <>
    <Navbar />
    <Hero />
    <ServicesSection />
    <WhyChooseUsSection />
    <AboutUsSection />
    <Footer />
  </>
)

export default Home
