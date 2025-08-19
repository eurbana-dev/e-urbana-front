// src/components/dashboard/GraficaConsumoLine.jsx
import { useEffect, useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import { getConsumos } from "../../api/consumoService";
import dayjs from "dayjs";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Box,
  Skeleton,
} from "@chakra-ui/react";

const GraficaConsumo = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsumos = async () => {
      try {
        const consumos = await getConsumos();

        // Agrupar por día y hora
        const consumosPorDia = {};
        consumos.forEach((c) => {
          const dia = dayjs(c.timestamp).format("YYYY-MM-DD");
          const hora = dayjs(c.timestamp).format("HH");

          if (!consumosPorDia[dia]) {
            consumosPorDia[dia] = {};
          }
          if (!consumosPorDia[dia][hora]) {
            consumosPorDia[dia][hora] = 0;
          }
          consumosPorDia[dia][hora] += c.consumo;
        });

        // Formato para Nivo
        const dataProcesada = Object.entries(consumosPorDia).map(
          ([dia, horas]) => {
            const puntos = Object.entries(horas)
              .map(([hora, total]) => ({
                x: hora,
                y: total,
              }))
              .sort((a, b) => parseInt(a.x) - parseInt(b.x))
              .slice(0, 10);

            return {
              id: dia,
              data: puntos,
            };
          }
        );

        setData(dataProcesada);
      } catch (error) {
        console.error("Error al cargar consumos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsumos();
  }, []);

  return (
    <Card shadow="xl" borderRadius="2xl" p={4}>
      <CardHeader>
        <Heading size="md">Consumo por hora (primeras 10 horas)</Heading>
      </CardHeader>
      <CardBody>
        {loading ? (
          <Skeleton height="400px" borderRadius="xl" />
        ) : (
          <Box height="400px">
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
              axisBottom={{
                legend: "Hora del día",
                legendOffset: 36,
                legendPosition: "middle",
              }}
              axisLeft={{
                legend: "Consumo (W)",
                legendOffset: -40,
                legendPosition: "middle",
              }}
              pointSize={8}
              pointColor={{ theme: "background" }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              enableTouchCrosshair={true}
              useMesh={true}
              legends={[
                {
                  anchor: "bottom-right",
                  direction: "column",
                  translateX: 100,
                  itemWidth: 80,
                  itemHeight: 22,
                  symbolShape: "circle",
                },
              ]}
            />
          </Box>
        )}
      </CardBody>
    </Card>
  );
};

export default GraficaConsumo;
