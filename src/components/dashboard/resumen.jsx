// src/pages/DashboardLuminarias.jsx
import { useEffect, useState } from "react";
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Stack,
  Heading,
} from "@chakra-ui/react";
import { Lightbulb, Wrench, ChartBar, Globe } from "phosphor-react";
import { getLuminarias } from "../../api/luminariasService";

const Resumen = () => {
  const [luminarias, setLuminarias] = useState([]);

  useEffect(() => {
    const fetchLuminarias = async () => {
      try {
        const data = await getLuminarias();
        console.log("Obtencion correcta"); 
        setLuminarias(data || []); 
      } catch (error) {
        console.error("Error al cargar luminarias", error);
      }
    };

    fetchLuminarias();
  }, []);

  // Cálculos rápidos
  const totalLuminarias = luminarias.length;
  const activas = luminarias.filter((l) => l.activo).length;

  return (
    <Box p={8}>
      <Stack spacing={6}>
        <Heading fontSize="3xl"> </Heading>
        <Heading fontSize="3xl"> </Heading>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
          {/* Card 1: Luminarias activas */}
          <Stat p={4} borderRadius="xl" bg="brand.400" color="white" shadow="md">
            <StatLabel display="flex" alignItems="center">
              <Lightbulb size={24} weight="bold" style={{ marginRight: 8 }} />
              Luminarias activas
            </StatLabel>
            <StatNumber>{activas}</StatNumber>
            <StatHelpText>De {totalLuminarias}</StatHelpText>
          </Stat>

          {/* Card 2: Total luminarias */}
          <Stat p={4} borderRadius="xl" bg="brand.900" color="white" shadow="md">
            <StatLabel display="flex" alignItems="center">
              <Globe size={24} weight="bold" style={{ marginRight: 8 }} />
              Total luminarias
            </StatLabel>
            <StatNumber>{totalLuminarias}</StatNumber>
            <StatHelpText>En todo el sistema</StatHelpText>
          </Stat>

          {/* Card 3: Consumo mensual (estático) */}
          <Stat p={4} borderRadius="xl" bg="brand.300" color="white" shadow="md">
            <StatLabel display="flex" alignItems="center">
              <ChartBar size={24} weight="bold" style={{ marginRight: 8 }} />
              Consumo mensual
            </StatLabel>
            <StatNumber>12345 kWh</StatNumber>
            <StatHelpText>Dato estático por ahora</StatHelpText>
          </Stat>

          {/* Card 4: Luminarias en mantenimiento (estático) */}
          <Stat p={4} borderRadius="xl" bg="brand.200" color="black" shadow="md">
            <StatLabel display="flex" alignItems="center">
              <Wrench size={24} weight="bold" style={{ marginRight: 8 }} />
              Requieren mantenimiento
            </StatLabel>
            <StatNumber>5</StatNumber>
            <StatHelpText>Dato estático por ahora</StatHelpText>
          </Stat>

        
        </SimpleGrid>
      </Stack>
    </Box>
  );
};

export default Resumen;
