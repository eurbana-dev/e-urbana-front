import { useEffect, useState } from "react";
import { getConsumos } from "../../api/consumoService";
import { getLuminarias } from "../../api/luminariasService";
import { ResponsiveLine } from "@nivo/line";
import {
  Card,
  CardBody,
  Flex,
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
  Button,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  HStack,
} from "@chakra-ui/react";
import { MagnifyingGlass, Funnel, X, CaretDown, Calendar, Lightning, Sun } from "phosphor-react";

const ListaConsumos = () => {
  const [luminarias, setLuminarias] = useState([]);
  const [consumos, setConsumos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLuminaria, setSelectedLuminaria] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lum = await getLuminarias();
        setLuminarias(lum);

        const cons = await getConsumos();
        setConsumos(cons);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    fetchData();
  }, []);

  const uniqueCities = [...new Set(luminarias.map((l) => l.ciudad))];
  const uniqueStates = ["activo", "inactivo"];

  const clearFilters = () => setFilters({});

  const filteredLuminarias = luminarias.filter((l) => {
    const matchSearch = l.identificador.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCiudad = !filters.ciudad || l.ciudad === filters.ciudad;
    const matchEstado = !filters.estado || l.estado === filters.estado;
    return matchSearch && matchCiudad && matchEstado;
  });

  const totalPages = Math.ceil(filteredLuminarias.length / itemsPerPage);
  const paginatedLuminarias = filteredLuminarias.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRowClick = (id) => {
    setSelectedLuminaria(id);
    setModalOpen(true);
  };

  const getConsumosLuminaria = (id) => {
    return consumos
      .filter((c) => c.luminaria_id === id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5)
      .reverse();
  };

  const getNivoData = (id) => {
    const registros = consumos
      .filter((c) => c.luminaria_id === id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const dias = [...new Set(registros.map((r) => new Date(r.timestamp).toLocaleDateString()))].slice(-5);
    const dataPorDia = dias.map((dia) => {
      const total = registros
        .filter((r) => new Date(r.timestamp).toLocaleDateString() === dia)
        .reduce((sum, r) => sum + r.consumo, 0);
      return { x: dia, y: total };
    });
    return [{ id: "Consumo W", data: dataPorDia }];
  };

  return (
    <div style={{ marginTop: "50px", marginLeft: "20px", marginRight: "20px", marginBottom: "50px" }}>
      {/* Card con buscador y filtros */}
      <Card shadow="md" borderRadius="md" mb={4}>
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
                <IconButton icon={<Funnel size={20} />} aria-label="Filtros" variant="outline" />
              </PopoverTrigger>
              <PopoverContent borderRadius="xl" shadow="md">
                <PopoverArrow />
                <Flex justify="flex-end" p={2}>
                  <IconButton icon={<X size={16} />} size="sm" aria-label="Borrar filtros" onClick={clearFilters} variant="ghost" />
                </Flex>
                <PopoverHeader>Filtros</PopoverHeader>
                <PopoverBody>
                  <Stack spacing={2}>
                    <Menu>
                      <MenuButton as={Button} rightIcon={<CaretDown size={16} />} size="sm" borderRadius="md" variant="outline">
                        {filters.ciudad || "Ciudad"}
                      </MenuButton>
                      <MenuList>
                        {uniqueCities.map((city) => (
                          <MenuItem key={city} onClick={() => setFilters({ ...filters, ciudad: city })}>
                            {city || "N/A"}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>

                    <Menu>
                      <MenuButton as={Button} rightIcon={<CaretDown size={16} />} size="sm" borderRadius="md" variant="outline">
                        {filters.estado || "Estado"}
                      </MenuButton>
                      <MenuList>
                        {uniqueStates.map((estado) => (
                          <MenuItem key={estado} onClick={() => setFilters({ ...filters, estado })}>
                            {estado}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </Stack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Flex>
        </CardBody>
      </Card>

      {/* Tabla de luminarias */}
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Identificador</Th>
            <Th>Ciudad</Th>
            <Th>Estado</Th>
            <Th>Activo</Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginatedLuminarias.map((l) => (
            <Tr key={l._id} cursor="pointer" _hover={{ bg: "gray.100" }} onClick={() => handleRowClick(l._id)}>
              <Td>{l.identificador}</Td>
              <Td>{l.ciudad}</Td>
              <Td>{l.estado}</Td>
              <Td>{l.activo ? "Sí" : "No"}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Paginación con HStack */}
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

      {/* Modal con últimos 5 consumos */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Lightning size={24} style={{ marginRight: "8px" }} />
            Consumos - {selectedLuminaria && luminarias.find((l) => l._id === selectedLuminaria)?.identificador}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedLuminaria && (
              <>
                <Flex align="center" mb={2}>
                  <Calendar size={20} style={{ marginRight: "6px" }} />
                  <Text fontWeight="bold">Últimos 5 días (consumo total por día)</Text>
                </Flex>
                <div style={{ height: "300px" }}>
                  <ResponsiveLine
                    data={getNivoData(selectedLuminaria)}
                    margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
                    xScale={{ type: "point" }}
                    yScale={{ type: "linear", min: "auto", max: "auto" }}
                    axisBottom={{ orient: "bottom", legend: "Fecha", legendOffset: 36 }}
                    axisLeft={{ orient: "left", legend: "Consumo W", legendOffset: -50 }}
                    colors={{ scheme: "nivo" }}
                    pointSize={10}
                    pointBorderWidth={2}
                    pointLabel="y"
                    enableArea={true}
                  />
                </div>

                <Flex align="center" mt={4} mb={2}>
                  <Sun size={20} style={{ marginRight: "6px" }} />
                  <Text fontWeight="bold">Registros (últimos 5)</Text>
                </Flex>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Fecha</Th>
                      <Th>Consumo (W)</Th>
                      <Th>Lúmenes</Th>
                      <Th>Encendida</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {getConsumosLuminaria(selectedLuminaria).map((c) => (
                      <Tr key={c._id}>
                        <Td>{new Date(c.timestamp).toLocaleString()}</Td>
                        <Td>{c.consumo}</Td>
                        <Td>{c.lumenes}</Td>
                        <Td>{c.encendida ? "Sí" : "No"}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ListaConsumos;
