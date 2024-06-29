import React, { useState } from "react";
import { TextField, Button, Modal, Box, Grid, IconButton } from "@mui/material";
import { useSnackbar } from "notistack";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import CategoryForm from "./CategoryForm";
import CloseIcon from "@mui/icons-material/Close";
import getApiUrl from "../../helpers/apiConfig";
import CategoryAutocomplete from "../CategoryAutocomplete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import InfoModal from "../AddInfoModal";

const apiUrl = getApiUrl();

const initialFoodState = {
  name: "",
  calories: "",
  weight: "",
  category: { name: "" },
  carbs: "",
  proteins: "",
  fats: ""
};

const FoodForm = ({ open, setOpen }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFood, setNewFood] = useState(initialFoodState);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Nuevo estado

  const handleAddFood = () => {
    if (
      newFood.name === "" ||
      newFood.calories === "" ||
      newFood.weight === "" ||
      newFood.category.name === "" ||
      Number(newFood.calories) < 1 ||
      Number(newFood.weight) < 1 ||
      isSubmitting // Evita múltiples envíos mientras se está procesando
    ) {
      enqueueSnackbar("Please complete all the fields correctly.", {
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true); // Bloquea el botón

    // Asigna solo el _id de la categoría para la solicitud POST
    const foodToSend = { ...newFood, category: newFood.category._id };

    fetch(apiUrl + "/api/foods", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(foodToSend),
    })
      .then(function (response) {
        setIsSubmitting(false); // Desbloquea el botón después de recibir la respuesta

        if (response.status === 200) {
          enqueueSnackbar("The food was created successfully.", {
            variant: "success",
          });
          closeModal();
        } else {
          enqueueSnackbar("An error occurred while creating the food.", {
            variant: "error",
          });
        }
      })
      .catch(function (error) {
        setIsSubmitting(false); // Asegura que se desbloquee en caso de error de red u otro
        console.error("Error:", error);
        enqueueSnackbar("An error occurred while processing your request.", {
          variant: "error",
        });
      });
  };

  const closeModal = () => {
    setOpen(false);
    setNewFood(initialFoodState);
    setIsSubmitting(false); // Asegúrate de restablecer isSubmitting al cerrar modal
  };

  const handleCaloriesInputChange = (e, index) => {
    const inputValue = Number(e.target.value);
    if (!isNaN(inputValue) && inputValue >= 1) {
      setNewFood({ ...newFood, calories: inputValue });
    } else {
      setNewFood({ ...newFood, calories: "" });
    }
  };

  const handleWeightInputChange = (e, index) => {
    const inputValue = Number(e.target.value);
    if (!isNaN(inputValue) && inputValue >= 1) {
      setNewFood({ ...newFood, weight: inputValue });
    } else {
      setNewFood({ ...newFood, weight: "" });
    }
  };

  const handleCategoryChange = (selectedCategory) => {
    setNewFood({ ...newFood, category: selectedCategory });
  };

  const shouldBlink = () => {
    return newFood.carbs === "" && newFood.proteins === "" && newFood.fats === ""
      ? "blinkingIcon"
      : "";
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
          maxWidth: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 5,
          borderRadius: "2%",
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
            value={newFood.name}
            onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                handleAddFood();
              }
            }}
          />

          <TextField
            InputProps={{
              inputProps: { min: 1 },
            }}
            label={`Weight (gr/ml)`}
            type="number"
            variant="outlined"
            fullWidth
            value={newFood.weight}
            onChange={(e) => handleWeightInputChange(e)}
            style={{ marginBottom: "7px" }}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                handleAddFood();
              }
            }}
          />
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={10}>
              <CategoryAutocomplete
                selectedCategory={newFood.category}
                onCategoryChange={handleCategoryChange}
                addModalOpen={isModalOpen}
              />
            </Grid>
            <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                color="primary"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                <AddCircleRoundedIcon fontSize="medium" />
              </IconButton>
            </Grid>
          </Grid>
          <Grid container spacing={1} alignItems="center" sx={{ mt: 0.05 }}>
            <Grid item xs={10}>
              <TextField
                InputProps={{
                  inputProps: {
                    step: 1,
                  },
                }}
                label={`Calories`}
                type="number"
                variant="outlined"
                fullWidth
                value={newFood.calories}
                onChange={(e) => handleCaloriesInputChange(e)}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    handleAddFood();
                  }
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton
                color="primary"
                onClick={() => {
                  setIsInfoModalOpen(true);
                }}
                className={shouldBlink()}
              >
                <MoreHorizIcon fontSize="medium" />
              </IconButton>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddFood}
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
            {isSubmitting ? "Adding..." : "Add Food"}
          </Button>
        </div>
        <InfoModal
          open={isInfoModalOpen}
          setOpen={setIsInfoModalOpen}
          newFood={newFood}
          setNewFood={setNewFood}
        />
        <CategoryForm open={isModalOpen} setOpen={setIsModalOpen} />
      </Box>
    </Modal>
  );
};

export default FoodForm;
