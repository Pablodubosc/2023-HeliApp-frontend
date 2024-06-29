import React, { useState } from "react";
import { TextField, Button, Modal, Box, Grid, IconButton } from "@mui/material";
import { useSnackbar } from "notistack";
import CloseIcon from "@mui/icons-material/Close";
import getApiUrl from "../../helpers/apiConfig";

const apiUrl = getApiUrl();

const initialExerciseState = {
  name: "",
  caloriesBurn: "",
  time: "",
};

const ExerciseForm = ({ open, setOpen }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [newExercise, setNewExercise] = useState(initialExerciseState);
  const [isSubmitting, setIsSubmitting] = useState(false); // Nuevo estado

  const handleAddExercise = () => {
    if (
      newExercise.name === "" ||
      newExercise.caloriesBurn === "" ||
      newExercise.time === "" ||
      Number(newExercise.caloriesBurn) < 1 ||
      Number(newExercise.time) < 1 ||
      isSubmitting // Evita múltiples envíos mientras se está procesando
    ) {
      enqueueSnackbar("Please complete all the fields correctly.", {
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true); // Bloquea el botón

    fetch(apiUrl + "/api/exercise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(newExercise),
    })
      .then(function (response) {
        setIsSubmitting(false); // Desbloquea el botón después de recibir la respuesta

        if (response.status === 200) {
          enqueueSnackbar("The exercise was created successfully.", {
            variant: "success",
          });
          closeModal();
        } else {
          enqueueSnackbar("An error occurred while creating the exercise.", {
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
    setNewExercise(initialExerciseState);
    setIsSubmitting(false); // Asegúrate de restablecer isSubmitting al cerrar modal
  };

  const handleCaloriesBurnInputChange = (e, index) => {
    const inputValue = Number(e.target.value);
    if (!isNaN(inputValue) && inputValue >= 1) {
      setNewExercise({ ...newExercise, caloriesBurn: inputValue });
    } else {
      setNewExercise({ ...newExercise, caloriesBurn: "" });
    }
  };

  const handleTimeInputChange = (e, index) => {
    const inputValue = Number(e.target.value);
    if (!isNaN(inputValue) && inputValue >= 1) {
      setNewExercise({ ...newExercise, time: inputValue });
    } else {
      setNewExercise({ ...newExercise, time: "" });
    }
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
            value={newExercise.name}
            onChange={(e) =>
              setNewExercise({ ...newExercise, name: e.target.value })
            }
          />
          <Grid sx={{ marginBottom: 1 }}>
            <TextField
              InputProps={{
                inputProps: {
                  step: 1,
                },
              }}
              label={`Calories Burn`}
              type="number"
              variant="outlined"
              fullWidth
              value={newExercise.caloriesBurn}
              onChange={(e) => handleCaloriesBurnInputChange(e)}
            />
          </Grid>

          <Grid>
            <TextField
              InputProps={{
                inputProps: {
                  step: 1,
                },
              }}
              label={`Time (minutes)`}
              type="number"
              variant="outlined"
              fullWidth
              value={newExercise.time}
              onChange={(e) => handleTimeInputChange(e)}
            />
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddExercise}
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
            {isSubmitting ? "Adding..." : "Add Exercise"}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default ExerciseForm;
