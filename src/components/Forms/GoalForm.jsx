import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Modal,
  Box,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSnackbar } from "notistack";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import getApiUrl from "../../helpers/apiConfig";

const apiUrl = getApiUrl();

const initialGoalState = {
  name: "",
  type: "",
  objetive: "",
  startDate: new Date(),
  endDate: new Date(),
  recurrency: "Non-Recurring",
};

const GoalForm = ({ open, setOpen, initialData, setSelectedGoal }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [selectedRecuringValue, setSelectedRecurringValue] = useState(
    "Non-Recurring"
  );
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar el envío de la solicitud

  const handleSelectChange = (e) => {
    setNewGoal({ ...newGoal, type: e.target.value });
  };

  const closeModal = () => {
    setOpen(false);
    setSelectedRecurringValue("Non-Recurring");
    setNewGoal(initialGoalState);
  };

  const [newGoal, setNewGoal] = useState({
    name: "",
    type: "",
    objetive: "",
    startDate: new Date(),
    endDate: new Date(),
    recurrency: "Non-Recurring",
  });

  useEffect(() => {
    if (initialData) {
      const parsedStartDate = new Date(initialData.startDate);
      const parsedEndDate = new Date(initialData.endDate);
      setSelectedRecurringValue(initialData.recurrency);
      setNewGoal({
        ...initialData,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
      });
    } else {
      setNewGoal({
        name: "",
        type: "",
        objetive: "",
        startDate: new Date(),
        endDate: new Date(),
        recurrency: "Non-Recurring",
      });
    }
  }, [initialData, open]);

  const handleAddGoal = () => {
    if (
      isSubmitting || // Evita múltiples envíos mientras se está enviando
      newGoal.name === "" ||
      newGoal.type === "" ||
      newGoal.objetive === "" ||
      newGoal.startDate === "" ||
      newGoal.endDate === "" ||
      newGoal.endDate < newGoal.startDate
    ) {
      enqueueSnackbar("Please complete all the fields correctly.", {
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true); // Marca como "submitting" al iniciar la solicitud

    const url = initialData
      ? apiUrl + `/api/goals/${initialData._id}`
      : apiUrl + "/api/goals";
    const method = initialData ? "PUT" : "POST";

    newGoal.startDate.setHours(-3, 0, 0, 0);
    newGoal.endDate.setHours(20, 59, 59, 999);

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(newGoal),
    })
      .then((response) => {
        if (response.status === 200) {
          enqueueSnackbar(
            initialData
              ? "The goal was updated successfully."
              : "The goal was created successfully.",
            {
              variant: "success",
            }
          );
          if (initialData) {
            setSelectedGoal(newGoal);
          }
          closeModal();
        } else {
          enqueueSnackbar("An error occurred while creating the goal.", {
            variant: "error",
          });
        }
      })
      .catch((error) => {
        enqueueSnackbar("An error occurred while creating the goal.", {
          variant: "error",
        });
      })
      .finally(() => {
        setIsSubmitting(false); // Marca como "no submitting" al finalizar
      });
  };

  const handleCaloriesInputChange = (e) => {
    const inputValue = Number(e.target.value);
    if (!isNaN(inputValue) && inputValue >= 1) {
      setNewGoal({ ...newGoal, objetive: inputValue });
    } else {
      setNewGoal({ ...newGoal, objetive: "" });
    }
  };

  const handleRecurrencyChange = (event) => {
    setSelectedRecurringValue(event.target.value);
    setNewGoal({ ...newGoal, recurrency: event.target.value });
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
          maxWidth: 450,
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
            value={newGoal.name}
            onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                handleAddGoal();
              }
            }}
          />

          <Grid container spacing={2}>
            <Grid item xs={8}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="goal-type-label">Goal Type</InputLabel>
                <Select
                  labelId="goal-type-label"
                  id="goal-type-select"
                  value={newGoal.type}
                  onChange={handleSelectChange}
                  label="Goal Type"
                >
                  <MenuItem value="Calories">Calories</MenuItem>
                  <MenuItem value="Fats">Fats</MenuItem>
                  <MenuItem value="Carbs">Carbs</MenuItem>
                  <MenuItem value="Proteins">Proteins</MenuItem>
                  <MenuItem value="Calories Burn">Calories Burn</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <TextField
                InputProps={{
                  inputProps: { min: 1 },
                }}
                label="Goal"
                type="number"
                variant="outlined"
                fullWidth
                value={newGoal.objetive}
                onChange={handleCaloriesInputChange}
                style={{ marginBottom: "7px" }}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    handleAddGoal();
                  }
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ marginBottom: "7px" }}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  disablePast
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 60,
                  }}
                  value={newGoal.startDate}
                  onChange={(newDate) => {
                    setNewGoal((prevGoal) => ({
                      ...prevGoal,
                      startDate: newDate,
                    }));
                  }}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  disabled={!newGoal.startDate}
                  minDate={newGoal.startDate}
                  minDateMessage="End date must be after start date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 60,
                  }}
                  value={newGoal.endDate}
                  onChange={(newDate) => {
                    setNewGoal((prevGoal) => ({
                      ...prevGoal,
                      endDate: newDate,
                    }));
                  }}
                />
              </LocalizationProvider>
            </FormControl>
            <FormGroup>
              <RadioGroup
                onChange={handleRecurrencyChange}
                row
                value={selectedRecuringValue}
                style={{ justifyContent: "center" }}
              >
                <FormControlLabel
                  control={<Radio />}
                  label="Non-Recurring"
                  value="Non-Recurring"
                />
                <FormControlLabel control={<Radio />} label="Weekly" value="Weekly" />
                <FormControlLabel control={<Radio />} label="Monthly" value="Monthly" />
              </RadioGroup>
            </FormGroup>
          </Grid>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddGoal}
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
            {initialData ? "Update Goal" : "Add Goal"}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default GoalForm;
