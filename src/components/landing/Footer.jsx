// src/components/landing/Footer.jsx
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  Stack,
  HStack,
  IconButton,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react'
import {
  InstagramLogo,
  TwitterLogo,
  FacebookLogo,
  LinkedinLogo,
  PinterestLogo,
} from 'phosphor-react'

const Footer = () => {
  const bgColor = useColorModeValue('brand.100', 'gray.900')
  const textColor = useColorModeValue('brand.900', 'gray.100')
  const headingColor = useColorModeValue('brand.500', 'white')

  return (
    <Box bg={bgColor} color={textColor} pt="3rem" pb="1.5rem" mt="4rem">
      <Container maxW="7xl">
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
          gap={{ base: 10, md: 6 }}
        >
          {/* Empresa */}
          <Stack spacing="1rem">
            <Heading as="h4" size="md" color={headingColor}>
              E-Urbana
            </Heading>
            <Text fontSize="sm" lineHeight="1.8">
              Optimizamos la gestión del alumbrado público con tecnología eficiente,
              automatización y análisis de datos en tiempo real.
            </Text>

            <Box>
              <Heading as="h5" size="sm" mb="0.5rem">
                Síguenos
              </Heading>
              <HStack spacing="0.5rem">
                <IconButton icon={<InstagramLogo />} aria-label="Instagram" variant="ghost" />
                <IconButton icon={<TwitterLogo />} aria-label="Twitter" variant="ghost" />
                <IconButton icon={<FacebookLogo />} aria-label="Facebook" variant="ghost" />
                <IconButton icon={<LinkedinLogo />} aria-label="LinkedIn" variant="ghost" />
                <IconButton icon={<PinterestLogo />} aria-label="Pinterest" variant="ghost" />
              </HStack>
            </Box>
          </Stack>

          {/* Servicios */}
          <Stack spacing="1rem">
            <Heading as="h4" size="md" color={headingColor}>
              Servicios
            </Heading>
            <Stack fontSize="sm" spacing="0.5rem">
              <Text as="a" href="#">Desarrollo de software</Text>
              <Text as="a" href="#">Soporte y mantenimiento</Text>
              <Text as="a" href="#">Redes e IoT</Text>
              <Text as="a" href="#">Monitoreo inteligente</Text>
            </Stack>
          </Stack>

          {/* Contacto */}
          <Stack spacing="1rem">
            <Heading as="h4" size="md" color={headingColor}>
              Contacto
            </Heading>
            <Stack fontSize="sm" spacing="0.5rem">
              <Text>Av. Universidad Tecnológica No. 1000</Text>
              <Text>73080 Xicotepec de Juárez, Puebla</Text>
              <Text>+52 (764) 100-1225</Text>
              <Text>+52 (776) 100-5669</Text>
              <Text>ventas@eurbana.mx</Text>
            </Stack>
          </Stack>
        </Grid>

        <Divider my="2rem" borderColor="gray.300" />

        <Text textAlign="center" fontSize="sm">
          © {new Date().getFullYear()} E-Urbana. Todos los derechos reservados.
        </Text>
      </Container>
    </Box>
  )
}

export default Footer
