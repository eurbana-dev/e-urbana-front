// src/components/Hero.jsx
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Stack,
  Image,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import lampIllustration from '../../assets/imagenes/luminaria2.png' // Asegúrate de que la ruta sea correcta


const Hero = () => {
  return (
    <Box
      as="section"
      id="home-section"
      bg="white"                // fondo blanco
      py={{ base: 8, md: 12 }}  // padding vertical reducido
      px={{ base: 4, md: 6 }}
    >
      <Flex
        maxW="4xl"               // ancho más contenido
        mx="auto"
        align="center"
        direction={{ base: 'column', lg: 'row' }}
        gap={6}
      >
        {/* Texto */}
        <Box
          w={{ base: '100%', lg: '45%' }}
          textAlign={{ base: 'center', lg: 'left' }}
        >
          <Heading
            as="h1"
            fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
            color="brand.900"
            mb={3}
            lineHeight="shorter"
          >
            Iluminación inteligente
            <br />
            para ciudades sostenibles
          </Heading>

          <Text
            fontSize={{ base: 'sm', md: 'md' }}
            color="gray.700"
            mb={5}
            maxW="lg"
            mx={{ base: 'auto', lg: 0 }}
          >
            <Box as="span" color="brand.500" fontWeight="bold">
              Ecoluz Urbana
            </Box>{' '}
            optimiza tu alumbrado público con sensores IoT, reduciendo costos
            y promoviendo la sostenibilidad urbana.
          </Text>

          <Stack
            direction={{ base: 'column', sm: 'row' }}
            spacing={4}
            justify={{ base: 'center', lg: 'flex-start' }}
          >

            <Button
              as={RouterLink}
              to="/more-info"
              size="md"
              variant="outline"
              color="brand.500"
              borderColor="brand.500"
              _hover={{ bg: 'brand.500', color: 'white' }}
            >
              Conoce más
            </Button>
          </Stack>
        </Box>

        {/* Ilustración */}
        <Box w={{ base: '80%', md: '60%', lg: '40%' }} mx="auto">
          <Image
            src={lampIllustration}
            alt="Luminaria inteligente"
            maxW="100%"
          />
        </Box>
      </Flex>
    </Box>
  )
}

export default Hero
