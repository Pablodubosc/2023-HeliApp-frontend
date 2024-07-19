import React, { useState } from "react";
import { TextField, Button, Modal, Box, IconButton } from "@mui/material";
import { useSnackbar } from "notistack";
import CloseIcon from "@mui/icons-material/Close";
import getApiUrl from '../../helpers/apiConfig';

const apiUrl = getApiUrl();

const initialCategoryState = {
  name: "",
};

const CategoryForm = ({ open, setOpen }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [newCategory, setNewCategory] = useState(initialCategoryState);
  const [isSubmitting, setIsSubmitting] = useState(false); // Nuevo estado

  const handleAddCategory = () => {
    if (newCategory.name === "" || isSubmitting) { // Verifica isSubmitting
      return;
    }

    setIsSubmitting(true); // Bloquea el botón

    fetch(apiUrl + "/api/category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(newCategory),
    }).then(function (response) {
      setIsSubmitting(false); // Desbloquea el botón después de recibir la respuesta
      if (response.status == 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
      if (response.status === 200) {
        enqueueSnackbar("The category was created successfully.", {
          variant: "success",
        });
        closeModal();
      } else {
        enqueueSnackbar("An error occurred while creating the category.", {
          variant: "error",
        });
      }
    });
  };

  const closeModal = () => {
    setOpen(false);
    setNewCategory(initialCategoryState);
    setIsSubmitting(false); // Asegúrate de restablecer isSubmitting al cerrar modal
  };

  return (
    <Modal
      open={open}
      onClose={closeModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: 350,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "4%",
        }}
      >
        <IconButton
          aria-label="Close"
          onClick={closeModal}
          sx={{
            position: "absolute",
            top: "3%",
            right: "10px",
            zIndex: 2,
          }}
        >
          <CloseIcon />
        </IconButton>
        <div>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                handleAddCategory();
              }
            }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddCategory}
            disabled={isSubmitting} // Deshabilita el botón si isSubmitting es true
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#373D20",
              "&:hover": { backgroundColor: "#373D20" },
              fontWeight: "bold",
            }}
            fullWidth
          >
            {isSubmitting ? "Adding..." : "Add Category"}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default CategoryForm;
