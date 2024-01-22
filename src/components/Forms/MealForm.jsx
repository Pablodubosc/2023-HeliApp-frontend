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
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseIcon from "@mui/icons-material/Close";
import getApiUrl from "../../helpers/apiConfig";
import { Autocomplete } from "@mui/material";
const apiUrl = getApiUrl();

const initialMealState = {
  name: "",
  date: new Date(),
  hour: new Date(),
  calories: 0,
  foods: [{ name: "", calories: "", weight: "", category: "" }],
  userId: localStorage.getItem("userId"),
};

const MealForm = ({ open, setOpen, initialData }) => {
  const [mealData, setMealData] = useState(initialMealState);
  const [foodOptions, setFoodOptions] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (initialData) {
      const initialTime = new Date(`2023-01-01T${initialData.hour}`);
      const initialDate = new Date(initialData.date + "T10:00:00Z");
      setMealData({
        ...initialData,
        hour: initialTime,
        date: initialDate,
      });
    } else {
      setMealData({
        name: "",
        date: new Date(),
        hour: new Date(),
        calories: 0,
        foods: [{ name: "", calories: "", weight: "", category: "" }],
        userId: localStorage.getItem("userId"),
      });
    }
  }, [initialData]);

  useEffect(() => {
    getFoods();
  }, [open]);

  const getFoods = async () => {
    const response = await fetch(apiUrl + "/api/foods/" + localStorage.getItem("userId") , {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    setFoodOptions(data.data);
  };

  const handleAddMeal = () => {
    console.log(mealData)
    if (
      mealData.name === "" ||
      mealData.date === "" ||
      mealData.hour === "" ||
      !mealData.foods.every(
        (food) =>
          food.name !== "" &&
          food.weight !== "" &&
          Number(food.weightConsumed) > 0
      )
    ) {
      enqueueSnackbar("Please complete all the fields correctly.", {
        variant: "error",
      });
      return;
    } else {
      mealData.calories = mealData.foods
        .map((food) => parseInt(food.totalCalories))
        .reduce((acc, calories) => acc + calories, 0);

      mealData.carbs = mealData.foods
        .map((food) => parseInt(food.totalCarbs))
        .reduce((acc, carbs) => acc + carbs, 0);

      mealData.proteins = mealData.foods
        .map((food) => parseInt(food.totalProteins))
        .reduce((acc, proteins) => acc + proteins, 0);

      mealData.fats = mealData.foods
        .map((food) => parseInt(food.totalFats))
        .reduce((acc, fats) => acc + fats, 0);

      mealData.hour = mealData.hour.toTimeString().slice(0, 5);

      mealData.date.setHours(1, 0);

      const url = initialData
        ? apiUrl + `/api/meals/${initialData._id}`
        : apiUrl + "/api/meals";
      const method = initialData ? "PUT" : "POST";

      fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(mealData),
      })
        .then(function (response) {
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
        })
        .catch(function (error) {
          enqueueSnackbar("An error occurred while saving the meal.", {
            variant: "error",
          });
        });
    }
  };

  const closeModal = () => {
    setOpen(false);
    setMealData({
      name: "",
      date: new Date(),
      hour: new Date(),
      calories: 0,
      foods: [{ name: "", calories: "", weight: "", category: "" }],
      userId: localStorage.getItem("userId"),
    });
  };

  const handleAddFoodInput = () => {
    const updatedFoods = [
      ...mealData.foods,
      { name: "", calories: "", weight: "", category: "" },
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
      updatedFoods[index].name = newValue.name ? newValue.name : "";
      updatedFoods[index].calories = newValue.calories;
      updatedFoods[index].carbs = newValue.carbs;
      updatedFoods[index].proteins = newValue.proteins;
      updatedFoods[index].fats = newValue.fats;
      updatedFoods[index].weight = newValue.weight;
      updatedFoods[index].category = newValue.category;
      if (updatedFoods[index].weightConsumed) {
        updatedFoods[index].totalCalories = Math.round(
          updatedFoods[index].weightConsumed *
            (updatedFoods[index].calories / updatedFoods[index].weight)
        )

        updatedFoods[index].totalCarbs = Math.round(
          updatedFoods[index].weightConsumed *
            (updatedFoods[index].carbs / updatedFoods[index].weight)
        )

        updatedFoods[index].totalProteins = Math.round(
          updatedFoods[index].weightConsumed *
            (updatedFoods[index].proteins / updatedFoods[index].weight)
        )

        updatedFoods[index].totalFats = Math.round(
          updatedFoods[index].weightConsumed *
            (updatedFoods[index].fats / updatedFoods[index].weight)
        )
      }
    } else {
      updatedFoods[index].name = "";
      updatedFoods[index].calories = 0;
      updatedFoods[index].weight = 0;
      updatedFoods[index].category = "";
    }
    setMealData({ ...mealData, foods: updatedFoods });
  };

  const handleQuantityInputChange = (e, index) => {
    const inputValue = Number(e.target.value);
    const updatedFoods = [...mealData.foods];
    if (!isNaN(inputValue) && inputValue >= 1) {
      updatedFoods[index].weightConsumed = inputValue;
      updatedFoods[index].totalCalories = Math.round(
        inputValue * (updatedFoods[index].calories / updatedFoods[index].weight)
      );
      updatedFoods[index].totalCarbs = Math.round(
        updatedFoods[index].weightConsumed *
          (updatedFoods[index].carbs / updatedFoods[index].weight)
      )

      updatedFoods[index].totalProteins = Math.round(
        updatedFoods[index].weightConsumed *
          (updatedFoods[index].proteins / updatedFoods[index].weight)
      )

      updatedFoods[index].totalFats = Math.round(
        updatedFoods[index].weightConsumed *
          (updatedFoods[index].fats / updatedFoods[index].weight)
      )
      setMealData({ ...mealData, foods: updatedFoods });
    }else {
      console.log("ENTRA")
      updatedFoods[index].weightConsumed = "";
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
                  value={
                    foodOptions.find((option) => option.name === food.name) ||
                    null
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
      </Box>
    </Modal>
  );
};

export default MealForm;
