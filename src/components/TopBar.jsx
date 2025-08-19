// src/components/TopBar.jsx
import { Box, HStack, Icon, Text, Image, useToken, Fade, Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { UserCircle } from "phosphor-react";
import { useLocation, useNavigate } from "react-router-dom";
import EUrbanalogo from "../assets/icons/EUrbanalogo.svg"; 
import { useEffect, useState } from "react";

const nombresVistas = {
  "/dashboard": "Dashboard",
  "/luminarias": "Luminarias",
  "/registros": "Registros",
  "/consumos": "Consumos",
  "/mantenimiento": "Mantenimiento"
};

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Rutas donde NO debe mostrarse la TopBar
  const rutasExcluidas = ["/", "/login", "/contacto"];
  
  // Obtener el correo de localStorage
  const [correoUsuario] = useState(localStorage.getItem('correoUsuario'));
  const [rol] = useState(localStorage.getItem('rolUsuario')  );
  const [vistaActual, setVistaActual] = useState(nombresVistas[location.pathname] || "Panel Principal");
  const [mostrarVista, setMostrarVista] = useState(true);

  // Verificar si debe mostrarse la barra
  const shouldShowBar = !rutasExcluidas.includes(location.pathname) && 
                       nombresVistas[location.pathname] !== undefined;

  const cerrarSesion = () => {
    // Eliminar token y datos del usuario del almacenamiento
    localStorage.removeItem('token');
    localStorage.removeItem('correoUsuario');
    // Redirigir a la página de login
    navigate('/login');
  };

  useEffect(() => {
    setMostrarVista(false);
    const temporizador = setTimeout(() => {
      setVistaActual(nombresVistas[location.pathname] || "Panel Principal");
      setMostrarVista(true);
    }, 150);
    
    return () => clearTimeout(temporizador);
  }, [location.pathname]);

  if (!shouldShowBar) return null;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bg="rgba(255, 255, 255, 0.8)"
      css={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      shadow="sm"
      px={6}
      py={3}
      borderBottomWidth="1px"
      borderColor="rgba(255, 255, 255, 0.2)"
      zIndex={1000}
    >
      <HStack justify="space-between" w="100%">
        <HStack spacing={3}>
          <Image 
            src={EUrbanalogo} 
            alt="Logo EUrbana"
            boxSize="28px"
          />
          <Fade in={mostrarVista} transition={{ enter: { duration: 0.3 }, exit: { duration: 0.15 } }}>
            <Text fontSize="lg" fontWeight="bold" color="gray.700">
              {vistaActual}
            </Text>
          </Fade>
        </HStack>
        
        <Menu>
  <MenuButton 
    as={Button} 
    variant="ghost" 
    p={0} 
    minW="auto" 
    h="auto"
    _hover={{ bg: 'transparent' }}
    _active={{ bg: 'transparent' }}
  >
    <HStack spacing={2} align="center">
      <Text fontSize="sm" color="gray.600" fontWeight="medium">
       Rol: {rol}
      </Text>
      <Icon 
        as={UserCircle} 
        boxSize="32px" 
        color="brand.900"
        cursor="pointer"
      />
    </HStack>
  </MenuButton>
  <MenuList minW="200px" p={2}>
    <Text px={3} py={1} fontSize="sm" color="gray.600">
      Correo: {correoUsuario}
    </Text>
    <MenuItem 
      onClick={cerrarSesion}
      color="red.500"
      _hover={{ bg: 'red.50' }}
    >
      Cerrar sesión
    </MenuItem>
  </MenuList>
</Menu>
      </HStack>
    </Box>
  );
}