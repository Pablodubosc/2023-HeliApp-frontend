import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Modal,
  Box,
  IconButton,
  Grid,
  FormControl,
  CircularProgress,
} from "@mui/material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import { useSnackbar } from "notistack";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseIcon from "@mui/icons-material/Close";
import getApiUrl from "../../helpers/apiConfig";
import { Autocomplete } from "@mui/material";

const apiUrl = getApiUrl();

const initialExerciseDoneState = {
  name: "",
  date: new Date(),
  exercises: [{ exerciseId: "", timeWasted: "" }],
};

const ExerciseDoneForm = ({ open, setOpen, initialData }) => {
  const [exerciseDoneData, setExerciseDoneData] = useState(initialExerciseDoneState);
  const [exerciseOptions, setExerciseOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar el envío de la solicitud
  const [exercisesLoaded, setExercisesLoaded] = useState(false);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (open && !exercisesLoaded) {
      getExercise();
    }
  }, [open, exercisesLoaded]);

  useEffect(() => {
    if (initialData) {
      initializeForm(initialData);
    } else {
      initializeForm({
        name: "",
        date: new Date(),
        exercises: [{ exerciseId: "", timeWasted: "" }],
      });
    }
  }, [initialData, exercisesLoaded]);

  const initializeForm = (data) => {
    const initialDate = new Date(data.date + "T10:00:00Z");
    const initialExercises = data.exercises.map((exercise) => ({
      exerciseId: exercise.exerciseId._id,
      timeWasted: exercise.timeWasted,
    }));
    setExerciseDoneData({
      ...data,
      date: initialDate,
      exercises: initialExercises,
    });
  };

  const getExercise = async () => {
    setLoadingExercises(true);
    try {
      const response = await fetch(apiUrl + "/api/exercise", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setExerciseOptions(data.data);
        setExercisesLoaded(true);
      } else {
        throw new Error("Failed to fetch exercises options");
      }
    } catch (error) {
      console.error("Error fetching exercises options:", error);
      enqueueSnackbar("Failed to load exercises options.", { variant: "error" });
    } finally {
      setLoadingExercises(false);
    }
  };

  const handleAddExercise = async () => {
    // Verifica si ya se está enviando una solicitud
    if (isSubmitting) {
      return;
    }

    // Realiza validaciones antes de enviar
    if (
      exerciseDoneData.name === "" ||
      exerciseDoneData.date === "" ||
      !exerciseDoneData.exercises.every(
        (exercise) =>
          exercise.exerciseId !== "" &&
          Number(exercise.timeWasted) > 0
      )
    ) {
      enqueueSnackbar("Please complete all the fields correctly.", {
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true); // Marca como "submitting" al iniciar la solicitud

    // Prepara los datos para enviar
    exerciseDoneData.date.setHours(1, 0);

    const url = initialData
      ? apiUrl + `/api/exerciseDone/${initialData._id}`
      : apiUrl + "/api/exerciseDone";
    const method = initialData ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(exerciseDoneData),
      });

      if (response.status === 200) {
        enqueueSnackbar(
          initialData
            ? "The exercise was updated successfully."
            : "The exercise was created successfully.",
          {
            variant: "success",
          }
        );
        closeModal();
      } else {
        throw new Error("Failed to save exercise.");
      }
    } catch (error) {
      console.error("Error saving exercise:", error);
      enqueueSnackbar("An error occurred while saving the exercise.", {
        variant: "error",
      });
    } finally {
      setIsSubmitting(false); // Marca como "no submitting" al finalizar
    }
  };

  const closeModal = () => {
    setOpen(false);
    if (!initialData) {
      setExerciseDoneData({
        name: "",
        date: new Date(),
        exercises: [{ exerciseId: "", timeWasted: "" }],
      });
    }
  };

  const handleAddExerciseInput = () => {
    const updatedExercises = [
      ...exerciseDoneData.exercises,
      { exerciseId: "", timeWasted: "" },
    ];
    setExerciseDoneData({ ...exerciseDoneData, exercises: updatedExercises });
  };

  const handleRemoveExerciseInput = (index) => {
    const updatedExercises = [...exerciseDoneData.exercises];
    updatedExercises.splice(index, 1);
    setExerciseDoneData({ ...exerciseDoneData, exercises: updatedExercises });
  };

  const handleExerciseInputChange = (newValue, index) => {
    const updatedExercises = [...exerciseDoneData.exercises];
    if (newValue) {
      updatedExercises[index].exerciseId = newValue._id;
    } else {
      updatedExercises[index].exerciseId = "";
      updatedExercises[index].timeWasted = "";
    }
    setExerciseDoneData({ ...exerciseDoneData, exercises: updatedExercises });
  };

  const handleQuantityInputChange = (e, index) => {
    const inputValue = Number(e.target.value);
    const updatedExercises = [...exerciseDoneData.exercises];
    if (!isNaN(inputValue) && inputValue >= 1) {
      updatedExercises[index].timeWasted = inputValue;
    } else {
      updatedExercises[index].timeWasted = "";
    }
    setExerciseDoneData({ ...exerciseDoneData, exercises: updatedExercises });
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
          maxHeight: "80vh !important",
          overflowY: "auto !important",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={exerciseDoneData.name}
              onChange={(e) =>
                setExerciseDoneData({ ...exerciseDoneData, name: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date (MM/DD/YYYY)"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  disableFuture
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 60,
                  }}
                  value={exerciseDoneData.date}
                  onChange={(newDate) =>
                    setExerciseDoneData({ ...exerciseDoneData, date: newDate })
                  }
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          {exerciseDoneData.exercises.map((exercise, index) => (
            <React.Fragment key={index}>
              <Grid item xs={6}>
                <Autocomplete
                  id={`exercise-autocomplete-${index}`}
                  options={exerciseOptions}
                  loading={loadingExercises}
                  value={
                    exercise.exerciseId
                      ? exerciseOptions.find((option) => option._id === exercise.exerciseId)
                      : null
                  }
                  onChange={(e, newValue) =>
                    handleExerciseInputChange(newValue, index)
                  }
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Exercise"
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loadingExercises ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                  noOptionsText="No exercises available."
                  ListboxProps={{
                    style: {
                      maxHeight: 110,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  InputProps={{
                    inputProps: { min: 1 },
                  }}
                  label={`Time (minutes)`}
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={exercise.timeWasted}
                  onChange={(e) => handleQuantityInputChange(e, index)}
                />
              </Grid>
              {index === 0 && (
                <Grid
                  item
                  xs={2}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <IconButton color="primary" onClick={handleAddExerciseInput}>
                    <AddCircleRoundedIcon />
                  </IconButton>
                </Grid>
              )}
              {index > 0 && (
                <Grid
                  item
                  xs={2}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <IconButton
                    color="primary"
                    onClick={() => handleRemoveExerciseInput(index)}
                  >
                    <RemoveCircleRoundedIcon />
                  </IconButton>
                </Grid>
              )}
            </React.Fragment>
          ))}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddExercise}
              disabled={isSubmitting} // Deshabilita el botón si se está enviando
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "#373D20",
                "&:hover": { backgroundColor: "#373D20" },
                fontWeight: "bold",
              }}
              fullWidth
            >
              {initialData ? "Update Exercise" : "Add Exercise"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default ExerciseDoneForm;
