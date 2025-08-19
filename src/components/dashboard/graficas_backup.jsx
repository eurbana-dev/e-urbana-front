import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  useColorModeValue,
  useTheme,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  HStack,
  VStack,
  Progress,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer
} from '@chakra-ui/react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveCalendar } from '@nivo/calendar';

// Importar servicios
import { getLuminarias } from '../../api/luminariasService';
import { getConsumos } from '../../api/consumoService';
import { getMantenimientos } from '../../api/mantenimientoService';
import { getUsuarios } from '../../api/usuariosService';

const Graficas = () => {
  const [data, setData] = useState({
    luminarias: [],
    consumos: [],
    mantenimientos: [],
    usuarios: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [luminariasRes, consumosRes, mantenimientosRes, usuariosRes] = await Promise.all([
          getLuminarias().catch(() => []),
          getConsumos().catch(() => []),
          getMantenimientos().catch(() => []),
          getUsuarios().catch(() => [])
        ]);

        console.log('Luminarias response:', luminariasRes);
        console.log('Consumos response:', consumosRes);
        console.log('Mantenimientos response:', mantenimientosRes);
        console.log('Usuarios response:', usuariosRes);

        setData({
          luminarias: Array.isArray(luminariasRes) ? luminariasRes : (Array.isArray(luminariasRes?.data) ? luminariasRes.data : []),
          consumos: Array.isArray(consumosRes) ? consumosRes : (Array.isArray(consumosRes?.data) ? consumosRes.data : []),
          mantenimientos: Array.isArray(mantenimientosRes) ? mantenimientosRes : (Array.isArray(mantenimientosRes?.data) ? mantenimientosRes.data : []),
          usuarios: Array.isArray(usuariosRes) ? usuariosRes : (Array.isArray(usuariosRes?.data) ? usuariosRes.data : [])
        });
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Procesar datos para gráficas
  const processLuminariasEstado = () => {
    if (!data.luminarias.length) {
      return [{ id: 'Sin datos', label: 'Sin datos', value: 1, color: theme.colors.brand[200] }];
    }
    
    const estados = data.luminarias.reduce((acc, luminaria) => {
      const estado = luminaria.estado || 'Sin estado';
      acc[estado] = (acc[estado] || 0) + 1;
      return acc;
    }, {});

    const colors = [theme.colors.brand[500], theme.colors.brand[400], theme.colors.brand[300], theme.colors.alert.info, theme.colors.alert.success];
    
    return Object.entries(estados).map(([estado, cantidad], index) => ({
      id: estado,
      label: estado,
      value: cantidad,
      color: colors[index % colors.length]
    }));
  };

  const processLuminariasCiudad = () => {
    if (!data.luminarias.length) {
      return [{ ciudad: 'Sin datos', cantidad: 0, activasCount: 0 }];
    }
    
    const ciudades = data.luminarias.reduce((acc, luminaria) => {
      const ciudad = luminaria.ciudad || 'Sin ciudad';
      acc[ciudad] = (acc[ciudad] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(ciudades).map(([ciudad, cantidad]) => ({
      ciudad,
      cantidad,
      activasCount: data.luminarias.filter(l => l.ciudad === ciudad && l.activo).length
    }));
  };

  const processConsumosPorDia = () => {
    if (!data.consumos.length) {
      return [{
        id: 'sin-datos',
        data: [
          { x: 'Sin datos', y: 0 }
        ]
      }];
    }
    
    const consumosPorDia = data.consumos.reduce((acc, consumo) => {
      if (consumo.timestamp) {
        const fecha = new Date(consumo.timestamp).toISOString().split('T')[0];
        acc[fecha] = (acc[fecha] || 0) + (parseFloat(consumo.consumo) || 0);
      }
      return acc;
    }, {});

    const sortedData = Object.entries(consumosPorDia)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .slice(-30); // Últimos 30 días

    if (sortedData.length === 0) {
      return [{
        id: 'sin-datos',
        data: [{ x: 'Sin datos', y: 0 }]
      }];
    }

    return [{
      id: 'consumo',
      data: sortedData.map(([fecha, cantidad]) => ({
        x: new Date(fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
        y: Math.round(cantidad * 100) / 100
      }))
    }];
  };

  const processMantenimientosTipo = () => {
    const tipos = data.mantenimientos.reduce((acc, mantenimiento) => {
      const tipo = mantenimiento.tipo_mantenimiento || 'Sin tipo';
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(tipos).map(([tipo, cantidad]) => ({
      tipo,
      cantidad,
      finalizados: data.mantenimientos.filter(m => m.tipo_mantenimiento === tipo && m.estatus === 'finalizado').length
    }));
  };

  const processMantenimientosEstatus = () => {
    const estatus = data.mantenimientos.reduce((acc, mantenimiento) => {
      const estado = mantenimiento.estatus || 'Sin estado';
      acc[estado] = (acc[estado] || 0) + 1;
      return acc;
    }, {});

    const colors = {
      'finalizado': theme.colors.alert.success,
      'correcto': theme.colors.alert.info,
      'pendiente': theme.colors.alert.warning,
      'cancelado': theme.colors.alert.error
    };

    return Object.entries(estatus).map(([estado, cantidad]) => ({
      id: estado,
      label: estado.charAt(0).toUpperCase() + estado.slice(1),
      value: cantidad,
      color: colors[estado] || theme.colors.brand[400]
    }));
  };

  const getEstadisticas = () => {
    const totalLuminarias = data.luminarias.length;
    const luminariaActivas = data.luminarias.filter(l => l.activo).length;
    const totalConsumo = data.consumos.reduce((sum, c) => sum + (parseFloat(c.consumo) || 0), 0);
    const promedioConsumo = totalConsumo / (data.consumos.length || 1);
    const mantenimientosFinalizados = data.mantenimientos.filter(m => m.estatus === 'finalizado').length;
    const eficienciaMantenimiento = (mantenimientosFinalizados / (data.mantenimientos.length || 1)) * 100;

    return {
      totalLuminarias,
      luminariaActivas,
      porcentajeActivas: (luminariaActivas / (totalLuminarias || 1)) * 100,
      totalConsumo: Math.round(totalConsumo * 100) / 100,
      promedioConsumo: Math.round(promedioConsumo * 100) / 100,
      totalMantenimientos: data.mantenimientos.length,
      eficienciaMantenimiento: Math.round(eficienciaMantenimiento * 100) / 100,
      totalUsuarios: data.usuarios.length
    };
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <Spinner size="xl" color="brand.500" />
        <Text ml={4} color="brand.900">Cargando gráficas...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md" borderColor="alert.error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  const estadisticas = getEstadisticas();

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        
        {/* Resumen de Estadísticas Principales - Ocupa todo el ancho */}
        <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" shadow="md">
          <CardHeader>
            <Heading size="md" color="brand.900">
              Resumen General del Sistema
            </Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6}>
              <Stat textAlign="center">
                <StatLabel color="brand.800">Luminarias Totales</StatLabel>
                <StatNumber fontSize="3xl" color="brand.500">{estadisticas.totalLuminarias}</StatNumber>
                <StatHelpText>
                  <HStack justify="center">
                    <Badge colorScheme="green">{estadisticas.luminariaActivas} activas</Badge>
                    <Text fontSize="sm">({estadisticas.porcentajeActivas.toFixed(1)}%)</Text>
                  </HStack>
                </StatHelpText>
                <Progress 
                  value={estadisticas.porcentajeActivas} 
                  colorScheme="green" 
                  size="sm" 
                  mt={2}
                  bg="brand.100"
                />
              </Stat>

              <Stat textAlign="center">
                <StatLabel color="brand.800">Consumo Total</StatLabel>
                <StatNumber fontSize="3xl" color="brand.400">{estadisticas.totalConsumo} kWh</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  Promedio: {estadisticas.promedioConsumo} kWh
                </StatHelpText>
              </Stat>

              <Stat textAlign="center">
                <StatLabel color="brand.800">Mantenimientos</StatLabel>
                <StatNumber fontSize="3xl" color="brand.300">{estadisticas.totalMantenimientos}</StatNumber>
                <StatHelpText>
                  <Badge colorScheme="blue">Eficiencia: {estadisticas.eficienciaMantenimiento}%</Badge>
                </StatHelpText>
                <Progress 
                  value={estadisticas.eficienciaMantenimiento} 
                  colorScheme="blue" 
                  size="sm" 
                  mt={2}
                  bg="brand.100"
                />
              </Stat>

              <Stat textAlign="center">
                <StatLabel color="brand.800">Usuarios Registrados</StatLabel>
                <StatNumber fontSize="3xl" color="brand.600">{estadisticas.totalUsuarios}</StatNumber>
                <StatHelpText>
                  <Badge colorScheme="purple">Activos en sistema</Badge>
                </StatHelpText>
              </Stat>
            </Grid>
          </CardBody>
        </Card>

        {/* Grid de Gráficas - 3 columnas */}
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        
          {/* Gráfica de Luminarias por Estado */}
          <GridItem>
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" shadow="md">
              <CardHeader>
                <Heading size="md" color="brand.500">
                  Distribución por Estado
                </Heading>
              </CardHeader>
            <CardBody>
              <Box height="300px">
                <ResponsivePie
                  data={processLuminariasEstado()}
                  margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  colors={{ datum: 'data.color' }}
                  borderWidth={1}
                  borderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.2]]
                  }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor={theme.colors.brand[900]}
                  arcLinkLabelsThickness={2}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{
                    from: 'color',
                    modifiers: [['darker', 2]]
                  }}
                />
              </Box>
            </CardBody>
          </Card>
        </GridItem>

        {/* Gráfica de Luminarias por Ciudad */}
        <GridItem>
          <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" shadow="md">
            <CardHeader>
              <Heading size="md" color="brand.400">
                Luminarias por Ciudad
              </Heading>
            </CardHeader>
            <CardBody>
              <Box height="300px">
                <ResponsiveBar
                  data={processLuminariasCiudad()}
                  keys={['cantidad', 'activasCount']}
                  indexBy="ciudad"
                  margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                  padding={0.3}
                  valueScale={{ type: 'linear' }}
                  indexScale={{ type: 'band', round: true }}
                  colors={[theme.colors.brand[500], theme.colors.brand[300]]}
                  borderColor={{
                    from: 'color',
                    modifiers: [['darker', 1.6]]
                  }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45,
                    legend: 'Ciudad',
                    legendPosition: 'middle',
                    legendOffset: 32,
                    tickTextColor: theme.colors.brand[900]
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Cantidad',
                    legendPosition: 'middle',
                    legendOffset: -40,
                    tickTextColor: theme.colors.brand[900]
                  }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor={{
                    from: 'color',
                    modifiers: [['darker', 1.6]]
                  }}
                  legends={[
                    {
                      dataFrom: 'keys',
                      anchor: 'bottom-right',
                      direction: 'column',
                      justify: false,
                      translateX: 120,
                      translateY: 0,
                      itemsSpacing: 2,
                      itemWidth: 100,
                      itemHeight: 20,
                      itemDirection: 'left-to-right',
                      itemOpacity: 0.85,
                      symbolSize: 20,
                      effects: [
                        {
                          on: 'hover',
                          style: {
                            itemOpacity: 1
                          }
                        }
                      ]
                    }
                  ]}
                />
              </Box>
            </CardBody>
          </Card>
        </GridItem>

        {/* Gráfica de Consumo por Día */}
        <GridItem>
          <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" shadow="md">
            <CardHeader>
              <Heading size="md" color="brand.600">
                Tendencia de Consumo (30 días)
              </Heading>
            </CardHeader>
            <CardBody>
              <Box height="300px">
                <ResponsiveLine
                  data={processConsumosPorDia()}
                  margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                  xScale={{ type: 'point' }}
                  yScale={{
                    type: 'linear',
                    min: 'auto',
                    max: 'auto',
                    stacked: true,
                    reverse: false
                  }}
                  yFormat=" >-.2f"
                  curve="catmullRom"
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45,
                    legend: 'Fecha',
                    legendOffset: 36,
                    legendPosition: 'middle',
                    tickTextColor: theme.colors.brand[900]
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Consumo (kWh)',
                    legendOffset: -40,
                    legendPosition: 'middle',
                    tickTextColor: theme.colors.brand[900]
                  }}
                  pointSize={8}
                  pointColor={{ theme: 'background' }}
                  pointBorderWidth={2}
                  pointBorderColor={{ from: 'serieColor' }}
                  pointLabelYOffset={-12}
                  useMesh={true}
                  colors={[theme.colors.brand[400]]}
                  enableArea={true}
                  areaOpacity={0.1}
                />
              </Box>
            </CardBody>
          </Card>
        </GridItem>

        {/* Gráfica de Mantenimientos por Tipo */}
        <GridItem>
          <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" shadow="md">
            <CardHeader>
              <Heading size="md" color="brand.300">
                Mantenimientos por Tipo
              </Heading>
            </CardHeader>
            <CardBody>
              <Box height="300px">
                <ResponsiveBar
                  data={processMantenimientosTipo()}
                  keys={['cantidad', 'finalizados']}
                  indexBy="tipo"
                  margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                  padding={0.3}
                  layout="vertical"
                  valueScale={{ type: 'linear' }}
                  indexScale={{ type: 'band', round: true }}
                  colors={[theme.colors.brand[300], theme.colors.alert.success]}
                  borderColor={{
                    from: 'color',
                    modifiers: [['darker', 1.6]]
                  }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Cantidad',
                    legendPosition: 'middle',
                    legendOffset: 32,
                    tickTextColor: theme.colors.brand[900]
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Tipo',
                    legendPosition: 'middle',
                    legendOffset: -40,
                    tickTextColor: theme.colors.brand[900]
                  }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor={{
                    from: 'color',
                    modifiers: [['darker', 1.6]]
                  }}
                  legends={[
                    {
                      dataFrom: 'keys',
                      anchor: 'bottom-right',
                      direction: 'column',
                      justify: false,
                      translateX: 120,
                      translateY: 0,
                      itemsSpacing: 2,
                      itemWidth: 100,
                      itemHeight: 20,
                      itemDirection: 'left-to-right',
                      itemOpacity: 0.85,
                      symbolSize: 20
                    }
                  ]}
                />
              </Box>
            </CardBody>
          </Card>
        </GridItem>

        {/* Gráfica de Estado de Mantenimientos */}
        <GridItem>
          <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" shadow="md">
            <CardHeader>
              <Heading size="md" color="alert.info">
                Estado de Mantenimientos
              </Heading>
            </CardHeader>
            <CardBody>
              <Box height="300px">
                <ResponsivePie
                  data={processMantenimientosEstatus()}
                  margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  colors={{ datum: 'data.color' }}
                  borderWidth={1}
                  borderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.2]]
                  }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor={theme.colors.brand[900]}
                  arcLinkLabelsThickness={2}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{
                    from: 'color',
                    modifiers: [['darker', 2]]
                  }}
                />
              </Box>
            </CardBody>
          </Card>
        </GridItem>

        </Grid>

        {/* Grid de Tablas - 2 columnas */}
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          
          {/* Tabla de Distribución por Estado */}
          <GridItem>
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" shadow="md">
              <CardHeader>
                <Heading size="md" color="brand.500">
                  Detalle de Distribución por Estado
                </Heading>
              </CardHeader>
            <CardBody>
              <TableContainer>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th color="brand.900">Estado</Th>
                      <Th color="brand.900" isNumeric>Total Luminarias</Th>
                      <Th color="brand.900" isNumeric>Activas</Th>
                      <Th color="brand.900" isNumeric>Porcentaje</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data.luminarias && data.luminarias.length > 0 ? (
                      Object.entries(
                        data.luminarias.reduce((acc, luminaria) => {
                          const estado = luminaria.estado || 'Sin estado';
                          if (!acc[estado]) {
                            acc[estado] = { total: 0, activas: 0 };
                          }
                          acc[estado].total++;
                          if (luminaria.activo) acc[estado].activas++;
                          return acc;
                        }, {})
                      ).map(([estado, datos]) => (
                        <Tr key={estado}>
                          <Td fontWeight="medium">{estado}</Td>
                          <Td isNumeric>
                            <Badge colorScheme="blue">{datos.total}</Badge>
                          </Td>
                          <Td isNumeric>
                            <Badge colorScheme="green">{datos.activas}</Badge>
                          </Td>
                          <Td isNumeric>
                            {((datos.activas / datos.total) * 100).toFixed(1)}%
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={4} textAlign="center" color="brand.800">
                          No hay datos de luminarias disponibles ({data.luminarias?.length || 0} items)
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>
        </GridItem>

        {/* Tabla de Luminarias por Ciudad */}
        <GridItem>
          <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" shadow="md">
            <CardHeader>
              <Heading size="md" color="brand.400">
                Detalle de Luminarias por Ciudad
              </Heading>
            </CardHeader>
            <CardBody>
              <TableContainer>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th color="brand.900">Ciudad</Th>
                      <Th color="brand.900" isNumeric>Total</Th>
                      <Th color="brand.900" isNumeric>Activas</Th>
                      <Th color="brand.900" isNumeric>Región</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data.luminarias && data.luminarias.length > 0 ? (
                      Object.entries(
                        data.luminarias.reduce((acc, luminaria) => {
                          const ciudad = luminaria.ciudad || 'Sin ciudad';
                          if (!acc[ciudad]) {
                            acc[ciudad] = { 
                              total: 0, 
                              activas: 0, 
                              regiones: new Set() 
                            };
                          }
                          acc[ciudad].total++;
                          if (luminaria.activo) acc[ciudad].activas++;
                          if (luminaria.region) acc[ciudad].regiones.add(luminaria.region);
                          return acc;
                        }, {})
                      ).map(([ciudad, datos]) => (
                        <Tr key={ciudad}>
                          <Td fontWeight="medium">{ciudad}</Td>
                          <Td isNumeric>
                            <Badge colorScheme="blue">{datos.total}</Badge>
                          </Td>
                          <Td isNumeric>
                            <Badge colorScheme="green">{datos.activas}</Badge>
                          </Td>
                          <Td isNumeric>
                            <HStack justify="flex-end" spacing={1}>
                              {Array.from(datos.regiones).map(region => (
                                <Badge key={region} colorScheme="purple" size="sm">
                                  {region}
                                </Badge>
                              ))}
                            </HStack>
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={4} textAlign="center" color="brand.800">
                          No hay datos de luminarias disponibles ({data.luminarias?.length || 0} items)
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>
        </GridItem>

        </Grid>

        {/* Tabla de Consumos Recientes - Ancho completo */}
        <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" shadow="md">
          <CardHeader>
            <Heading size="md" color="brand.600">
              Registros de Consumo Recientes
            </Heading>
          </CardHeader>
            <CardBody>
              <TableContainer>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th color="brand.900">Fecha y Hora</Th>
                      <Th color="brand.900">Luminaria ID</Th>
                      <Th color="brand.900" isNumeric>Consumo (kWh)</Th>
                      <Th color="brand.900" isNumeric>Lúmenes</Th>
                      <Th color="brand.900">Estado</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data.consumos && data.consumos.length > 0 ? (
                      data.consumos
                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                        .slice(0, 10)
                        .map((consumo, index) => (
                          <Tr key={index}>
                            <Td>
                              {new Date(consumo.timestamp).toLocaleString('es-ES')}
                            </Td>
                            <Td fontFamily="mono" fontSize="sm">
                              {consumo.luminaria_id?.slice(-8) || 'N/A'}
                            </Td>
                            <Td isNumeric>
                              <Badge 
                                colorScheme={consumo.consumo > 80 ? "red" : consumo.consumo > 50 ? "orange" : "green"}
                              >
                                {consumo.consumo?.toFixed(2) || '0.00'}
                              </Badge>
                            </Td>
                            <Td isNumeric>{consumo.lumenes || 'N/A'}</Td>
                            <Td>
                              <Badge 
                                colorScheme={consumo.encendida ? "green" : "gray"}
                                variant={consumo.encendida ? "solid" : "outline"}
                              >
                                {consumo.encendida ? 'Encendida' : 'Apagada'}
                              </Badge>
                            </Td>
                          </Tr>
                        ))
                    ) : (
                      <Tr>
                        <Td colSpan={5} textAlign="center" color="brand.800">
                          No hay datos de consumo disponibles ({data.consumos?.length || 0} items)
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
              {data.consumos && data.consumos.length > 10 && (
                <Text fontSize="sm" color="brand.800" mt={2} textAlign="center">
                  Mostrando los 10 registros más recientes de {data.consumos.length} total
                </Text>
              )}
            </CardBody>
          </Card>
        </GridItem>

        </Grid>

        {/* Debug: Mostrar datos crudos */}
        <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" shadow="md">
          <CardHeader>
            <Heading size="md" color="alert.warning">
              🐛 Debug - Información de Datos (Temporal)
            </Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns="repeat(4, 1fr)" gap={4} textAlign="center">
              <Box>
                <Text fontSize="lg" fontWeight="bold" color="blue.500">
                  Luminarias
                </Text>
                <Text fontSize="sm">
                  Tipo: {Array.isArray(data.luminarias) ? 'Array' : typeof data.luminarias}
                </Text>
                <Text fontSize="sm">
                  Longitud: {data.luminarias?.length || 'undefined'}
                </Text>
                <Text fontSize="xs" fontFamily="mono" bg="gray.100" p={1} mt={1} borderRadius="sm">
                  {JSON.stringify(data.luminarias?.[0] || 'No data', null, 2).slice(0, 100)}...
                </Text>
              </Box>
              <Box>
                <Text fontSize="lg" fontWeight="bold" color="green.500">
                  Consumos
                </Text>
                <Text fontSize="sm">
                  Tipo: {Array.isArray(data.consumos) ? 'Array' : typeof data.consumos}
                </Text>
                <Text fontSize="sm">
                  Longitud: {data.consumos?.length || 'undefined'}
                </Text>
                <Text fontSize="xs" fontFamily="mono" bg="gray.100" p={1} mt={1} borderRadius="sm">
                  {JSON.stringify(data.consumos?.[0] || 'No data', null, 2).slice(0, 100)}...
                </Text>
              </Box>
              <Box>
                <Text fontSize="lg" fontWeight="bold" color="orange.500">
                  Mantenimientos
                </Text>
                <Text fontSize="sm">
                  Tipo: {Array.isArray(data.mantenimientos) ? 'Array' : typeof data.mantenimientos}
                </Text>
                <Text fontSize="sm">
                  Longitud: {data.mantenimientos?.length || 'undefined'}
                </Text>
                <Text fontSize="xs" fontFamily="mono" bg="gray.100" p={1} mt={1} borderRadius="sm">
                  {JSON.stringify(data.mantenimientos?.[0] || 'No data', null, 2).slice(0, 100)}...
                </Text>
              </Box>
              <Box>
                <Text fontSize="lg" fontWeight="bold" color="purple.500">
                  Usuarios
                </Text>
                <Text fontSize="sm">
                  Tipo: {Array.isArray(data.usuarios) ? 'Array' : typeof data.usuarios}
                </Text>
                <Text fontSize="sm">
                  Longitud: {data.usuarios?.length || 'undefined'}
                </Text>
                <Text fontSize="xs" fontFamily="mono" bg="gray.100" p={1} mt={1} borderRadius="sm">
                  {JSON.stringify(data.usuarios?.[0] || 'No data', null, 2).slice(0, 100)}...
                </Text>
              </Box>
            </Grid>
          </CardBody>
        </Card>

      </VStack>
    </Box>
  );
};

export default Graficas;
