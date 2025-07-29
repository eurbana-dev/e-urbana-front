import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  Image,
  SimpleGrid,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react"
import { Buildings, Lightning, ChartLine } from "phosphor-react"

const Feature = ({ icon, title, text }) => {
  return (
    <Stack align="center" textAlign="center" p={5} borderWidth={1} borderRadius="xl">
      <Box as={icon} size={32} color="blue" />
      <Heading size="md">{title}</Heading>
      <Text>{text}</Text>
    </Stack>
  )
}

export default function Home() {
  return (
    <Box bg={useColorModeValue("gray.50", "gray.800")} py={10}>
      <Container maxW="6xl">
        <Stack spacing={8} align="center" textAlign="center">
          <Heading fontSize={{ base: "3xl", md: "4xl" }}>
            Bienvenido a <Text as="span" color="blue.400">E. Urbana</Text>
          </Heading>
          <Text color="gray.600" maxW="3xl">
            Plataforma inteligente de gestión energética para iluminación urbana. Visualiza, controla y mejora la eficiencia de tus luminarias.
          </Text>
          <Button colorScheme="blue" size="lg">Empezar</Button>
        </Stack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} mt={14}>
          <Feature
            icon={Lightning}
            title="Luminarias Inteligentes"
            text="Monitorea en tiempo real el estado y consumo de cada luminaria."
          />
          <Feature
            icon={ChartLine}
            title="Análisis de Consumo"
            text="Toma decisiones con base en datos energéticos detallados."
          />
          <Feature
            icon={Buildings}
            title="Adaptado a Ciudades"
            text="Diseñado para empresas, municipios y universidades."
          />
        </SimpleGrid>

        <Image
          mt={16}
          borderRadius="xl"
          src="https://images.unsplash.com/photo-1549921296-3a90e9d1efb4"
          alt="Ciudad iluminada"
          w="full"
          h={{ base: "200px", md: "400px" }}
          objectFit="cover"
        />
      </Container>
    </Box>
  )
}
