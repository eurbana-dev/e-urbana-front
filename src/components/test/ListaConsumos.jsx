import { useEffect, useState } from "react";
import { getConsumos } from "../../api/consumoService";

const ListaConsumos = () => {
  const [consumos, setConsumos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getConsumos();
        setConsumos(data);
      } catch (error) {
        console.error("Error cargando consumos:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Registros de Consumo</h2>
      <ul>
        {consumos.map((c) => (
          <li key={c._id}>
            <strong>{c.luminaria_id}</strong> | Consumo: {c.consumo} W |
            Lúmenes: {c.lumenes} | Encendida: {c.encendida ? "Sí" : "No"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaConsumos;
