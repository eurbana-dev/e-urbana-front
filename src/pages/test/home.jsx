import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  Image,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react"
import { Buildings, Lightning, ChartLine } from "phosphor-react"
import { ResponsiveLine } from "@nivo/line"

const Feature = ({ icon, title, text }) => {
  return (
    <Stack
      align="center"
      textAlign="center"
      p={5}
      borderWidth={1}
      borderRadius="xl"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      bg={useColorModeValue("white", "gray.900")}
    >
      <Box as={icon} size={32} color="brand.500" />
      <Heading size="md" color="brand.700">{title}</Heading>
      <Text color={useColorModeValue("gray.600", "gray.400")}>{text}</Text>
    </Stack>
  )
}

const data = [
  {
    id: "Consumo",
    color: "hsl(190, 70%, 50%)",
    data: [
      { x: "Lun", y: 12 },
      { x: "Mar", y: 18 },
      { x: "Mié", y: 22 },
      { x: "Jue", y: 16 },
      { x: "Vie", y: 19 },
      { x: "Sáb", y: 14 },
      { x: "Dom", y: 11 },
    ],
  },
]

export default function Home() {
  return (
    <Box bg={useColorModeValue("gray.50", "gray.800")} py={10}>
      <Container maxW="6xl">
        <Stack spacing={8} align="center" textAlign="center">
          <Heading fontSize={{ base: "3xl", md: "4xl" }}>
            Bienvenido a <Text as="span" color="brand.400">E. Urbana</Text>
          </Heading>
          <Text color="gray.600" maxW="3xl">
            Plataforma inteligente de gestión energética para iluminación urbana. Visualiza, controla y mejora la eficiencia de tus luminarias.
          </Text>
          <Button colorScheme="brand" size="lg">Empezar</Button>
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

        {/* Grafico de nivo de ejemplo */}
        <Box h="400px" mt={20} borderRadius="xl" bg="white" p={5} boxShadow="md">
          <ResponsiveLine
            data={data}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              legend: "Día de la semana",
              legendOffset: 36,
              legendPosition: "middle",
            }}
            axisLeft={{
              orient: "left",
              legend: "Consumo (kWh)",
              legendOffset: -40,
              legendPosition: "middle",
            }}
            colors={{ scheme: "category10" }}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        </Box>
      </Container>
    </Box>
  )
}
