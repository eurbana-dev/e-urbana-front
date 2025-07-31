import { Box, Flex } from "@chakra-ui/react"
import { Lightbulb } from "phosphor-react"
import { useEffect, useState } from "react"
import Auth from "../../components/auth/auth"

const getRandomColor = () => {
  const colors = ["#69e7ceff", "#65c7e4ff", "#30b39bff", "#68C1FF"]
  return colors[Math.floor(Math.random() * colors.length)]
}


const distance = (a, b) => {
  const dx = parseFloat(a.left) - parseFloat(b.left)
  const dy = parseFloat(a.top) - parseFloat(b.top)
  return Math.sqrt(dx * dx + dy * dy)
}

const AuthPage = () => {
  const [icons, setIcons] = useState([])

  useEffect(() => {
    const generatedIcons = []
    const maxIcons = 50
    const minDistance = 5 

    while (generatedIcons.length < maxIcons) {
      const top = (Math.random() * 90).toFixed(2)
      const left = (Math.random() * 90).toFixed(2)

      const position = { top, left }

      const tooClose = generatedIcons.some(
        (icon) => distance(icon, position) < minDistance
      )

      if (!tooClose) {
        generatedIcons.push({
          id: generatedIcons.length,
          top: `${top}%`,
          left: `${left}%`,
          size: Math.floor(Math.random() * 20) + 24,
          opacity: Math.random() * 0.2 + 0.3, 
          color: getRandomColor()
        })
      }
    }

    setIcons(generatedIcons)
  }, [])

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="white"
      px={4}
      position="relative"
      overflow="hidden"
    >
      {/* Fondo con bombillas */}
      <Box position="fixed" top={0} left={0} w="100%" h="100%" zIndex={0}>
        {icons.map((icon) => (
          <Box
            key={icon.id}
            position="fixed"
            top={icon.top}
            left={icon.left}
            opacity={icon.opacity}
            transition="color 2s ease-in-out"
          >
            <Lightbulb
              size={icon.size}
              color={icon.color}
              weight="light"
            />
          </Box>
        ))}
      </Box>


      <Box zIndex={1}>
        <Auth />
      </Box>
    </Flex>
  )
}

export default AuthPage
