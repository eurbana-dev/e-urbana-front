// src/components/BottomNav.jsx
import { Box, HStack, Icon, Text, useToken } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { House, Lightbulb, FileText, ChartBar, Wrench } from "phosphor-react";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

// Items de navegación base
const navItemsBase = [
  { name: "Dashboard", icon: House, path: "/dashboard" },
  { name: "Luminarias", icon: Lightbulb, path: "/luminarias" },
  { name: "Registros", icon: FileText, path: "/registros", adminOnly: true },
  { name: "Consumos", icon: ChartBar, path: "/consumos" },
  { name: "Mantenimiento", icon: Wrench, path: "/mantenimiento" },
];

// Rutas válidas para mostrar el BottomNav
const rutasValidas = {
  "/dashboard": true,
  "/luminarias": true,
  "/registros": true,
  "/consumos": true,
  "/mantenimiento": true
};

const MotionBox = motion(Box);

export default function BottomNav() {
  const location = useLocation();
  const excludedRoutes = ["/", "/login", "/contacto"];
  const itemsRef = useRef([]);
  const blue100 = useToken("colors", "brand.900");

  // Estado para el rol y sincronización con localStorage
  const [rol, setRol] = useState(localStorage.getItem("rolUsuario"));

  useEffect(() => {
    const handleStorageChange = () => setRol(localStorage.getItem("rolUsuario"));
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Filtrar navItems según rol
  const navItems = navItemsBase.filter(item => {
    if (item.adminOnly && rol !== "admin") return false;
    return true;
  });

  // Estado del item activo, por defecto Dashboard
  const [activeItem, setActiveItem] = useState(navItems[0] || null);

  // Mostrar nav solo en rutas válidas
  const shouldShowNav = !excludedRoutes.includes(location.pathname) &&
                        rutasValidas[location.pathname] === true;

  if (!shouldShowNav) return null;

  return (
    <Box
      position="fixed"
      bottom="20px"
      left="50%"
      transform="translateX(-50%)"
      bg="rgba(255, 255, 255, 0.5)"
      css={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      shadow="xl"
      borderRadius="full"
      px={4}
      py={2}
      zIndex="100"
      maxW="500px"
      w="90%"
      overflow="hidden"
      borderWidth="1px"
      borderColor="rgba(255, 255, 255, 0.2)" 
    >
      <Box position="relative">
        {/* Fondo animado */}
        <AnimatePresence>
          {activeItem && itemsRef.current[activeItem.name] && (
            <MotionBox
              position="absolute"
              bg={blue100}
              borderRadius="full"
              initial={false}
              animate={{
                width: itemsRef.current[activeItem.name]?.offsetWidth || 0,
                height: itemsRef.current[activeItem.name]?.offsetHeight || 0,
                x: itemsRef.current[activeItem.name]?.offsetLeft || 0,
                y: 0,
                opacity: 1
              }}
              exit={{ opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
            />
          )}
        </AnimatePresence>

        <HStack justify="space-between" position="relative" zIndex="1" spacing={0}>
          {navItems.map((item) => {
            const isActive = activeItem?.name === item.name;
            return (
              <NavLink 
                key={item.name} 
                to={item.path}
                onClick={() => setActiveItem(item)}
              >
                <Box
                  ref={el => itemsRef.current[item.name] = el}
                  position="relative"
                  px={3}
                  py={2}
                >
                  <HStack
                    spacing={2}
                    justify="center"
                    color={isActive ? "white" : "gray.600"} 
                    transition="color 0.2s"
                  >
                    <Icon as={item.icon} size={24} weight={isActive ? "fill" : "regular"} />
                    {isActive && (
                      <Text fontSize="sm" fontWeight="bold">
                        {item.name}
                      </Text>
                    )}
                  </HStack>
                </Box>
              </NavLink>
            );
          })}
        </HStack>
      </Box>
    </Box>
  );
}
