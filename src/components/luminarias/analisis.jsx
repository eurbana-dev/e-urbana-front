import React from 'react';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  Heading,
  Text,
  useColorModeValue,
  VStack,
  Badge,
  HStack,
  Flex
} from '@chakra-ui/react';
import { 
  ChartBar, 
  Robot, 
  Brain, 
  ArrowSquareOut,
  Cpu,
  Target
} from 'phosphor-react';

const Analisis = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgGradient = useColorModeValue(
    'linear(to-r, blue.50, purple.50)',
    'linear(to-r, blue.900, purple.900)'
  );

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Título Principal */}
         
        {/* Card Principal que contiene las dos herramientas */}
        <Card 
          bg={cardBg} 
          borderColor={borderColor} 
          borderWidth="2px" 
          shadow="xl"
          bgGradient={bgGradient}
        >
          <CardHeader textAlign="center" pb={4}>
            <VStack spacing={3}>
              <Cpu size={48} color="var(--chakra-colors-brand-500)" />
              <Heading size="lg" color="brand.600">
                Analisis supervisado y no supervisado
              </Heading>
              <Text fontSize="md" color="gray.700" maxW="600px">
                Utiliza algoritmos de Machine Learning para obtener insights profundos sobre el comportamiento y patrones de las luminarias
              </Text>
            </VStack>
          </CardHeader>

          <CardBody pt={0}>
            {/* Grid con las dos herramientas de análisis */}
            <Grid templateColumns="repeat(auto-fit, minmax(600px, 1fr))" gap={6}>
              
              {/* Análisis No Supervisado */}
              <GridItem>
                <Card 
                  bg="white" 
                  borderColor="purple.200" 
                  borderWidth="2px" 
                  shadow="md"
                  height="600px"
                  transition="all 0.3s"
                  _hover={{ 
                    shadow: "xl", 
                    borderColor: "purple.400",
                    transform: "translateY(-2px)"
                  }}
                >
                  <CardHeader bg="purple.50" borderTopRadius="md" pb={3}>
                    <Flex justify="space-between" align="center" mb={3}>
                      <HStack spacing={3}>
                        <ChartBar size={32} color="var(--chakra-colors-purple-500)" />
                        <VStack align="start" spacing={0}>
                          <Heading size="md" color="purple.600">
                            Análisis No Supervisado
                          </Heading>
                          <Text fontSize="sm" color="gray.600">
                            Clustering y patrones ocultos
                          </Text>
                        </VStack>
                      </HStack>
                      <Badge colorScheme="purple" variant="solid" fontSize="xs" px={3} py={1}>
                        ML Clustering
                      </Badge>
                    </Flex>
                    <Text fontSize="sm" color="gray.700">
                      Descubre grupos naturales y patrones en los datos sin etiquetas predefinidas
                    </Text>
                  </CardHeader>
                  
                  <CardBody p={2}>
                    <Box 
                      as="iframe"
                      src="https://clusterapp-nosupervisado.streamlit.app/?embed=true"
                      width="100%"
                      height="520px"
                      border="none"
                      borderRadius="md"
                      loading="lazy"
                      title="Análisis No Supervisado - Clustering de Luminarias"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
                      referrerPolicy="strict-origin-when-cross-origin"
                      style={{
                        border: 'none',
                        backgroundColor: '#ffffff'
                      }}
                    />
                  </CardBody>
                </Card>
              </GridItem>

              {/* Análisis Supervisado */}
              <GridItem>
                <Card 
                  bg="white" 
                  borderColor="blue.200" 
                  borderWidth="2px" 
                  shadow="md"
                  height="600px"
                  transition="all 0.3s"
                  _hover={{ 
                    shadow: "xl", 
                    borderColor: "blue.400",
                    transform: "translateY(-2px)"
                  }}
                >
                  <CardHeader bg="blue.50" borderTopRadius="md" pb={3}>
                    <Flex justify="space-between" align="center" mb={3}>
                      <HStack spacing={3}>
                        <Target size={32} color="var(--chakra-colors-blue-500)" />
                        <VStack align="start" spacing={0}>
                          <Heading size="md" color="blue.600">
                            Análisis Supervisado
                          </Heading>
                          <Text fontSize="sm" color="gray.600">
                            Predicción y clasificación
                          </Text>
                        </VStack>
                      </HStack>
                      <Badge colorScheme="blue" variant="solid" fontSize="xs" px={3} py={1}>
                        ML Predictivo
                      </Badge>
                    </Flex>
                    <Text fontSize="sm" color="gray.700">
                      Predice comportamientos y clasifica luminarias basado en datos históricos
                    </Text>
                  </CardHeader>
                  
                  <CardBody p={2}>
                    <Box 
                      as="iframe"
                      src="https://clusterapp2-supervisado.streamlit.app/?embed=true"
                      width="100%"
                      height="520px"
                      border="none"
                      borderRadius="md"
                      loading="lazy"
                      title="Análisis Supervisado - Predicción de Luminarias"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
                      referrerPolicy="strict-origin-when-cross-origin"
                      style={{
                        border: 'none',
                        backgroundColor: '#ffffff'
                      }}
                    />
                  </CardBody>
                </Card>
              </GridItem>

            </Grid>

            {/* Información adicional */}
            <Box mt={6} p={4} bg="gray.50" borderRadius="md" border="1px" borderColor="gray.200">
              <Flex justify="center" align="center" flexWrap="wrap" gap={4}>
                <HStack spacing={2}>
                  <ArrowSquareOut size={16} color="var(--chakra-colors-gray-500)" />
                  <Text fontSize="sm" color="gray.600">
                    Aplicaciones integradas directamente en el dashboard
                  </Text>
                </HStack>
                <Text fontSize="sm" color="gray.400">•</Text>
                <Text fontSize="sm" color="gray.600">
                  Totalmente funcionales e interactivas
                </Text>
                <Text fontSize="sm" color="gray.400">•</Text>
                <Text fontSize="sm" color="gray.600">
                  Actualizaciones en tiempo real
                </Text>
              </Flex>
            </Box>

          </CardBody>
        </Card>

        {/* Card de instrucciones */}
        <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" shadow="md">
          <CardHeader>
            <Heading size="md" color="brand.500" display="flex" alignItems="center" gap={3}>
              <Robot size={24} />
              Instrucciones de Uso
            </Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
              <VStack align="start" spacing={3}>
                <HStack spacing={2}>
                  <ChartBar size={20} color="var(--chakra-colors-purple-500)" />
                  <Text fontWeight="bold" color="purple.600">
                    Análisis No Supervisado
                  </Text>
                </HStack>
                <VStack align="start" spacing={1} fontSize="sm" color="gray.700" pl={7}>
                  <Text>• Identifica grupos naturales en los datos</Text>
                  <Text>• Detecta patrones ocultos de comportamiento</Text>
                  <Text>• Análisis de clustering K-means y DBSCAN</Text>
                  <Text>• Visualizaciones interactivas 2D y 3D</Text>
                </VStack>
              </VStack>
              
              <VStack align="start" spacing={3}>
                <HStack spacing={2}>
                  <Target size={20} color="var(--chakra-colors-blue-500)" />
                  <Text fontWeight="bold" color="blue.600">
                    Análisis Supervisado
                  </Text>
                </HStack>
                <VStack align="start" spacing={1} fontSize="sm" color="gray.700" pl={7}>
                  <Text>• Predice fallas y mantenimientos</Text>
                  <Text>• Clasifica estados de luminarias</Text>
                  <Text>• Modelos de regresión y clasificación</Text>
                  <Text>• Métricas de precisión y rendimiento</Text>
                </VStack>
              </VStack>
            </Grid>
          </CardBody>
        </Card>

      </VStack>
    </Box>
  );
};

export default Analisis;
