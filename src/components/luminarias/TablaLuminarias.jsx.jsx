// src/components/dashboard/TablaLuminarias.jsx
import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  HStack,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Flex,
  Box,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { MagnifyingGlass, Funnel, CaretDown, X } from "phosphor-react";
import { getLuminarias } from "../../api/luminariasService";
import ModalLuminaria from "./ModalLuminaria";

const TablaLuminarias = () => {
  const [luminarias, setLuminarias] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    region: "",
    ciudad: "",
    pais: "",
    estado: "",
  });
  const [selectedLuminaria, setSelectedLuminaria] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();
  const toast = useToast();
  const rowsPerPage = 15;

  const fetchLuminarias = async () => {
    try {
      const data = await getLuminarias();
      setLuminarias(data);
    } catch (error) {
      console.error("Error al cargar luminarias:", error);
      toast({
        title: "Error al cargar luminarias",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchLuminarias();
  }, []);

  const filteredLuminarias = luminarias.filter((lum) => {
    const matchesSearch = Object.values(lum).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesFilters =
      (!filters.region || lum.region === filters.region) &&
      (!filters.ciudad || lum.ciudad === filters.ciudad) &&
      (!filters.pais || lum.pais === filters.pais) &&
      (!filters.estado ||
        (lum.activo ? "activo" : "inactivo") === filters.estado);

    return matchesSearch && matchesFilters;
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredLuminarias.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredLuminarias.length / rowsPerPage);

  const uniqueRegions = [...new Set(luminarias.map((lum) => lum.region))];
  const uniqueCities = [...new Set(luminarias.map((lum) => lum.ciudad))];
  const uniqueCountries = [...new Set(luminarias.map((lum) => lum.pais))];

  const clearFilters = () => {
    setFilters({ region: "", ciudad: "", pais: "", estado: "" });
    setCurrentPage(1);
  };

  const handleLuminariaUpdated = () => {
    fetchLuminarias(); // Refresca la lista de luminarias
    closeModal(); // Cierra el modal
  };

  return (
    <Box mt={8} mx={4} pb="50px">
      <Stack spacing={4}>
        {/* Card de búsqueda y filtros */}
        <Card shadow="md" borderRadius="md" mt={12}>
          <CardBody>
            <Flex direction={{ base: "column", md: "row" }} gap={4} align="center">
              {/* Buscador */}
              <InputGroup flex="1">
                <InputLeftElement pointerEvents="none">
                  <MagnifyingGlass size={20} />
                </InputLeftElement>
                <Input
                  placeholder="Buscar luminarias..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  borderRadius="full"
                  borderWidth="2px"
                />
              </InputGroup>

              {/* Popover con filtros */}
              <Popover placement="bottom-start" isOpen={isOpen} onOpen={onOpen} onClose={onClose} closeOnBlur={true}>
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
                      {/* Región */}
                      <Menu>
                        <MenuButton
                          as={Button}
                          rightIcon={<CaretDown size={16} />}
                          size="sm"
                          borderRadius="md"
                          variant="outline"
                        >
                          {filters.region || "Región"}
                        </MenuButton>
                        <MenuList>
                          {uniqueRegions.map((region) => (
                            <MenuItem
                              key={region}
                              onClick={() => {
                                setFilters({ ...filters, region });
                                setCurrentPage(1);
                              }}
                            >
                              {region || "N/A"}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Menu>

                      {/* Ciudad */}
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
                              onClick={() => {
                                setFilters({ ...filters, ciudad: city });
                                setCurrentPage(1);
                              }}
                            >
                              {city || "N/A"}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Menu>

                      {/* País */}
                      <Menu>
                        <MenuButton
                          as={Button}
                          rightIcon={<CaretDown size={16} />}
                          size="sm"
                          borderRadius="md"
                          variant="outline"
                        >
                          {filters.pais || "País"}
                        </MenuButton>
                        <MenuList>
                          {uniqueCountries.map((country) => (
                            <MenuItem
                              key={country}
                              onClick={() => {
                                setFilters({ ...filters, pais: country });
                                setCurrentPage(1);
                              }}
                            >
                              {country || "N/A"}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Menu>

                      {/* Estado */}
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
                          <MenuItem
                            onClick={() => {
                              setFilters({ ...filters, estado: "activo" });
                              setCurrentPage(1);
                            }}
                          >
                            Activo
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setFilters({ ...filters, estado: "inactivo" });
                              setCurrentPage(1);
                            }}
                          >
                            Inactivo
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Stack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Flex>
          </CardBody>
        </Card>

        {/* Card de la tabla con borde inferior */}
        <Card shadow="xl" borderRadius="xl" mx={2} borderBottom="50px solid #E2E8F0">
          <CardHeader>
            <Heading size="md">Lista de Luminarias</Heading>
          </CardHeader>
          <CardBody>
            <TableContainer>
              <Table variant="striped" colorScheme="gray">
                <Thead>
                  <Tr>
                    <Th>Identificador</Th>
                    <Th>Ciudad</Th>
                    <Th>Región</Th>
                    <Th>Activo</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {currentRows.length > 0 ? (
                    currentRows.map((lum) => (
                      <Tr
                        key={lum._id}
                        onClick={() => {
                          setSelectedLuminaria(lum);
                          openModal();
                        }}
                        _hover={{ bg: "gray.100", cursor: "pointer" }}
                      >
                        <Td>{lum.identificador || lum._id}</Td>
                        <Td>{lum.ciudad || "N/A"}</Td>
                        <Td>{lum.region || "N/A"}</Td>
                        <Td>{lum.activo ? "Activa" : "Inactiva"}</Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={4} textAlign="center">
                        No se encontraron resultados
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>

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
          </CardBody>
        </Card>
      </Stack>

      {/* Modal de la luminaria seleccionada */}
      <ModalLuminaria
        isOpen={isModalOpen}
        onClose={handleLuminariaUpdated}
        luminaria={selectedLuminaria}
      />
    </Box>
  );
};

export default TablaLuminarias;