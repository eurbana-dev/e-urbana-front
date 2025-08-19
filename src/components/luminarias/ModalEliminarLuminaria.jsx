import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import { deleteLuminaria } from "../../api/luminariasService";

const ModalEliminarLuminaria = ({ isOpen, onClose, luminaria, onDelete }) => {
  const toast = useToast();

  const handleDelete = async () => {
    try {
      await deleteLuminaria(luminaria._id); // 👈 Usamos el servicio
      toast({
        title: "Luminaria eliminada",
        description: "Se eliminó correctamente la luminaria",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onDelete(); // refresca lista en el padre
      onClose();
    } catch (error) {
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar la luminaria",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Eliminar Luminaria</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            ¿Estás seguro de que deseas eliminar la luminaria{" "}
            <b>{luminaria?.nombre}</b>?
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={handleDelete}>
            Eliminar
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalEliminarLuminaria;
