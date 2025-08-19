// src/services/consumoService.js
import api from "./axios";

// Obtener todos los registros de consumo
export const getConsumos = async () => {
  try {
    const response = await api.get("/consumo");
    return response.data;
  } catch (error) {
    console.error("Error al obtener consumos:", error);
    throw error;
  }
};

// Obtener un consumo por ID
export const getConsumoById = async (id) => {
  try {
    const response = await api.get(`/consumo/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener consumo:", error);
    throw error;
  }
};

// Crear un nuevo registro de consumo
export const createConsumo = async (nuevoConsumo) => {
  try {
    const response = await api.post("/consumo", nuevoConsumo);
    return response.data;
  } catch (error) {
    console.error("Error al crear consumo:", error);
    throw error;
  }
};

// Actualizar un consumo
export const updateConsumo = async (id, consumoActualizado) => {
  try {
    const response = await api.put(`/consumo/${id}`, consumoActualizado);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar consumo:", error);
    throw error;
  }
};

// Eliminar un consumo
export const deleteConsumo = async (id) => {
  try {
    const response = await api.delete(`/consumo/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar consumo:", error);
    throw error;
  }
};
