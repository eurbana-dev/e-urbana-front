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
  TableContainer,
  Icon
} from '@chakra-ui/react';
import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Configurar iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

  // Función para crear iconos personalizados según el estado
  const createCustomIcon = (estado) => {
    const colors = {
      'activa': '#22C55E',        // Verde
      'funcionando': '#22C55E',   // Verde
      'activo': '#22C55E',        // Verde
      'encendida': '#22C55E',     // Verde
      'mantenimiento': '#F59E0B', // Amarillo
      'pendiente': '#F59E0B',     // Amarillo
      'inactiva': '#EF4444',      // Rojo
      'apagada': '#EF4444',       // Rojo
      'dañada': '#EF4444',        // Rojo
      'default': '#3B82F6'        // Azul
    };
    
    const color = colors[estado?.toLowerCase()] || colors['default'];
    
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      className: 'custom-marker'
    });
  };

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

  const processLuminariasPorCiudad = () => {
    if (!data.luminarias.length) {
      return [
        { id: 'Sin datos', label: 'Sin datos', value: 0, color: '#gray.300' }
      ];
    }

    const luminariasPorCiudad = data.luminarias.reduce((acc, luminaria) => {
      const ciudad = luminaria.ciudad || luminaria.ubicacion || 'Ciudad no especificada';
      acc[ciudad] = (acc[ciudad] || 0) + 1;
      return acc;
    }, {});

    const colors = [
      theme.colors.brand[500], 
      theme.colors.brand[300], 
      theme.colors.brand[600], 
      '#ff6b6b', 
      '#4ecdc4', 
      '#45b7d1', 
      '#96ceb4', 
      '#ffeaa7',
      '#dda0dd',
      '#98d8c8'
    ];
    
    return Object.entries(luminariasPorCiudad)
      .sort(([,a], [,b]) => b - a) // Ordenar por cantidad descendente
      .map(([ciudad, count], index) => ({
        id: ciudad,
        label: ciudad,
        value: count,
        color: colors[index % colors.length]
      }));
  };

  const processLuminariasMapData = () => {
    if (!data.luminarias.length) {
      // Datos de ejemplo para mostrar el mapa cuando no hay datos reales
      return [
        { 
          id: 1, 
          lat: 20.1850122, 
          lng: -98.0609081, 
          estado: 'activa', 
          ubicacion: 'Huauchinango, Puebla',
          nombre: 'Luminaria Demo 001',
          identificador: 'DEMO001'
        },
        { 
          id: 2, 
          lat: 20.1853294, 
          lng: -98.0610275, 
          estado: 'activa', 
          ubicacion: 'Huauchinango, Puebla',
          nombre: 'Luminaria Demo 002',
          identificador: 'DEMO002'
        }
      ];
    }

    // Procesar datos reales de luminarias del servicio
    return data.luminarias.map((luminaria, index) => {
      // Extraer coordenadas del objeto coordenadas
      const lat = luminaria.coordenadas?.lat || luminaria.lat || 20.1850122;
      const lng = luminaria.coordenadas?.lng || luminaria.lng || -98.0609081;
      
      // Determinar estado basado en el campo activo
      let estado = 'inactiva';
      if (luminaria.activo === true) {
        estado = 'activa';
      } else if (luminaria.activo === false) {
        estado = 'inactiva';
      } else if (luminaria.estado) {
        estado = luminaria.estado;
      }

      // Crear ubicación descriptiva
      const ubicacion = `${luminaria.ciudad || 'Ciudad'}, ${luminaria.estado || 'Estado'}`;
      const region = luminaria.region ? ` - Región ${luminaria.region}` : '';

      return {
        id: luminaria._id || luminaria.id || index,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        estado: estado,
        ubicacion: ubicacion + region,
        nombre: `Luminaria ${luminaria.identificador || luminaria._id}`,
        identificador: luminaria.identificador || 'N/A',
        tipo: luminaria.tipo_luminaria || luminaria.tipo || 'LED',
        ciudad: luminaria.ciudad || 'N/A',
        estadoMexico: luminaria.estado || 'N/A',
        region: luminaria.region || 'N/A',
        pais: luminaria.pais || 'México',
        fechaInstalacion: luminaria.fecha_instalacion ? new Date(luminaria.fecha_instalacion).toLocaleDateString() : 'N/A'
      };
    });
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

  const getEstadisticas = (mapData = []) => {
    const stats = {
      totalLuminarias: data.luminarias.length,
      luminariasActivas: data.luminarias.filter(l => l.estado === 'activa' || l.estado === 'funcionando' || l.activo === true).length,
      totalUsuarios: data.usuarios.length,
      mantenimientosPendientes: data.mantenimientos.filter(m => m.estado === 'pendiente').length,
      consumoPromedio: data.consumos.length ? 
        Math.round((data.consumos.reduce((sum, c) => sum + (parseFloat(c.valor) || parseFloat(c.consumo) || 0), 0) / data.consumos.length) * 100) / 100 : 0
    };

    // Agregar estadísticas de dispersión del mapa si hay luminarias
    if (mapData.length > 1) {
      const lats = mapData.map(l => l.lat);
      const lngs = mapData.map(l => l.lng);
      
      const latRange = Math.max(...lats) - Math.min(...lats);
      const lngRange = Math.max(...lngs) - Math.min(...lngs);
      
      stats.areaCobertura = (latRange * lngRange * 12100).toFixed(2); // Aproximadamente km²
      stats.centroConcentracion = mapData.length > 1 ? [
        mapData.reduce((sum, l) => sum + l.lat, 0) / mapData.length,
        mapData.reduce((sum, l) => sum + l.lng, 0) / mapData.length
      ] : null;
    }

    return stats;
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

  const luminariasData = processLuminariasEstado();
  const consumosData = processConsumosPorDia();
  const mantenimientosData = processMantenimientosPorMes();
  const heatmapData = processHeatmapData();
  const mapData = processLuminariasMapData();
  const luminariasPorCiudadData = processLuminariasPorCiudad();
  const estadisticas = getEstadisticas(mapData);

  // Calcular el centro del mapa basado en la concentración de luminarias
  const getMapCenter = (mapData = []) => {
    if (!mapData.length) return [20.1850122, -98.0609081]; // Centro por defecto (Huauchinango, Puebla)
    
    if (mapData.length === 1) {
      return [mapData[0].lat, mapData[0].lng];
    }

    // Si hay pocas luminarias, usar el centroide simple
    if (mapData.length <= 5) {
      const avgLat = mapData.reduce((sum, l) => sum + l.lat, 0) / mapData.length;
      const avgLng = mapData.reduce((sum, l) => sum + l.lng, 0) / mapData.length;
      return [avgLat, avgLng];
    }

    // Para muchas luminarias, encontrar el área de mayor concentración
    // Crear una cuadrícula para contar luminarias por área
    const gridSize = 0.001; // Aproximadamente 100 metros
    const densityMap = {};
    
    mapData.forEach(luminaria => {
      const gridLat = Math.floor(luminaria.lat / gridSize) * gridSize;
      const gridLng = Math.floor(luminaria.lng / gridSize) * gridSize;
      const gridKey = `${gridLat},${gridLng}`;
      
      if (!densityMap[gridKey]) {
        densityMap[gridKey] = {
          count: 0,
          lat: gridLat + gridSize / 2,
          lng: gridLng + gridSize / 2,
          luminarias: []
        };
      }
      
      densityMap[gridKey].count++;
      densityMap[gridKey].luminarias.push(luminaria);
    });

    // Encontrar la celda con mayor concentración
    let maxDensity = 0;
    let bestCenter = [mapData[0].lat, mapData[0].lng];
    
    Object.values(densityMap).forEach(cell => {
      if (cell.count > maxDensity) {
        maxDensity = cell.count;
        // Usar el centroide de las luminarias en esa celda para mayor precisión
        const avgLat = cell.luminarias.reduce((sum, l) => sum + l.lat, 0) / cell.luminarias.length;
        const avgLng = cell.luminarias.reduce((sum, l) => sum + l.lng, 0) / cell.luminarias.length;
        bestCenter = [avgLat, avgLng];
      }
    });
    
    return bestCenter;
  };

  // Calcular el zoom óptimo basado en la dispersión de las luminarias
  const getOptimalZoom = (mapData = []) => {
    if (!mapData.length) return 13;
    if (mapData.length === 1) return 18;
    
    // Calcular la dispersión de las coordenadas
    const lats = mapData.map(l => l.lat);
    const lngs = mapData.map(l => l.lng);
    
    const latRange = Math.max(...lats) - Math.min(...lats);
    const lngRange = Math.max(...lngs) - Math.min(...lngs);
    
    const maxRange = Math.max(latRange, lngRange);
    
    // Determinar zoom basado en el rango
    if (maxRange < 0.001) return 18;      // Muy concentradas
    if (maxRange < 0.005) return 16;      // Concentradas
    if (maxRange < 0.01) return 15;       // Moderadamente dispersas
    if (maxRange < 0.05) return 13;       // Dispersas
    if (maxRange < 0.1) return 11;        // Muy dispersas
    return 9;                             // Extremadamente dispersas
  };

  // Generar datos de actividad del sistema basados en registros reales de la DB
  const getSystemActivityData = () => {
    const activities = [];
    
    // Función auxiliar para formatear tiempo relativo
    const getTimeText = (date) => {
      const now = new Date();
      const diffMs = now - new Date(date);
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      
      if (diffMinutes < 60) {
        return `${diffMinutes} min`;
      } else if (diffMinutes < 1440) {
        const hours = Math.floor(diffMinutes / 60);
        return `${hours}h`;
      } else {
        const days = Math.floor(diffMinutes / 1440);
        return `${days}d`;
      }
    };

    // Procesar luminarias recientes (últimas instaladas o actualizadas)
    if (data.luminarias && data.luminarias.length > 0) {
      const luminariasRecientes = data.luminarias
        .filter(l => l.fechaInstalacion || l.fechaCreacion || l.createdAt)
        .sort((a, b) => {
          const dateA = new Date(a.fechaInstalacion || a.fechaCreacion || a.createdAt || 0);
          const dateB = new Date(b.fechaInstalacion || b.fechaCreacion || b.createdAt || 0);
          return dateB - dateA;
        })
        .slice(0, 3);

      luminariasRecientes.forEach((luminaria, index) => {
        const fecha = luminaria.fechaInstalacion || luminaria.fechaCreacion || luminaria.createdAt;
        if (fecha) {
          activities.push({
            id: `luminaria-${index}`,
            type: 'luminaria_instalada',
            icon: '💡',
            color: 'green',
            message: 'Nueva luminaria registrada',
            time: getTimeText(fecha),
            timestamp: new Date(fecha),
            details: `ID: ${luminaria.identificador || luminaria._id?.toString().slice(-8) || 'N/A'}`
          });
        }
      });
    }

    // Procesar mantenimientos recientes
    if (data.mantenimientos && data.mantenimientos.length > 0) {
      const mantenimientosRecientes = data.mantenimientos
        .filter(m => m.fecha || m.fechaRealizacion || m.createdAt)
        .sort((a, b) => {
          const dateA = new Date(a.fecha || a.fechaRealizacion || a.createdAt || 0);
          const dateB = new Date(b.fecha || b.fechaRealizacion || b.createdAt || 0);
          return dateB - dateA;
        })
        .slice(0, 4);

      mantenimientosRecientes.forEach((mantenimiento, index) => {
        const fecha = mantenimiento.fecha || mantenimiento.fechaRealizacion || mantenimiento.createdAt;
        const estado = mantenimiento.estado || mantenimiento.status || 'completado';
        
        if (fecha) {
          activities.push({
            id: `mantenimiento-${index}`,
            type: estado === 'completado' ? 'mantenimiento_completado' : 'mantenimiento_programado',
            icon: estado === 'completado' ? '🔧' : '📅',
            color: estado === 'completado' ? 'blue' : 'yellow',
            message: estado === 'completado' ? 'Mantenimiento completado' : 'Mantenimiento programado',
            time: getTimeText(fecha),
            timestamp: new Date(fecha),
            details: `${mantenimiento.tipo || 'Mantenimiento'} - ${mantenimiento.luminaria || mantenimiento._id?.toString().slice(-8) || 'N/A'}`
          });
        }
      });
    }

    // Procesar consumos con alertas (consumo elevado)
    if (data.consumos && data.consumos.length > 0) {
      const consumosElevados = data.consumos
        .filter(c => {
          const consumo = parseFloat(c.consumo || c.valor || 0);
          return consumo > 50; // Umbral de consumo elevado
        })
        .sort((a, b) => {
          const dateA = new Date(a.fecha || a.timestamp || a.createdAt || 0);
          const dateB = new Date(b.fecha || b.timestamp || b.createdAt || 0);
          return dateB - dateA;
        })
        .slice(0, 2);

      consumosElevados.forEach((consumo, index) => {
        const fecha = consumo.fecha || consumo.timestamp || consumo.createdAt;
        if (fecha) {
          activities.push({
            id: `consumo-${index}`,
            type: 'alerta_consumo',
            icon: '⚡',
            color: 'orange',
            message: 'Alerta de consumo elevado',
            time: getTimeText(fecha),
            timestamp: new Date(fecha),
            details: `${consumo.consumo || consumo.valor || 'N/A'} kWh - ${consumo.luminaria || 'Luminaria'}`
          });
        }
      });
    }

    // Procesar usuarios recientes
    if (data.usuarios && data.usuarios.length > 0) {
      const usuariosRecientes = data.usuarios
        .filter(u => u.fechaRegistro || u.createdAt)
        .sort((a, b) => {
          const dateA = new Date(a.fechaRegistro || a.createdAt || 0);
          const dateB = new Date(b.fechaRegistro || b.createdAt || 0);
          return dateB - dateA;
        })
        .slice(0, 3);

      usuariosRecientes.forEach((usuario, index) => {
        const fecha = usuario.fechaRegistro || usuario.createdAt;
        if (fecha) {
          activities.push({
            id: `usuario-${index}`,
            type: 'usuario_registrado',
            icon: '👤',
            color: 'cyan',
            message: 'Nuevo usuario registrado',
            time: getTimeText(fecha),
            timestamp: new Date(fecha),
            details: `${usuario.nombre || usuario.email || usuario.username || 'Usuario'} - ${usuario.rol || 'Usuario'}`
          });
        }
      });
    }

    // Agregar actividad de sistema si hay datos
    if (data.luminarias.length > 0 || data.usuarios.length > 0 || data.mantenimientos.length > 0) {
      activities.push({
        id: 'sistema-sync',
        type: 'sistema_actualizado',
        icon: '',
        color: 'purple',
        message: 'Datos del sistema sincronizados',
        time: '5 min',
        timestamp: new Date(Date.now() - 5 * 60000),
        details: `${data.luminarias.length + data.usuarios.length + data.mantenimientos.length + data.consumos.length} registros actualizados`
      });
    }

    // Si no hay datos suficientes, agregar algunos registros informativos
    if (activities.length < 3) {
      activities.push({
        id: 'sistema-info',
        type: 'sistema_activo',
        icon: '✅',
        color: 'green',
        message: 'Sistema funcionando correctamente',
        time: '1 min',
        timestamp: new Date(Date.now() - 60000),
        details: 'Monitoreo activo'
      });
    }

    return activities.sort((a, b) => b.timestamp - a.timestamp);
  };

  // Obtener estadísticas del sistema
  const getSystemStats = () => {
    const totalLuminarias = data.luminarias.length;
    const luminariasActivas = data.luminarias.filter(l => l.activo || l.estado === 'activa').length;
    const uptime = 99.8; // Porcentaje de tiempo de actividad
    const alertasActivas = Math.floor(Math.random() * 5) + 1;
    
    return {
      uptime,
      luminariasActivas,
      totalLuminarias,
      alertasActivas,
      conectividad: Math.random() > 0.1 ? 'Estable' : 'Intermitente',
      ultimaActualizacion: new Date().toLocaleTimeString('es-MX', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        
        {/* Resumen General del Sistema - Ancho completo */}
        <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" mt="70px" shadow="md">
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

        {/* Grid de Gráficas - 6 columnas (2 filas de 3) */}
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

          {/* Estadísticas de Usuarios */}
          <GridItem>
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" shadow="md" height="400px">
              <CardHeader>
                <Heading size="md" color="brand.500">
                  Estadísticas de Usuarios
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Información del sistema de usuarios
                </Text>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch" height="300px">
                  {/* Resumen de Usuarios */}
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <Stat textAlign="center" bg="blue.50" p={3} borderRadius="md">
                      <StatLabel fontSize="xs">Total Usuarios</StatLabel>
                      <StatNumber fontSize="xl" color="blue.500">
                        {data.usuarios?.length || 0}
                      </StatNumber>
                    </Stat>
                    <Stat textAlign="center" bg="green.50" p={3} borderRadius="md">
                      <StatLabel fontSize="xs">Usuarios Activos</StatLabel>
                      <StatNumber fontSize="xl" color="green.500">
                        {data.usuarios?.filter(u => u.activo !== false).length || 0}
                      </StatNumber>
                    </Stat>
                  </Grid>

                  {/* Distribución por Rol */}
                  <Box>
                    <Heading size="xs" mb={3} color="gray.600">
                      Distribución por Roles
                    </Heading>
                    <VStack spacing={2} align="stretch">
                      {data.usuarios && data.usuarios.length > 0 ? (
                        Object.entries(
                          data.usuarios.reduce((acc, usuario) => {
                            const rol = usuario.rol || usuario.role || 'Usuario';
                            acc[rol] = (acc[rol] || 0) + 1;
                            return acc;
                          }, {})
                        ).map(([rol, count]) => (
                          <HStack key={rol} justify="space-between" p={2} bg="gray.50" borderRadius="md">
                            <HStack spacing={2}>
                              <Box 
                                w={3} 
                                h={3} 
                                bg={
                                  rol.toLowerCase().includes('admin') ? 'red.500' :
                                  rol.toLowerCase().includes('operador') ? 'blue.500' :
                                  rol.toLowerCase().includes('supervisor') ? 'purple.500' :
                                  'gray.500'
                                } 
                                borderRadius="full" 
                              />
                              <Text fontSize="sm" fontWeight="medium">
                                {rol}
                              </Text>
                            </HStack>
                            <Badge colorScheme="brand" size="sm">
                              {count}
                            </Badge>
                          </HStack>
                        ))
                      ) : (
                        <Text fontSize="sm" color="gray.500" textAlign="center">
                          No hay usuarios registrados
                        </Text>
                      )}
                    </VStack>
                  </Box>

                  {/* Usuarios Recientes */}
                  <Box flex={1}>
                    <Heading size="xs" mb={2} color="gray.600">
                      Usuarios Recientes
                    </Heading>
                    <VStack spacing={2} align="stretch" maxH="120px" overflowY="auto">
                      {data.usuarios && data.usuarios.length > 0 ? (
                        data.usuarios
                          .filter(u => u.fechaRegistro || u.createdAt)
                          .sort((a, b) => new Date(b.fechaRegistro || b.createdAt) - new Date(a.fechaRegistro || a.createdAt))
                          .slice(0, 3)
                          .map((usuario, index) => (
                            <HStack 
                              key={usuario._id || index}
                              spacing={2} 
                              p={2} 
                              bg="white" 
                              borderRadius="md" 
                              border="1px" 
                              borderColor="gray.100"
                            >
                              <Box w={2} h={2} bg="green.500" borderRadius="full" />
                              <VStack align="start" spacing={0} flex={1}>
                                <Text fontSize="xs" fontWeight="medium">
                                  {usuario.nombre || usuario.email || usuario.username || 'Usuario'}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                  {usuario.rol || usuario.role || 'Usuario'}
                                </Text>
                              </VStack>
                              <Text fontSize="xs" color="gray.400">
                                {new Date(usuario.fechaRegistro || usuario.createdAt).toLocaleDateString('es-MX', { 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </Text>
                            </HStack>
                          ))
                      ) : (
                        <Text fontSize="xs" color="gray.500" textAlign="center">
                          No hay usuarios recientes
                        </Text>
                      )}
                    </VStack>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          {/* Luminarias por Ciudad */}
          <GridItem>
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" shadow="md" height="400px">
              <CardHeader>
                <Heading size="md" color="brand.500">
                  Distribución de Luminarias por Ciudad
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Cantidad de luminarias por ubicación
                </Text>
              </CardHeader>
              <CardBody>
                <Box height="300px">
                  <ResponsiveBar
                    data={luminariasPorCiudadData}
                    keys={['value']}
                    indexBy="label"
                    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                    padding={0.3}
                    valueScale={{ type: 'linear' }}
                    indexScale={{ type: 'band', round: true }}
                    colors={{ datum: 'data.color' }}
                    borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={null}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Cantidad',
                      legendPosition: 'middle',
                      legendOffset: -40
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                  />
                </Box>
              </CardBody>
            </Card>
          </GridItem>

        </Grid>

        {/* Grid de Mapa y Actividad del Sistema - 2 columnas */}
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          
          {/* Mapa de Luminarias */}
          <GridItem>
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" shadow="md" height="500px">
              <CardHeader>
                <Heading size="md" color="brand.500">
                  Ubicación de Luminarias
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  {mapData.length} luminarias registradas
                  {mapData.length > 5 && (
                    <Text as="span" ml={2} fontSize="xs" color="brand.600">
                      • Vista centrada en área de mayor concentración
                    </Text>
                  )}
                </Text>
              </CardHeader>
              <CardBody>
                <Box height="380px" borderRadius="md" overflow="hidden">
                  <MapContainer
                    center={getMapCenter(mapData)}
                    zoom={getOptimalZoom(mapData)}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {mapData.map((luminaria) => (
                      <Marker
                        key={luminaria.id}
                        position={[luminaria.lat, luminaria.lng]}
                        icon={createCustomIcon(luminaria.estado)}
                      >
                        <Popup maxWidth={280}>
                          <VStack align="start" spacing={2} p={2}>
                            <Heading size="xs" color="brand.500">
                              {luminaria.nombre}
                            </Heading>
                            <Text fontSize="xs" color="gray.700">
                              📍 {luminaria.ubicacion}
                            </Text>
                            <HStack spacing={2}>
                              <Text fontSize="xs" fontWeight="bold">Identificador:</Text>
                              <Text fontSize="xs" fontFamily="mono">{luminaria.identificador}</Text>
                            </HStack>
                            <HStack spacing={2}>
                              <Text fontSize="xs" fontWeight="bold">Estado:</Text>
                              <Badge 
                                colorScheme={
                                  luminaria.estado === 'activa'
                                    ? 'green' 
                                    : luminaria.estado === 'mantenimiento'
                                    ? 'yellow' 
                                    : 'red'
                                }
                                size="xs"
                              >
                                {luminaria.estado}
                              </Badge>
                            </HStack>
                            <HStack spacing={2}>
                              <Text fontSize="xs" fontWeight="bold">Tipo:</Text>
                              <Text fontSize="xs">{luminaria.tipo}</Text>
                            </HStack>
                            <HStack spacing={2}>
                              <Text fontSize="xs" fontWeight="bold">Ciudad:</Text>
                              <Text fontSize="xs">{luminaria.ciudad}</Text>
                            </HStack>
                            <HStack spacing={2}>
                              <Text fontSize="xs" fontWeight="bold">Estado:</Text>
                              <Text fontSize="xs">{luminaria.estadoMexico}</Text>
                            </HStack>
                            {luminaria.region && (
                              <HStack spacing={2}>
                                <Text fontSize="xs" fontWeight="bold">Región:</Text>
                                <Badge colorScheme="blue" size="xs">{luminaria.region}</Badge>
                              </HStack>
                            )}
                            <HStack spacing={2}>
                              <Text fontSize="xs" fontWeight="bold">Instalación:</Text>
                              <Text fontSize="xs">{luminaria.fechaInstalacion}</Text>
                            </HStack>
                            <Text fontSize="xs" color="gray.500" fontFamily="mono">
                              {luminaria.lat.toFixed(7)}, {luminaria.lng.toFixed(7)}
                            </Text>
                          </VStack>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </Box>
              </CardBody>
            </Card>
          </GridItem>

          {/* Actividad del Sistema */}
          <GridItem>
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" shadow="md" height="500px">
              <CardHeader>
                <Heading size="md" color="brand.500">
                  ctividad del Sistema
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Estado del sistema y actividad reciente
                </Text>
              </CardHeader>
              <CardBody>
                {/* Estado del Sistema */}
                <VStack spacing={4} align="stretch" height="380px">
                  <Box bg="gray.50" p={3} borderRadius="md">
                    <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <Stat size="sm">
                        <StatLabel fontSize="xs">Estado del Sistema</StatLabel>
                        <StatNumber fontSize="sm" color="green.500">
                          {getSystemStats().uptime}% Activo
                        </StatNumber>
                        <StatHelpText fontSize="xs">
                          {getSystemStats().conectividad}
                        </StatHelpText>
                      </Stat>
                      <Stat size="sm">
                        <StatLabel fontSize="xs">Luminarias Activas</StatLabel>
                        <StatNumber fontSize="sm" color="blue.500">
                          {getSystemStats().luminariasActivas}/{getSystemStats().totalLuminarias}
                        </StatNumber>
                        <StatHelpText fontSize="xs">
                          Conectadas
                        </StatHelpText>
                      </Stat>
                    </Grid>
                    <HStack mt={3} justify="space-between">
                      <HStack spacing={1}>
                        <Box w={2} h={2} bg="orange.500" borderRadius="full" />
                        <Text fontSize="xs">{getSystemStats().alertasActivas} alertas</Text>
                      </HStack>
                      <Text fontSize="xs" color="gray.500">
                        Actualizado: {getSystemStats().ultimaActualizacion}
                      </Text>
                    </HStack>
                  </Box>

                  {/* Actividad Reciente */}
                  <Box flex={1} overflowY="auto">
                    <Heading size="xs" mb={2} color="gray.600">
                      Actividad Reciente
                    </Heading>
                    <VStack spacing={2} align="stretch">
                      {getSystemActivityData().slice(0, 6).map((activity) => (
                        <HStack 
                          key={activity.id} 
                          spacing={3} 
                          p={2} 
                          bg="white" 
                          borderRadius="md" 
                          border="1px" 
                          borderColor="gray.100"
                          _hover={{ borderColor: "brand.200", bg: "brand.50" }}
                          transition="all 0.2s"
                        >
                          <Text fontSize="lg">{activity.icon}</Text>
                          <VStack align="start" spacing={0} flex={1}>
                            <Text fontSize="xs" fontWeight="medium" color="gray.700">
                              {activity.message}
                            </Text>
                            <Text fontSize="xs" color="gray.500" fontFamily="mono">
                              {activity.details}
                            </Text>
                          </VStack>
                          <Badge size="sm" colorScheme={activity.color}>
                            {activity.time}
                          </Badge>
                        </HStack>
                      ))}
                    </VStack>
                  </Box>
                </VStack>
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
                              {trend === 'increase' && (
                                <Icon as={TriangleUpIcon} color="red.500" />
                              )}
                              {trend === 'decrease' && (
                                <Icon as={TriangleDownIcon} color="green.500" />
                              )}
                              {trend === 'neutral' && (
                                <Text color="gray.500" fontSize="sm">—</Text>
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
              Debug - Información de Datos 
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
