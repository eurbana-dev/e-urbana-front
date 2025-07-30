// src/components/Loader.jsx
import React, { useState, useEffect } from "react"
import { Box, Image } from "@chakra-ui/react"
import loaderGif from "../assets/gifs/Loading.gif" // ajusta la ruta a tu GIF

const Loader = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [delayDone, setDelayDone] = useState(false)
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Marca isLoaded cuando el window.load dispare, o si ya estaba completo
    const onLoad = () => setIsLoaded(true)
    if (document.readyState === "complete") {
      setIsLoaded(true)
    } else {
      window.addEventListener("load", onLoad)
    }

    // Asegura un mínimo de 3 segundos
    const delayTimer = setTimeout(() => setDelayDone(true), 3000)

    return () => {
      window.removeEventListener("load", onLoad)
      clearTimeout(delayTimer)
    }
  }, [])

  // Cuando ambos flags están en true, iniciamos el fade out
  useEffect(() => {
    if (isLoaded && delayDone) {
      setFadeOut(true)
      // Desmonta el loader tras 0.5s (mismo tiempo que la transición)
      const fadeTimer = setTimeout(() => setVisible(false), 500)
      return () => clearTimeout(fadeTimer)
    }
  }, [isLoaded, delayDone])

  // Si ya terminó la transición, no montamos nada
  if (!visible) return null

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      bg="white"
      zIndex="9999"
      display="flex"
      alignItems="center"
      justifyContent="center"
      opacity={fadeOut ? 0 : 1}
      transition="opacity 0.5s ease"
    >
      <Image src={loaderGif} alt="Cargando..." boxSize="8rem" />
    </Box>
  )
}

export default Loader
