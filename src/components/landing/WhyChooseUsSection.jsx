import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Money, Cpu, ShieldCheck, Headset } from 'phosphor-react'

const MotionFlex = motion(Flex)

const features = [
  {
    icon: Money,
    title: 'Eficiencia garantizada',
    description:
      'Optimizamos la gestión de recursos para reducir costos y mejorar la disponibilidad.',
  },
  {
    icon: Cpu,
    title: 'Tecnología inteligente',
    description:
      'Usamos reportes y automatización para agilizar procesos y mejorar decisiones.',
  },
  {
    icon: ShieldCheck,
    title: 'Seguridad y control',
    description:
      'Implementamos accesos personalizados para una administración confiable.',
  },
  {
    icon: Headset,
    title: 'Soporte especializado',
    description:
      'Un equipo listo para brindar asistencia según tus necesidades.',
  },
]

const WhyChooseUsSection = () => {
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: false, margin: '-100px 0px' })

  const bgIcon = useColorModeValue('brand.100', 'brand.100')
  const iconColor = useColorModeValue('brand.500', 'brand.500')
  const titleColor = useColorModeValue('brand.900', 'white')
  const descColor = useColorModeValue('brand.400', 'brand.300')

  return (
    <Box py={{ base: '3rem', md: '4rem' }} bg="white" ref={sectionRef}>
      <Container maxW="6xl">
        <Heading
          textAlign="center"
          fontSize={{ base: '1.75rem', md: '2.25rem' }}
          color={titleColor}
          mb="0.5rem"
        >
          ¿Por qué elegirnos?
        </Heading>
        <Text
          textAlign="center"
          color={descColor}
          fontSize="1.1rem"
          mb={{ base: '2.5rem', md: '3rem' }}
        >
          Te decimos porqué
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="3rem">
          {features.map(({ icon: Icon, title, description }, index) => (
            <MotionFlex
              key={title}
              align="flex-start"
              gap="1.5rem"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={
                inView
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 40, scale: 0.95 }
              }
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                ease: 'easeOut',
              }}
            >
              <Box
                bg={bgIcon}
                p="0.9rem"
                borderRadius="md"
                color={iconColor}
                display="flex"
                alignItems="center"
                justifyContent="center"
                minW="3rem"
                minH="3rem"
              >
                <Icon size={30} weight="duotone" />
              </Box>

              <Box>
                <Text
                  fontWeight="semibold"
                  fontSize={{ base: '1.1rem', md: '1.25rem' }}
                  color={titleColor}
                  mb="0.3rem"
                >
                  {title}
                </Text>
                <Text fontSize="1rem" color={descColor} lineHeight="1.6">
                  {description}
                </Text>
              </Box>
            </MotionFlex>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
}

export default WhyChooseUsSection
