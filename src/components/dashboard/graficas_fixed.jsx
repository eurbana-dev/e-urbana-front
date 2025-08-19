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
import { ResponsiveHeatMap } from '@nivo/heatmap';

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

    const colors = [theme.colors.brand[500], theme.colors.brand[300], theme.colors.brand[600], '#ff6b6b', '#4ecdc4'];
    
    return Object.entries(estados).map(([estado, count], index) => ({
      id: estado,
      label: estado,
      value: count,
      color: colors[index % colors.length]
    }));
  };

  const processConsumosPorDia = () => {
    if (!data.consumos.length) {
      return [{ x: new Date().toISOString().split('T')[0], y: 0 }];
    }

    const consumosPorDia = data.consumos.reduce((acc, consumo) => {
      const fecha = consumo.fecha || consumo.timestamp || new Date().toISOString().split('T')[0];
      const dia = fecha.split('T')[0];
      acc[dia] = (acc[dia] || 0) + (parseFloat(consumo.valor) || parseFloat(consumo.consumo) || 0);
      return acc;
    }, {});

    return Object.entries(consumosPorDia)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .slice(-30)
      .map(([fecha, total]) => ({
        x: fecha,
        y: Math.round(total * 100) / 100
      }));
  };

  const processMantenimientosPorMes = () => {
    if (!data.mantenimientos.length) {
      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
      return meses.map(mes => ({ mes, completados: 0, pendientes: 0, programados: 0 }));
    }

    const mantenimientosPorMes = data.mantenimientos.reduce((acc, mant) => {
      const fecha = new Date(mant.fecha || mant.fechaMantenimiento || Date.now());
      const mes = fecha.toLocaleDateString('es-ES', { month: 'short' });
      const estado = mant.estado || mant.status || 'pendiente';
      
      if (!acc[mes]) {
        acc[mes] = { mes, completados: 0, pendientes: 0, programados: 0 };
      }
      
      if (estado.toLowerCase() === 'completado') {
        acc[mes].completados++;
      } else if (estado.toLowerCase() === 'pendiente') {
        acc[mes].pendientes++;
      } else {
        acc[mes].programados++;
      }
      
      return acc;
    }, {});

    return Object.values(mantenimientosPorMes);
  };

  const processCalendarData = () => {
    if (!data.consumos.length) return [];

    const consumosPorDia = data.consumos.reduce((acc, consumo) => {
      const fecha = consumo.fecha || consumo.timestamp || new Date().toISOString().split('T')[0];
      const dia = fecha.split('T')[0];
      acc[dia] = (acc[dia] || 0) + (parseFloat(consumo.valor) || parseFloat(consumo.consumo) || 0);
      return acc;
    }, {});

    return Object.entries(consumosPorDia).map(([day, value]) => ({
      day,
      value: Math.round(value * 100) / 100
    }));
  };

  // Función para procesar datos de heatmap de mantenimientos
  const processHeatmapData = () => {
    if (!data.mantenimientos.length) {
      return [
        { id: 'Lun', data: [{ x: '00h', y: 0 }, { x: '06h', y: 0 }, { x: '12h', y: 0 }, { x: '18h', y: 0 }] },
        { id: 'Mar', data: [{ x: '00h', y: 0 }, { x: '06h', y: 0 }, { x: '12h', y: 0 }, { x: '18h', y: 0 }] },
        { id: 'Mié', data: [{ x: '00h', y: 0 }, { x: '06h', y: 0 }, { x: '12h', y: 0 }, { x: '18h', y: 0 }] },
        { id: 'Jue', data: [{ x: '00h', y: 0 }, { x: '06h', y: 0 }, { x: '12h', y: 0 }, { x: '18h', y: 0 }] },
        { id: 'Vie', data: [{ x: '00h', y: 0 }, { x: '06h', y: 0 }, { x: '12h', y: 0 }, { x: '18h', y: 0 }] },
      ];
    }

    const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const horas = ['00h', '06h', '12h', '18h'];
    
    const mantenimientosMap = {};
    
    data.mantenimientos.forEach(mant => {
      const fecha = new Date(mant.fecha || mant.fechaMantenimiento || Date.now());
      const diaSemana = dias[fecha.getDay()];
      const hora = `${Math.floor(fecha.getHours() / 6) * 6}h`.padStart(3, '0');
      
      const key = `${diaSemana}-${hora}`;
      mantenimientosMap[key] = (mantenimientosMap[key] || 0) + 1;
    });

    return dias.map(dia => ({
      id: dia,
      data: horas.map(hora => ({
        x: hora,
        y: mantenimientosMap[`${dia}-${hora}`] || 0
      }))
    }));
  };

  const getEstadisticas = () => {
    return {
      totalLuminarias: data.luminarias.length,
      luminariasActivas: data.luminarias.filter(l => l.estado === 'activa' || l.estado === 'funcionando').length,
      totalUsuarios: data.usuarios.length,
      mantenimientosPendientes: data.mantenimientos.filter(m => m.estado === 'pendiente').length,
      consumoPromedio: data.consumos.length ? 
        Math.round((data.consumos.reduce((sum, c) => sum + (parseFloat(c.valor) || parseFloat(c.consumo) || 0), 0) / data.consumos.length) * 100) / 100 : 0
    };
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <Spinner size="xl" color="brand.500" />
        <Text ml={4} fontSize="lg">Cargando datos...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  const estadisticas = getEstadisticas();
  const luminariasData = processLuminariasEstado();
  const consumosData = processConsumosPorDia();
  const mantenimientosData = processMantenimientosPorMes();
  const calendarData = processCalendarData();
  const heatmapData = processHeatmapData();

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        
        {/* Resumen General del Sistema - Ancho completo */}
        <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" shadow="md">
          <CardHeader>
            <Heading size="lg" color="brand.500" textAlign="center">
               Resumen General del Sistema
            </Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6}>
              <Stat textAlign="center">
                <StatLabel>Total Luminarias</StatLabel>
                <StatNumber color="brand.500">{estadisticas.totalLuminarias}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  Sistema completo
                </StatHelpText>
              </Stat>
              <Stat textAlign="center">
                <StatLabel>Luminarias Activas</StatLabel>
                <StatNumber color="green.500">{estadisticas.luminariasActivas}</StatNumber>
                <StatHelpText>
                  {((estadisticas.luminariasActivas / estadisticas.totalLuminarias) * 100 || 0).toFixed(1)}% operativas
                </StatHelpText>
              </Stat>
              <Stat textAlign="center">
                <StatLabel>Total Usuarios</StatLabel>
                <StatNumber color="blue.500">{estadisticas.totalUsuarios}</StatNumber>
                <StatHelpText>Usuarios registrados</StatHelpText>
              </Stat>
              <Stat textAlign="center">
                <StatLabel>Mantenimientos Pendientes</StatLabel>
                <StatNumber color="orange.500">{estadisticas.mantenimientosPendientes}</StatNumber>
                <StatHelpText>Requieren atención</StatHelpText>
              </Stat>
              <Stat textAlign="center">
                <StatLabel>Consumo Promedio</StatLabel>
                <StatNumber color="purple.500">{estadisticas.consumoPromedio} kWh</StatNumber>
                <StatHelpText>Por luminaria</StatHelpText>
              </Stat>
            </Grid>
          </CardBody>
        </Card>

        {/* Grid de Gráficas - 3 columnas */}
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          
          {/* Distribución por Estado */}
          <GridItem>
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" shadow="md" height="400px">
              <CardHeader>
                <Heading size="md" color="brand.500">
                  Distribución por Estado
                </Heading>
              </CardHeader>
              <CardBody>
                <Box height="300px">
                  <ResponsivePie
                    data={luminariasData}
                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    colors={{ datum: 'data.color' }}
                    borderWidth={1}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="gray.600"
                    arcLinkLabelsThickness={2}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                  />
                </Box>
              </CardBody>
            </Card>
          </GridItem>

          {/* Estado de Mantenimientos */}
          <GridItem>
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" shadow="md" height="400px">
              <CardHeader>
                <Heading size="md" color="brand.500">
                  Estado de Mantenimientos
                </Heading>
              </CardHeader>
              <CardBody>
                <Box height="300px">
                  <ResponsiveBar
                    data={mantenimientosData}
                    keys={['completados', 'pendientes', 'programados']}
                    indexBy="mes"
                    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                    padding={0.3}
                    valueScale={{ type: 'linear' }}
                    indexScale={{ type: 'band', round: true }}
                    colors={[theme.colors.green[500], theme.colors.orange[500], theme.colors.blue[500]]}
                    borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Mes',
                      legendPosition: 'middle',
                      legendOffset: 32
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Cantidad',
                      legendPosition: 'middle',
                      legendOffset: -40
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
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                  />
                </Box>
              </CardBody>
            </Card>
          </GridItem>

          {/* Gráfica de Calor - Frecuencia de Mantenimientos */}
          <GridItem>
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" shadow="md" height="400px">
              <CardHeader>
                <Heading size="md" color="brand.500">
                  Frecuencia de Mantenimientos
                </Heading>
              </CardHeader>
              <CardBody>
                <Box height="300px">
                  <ResponsiveHeatMap
                    data={heatmapData}
                    margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
                    valueFormat=">-.2s"
                    axisTop={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: -90,
                      legend: '',
                      legendOffset: 46
                    }}
                    axisRight={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Día de la semana',
                      legendPosition: 'middle',
                      legendOffset: 70
                    }}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: -90,
                      legend: 'Hora del día',
                      legendPosition: 'middle',
                      legendOffset: 46
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Día',
                      legendPosition: 'middle',
                      legendOffset: -72
                    }}
                    colors={{
                      type: 'diverging',
                      scheme: 'red_yellow_blue',
                      divergeAt: 0.5,
                      minValue: 0,
                      maxValue: Math.max(1, ...heatmapData.flatMap(d => d.data.map(p => p.y)))
                    }}
                    emptyColor="#eeeeee"
                    legends={[
                      {
                        anchor: 'bottom',
                        translateX: 0,
                        translateY: 30,
                        length: 400,
                        thickness: 8,
                        direction: 'row',
                        tickPosition: 'after',
                        tickSize: 3,
                        tickSpacing: 4,
                        tickOverlap: false,
                        tickFormat: '>-.2s',
                        title: 'Cantidad →',
                        titleAlign: 'start',
                        titleOffset: 4
                      }
                    ]}
                  />
                </Box>
              </CardBody>
            </Card>
          </GridItem>

          {/* Consumo Energético */}
          <GridItem>
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" shadow="md" height="400px">
              <CardHeader>
                <Heading size="md" color="brand.500">
                  Consumo Energético (Últimos 30 días)
                </Heading>
              </CardHeader>
              <CardBody>
                <Box height="300px">
                  <ResponsiveLine
                    data={[{
                      id: 'consumo',
                      color: theme.colors.brand[500],
                      data: consumosData
                    }]}
                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                    xScale={{ type: 'point' }}
                    yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                    yFormat=" >-.2f"
                    curve="cardinal"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Fecha',
                      legendOffset: 36,
                      legendPosition: 'middle'
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Consumo (kWh)',
                      legendOffset: -40,
                      legendPosition: 'middle'
                    }}
                    pointSize={10}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabelYOffset={-12}
                    useMesh={true}
                    legends={[
                      {
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 0,
                        itemDirection: 'left-to-right',
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: 'circle',
                        symbolBorderColor: 'rgba(0, 0, 0, .5)',
                        effects: [
                          {
                            on: 'hover',
                            style: {
                              itemBackground: 'rgba(0, 0, 0, .03)',
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

          {/* Calendario de Actividad */}
          <GridItem>
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" shadow="md" height="400px">
              <CardHeader>
                <Heading size="md" color="brand.500">
                  Calendario de Actividad
                </Heading>
              </CardHeader>
              <CardBody>
                <Box height="300px">
                  <ResponsiveCalendar
                    data={calendarData}
                    from="2024-01-01"
                    to="2024-12-31"
                    emptyColor="#eeeeee"
                    colors={[theme.colors.brand[100], theme.colors.brand[300], theme.colors.brand[500], theme.colors.brand[700]]}
                    margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                    yearSpacing={40}
                    monthBorderColor="#ffffff"
                    dayBorderWidth={2}
                    dayBorderColor="#ffffff"
                    legends={[
                      {
                        anchor: 'bottom-right',
                        direction: 'row',
                        translateY: 36,
                        itemCount: 4,
                        itemWidth: 42,
                        itemHeight: 36,
                        itemsSpacing: 14,
                        itemDirection: 'right-to-left'
                      }
                    ]}
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
                        <Th>Estado</Th>
                        <Th isNumeric>Cantidad</Th>
                        <Th isNumeric>Porcentaje</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {luminariasData.map((item, index) => (
                        <Tr key={index}>
                          <Td>
                            <HStack>
                              <Box w={3} h={3} bg={item.color} borderRadius="sm" />
                              <Text>{item.label}</Text>
                            </HStack>
                          </Td>
                          <Td isNumeric>
                            <Badge colorScheme="brand">{item.value}</Badge>
                          </Td>
                          <Td isNumeric>
                            {((item.value / estadisticas.totalLuminarias) * 100 || 0).toFixed(1)}%
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>
          </GridItem>

          {/* Tabla de Últimos Consumos */}
          <GridItem>
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" shadow="md">
              <CardHeader>
                <Heading size="md" color="brand.500">
                  Últimos Registros de Consumo
                </Heading>
              </CardHeader>
              <CardBody>
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Fecha</Th>
                        <Th isNumeric>Consumo (kWh)</Th>
                        <Th>Tendencia</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {consumosData.slice(-10).map((item, index) => {
                        const prevValue = index > 0 ? consumosData[consumosData.length - 10 + index - 1]?.y : item.y;
                        const trend = item.y > prevValue ? 'increase' : item.y < prevValue ? 'decrease' : 'neutral';
                        return (
                          <Tr key={index}>
                            <Td>{item.x}</Td>
                            <Td isNumeric>
                              <Badge colorScheme={trend === 'increase' ? 'red' : trend === 'decrease' ? 'green' : 'gray'}>
                                {item.y}
                              </Badge>
                            </Td>
                            <Td>
                              {trend !== 'neutral' && (
                                <StatArrow type={trend} />
                              )}
                            </Td>
                          </Tr>
                        );
                      })}
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
            <Heading size="md" color="orange.500">
              🐛 Debug - Información de Datos (Temporal)
            </Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns="repeat(4, 1fr)" gap={4} textAlign="center">
              <Box>
                <Text fontWeight="bold" color="brand.500">Luminarias</Text>
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
                <Text fontWeight="bold" color="brand.500">Consumos</Text>
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
                <Text fontWeight="bold" color="brand.500">Mantenimientos</Text>
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
                <Text fontWeight="bold" color="brand.500">Usuarios</Text>
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
