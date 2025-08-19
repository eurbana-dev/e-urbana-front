import api from "./axios";

export const getUsuarios = async () => {
  try {
    const res = await api.get("/usuarios");
    // La lista de usuarios está en res.data.usuarios
    return res.data.usuarios || [];
  } catch (error) {
    console.error("Error al obtener usuarios:", error.response?.data || error.message);
    throw error;
  }
};

export const createUsuario = async (usuario) => {
  try {
    const res = await api.post("/usuarios/completo", usuario);
    return res.data;
  } catch (error) {
    console.error("Error creando usuario:", error.response?.data || error);
    throw error;
  }
};
