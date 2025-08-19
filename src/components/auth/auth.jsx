import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Heading,
  Text,
  IconButton,
  Image,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { Envelope, Lock, Eye, EyeSlash, ArrowLeft } from "phosphor-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const AuthPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); 
  const handleTogglePassword = () => setShowPassword(!showPassword);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { correo, password });
      console.log("Token recibido:", res.data.token);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("correoUsuario", correo);
      localStorage.setItem("rolUsuario", res.data.rol); 
      navigate("/dashboard");
    } catch (error) {
      const msg =
        error.response?.data?.message || "Error desconocido en el login";
      setErrorMsg(msg); 
    }
  };

  return (
    <Box
      position="relative"
      bg="white"
      p={10}
      borderRadius="2xl"
      boxShadow="2xl"
      w="full"
      maxW="md"
      overflow="hidden"
    >
      <Stack spacing={6} align="center" zIndex={1} position="relative">
        <Image
          src="src/assets/icons/EUrbanalogo.svg"
          alt="Logo E. Urbana"
          boxSize="80px"
          objectFit="contain"
        />
        <Heading fontSize="2xl" color="brand.900">
          Bienvenido
        </Heading>
        <Text fontSize="m" color="brand.800">
          Ingresa tus credenciales para continuar
        </Text>
      </Stack>

      <Stack spacing={5} mt={4} zIndex={1} position="relative">
        {/* 👈 Alerta de error */}
        {errorMsg && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {errorMsg}
          </Alert>
        )}

        <FormControl id="correo">
          <FormLabel>Correo electrónico</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Envelope size={20} color="#324B61" />
            </InputLeftElement>
            <Input
              background={"brand.100"}
              borderColor={"brand.100"}
              focusBorderColor="brand.600"
              _hover={{ borderColor: "brand.600" }}
              type="email"
              placeholder="hola@eurbana.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </InputGroup>
        </FormControl>

        <FormControl id="password">
          <FormLabel>Contraseña</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Lock size={20} color="#324B61" />
            </InputLeftElement>
            <Input
              background={"brand.100"}
              borderColor={"brand.100"}
              focusBorderColor="brand.600"
              _hover={{ borderColor: "brand.600" }}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement>
              <IconButton
                variant="ghost"
                size="sm"
                icon={showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                onClick={handleTogglePassword}
                aria-label="Mostrar u ocultar contraseña"
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          colorScheme="brand"
          size="lg"
          w="full"
          bg="brand.500"
          _hover={{ bg: "brand.300" }}
          onClick={handleLogin}
        >
          Iniciar sesión
        </Button>

        <Text fontSize="sm" color="brand.800" textAlign="center" marginBottom={4}>
          Si aun no tienes una cuenta, solicitala al administrador.
        </Text>
      </Stack>

      <Box
        position="absolute"
        bottom="0"
        left="0"
        w="100%"
        h="auto"
        zIndex={0}
      >
        <Image
          src="src/assets/images/Citylogin.png"
          alt="Decoración inferior"
          width="100%"
          objectFit="cover"
          pointerEvents="none"
          opacity={0.6}
        />
      </Box>
      <Box position="absolute" bottom="4" left="4" zIndex={2}>
        <IconButton
          variant="subtle"
          marginTop={6}
          aria-label="Salir"
          icon={<ArrowLeft size={24} weight="bold" />}
          color="brand.900"
          _hover={{ bg: "brand.600" }}
          onClick={() => navigate(-1)}
        />
      </Box>
    </Box>
  );
};

export default AuthPage;
