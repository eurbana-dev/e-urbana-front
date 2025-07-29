// src/components/landing/AboutUsSection.jsx
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  List,
  ListItem,
  ListIcon,
  Image,
  useColorModeValue,
  SimpleGrid,
} from '@chakra-ui/react'
import { CheckCircle } from 'phosphor-react'
import illustration from '../../assets/imagenes/developer.svg' 

const AboutUsSection = () => {
  const highlight = useColorModeValue('brand.400', 'brand.300')
  const textColor = useColorModeValue('brand.900', 'white')
  const mutedText = useColorModeValue('gray.600', 'gray.400')

  return (
    <Box py={{ base: '3rem', md: '4rem' }} bg="white">
      <Container maxW="6xl">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          gap={{ base: '2rem', md: '4rem' }}
        >
          {/* Imagen */}
          <Box flex="1" textAlign="center">
            <Image
              src={illustration}
              alt="Ilustración programador"
              maxW="100%"
              height="auto"
            />
          </Box>

          {/* Texto */}
          <Box flex="1">
            <Text fontSize="sm" color={highlight} fontWeight="bold" mb="0.5rem">
              NOSOTROS
            </Text>

            <Heading
              fontSize={{ base: '1.75rem', md: '2.25rem' }}
              color={textColor}
              mb="1rem"
            >
              ¿Quiénes somos?
            </Heading>

            <Text fontSize="1rem" color={mutedText} mb="1rem" lineHeight="1.8">
              En E-Urbana, estamos comprometidos con la eficiencia y la
              innovación en la gestión del alumbrado público. Nuestro objetivo
              es transformar las ciudades con soluciones inteligentes que
              optimicen recursos, reduzcan costos y mejoren la calidad de vida
              de las personas.
            </Text>

            <Text fontSize="1rem" color={mutedText} mb="1.5rem" lineHeight="1.8">
              Con un enfoque en tecnología, automatización y seguridad,
              facilitamos la administración de espacios, luminarias e insumos,
              reduciendo tiempos de respuesta y mejorando la toma de decisiones.
            </Text>

            <List spacing={3} mb="2rem">
              <ListItem color={textColor}>
                <ListIcon as={CheckCircle} color={highlight} />
                Eficiencia sin límites
              </ListItem>
              <ListItem color={textColor}>
                <ListIcon as={CheckCircle} color={highlight} />
                Control total, cero desperdicios
              </ListItem>
              <ListItem color={textColor}>
                <ListIcon as={CheckCircle} color={highlight} />
                Datos que potencian decisiones
              </ListItem>
            </List>

            {/* Contadores */}
            <SimpleGrid columns={{ base: 2, md: 2 }} spacing="2rem">
              <VStack spacing="0">
                <Heading color={textColor} fontSize="2rem">
                  100
                </Heading>
                <Text fontSize="sm" color={mutedText}>
                  Empresas con nosotros
                </Text>
              </VStack>
              <VStack spacing="0">
                <Heading color={textColor} fontSize="2rem">
                  2
                </Heading>
                <Text fontSize="sm" color={mutedText}>
                  Años de servicio
                </Text>
              </VStack>
            </SimpleGrid>
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}

export default AboutUsSection
