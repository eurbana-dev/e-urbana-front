import React, { useRef } from "react"
import Navbar from "../components/landing/Navbar.jsx"
import Hero from "../components/landing/hero.jsx"
import ServicesSection from "../components/landing/ServicesSection.jsx"
import WhyChooseUsSection from "../components/landing/WhyChooseUsSection.jsx"
import AboutUsSection from "../components/landing/AboutUsSection.jsx"
import Footer from "../components/landing/Footer.jsx"

const Home = () => {
  const servicesRef = useRef(null)

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <Navbar />
      <Hero scrollToServices={scrollToServices} />
      <div ref={servicesRef}>
        <ServicesSection />
      </div>
      <WhyChooseUsSection />
      <AboutUsSection />
      <Footer />
    </>
  )
}

export default Home
