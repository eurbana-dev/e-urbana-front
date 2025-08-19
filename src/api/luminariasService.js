// src/api/luminariasService.js
import api from "./axios";

// Obtener todas las luminarias
export const getLuminarias = async () => {
  try {
    const res = await api.get("/luminarias");
    console.log("Respuesta de la API de luminarias:", res.data); // 👈 aquí imprimimos lo que llega
    return res.data; // normalmente { success: true, data: [...] }
  } catch (error) {
    console.error("Error al obtener luminarias:", error.response?.data || error.message);
    throw error;
  }
};

// Obtener luminaria por id
export const getLuminariaById = async (id) => {
  try {
    const res = await api.get(`/luminarias/${id}`);
    console.log(`Respuesta de la API de luminaria ${id}:`, res.data); // 👈 console.log
    return res.data;
  } catch (error) {
    console.error(`Error al obtener luminaria ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Otros GETs específicos si existen, ejemplo: por zona o estado
export const getLuminariasActivas = async () => {
  try {
    const res = await api.get("/luminarias/activas");
    console.log("Respuesta de la API de luminarias activas:", res.data); // 👈 console.log
    return res.data;
  } catch (error) {
    console.error("Error al obtener luminarias activas:", error.response?.data || error.message);
    throw error;
  }
};


// Función mejorada para actualizar luminaria
export const updateLuminaria = async (id, data) => {
  try {
    console.log('Enviando actualización para ID:', id);
    console.log('Datos enviados:', data);
    
    const res = await api.put(`/luminarias/${id}`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Respuesta de actualización:', res.data);
    return res.data;
  } catch (error) {
    console.error(`Error detallado al actualizar luminaria ${id}:`, {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    
    // Mejor manejo de errores
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error(`Luminaria con ID ${id} no encontrada en el servidor`);
      } else if (error.response.status === 400) {
        throw new Error(`Datos inválidos: ${JSON.stringify(error.response.data)}`);
      }
    }
    
    throw new Error(`Error al actualizar luminaria: ${error.message}`);
  }
};



// Eliminar luminaria
export const deleteLuminaria = async (id) => {
  try {
    const res = await api.delete(`/luminarias/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error al eliminar luminaria ${id}:`, error.response?.data || error.message);
    throw error;
  }
};