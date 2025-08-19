import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      500: "#34b298", // Principal (botones)
      400: "#0A67AC", // Secundario (gráficos, detalles resaltados, enlaces)
      300: "#16BE80", // Éxito / estado positivo
      100: "#edf0f4ff", // Fondo claro
      200: "#c9caccff", // Fondo más claro
      900: "#324B61", // Sidebar y textos oscuros
      600: "#16be804b", // Fondo de tarjetas y formularios
      800: "#878787ff", // textos secundarios
      700: "#34b299bd", // Fondo ligero 
    },
    alert: {
      info: "#3182ce",     // Azul
      success: "#38a169",  // Verde
      warning: "#dd6b20",  // Naranja
      error: "#e53e3e",    // Rojo
    },
  },
  
  fonts: {
    heading: "Outfit, sans-serif",
    body: "Outfit, sans-serif",
  },
  components: {
    // Puedes agregar configuraciones específicas para componentes aquí
  }
});

export default theme;