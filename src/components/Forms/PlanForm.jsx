import React, { useState } from "react";
import {
  TextField,
  Button,
  Modal,
  Box,
  Grid,
  IconButton,
  FormControl,
  FormControlLabel,
  Radio,
  FormGroup,
  RadioGroup,
  MenuItem,
  InputLabel,
  Select,
} from "@mui/material";
import { useSnackbar } from "notistack";
import CategoryForm from "./CategoryForm";
import CloseIcon from "@mui/icons-material/Close";
import getApiUrl from "../../helpers/apiConfig";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const apiUrl = getApiUrl();

const initialPlanState = {
  name: "",
  suggestions: [],
  planType: "",
  planObjetive: "",
  startDate: new Date(),
  endDate: new Date(),
};

const PlanForm = ({ open, setOpen }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlan, setNewPlan] = useState(initialPlanState);
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar el envío de la solicitud

  const handleSelectChange = (e) => {
    setNewPlan({ ...newPlan, planType: e.target.value });
  };

  const handleAddPlan = () => {
    if (
      isSubmitting || // Evita múltiples envíos mientras se está enviando
      newPlan.name === "" ||
      newPlan.planObjetive === "" ||
      Number(newPlan.planObjetive) < 1 ||
      newPlan.endDate === "" ||
      newPlan.endDate < newPlan.startDate
    ) {
      enqueueSnackbar("Please complete all the fields correctly.", {
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true); // Marca como "submitting" al iniciar la solicitud

    newPlan.startDate.setHours(0, 0);
    newPlan.endDate.setHours(23, 59);

    fetch(apiUrl + "/api/plans/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(newPlan),
    })
      .then((response) => {
        if (response.status == 401) {
          localStorage.removeItem("token");
          window.location.href = "/";
        }
        if (response.status === 200) {
          enqueueSnackbar("The plan was created successfully.", {
            variant: "success",
          });
          closeModal();
        } else if (response.status === 400) {
          enqueueSnackbar(
            "The system could not generate the suggestions for that plan.",
            {
              variant: "error",
            }
          );
          closeModal();
        } else {
          enqueueSnackbar("An error occurred while creating the plan.", {
            variant: "error",
          });
        }
      })
      .catch((error) => {
        enqueueSnackbar("An error occurred while creating the plan.", {
          variant: "error",
        });
      })
      .finally(() => {
        setIsSubmitting(false); // Marca como "no submitting" al finalizar
      });
  };

  const closeModal = () => {
    setOpen(false);
    setNewPlan(initialPlanState);
  };

  const handleCaloriesInputChange = (e) => {
    const inputValue = Number(e.target.value);
    if (!isNaN(inputValue) && inputValue >= 1) {
      setNewPlan({ ...newPlan, planObjetive: inputValue });
    } else {
      setNewPlan({ ...newPlan, planObjetive: "" });
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
            value={newPlan.name}
            onChange={(e) =>
              setNewPlan({ ...newPlan, name: e.target.value })
            }
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                handleAddPlan();
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
                  value={newPlan.planType}
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
                value={newPlan.planObjetive}
                onChange={handleCaloriesInputChange}
                style={{ marginBottom: "7px" }}
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
                  value={newPlan.startDate}
                  onChange={(newDate) => {
                    setNewPlan((prevGoal) => ({
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
                  disabled={!newPlan.startDate}
                  minDate={newPlan.startDate}
                  minDateMessage="End date must be after start date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 60,
                  }}
                  value={newPlan.endDate}
                  onChange={(newDate) => {
                    setNewPlan((prevGoal) => ({
                      ...prevGoal,
                      endDate: newDate,
                    }));
                  }}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddPlan}
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
            Add Plan
          </Button>
        </div>
        {/* Aquí se incluiría el componente CategoryForm */}
        <CategoryForm open={isModalOpen} setOpen={setIsModalOpen} />
      </Box>
    </Modal>
  );
};

export default PlanForm;