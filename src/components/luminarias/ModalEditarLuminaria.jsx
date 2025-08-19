// src/components/dashboard/ModalEditarLuminaria.jsx
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
  Input,
  FormLabel,
  Switch,
} from "@chakra-ui/react";
import { updateLuminaria } from "../../api/luminariasService";

const ModalEditarLuminaria = ({ isOpen, onClose, luminaria, onUpdated }) => {
  const [formData, setFormData] = useState({ ...luminaria });

  if (!luminaria) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    try {
      await updateLuminaria(luminaria._id, formData);
      if (onUpdated) onUpdated(); // refrescar lista
      onClose();
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="2xl">
        <ModalHeader>Editar Luminaria</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={3}>
            <div>
              <FormLabel>Identificador</FormLabel>
              <Input
                name="identificador"
                value={formData.identificador || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <FormLabel>Tipo</FormLabel>
              <Input
                name="tipo_luminaria"
                value={formData.tipo_luminaria || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <FormLabel>Estado</FormLabel>
              <Input
                name="estado"
                value={formData.estado || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <FormLabel>Ciudad</FormLabel>
              <Input
                name="ciudad"
                value={formData.ciudad || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <FormLabel>Región</FormLabel>
              <Input
                name="region"
                value={formData.region || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <FormLabel>País</FormLabel>
              <Input
                name="pais"
                value={formData.pais || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <FormLabel>Activo</FormLabel>
              <Switch
                name="activo"
                isChecked={formData.activo}
                onChange={handleChange}
              />
            </div>
            <div>
              <FormLabel>Fecha de instalación</FormLabel>
              <Input
                type="date"
                name="fecha_instalacion"
                value={
                  formData.fecha_instalacion
                    ? new Date(formData.fecha_instalacion)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={handleChange}
              />
            </div>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={3}>
            Cancelar
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalEditarLuminaria;
