import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Modal,
  Box,
  IconButton,
  Grid,
  FormControl,
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
  exercises: [{ name: "", caloriesBurn: "", time: "", timeDoing: ""}],
  userId: localStorage.getItem("userId"),
};

const ExerciseDoneForm = ({ open, setOpen, initialData }) => {
  const [exerciseDoneData, setExerciseDoneData] = useState(initialExerciseDoneState);
  const [exerciseOptions, setExerciseOptions] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (initialData) {
      const initialDate = new Date(initialData.date + "T10:00:00Z");
      setExerciseDoneData({
        ...initialData,
        date: initialDate,
      });
    } else {
      setExerciseDoneData({
        name: "",
        date: new Date(),
        exercises: [{ name: "", caloriesBurn: "", time: "", timeDoing: ""}],
        userId: localStorage.getItem("userId"),
      });
    }
  }, [initialData]);

  useEffect(() => {
    getExercise();
  }, [open]);

  const getExercise = async () => {
    const response = await fetch(apiUrl + "/api/exercise" , {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    setExerciseOptions(data.data);
  };

  const handleAddExercise = () => {
    if (
      exerciseDoneData.name === "" ||
      exerciseDoneData.date === "" ||
      !exerciseDoneData.exercises.every(
        (exercise) =>
        exercise.name !== "" &&
        exercise.time !== "" &&
        Number(exercise.timeDoing) > 0
      )
    ) {
      enqueueSnackbar("Please complete all the fields correctly.", {
        variant: "error",
      });
      return;
    } else {
      exerciseDoneData.caloriesBurn = exerciseDoneData.exercises
        .map((exercise) => parseInt(exercise.totalCaloriesBurn))
        .reduce((acc, caloriesBurn) => acc + caloriesBurn, 0);

      exerciseDoneData.date.setHours(1, 0);

      const url = initialData
        ? apiUrl + `/api/exerciseDone/${initialData._id}`
        : apiUrl + "/api/exerciseDone";
      const method = initialData ? "PUT" : "POST";

      fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(exerciseDoneData),
      })
        .then(function (response) {
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
            enqueueSnackbar("An error occurred while saving the exercise.", {
              variant: "error",
            });
          }
        })
        .catch(function (error) {
          enqueueSnackbar("An error occurred while saving the exercise.", {
            variant: "error",
          });
        });
    }
  };

  const closeModal = () => {
    setOpen(false);
    setExerciseDoneData({
      name: "",
      date: new Date(),
      exercises: [{ name: "", caloriesBurn: "", time: "", timeDoing: ""}],
      userId: localStorage.getItem("userId"),
    });
  };

  const handleAddExerciseInput = () => {
    const updatedExercises = [
      ...exerciseDoneData.exercises,
      { name: "", caloriesBurn: "", time: "" },
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
      updatedExercises[index].name = newValue.name ? newValue.name : "";
      updatedExercises[index].caloriesBurn = newValue.caloriesBurn;
      updatedExercises[index].time = newValue.time;
      if (updatedExercises[index].timeDoing) {
        updatedExercises[index].totalCaloriesBurn = Math.round(
          updatedExercises[index].timeDoing *
            (updatedExercises[index].caloriesBurn / updatedExercises[index].time)
        )
      }
    } else {
      updatedExercises[index].name = "";
      updatedExercises[index].caloriesBurn = 0;
      updatedExercises[index].time = 0;
    }
    setExerciseDoneData({ ...exerciseDoneData, exercises: updatedExercises });
  };

  const handleQuantityInputChange = (e, index) => {
    const inputValue = Number(e.target.value);
    const updatedExercises = [...exerciseDoneData.exercises];
    if (!isNaN(inputValue) && inputValue >= 1) {
      updatedExercises[index].timeDoing = inputValue;
      updatedExercises[index].totalCaloriesBurn = Math.round(
        inputValue * (updatedExercises[index].caloriesBurn / updatedExercises[index].time)
      );
      setExerciseDoneData({ ...exerciseDoneData, exercises: updatedExercises });
    }else {
      updatedExercises[index].timeDoing = "";
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
                  label="Date (MM/DD/AAAA)"
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
                  value={
                    exerciseOptions.find((option) => option.name === exercise.name) ||
                    null
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
                  value={exercise.timeDoing}
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
