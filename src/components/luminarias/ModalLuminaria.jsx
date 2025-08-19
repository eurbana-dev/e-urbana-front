// src/components/dashboard/ModalLuminaria.jsx
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Stack,
  Box,
  Flex,
  Text,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  SquaresFour,
  MapPin,
  Globe,
  House,
  Plug,
  Calendar,
  Key,
  X,
  PencilSimple,
  TrashSimple,
} from "phosphor-react";
import { updateLuminaria, deleteLuminaria } from "../../api/luminariasService";

// Icono de Leaflet arreglado
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const ModalLuminaria = ({ isOpen, onClose, luminaria }) => {
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedLuminaria, setEditedLuminaria] = useState(luminaria || {});
  const { 
    isOpen: isDeleteOpen, 
    onOpen: onDeleteOpen, 
    onClose: onDeleteClose 
  } = useDisclosure();
  const cancelRef = React.useRef();

  if (!luminaria) return null;
  const { coordenadas } = luminaria;

  const rolUsuario = localStorage.getItem("rolUsuario");

  const infoList = [
    { icon: <Key  size={20} />, label: "Identificador", value: luminaria.identificador, field: "identificador" },
    { icon: <Plug size={20} />, label: "Tipo", value: luminaria.tipo_luminaria, field: "tipo_luminaria" },
    { icon: <House size={20} />, label: "Estado", value: luminaria.estado, field: "estado" },
    { icon: <MapPin size={20} />, label: "Ciudad", value: luminaria.ciudad, field: "ciudad" },
    { icon: <SquaresFour size={20} />, label: "Región", value: luminaria.region, field: "region" },
    { icon: <Globe size={20} />, label: "País", value: luminaria.pais, field: "pais" },
    { icon: <Plug size={20} />, label: "Activo", value: luminaria.activo ? "Sí" : "No", field: "activo" },
    { icon: <Calendar size={20} />, label: "Fecha de instalación", value: new Date(luminaria.fecha_instalacion).toLocaleDateString(), field: "fecha_instalacion" },
  ];

  const handleEdit = () => {
    setEditedLuminaria(luminaria);
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? e.target.checked : value;
    
    setEditedLuminaria(prev => ({
      ...prev,
      [name]: val
    }));
  };

  const handleSubmit = async () => {
    try {
      await updateLuminaria(luminaria._id, editedLuminaria);
      toast({
        title: "Luminaria actualizada",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsEditing(false);
      onClose(); // Cierra el modal después de actualizar
    } catch (error) {
      toast({
        title: "Error al actualizar",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteLuminaria(luminaria._id);
      toast({
        title: "Luminaria eliminada",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onDeleteClose();
      onClose(); // Cierra el modal después de eliminar
    } catch (error) {
      toast({
        title: "Error al eliminar",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {/* Modal principal de visualización */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent borderRadius="2xl" overflow="hidden">
          <ModalHeader>
            <Flex justify="space-between" align="center">
              Luminaria: {luminaria.identificador || luminaria._id}
              <Button size="sm" variant="ghost" onClick={onClose}>
                <X size={20} />
              </Button>
            </Flex>
          </ModalHeader>
          <ModalBody>
            <Stack spacing={3}>
              {infoList.map((item, idx) => (
                <Box
                  key={idx}
                  p={3}
                  borderRadius="xl"
                  shadow="sm"
                  borderWidth="1px"
                  display="flex"
                  alignItems="center"
                  gap={3}
                  bg="gray.50"
                >
                  {item.icon}
                  <Text fontWeight="semibold">{item.label}:</Text>
                  <Text>{item.value || "N/A"}</Text>
                </Box>
              ))}

              {/* Mapa */}
              {coordenadas && (
                <Box mt={4} h="300px" w="100%" borderRadius="xl" overflow="hidden">
                  <MapContainer
                    center={[coordenadas.lat, coordenadas.lng]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    <Marker position={[coordenadas.lat, coordenadas.lng]}>
                      <Popup>{luminaria.identificador}</Popup>
                    </Marker>
                  </MapContainer>
                </Box>
              )}

              {/* Botones Editar / Eliminar solo para Admin */}
              {rolUsuario === "admin" &&(
                <HStack mt={4} spacing={4} justify="center">
                 <Button
                leftIcon={<PencilSimple size={20} />}
                bg="rgba(52, 178, 152, 0.3)" // brand.500 con transparencia
                color="brand.500"             // texto e ícono con color principal
                onClick={handleEdit}
                >
                Editar
                </Button>

                 <Button
                leftIcon={<TrashSimple size={20} />}
                bg="rgba(178, 52, 52, 0.3)" // brand.500 con transparencia
                color="alert.error"  
                onClick={onDeleteOpen}
                >
                Eliminar
                </Button>

                </HStack>
              )}
            </Stack>
          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de edición */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="2xl">
          <ModalHeader>Editar Luminaria</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              {infoList.map((item, idx) => (
                <FormControl key={idx}>
                  <FormLabel>{item.label}</FormLabel>
                  {item.field === "activo" ? (
                    <Select
                      name={item.field}
                      value={editedLuminaria[item.field] ? "Sí" : "No"}
                      onChange={handleChange}
                    >
                      <option value="Sí">Sí</option>
                      <option value="No">No</option>
                    </Select>
                  ) : (
                    <Input
                      name={item.field}
                      value={editedLuminaria[item.field] || ""}
                      onChange={handleChange}
                    />
                  )}
                </FormControl>
              ))}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Guardar
            </Button>
            <Button onClick={() => setIsEditing(false)}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar Luminaria
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro que deseas eliminar esta luminaria? Esta acción no se puede deshacer.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ModalLuminaria;