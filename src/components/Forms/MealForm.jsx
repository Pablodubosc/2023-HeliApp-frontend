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
  Typography,
} from "@mui/material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import { useSnackbar } from "notistack";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseIcon from "@mui/icons-material/Close";
import getApiUrl from "../../helpers/apiConfig";
import { Autocomplete } from "@mui/material";
import CancelIntermittentFastingForm from "./CancelIntermittentFastingForm";
const apiUrl = getApiUrl();

const initialMealState = {
  name: "",
  date: new Date(),
  hour: new Date(),
  foods: [{ foodId: "", weightConsumed: "" }],
};

const MealForm = ({ open, setOpen, initialData }) => {
  const [mealData, setMealData] = useState(initialMealState);
  const [foodOptions, setFoodOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [foodsLoaded, setFoodsLoaded] = useState(false);
  const [loadingFoods, setLoadingFoods] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const { enqueueSnackbar } = useSnackbar();


  useEffect(() => {
    if (!foodsLoaded) {
      getFoods();
    }
  }, [foodsLoaded]);

  useEffect(() => {
    if (open) {
      getFoods();
    }
  }, [open]);

  useEffect(() => {
    if (initialData && foodsLoaded) {
      initializeForm(initialData);
    } else if (foodsLoaded) {
      setMealData({
        name: "",
        date: new Date(),
        hour: new Date(),
        foods: [{ foodId: "", weightConsumed: "" }],
      });
    }
  }, [initialData, foodsLoaded]);
  

  const initializeForm = (data) => {
    const initialTime = new Date(`2023-01-01T${data.hour}`);
    const initialDate = new Date(data.date + "T10:00:00Z");
    const initialFoods = data.foods.map((food) => ({
      foodId: food.foodId._id,
      weightConsumed: food.weightConsumed,
    }));
    setMealData({
      ...data,
      hour: initialTime,
      date: initialDate,
      foods: initialFoods,
    });
  };

  const getFoods = async () => {
    setLoadingFoods(true);
    setIsLoading(true);
    try {
      const response = await fetch(apiUrl + "/api/foods/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (response.status == 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
      if (response.ok) {
        const data = await response.json();
        setFoodOptions(data.data);
        setFoodsLoaded(true);
      } else {
        throw new Error("Failed to fetch food options");
      }
    } catch (error) {
      console.error("Error fetching food options:", error);
      enqueueSnackbar("Failed to load food options.", { variant: "error" });
    } finally {
      setIsLoading(false);
      setLoadingFoods(false);
    }
  };

  const handleGetActiveIntermittentFasting = async () => {
    // Función para obtener el ayuno intermitente activo
    try {
      const response = await fetch(
        apiUrl +
          "/api/intermittentFasting/active",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      if (response.status == 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
      if (data.filteredData) {
        return data.filteredData;
      }
    } catch (error) {
      console.error("Error fetching active intermittent fasting:", error);
    }
  };

  const handleAddMeal = async () => {
    try {
      setIsLoading(true); // Start loading

      if (
        mealData.name === "" ||
        mealData.date === "" ||
        mealData.hour === "" ||
        !mealData.foods.every(
          (food) =>
            food.foodId !== "" &&
            Number(food.weightConsumed) > 0
        )
      ) {
        enqueueSnackbar("Please complete all the fields correctly.", {
          variant: "error",
        });
        return;
      }
      mealData.hour = mealData.hour.toTimeString().slice(0, 5);
      mealData.date.setHours(mealData.hour.split(":")[0]-3, mealData.hour.split(":")[1]);


      const activeIF = await handleGetActiveIntermittentFasting()
      if (activeIF && new Date(mealData.date).toISOString() >= activeIF.startDateTime && new Date(mealData.date).toISOString() <= new Date(activeIF.endDateTime).toISOString())
        {
          setOpenCancelDialog(true)
        }     
      else
      {
        await confirmMeal();
      } 
  }
  catch (error) {
    console.error("Error saving meal:", error);
    enqueueSnackbar("An error occurred while saving the meal.", {
      variant: "error",
    });
  } finally {
    setIsLoading(false); // Stop loading
  }}

  const confirmMeal = async () => {
      const url = initialData
        ? apiUrl + `/api/meals/${initialData._id}`
        : apiUrl + "/api/meals";
      const method = initialData ? "PUT" : "POST";
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(mealData),
      });
      if (response.status == 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
      if (response.status === 200) {
        enqueueSnackbar(
          initialData
            ? "The meal was updated successfully."
            : "The meal was created successfully.",
          {
            variant: "success",
          }
        );
        closeModal();
      } else {
        enqueueSnackbar("An error occurred while saving the meal.", {
          variant: "error",
        });
      }
    } 

    const closeModal = () => {
      setOpenCancelDialog(false);
      setOpen(false);
      setMealData({
        name: "",
        date: new Date(),
        hour: new Date(),
        foods: [{ foodId: "", weightConsumed: "" }],
      });
    };

  const handleAddFoodInput = () => {
    const updatedFoods = [
      ...mealData.foods,
      { foodId: "", weightConsumed: "" },
    ];
    setMealData({ ...mealData, foods: updatedFoods });
  };

  const handleRemoveFoodInput = (index) => {
    const updatedFoods = [...mealData.foods];
    updatedFoods.splice(index, 1);
    setMealData({ ...mealData, foods: updatedFoods });
  };

  const handleFoodInputChange = (newValue, index) => {
    const updatedFoods = [...mealData.foods];
    if (newValue) {
      updatedFoods[index].foodId = newValue._id;
    } else {
      updatedFoods[index].foodId = "";
      updatedFoods[index].weightConsumed = "";
    }
    setMealData({ ...mealData, foods: updatedFoods });
  };

  const handleQuantityInputChange = (e, index) => {
    const inputValue = Number(e.target.value);
    const updatedFoods = [...mealData.foods];
    if (!isNaN(inputValue) && inputValue >= 1) {
      updatedFoods[index].weightConsumed = inputValue;
    } else {
      updatedFoods[index].weightConsumed = "";
    }
    setMealData({ ...mealData, foods: updatedFoods });
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
              value={mealData.name}
              onChange={(e) =>
                setMealData({ ...mealData, name: e.target.value })
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
                  value={mealData.date}
                  onChange={(newDate) =>
                    setMealData({ ...mealData, date: newDate })
                  }
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Hour"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 60,
                  }}
                  value={mealData.hour}
                  onChange={(newTime) =>
                    setMealData({
                      ...mealData,
                      hour: newTime,
                    })
                  }
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          {mealData.foods.map((food, index) => (
            <React.Fragment key={index}>
              <Grid item xs={6}>
                <Autocomplete
                  id={`food-autocomplete-${index}`}
                  options={foodOptions}
                  loading={loadingFoods}
                  value={
                    food.foodId
                      ? foodOptions.find((option) => option._id === food.foodId)
                      : null
                  }
                  onChange={(e, newValue) =>
                    handleFoodInputChange(newValue, index)
                  }
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Food"
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loadingFoods ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                  noOptionsText="No foods available."
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
                  label={`Weight (gr/ml)`}
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={food.weightConsumed}
                  onChange={(e) => handleQuantityInputChange(e, index)}
                />
              </Grid>
              {index === 0 && (
                <Grid
                  item
                  xs={2}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <IconButton color="primary" onClick={handleAddFoodInput}>
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
                    onClick={() => handleRemoveFoodInput(index)}
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
              onClick={handleAddMeal}
              disabled={isLoading} // Disable button when loading
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "#373D20",
                "&:hover": { backgroundColor: "#373D20" },
                fontWeight: "bold",
              }}
              fullWidth
            >
              {initialData ? "Update Meal" : "Add Meal"}
            </Button>
          </Grid>
        </Grid>
        <CancelIntermittentFastingForm open={openCancelDialog} setOpen={setOpenCancelDialog} onConfirm={confirmMeal} />
      </Box>
    </Modal>
  );
};

export default MealForm;
