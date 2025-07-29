import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
  colors: {
    brand: {
      500: "#1FA1AE", // Principal (botones)
      400: "#0A67AC", // Secundario (gráficos, detalles resaltados, enlaces)
      300: "#16BE80", // Éxito / estado positivo
      100: "#EAEFF5", // Fondo claro
      900: "#324B61", // Sidebar y textos oscuros
    },
    alert: {
      info: "#3182ce",     // Azul
      success: "#38a169",  // Verde
      warning: "#dd6b20",  // Naranja
      error: "#e53e3e",    // Rojo
    },
  },
  styles: {
    global: {
      body: {
        bg: "brand.100", // fondo general 
        color: "brand.900", // Color del texto
      },
    },
  },
  fonts: {
    heading: "Outfit, sans-serif",
    body: "Outfit, sans-serif",
  },
})

export default theme
