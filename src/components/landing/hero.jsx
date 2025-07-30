import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Stack,
  Image,
} from '@chakra-ui/react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import lampIllustration from '../../assets/images/ciudad_iluminada.png'

const MotionBox = motion(Box)
const MotionFlex = motion(Flex)
const MotionHeading = motion(Heading)
const MotionText = motion(Text)
const MotionStack = motion(Stack)
const MotionImage = motion(Image)

const Hero = ({ scrollToServices }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-100px 0px' })

  return (
    <Box
      as="section"
      id="home-section"
      ref={ref}
      bg="white"
      py={{ base: 8, md: 12 }}
      px={{ base: 4, md: 6 }}
    >
      <MotionFlex
        maxW="5xl"
        mx="auto"
        align="center"
        direction={{ base: 'column', lg: 'row' }}
        gap={6}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Texto */}
        <Box
          w={{ base: '100%', lg: '45%' }}
          textAlign={{ base: 'center', lg: 'left' }}
        >
          <MotionHeading
            as="h1"
            fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
            color="brand.900"
            mb={3}
            lineHeight="shorter"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Iluminación inteligente
            <br />
            para ciudades sostenibles
          </MotionHeading>

          <MotionText
            fontSize={{ base: 'sm', md: 'md' }}
            color="gray.700"
            mb={5}
            maxW="lg"
            mx={{ base: 'auto', lg: 0 }}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Box as="span" color="brand.500" fontWeight="bold">
              Ecoluz Urbana
            </Box>{' '}
            optimiza tu alumbrado público con sensores IoT, reduciendo costos
            y promoviendo la sostenibilidad urbana.
          </MotionText>

          <MotionStack
            direction={{ base: 'column', sm: 'row' }}
            spacing={4}
            justify={{ base: 'center', lg: 'flex-start' }}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              onClick={scrollToServices}
              size="md"
              variant="outline"
              color="brand.500"
              borderColor="brand.500"
              _hover={{ bg: 'brand.500', color: 'white' }}
            >
              Conoce más
            </Button>
          </MotionStack>
        </Box>

        {/* Ilustración */}
        <MotionBox
          w={{ base: '80%', md: '60%', lg: '40%' }}
          mx="auto"
          initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
          animate={
            inView
              ? { opacity: 1, scale: 1, rotate: 0 }
              : { opacity: 0, scale: 0.92, rotate: -2 }
          }
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <MotionImage
            src={lampIllustration}
            alt="Luminaria inteligente"
            maxW="100%"
          />
        </MotionBox>
      </MotionFlex>
    </Box>
  )
}

export default Hero
