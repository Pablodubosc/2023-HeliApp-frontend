import React, { useState, useEffect } from "react";
import { TextField, Grid, Autocomplete } from "@mui/material";
import { format } from "date-fns";
import MyResponsivePie from "./PieChart";
import CircularProgress from "@mui/material/CircularProgress";
import getApiUrl from '../../helpers/apiConfig';
import CategoryAutocomplete from "../CategoryAutocomplete";

const apiUrl = getApiUrl();

const getMealsByUserIdAndDay = async (
  date,
  selectedCategory,
  setData,
  setLoading
) => {
  setData("");
  setLoading(true);
  const response = await fetch(
    apiUrl + "/api/meals/user" +
    "/date/" +
    date,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }
  );
  const data = await response.json();
  const groupedFoods = {};
  if (data.mealsToSend && data.mealsToSend.length > 0) {
    data.mealsToSend.forEach((item) => {
      item.foods.forEach((food) => {
        if (groupedFoods[food.foodId.name]) {
          groupedFoods[food.foodId.name].value += food.weightConsumed;
        } else {
          groupedFoods[food.foodId.name] = { id: food.foodId.category._id, value: food.weightConsumed, label: food.foodId.name };
        }
      });
    });
    const groupedFoodsArray = Object.values(groupedFoods);

    if (selectedCategory && selectedCategory.name !="") {
      setData(groupedFoodsArray.filter((item) => item.id === selectedCategory._id));
      setLoading(false);
    } else {
      setData(groupedFoodsArray);
      setLoading(false);
    }
  } else {
    setData([]);
    setLoading(false);
  }
};

const getExerciseByUserIdAndDay = async (
  date,
  setData,
  setLoading
) => {
  setData("");
  setLoading(true);
  const response = await fetch(
    apiUrl + "/api/exerciseDone/user" +
    "/date/" +
    date,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }
  );
  const data = await response.json();
  const groupedExercises = {};
  if (data.exercisesDoneToSend && data.exercisesDoneToSend.length > 0) {
    data.exercisesDoneToSend.forEach((item) => {
      item.exercises.forEach((exercise) => {
        if (groupedExercises[exercise.exerciseId.name]) {
          groupedExercises[exercise.exerciseId.name].value += exercise.timeWasted;
        } else {
          groupedExercises[exercise.exerciseId.name] = { id: exercise.exerciseId.name, value: exercise.timeWasted, label: exercise.exerciseId.name };
        }
      });
    });
    const groupedExercisesArray = Object.values(groupedExercises);

    setData(groupedExercisesArray);
    setLoading(false);
  } else {
    setData([]);
    setLoading(false);
  }
};

const PieChartContainer = () => {
  const [data, setData] = useState();
  const [selectedCategory, setSelectedCategory] = useState({name:""});
  const [selectedType, setSelectedType] = useState("Foods");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(selectedType === 'Foods' )
    {
      getMealsByUserIdAndDay(date, selectedCategory, setData, setLoading);
    }
    else{
      getExerciseByUserIdAndDay(date,setData, setLoading);
    }
  }, [date, selectedCategory,selectedType]);

  const handleCategoryChange = (selectedCategory) => {
    setSelectedCategory(selectedCategory)
  };

  const handleTypeChange = (selectedType) => {
    setSelectedType(selectedType);
  };

  const typeOptions = ["Foods", "Exercise"];

  const noPatientsStyle = {
    textAlign: "center",
    margin: "20px",
    fontSize: "1.5rem",
    color: "grey",
  };

  return (
    <div
      style={{
        textAlign: "center",
        color: "black",
        maxWidth: 400,
      }}
    >

        <Grid sx={{ width: "73%", minWidth: 200, marginLeft: '13.5%' }}>
            <Autocomplete
                style={{ width: "100%", maxWidth: 400, minWidth: 200 }}
                value={selectedType}
                onChange={(event, newValue) => {
                  handleTypeChange(newValue);
                }}
                options={typeOptions}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField {...params} label="Choose a Type" variant="outlined" />
                )}
                ListboxProps={{
                  style: {
                    maxHeight: 110,
                  },
                }}
                disableClearable 
            />
        </Grid>
      <Grid sx={{ maxHeight: "450px", minWidth: "320px", alignContent: 'center', textAlign: 'center' }}>
        <h2 style={{ fontWeight: 'bold' }}>{selectedType} per Day</h2>
        <TextField
          style={{ width: "73%", minWidth: 200 }}
          InputLabelProps={{ shrink: true }}
          label="Date"
          variant="outlined"
          margin="normal"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
         {selectedType === 'Foods' && (<Grid sx={{ width: "73%", minWidth: 200, marginLeft: '13.5%' }}>
          <CategoryAutocomplete
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </Grid>)}
        <div>
          {loading ? (
            <CircularProgress />
          ) : data && data.length > 0 ? (
            <MyResponsivePie data={data} />
          ) : (
            <p style={noPatientsStyle}>
              No foods to show
            </p>
          )}
        </div>
      </Grid>
    </div>
  );
};

export default PieChartContainer;
