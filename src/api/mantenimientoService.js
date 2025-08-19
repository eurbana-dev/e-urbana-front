// src/services/mantenimientoService.js
import api from "./axios";

// Obtener todos los mantenimientos
export const getMantenimientos = async () => {
  try {
    const response = await api.get("/mantenimiento");
    return response.data;
  } catch (error) {
    console.error("Error obteniendo mantenimientos:", error);
    throw error;
  }
};

// Obtener mantenimientos por luminaria
export const getMantenimientosByLuminaria = async (luminariaId) => {
  try {
    const response = await api.get("/mantenimiento"); // ruta correcta
    // filtramos solo los de la luminaria seleccionada
    const mantenimientosFiltrados = response.data.filter(
      (m) => m.luminaria_id === luminariaId
    );
    return mantenimientosFiltrados;
  } catch (error) {
    console.error("Error obteniendo mantenimientos:", error);
    throw error;
  }
};


// Crear un nuevo mantenimiento
export const createMantenimiento = async (mantenimientoData) => {
    try {
        const response = await api.post("/mantenimiento", mantenimientoData);
        return response.data;
    } catch (error) {
        console.error("Error creando mantenimiento:", error);
        throw error;
    }
};