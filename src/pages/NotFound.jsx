// src/pages/NotFound.jsx
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" py={10} px={6} zIndex={100000}>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, brand.400, brand.600)"
        backgroundClip="text">
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Página no encontrada
      </Text>
      <Text color={'gray.500'} mb={6}>
        La página que estás buscando no existe o fue removida
      </Text>

      <Button
        colorScheme="brand"
        color="white"
        variant="solid"
        onClick={() => navigate('/')}>
        Volver al inicio
      </Button>
    </Box>
  );
};

export default NotFound;