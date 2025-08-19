import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  Text,
  Card,
  CardBody,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Button,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";

import { MagnifyingGlass, Funnel, X, CaretDown, Plus } from "phosphor-react";

import { getLuminarias } from "../../api/luminariasService";
import { getMantenimientosByLuminaria, createMantenimiento } from "../../api/mantenimientoService";

function LuminariasTable() {
  const [luminarias, setLuminarias] = useState([]);
  const [filteredLuminarias, setFilteredLuminarias] = useState([]);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [selectedLuminaria, setSelectedLuminaria] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ ciudad: "", estado: "" });
  const [ultimoMantenimiento, setUltimoMantenimiento] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMant, setNewMant] = useState({
    luminaria_id: "",
    responsable_id: "",
    fecha: "",
    id_mantenimiento_anterior: "",
    estatus: "finalizado",
    observaciones: "",
    tipo_mantenimiento: "preventivo",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    const fetchLuminarias = async () => {
      try {
        const data = await getLuminarias();
        setLuminarias(data);
        setFilteredLuminarias(data);

        const ultimos = {};
        for (const lum of data) {
          const mant = await getMantenimientosByLuminaria(lum._id);
          if (mant.length > 0) {
            mant.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            ultimos[lum._id] = mant[0].fecha;
          } else {
            ultimos[lum._id] = null;
          }
        }
        setUltimoMantenimiento(ultimos);
      } catch (error) {
        console.error("Error cargando luminarias o mantenimientos:", error);
      }
    };
    fetchLuminarias();
  }, []);

  useEffect(() => {
    let data = [...luminarias];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter((l) => {
        const identificador = l.identificador?.toLowerCase() || "";
        const estado = l.estado?.toLowerCase() || "";
        const fechaUlt = ultimoMantenimiento[l._id]
          ? new Date(ultimoMantenimiento[l._id]).toLocaleDateString()
          : "sin mantenimientos previos";
        return (
          identificador.includes(term) ||
          estado.includes(term) ||
          fechaUlt.toLowerCase().includes(term)
        );
      });
    }

    if (filters.estado) {
      data = data.filter((l) => l.estado === filters.estado);
    }
    if (filters.ciudad) {
      data = data.filter((l) => l.ubicacion?.ciudad === filters.ciudad);
    }

    setFilteredLuminarias(data);
    setCurrentPage(1);
  }, [searchTerm, filters, luminarias, ultimoMantenimiento]);

  const handleOpenModal = async (luminaria) => {
    setSelectedLuminaria(luminaria);
    setLoading(true);
    onOpen();
    try {
      const data = await getMantenimientosByLuminaria(luminaria._id);
      setMantenimientos(data);
    } catch (error) {
      console.error("Error obteniendo mantenimientos:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => setFilters({ ciudad: "", estado: "" });

  const handleAddMantenimiento = async (mant) => {
    try {
      await createMantenimiento(mant);
      toast({
        title: "Mantenimiento creado",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsAddModalOpen(false);
      setNewMant({
        luminaria_id: "",
        responsable_id: "",
        fecha: "",
        id_mantenimiento_anterior: "",
        estatus: "finalizado",
        observaciones: "",
        tipo_mantenimiento: "preventivo",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error creando mantenimiento",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const totalPages = Math.ceil(filteredLuminarias.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLuminarias = filteredLuminarias.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const uniqueCities = [
    ...new Set(luminarias.map((l) => l.ubicacion?.ciudad).filter(Boolean)),
  ];
  const uniqueStates = [...new Set(luminarias.map((l) => l.estado))];

  return (
    <>
      {/* Buscador, filtros y botón agregar mantenimiento */}
      <Card shadow="md" borderRadius="md" mb={4} mt={6}>
        <CardBody>
          <Flex direction={{ base: "column", md: "row" }} gap={4} align="center">
            <InputGroup flex="1">
              <InputLeftElement pointerEvents="none">
                <MagnifyingGlass size={20} />
              </InputLeftElement>
              <Input
                placeholder="Buscar luminarias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                borderRadius="full"
                borderWidth="2px"
              />
            </InputGroup>

            <Popover placement="bottom-start">
              <PopoverTrigger>
                <IconButton
                  icon={<Funnel size={20} />}
                  aria-label="Filtros"
                  variant="outline"
                />
              </PopoverTrigger>
              <PopoverContent borderRadius="xl" shadow="md">
                <PopoverArrow />
                <Flex justify="flex-end" p={2}>
                  <IconButton
                    icon={<X size={16} />}
                    size="sm"
                    aria-label="Borrar filtros"
                    onClick={clearFilters}
                    variant="ghost"
                  />
                </Flex>
                <PopoverHeader>Filtros</PopoverHeader>
                <PopoverBody>
                  <Stack spacing={2}>
                    <Menu>
                      <MenuButton
                        as={Button}
                        rightIcon={<CaretDown size={16} />}
                        size="sm"
                        borderRadius="md"
                        variant="outline"
                      >
                        {filters.ciudad || "Ciudad"}
                      </MenuButton>
                      <MenuList>
                        {uniqueCities.map((city) => (
                          <MenuItem
                            key={city}
                            onClick={() => setFilters({ ...filters, ciudad: city })}
                          >
                            {city || "N/A"}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>

                    <Menu>
                      <MenuButton
                        as={Button}
                        rightIcon={<CaretDown size={16} />}
                        size="sm"
                        borderRadius="md"
                        variant="outline"
                      >
                        {filters.estado || "Estado"}
                      </MenuButton>
                      <MenuList>
                        {uniqueStates.map((estado) => (
                          <MenuItem
                            key={estado}
                            onClick={() => setFilters({ ...filters, estado })}
                          >
                            {estado}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </Stack>
                </PopoverBody>
              </PopoverContent>
            </Popover>

            <IconButton
              icon={<Plus size={20} />}
              aria-label="Agregar mantenimiento"
              colorScheme="green"
              onClick={() => setIsAddModalOpen(true)}
            />
          </Flex>
        </CardBody>
      </Card>

      {/* Tabla */}
      <Table variant="simple" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>Identificador</Th>
            <Th>Último mantenimiento</Th>
            <Th>Estado</Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginatedLuminarias.map((luminaria) => {
            const fechaUlt =
              ultimoMantenimiento[luminaria._id] !== null
                ? new Date(ultimoMantenimiento[luminaria._id]).toLocaleDateString()
                : "Sin mantenimientos previos";
            return (
              <Tr
                key={luminaria._id}
                cursor="pointer"
                _hover={{ bg: "gray.100" }}
                onClick={() => handleOpenModal(luminaria)}
              >
                <Td>{luminaria.identificador}</Td>
                <Td>{fechaUlt}</Td>
                <Td>{luminaria.estado}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>

      {/* Paginación */}
      <HStack mt={4} spacing={2} justify="center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            size="sm"
            variant={currentPage === page ? "solid" : "outline"}
            colorScheme={currentPage === page ? "teal" : "gray"}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}
      </HStack>

      {/* Modal ver mantenimientos */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Mantenimientos de {selectedLuminaria?.identificador}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {loading ? (
              <Spinner size="xl" />
            ) : mantenimientos.length > 0 ? (
              <Table variant="striped" colorScheme="orange">
                <Thead>
                  <Tr>
                    <Th>Fecha</Th>
                    <Th>Tipo</Th>
                    <Th>Estatus</Th>
                    <Th>Observaciones</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {mantenimientos.map((m) => (
                    <Tr key={m._id}>
                      <Td>{new Date(m.fecha).toLocaleDateString()}</Td>
                      <Td>{m.tipo_mantenimiento}</Td>
                      <Td>{m.estatus}</Td>
                      <Td>{m.observaciones}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text>No hay mantenimientos registrados</Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal agregar mantenimiento */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Registrar mantenimiento</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Luminaria</FormLabel>
              <Select
                value={newMant.luminaria_id}
                onChange={(e) =>
                  setNewMant({ ...newMant, luminaria_id: e.target.value })
                }
              >
                <option value="">Seleccione una luminaria</option>
                {luminarias.map((l) => (
                  <option key={l._id} value={l._id}>
                    {l.identificador}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Responsable</FormLabel>
              <Input
                value={newMant.responsable_id}
                onChange={(e) =>
                  setNewMant({ ...newMant, responsable_id: e.target.value })
                }
                placeholder="ID del responsable"
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Fecha</FormLabel>
              <Input
                type="date"
                value={newMant.fecha}
                onChange={(e) =>
                  setNewMant({ ...newMant, fecha: e.target.value })
                }
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Estatus</FormLabel>
              <Select
                value={newMant.estatus}
                onChange={(e) => setNewMant({ ...newMant, estatus: e.target.value })}
              >
                <option value="finalizado">Finalizado</option>
                <option value="pendiente">Pendiente</option>
                <option value="correcto">Correcto</option>
              </Select>
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Tipo de mantenimiento</FormLabel>
              <Select
                value={newMant.tipo_mantenimiento}
                onChange={(e) =>
                  setNewMant({ ...newMant, tipo_mantenimiento: e.target.value })
                }
              >
                <option value="preventivo">Preventivo</option>
                <option value="correctivo">Correctivo</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Observaciones</FormLabel>
              <Textarea
                value={newMant.observaciones}
                onChange={(e) =>
                  setNewMant({ ...newMant, observaciones: e.target.value })
                }
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={async () => {
                // Asignar automáticamente el id del último mantenimiento
                const ultimoId = mantenimientos
                  .filter((m) => m.luminaria_id === newMant.luminaria_id)
                  .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0]?._id || null;

                await handleAddMantenimiento({
                  ...newMant,
                  id_mantenimiento_anterior: ultimoId,
                });
              }}
            >
              Guardar
            </Button>
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default LuminariasTable;
