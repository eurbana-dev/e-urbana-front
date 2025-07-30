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
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import illustration from '../../assets/images/developer.svg'

const MotionBox = motion(Box)
const MotionFlex = motion(Flex)
const MotionVStack = motion(VStack)

const AboutUsSection = () => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-100px 0px' })

  const highlight = useColorModeValue('brand.400', 'brand.300')
  const textColor = useColorModeValue('brand.900', 'white')
  const mutedText = useColorModeValue('gray.600', 'gray.400')

  return (
    <Box py={{ base: '3rem', md: '4rem' }} bg="white" ref={ref}>
      <Container maxW="6xl">
        <MotionFlex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          gap={{ base: '2rem', md: '4rem' }}
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* Imagen */}
          <MotionBox
            flex="1"
            textAlign="center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Image
              src={illustration}
              alt="Ilustración programador"
              maxW="100%"
              height="auto"
            />
          </MotionBox>

          {/* Texto */}
          <MotionBox
            flex="1"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
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

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
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
            </MotionBox>

            {/* Contadores */}
            <SimpleGrid columns={{ base: 2, md: 2 }} spacing="2rem">
              <MotionVStack
                spacing="0"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Heading color={textColor} fontSize="2rem">
                  100
                </Heading>
                <Text fontSize="sm" color={mutedText}>
                  Empresas con nosotros
                </Text>
              </MotionVStack>
              <MotionVStack
                spacing="0"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <Heading color={textColor} fontSize="2rem">
                  2
                </Heading>
                <Text fontSize="sm" color={mutedText}>
                  Años de servicio
                </Text>
              </MotionVStack>
            </SimpleGrid>
          </MotionBox>
        </MotionFlex>
      </Container>
    </Box>
  )
}

export default AboutUsSection
