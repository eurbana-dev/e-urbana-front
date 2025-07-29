// src/components/landing/ServicesSection.jsx
import React from 'react'
import {
  Box,
  Container,
  VStack,
  Text,
  Heading,
  useColorModeValue,
  Center,
  useTheme,
} from '@chakra-ui/react'
import { GridFour, ArrowClockwise, Envelope } from 'phosphor-react'

const ServicesSection = () => {
  const theme = useTheme()

  const services = [
    {
      icon: GridFour,
      title: 'Redefiniendo el Consumo Energético',
      description:
        'Diseñamos sistemas de iluminación inteligente que adaptan el consumo energético a las condiciones ambientales y la demanda, optimizando recursos y reduciendo costos.',
      accentColor: theme.colors.brand[500],
    },
    {
      icon: ArrowClockwise,
      title: 'Eficiencia en Acción',
      description:
        'Aplicamos tecnología avanzada para gestionar y monitorear luminarias de forma remota, facilitando el mantenimiento predictivo.',
      accentColor: theme.colors.brand[400],
    },
    {
      icon: Envelope,
      title: 'Sostenibilidad en Cada Paso',
      description:
        'Reducimos el impacto ambiental gestionando eficientemente el consumo eléctrico y disminuyendo las emisiones de CO₂.',
      accentColor: theme.colors.brand[300],
    },
  ]

  const bgColor   = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('brand.900', 'white')
  const descColor = useColorModeValue('gray.600', 'gray.300')

  return (
    <Box bg={bgColor} py={{ base: '2rem', md: '3rem' }}>
      <Container maxW="3xl" centerContent>
        <Heading
          fontSize={{ base: '1.5rem', md: '2rem' }}
          mb="2rem"
          color={textColor}
          textTransform="uppercase"
          letterSpacing="wide"
          textAlign="center"
        >
          Objetivos que Iluminan el Futuro
        </Heading>

        <VStack spacing="1.5rem" w="100%">
          {services.map(({ icon: IconComp, title, description, accentColor }) => (
            <Box
              key={title}
              w="100%"
              bg={bgColor}
              borderWidth="1px"
              borderColor={accentColor}
              borderRadius="md"
              boxShadow="sm"
              p={{ base: '1rem', md: '1.5rem' }}
            >
              {/* Ícono arriba y centrado */}
              <Center mb="1rem" color={accentColor}>
                <IconComp size={48} weight="duotone" />
              </Center>

              {/* Título */}
              <Text
                fontSize={{ base: '1.125rem', md: '1.25rem' }}
                fontWeight="semibold"
                color={textColor}
                textAlign="center"
                mb="0.5rem"
              >
                {title}
              </Text>

              {/* Descripción */}
              <Text
                fontSize={{ base: '0.875rem', md: '1rem' }}
                color={descColor}
                textAlign="center"
              >
                {description}
              </Text>
            </Box>
          ))}
        </VStack>
      </Container>
    </Box>
  )
}

export default ServicesSection
