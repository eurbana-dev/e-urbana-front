import { useEffect, useState } from "react";
import { getUsuarios, createUsuario } from "../../api/usuariosService";
import {
  Card,
  CardBody,
  Flex,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input as ChakraInput,
  Select,
  Button,
} from "@chakra-ui/react";
import { MagnifyingGlass, Plus, Phone, Key, User } from "phosphor-react";

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const [newUser, setNewUser] = useState({
    identificador: "",
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    rol: "usuario",
    password: "",
  });

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      setUsuarios([]);
    }
  };

  // Métricas
  const totalUsuarios = usuarios.length;
  const roles = [...new Set(usuarios.map((u) => u.rol))];
  const ultimoUsuario = usuarios[usuarios.length - 1];

  // Filtro y búsqueda
  const filteredUsuarios = usuarios.filter((u) => {
    return (
      u.identificador?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.apellido?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCreateUser = async () => {
    try {
      // Limpiar teléfono para obtener solo números
      const numerosTelefono = newUser.telefono.replace(/\D/g, "");
      const ultimosDosTelefono = numerosTelefono.slice(-2);

      // Día del registro
      const hoy = new Date();
      const dia = String(hoy.getDate()).padStart(2, "0");

      // Generar identificador
      const identificadorGenerado =
        (newUser.nombre.slice(0, 2) || "XX").toUpperCase() +
        (newUser.apellido.slice(0, 2) || "XX").toUpperCase() +
        ultimosDosTelefono +
        "-" +
        dia;

      // Actualizar usuario con identificador
      const usuarioConId = { ...newUser, identificador: identificadorGenerado };

      await createUsuario(usuarioConId);
      setModalOpen(false);
      setNewUser({
        identificador: "",
        nombre: "",
        apellido: "",
        telefono: "",
        correo: "",
        rol: "usuario",
        password: "",
      });
      fetchUsuarios();
    } catch (error) {
      console.error("Error creando usuario:", error);
    }
  };

  const handleOpenUserModal = (usuario) => {
    setModalUser(usuario);
  };

  return (
    <div style={{ marginTop: "50px", marginLeft: "20px", marginRight: "20px" }}>
      {/* Cards métricas */}
      <Flex gap={4} mb={6}>
        <Card shadow="md" borderRadius="md" flex="1">
          <CardBody>
            <Text fontSize="lg" fontWeight="bold">Total Usuarios</Text>
            <Text fontSize="2xl">{totalUsuarios}</Text>
          </CardBody>
        </Card>
        <Card shadow="md" borderRadius="md" flex="1">
          <CardBody>
            <Text fontSize="lg" fontWeight="bold">Roles</Text>
            <Text fontSize="2xl">3</Text>
          </CardBody>
        </Card>
        <Card shadow="md" borderRadius="md" flex="1">
          <CardBody>
            <Text fontSize="lg" fontWeight="bold">Último Usuario</Text>
            <Text fontSize="md">{ultimoUsuario ? `${ultimoUsuario.nombre} ${ultimoUsuario.apellido}` : "N/A"}</Text>
            <Text fontSize="sm">{ultimoUsuario?.identificador || ""}</Text>
          </CardBody>
        </Card>
      </Flex>

      {/* Card buscador y agregar usuario */}
      <Card shadow="md" borderRadius="md" mb={4}>
        <CardBody>
          <Flex direction={{ base: "column", md: "row" }} gap={4} align="center">
            {/* Buscador */}
            <InputGroup flex="1">
              <InputLeftElement pointerEvents="none">
                <MagnifyingGlass size={20} />
              </InputLeftElement>
              <Input
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                borderRadius="full"
                borderWidth="2px"
              />
            </InputGroup>

            {/* Botón agregar usuario solo con ícono */}
            <IconButton
              icon={<Plus size={16} />}
              aria-label="Agregar usuario"
              colorScheme="green"
              variant="outline"
              borderRadius="md"
              onClick={() => setModalOpen(true)}
            />
          </Flex>
        </CardBody>
      </Card>

      {/* Tabla de usuarios */}
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Identificador</Th>
            <Th>Nombre</Th>
            <Th>Apellido</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Array.isArray(filteredUsuarios) && filteredUsuarios.map((u) => (
            <Tr key={u._id} cursor="pointer" onClick={() => handleOpenUserModal(u)}>
              <Td>{u.identificador}</Td>
              <Td>{u.nombre}</Td>
              <Td>{u.apellido}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Modal agregar usuario */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar Usuario</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <FormControl>
                <FormLabel>Identificador</FormLabel>
                <ChakraInput
                  value={newUser.identificador || "Se generará automáticamente"}
                  isDisabled
                />
              </FormControl>
              <FormControl>
                <FormLabel>Nombre</FormLabel>
                <ChakraInput value={newUser.nombre} onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })} />
              </FormControl>
              <FormControl>
                <FormLabel>Apellido</FormLabel>
                <ChakraInput value={newUser.apellido} onChange={(e) => setNewUser({ ...newUser, apellido: e.target.value })} />
              </FormControl>
              <FormControl>
                <FormLabel>Teléfono</FormLabel>
                <ChakraInput value={newUser.telefono} onChange={(e) => setNewUser({ ...newUser, telefono: e.target.value })} />
              </FormControl>
              <FormControl>
                <FormLabel>Correo</FormLabel>
                <ChakraInput value={newUser.correo} onChange={(e) => setNewUser({ ...newUser, correo: e.target.value })} />
              </FormControl>
              <FormControl>
                <FormLabel>Rol</FormLabel>
                <Select value={newUser.rol} onChange={(e) => setNewUser({ ...newUser, rol: e.target.value })}>
                  <option value="usuario">Usuario</option>
                  <option value="admin">Admin</option>
                  <option value="supervisor">Supervisor</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <ChakraInput type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleCreateUser}>Guardar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal info usuario */}
      <Modal isOpen={!!modalUser} onClose={() => setModalUser(null)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Información Usuario</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {modalUser && (
              <Stack spacing={2}>
                <Text><strong>Identificador:</strong> {modalUser.identificador}</Text>
                <Text><User size={16} /> <strong>Nombre:</strong> {modalUser.nombre} {modalUser.apellido}</Text>
                <Text><Phone size={16} /> <strong>Teléfono:</strong> {modalUser.telefono}</Text>
                <Text><Key size={16} /> <strong>Rol:</strong> {modalUser.correo || "N/A"}</Text>
              </Stack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ListaUsuarios;
