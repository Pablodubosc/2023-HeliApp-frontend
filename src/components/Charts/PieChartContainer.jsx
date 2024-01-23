import React, { useState, useEffect } from "react";
import { TextField, Grid } from "@mui/material";
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
    apiUrl + "/api/meals/user/" +
    localStorage.getItem("userId") +
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
  if (data.data && data.data.length > 0) {
    data.data.forEach((item) => {
      item.foods.forEach((food) => {
        const { name, weightConsumed, category } = food;
        if (groupedFoods[name]) {
          groupedFoods[name].value += weightConsumed;
        } else {
          groupedFoods[name] = { id: category, value: weightConsumed, label: name };
        }
      });
    });
    const groupedFoodsArray = Object.values(groupedFoods);

    if (selectedCategory) {
      setData(groupedFoodsArray.filter((item) => item.id === selectedCategory));
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

const PieChartContainer = () => {
  const [data, setData] = useState();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMealsByUserIdAndDay(date, selectedCategory, setData, setLoading);
  }, [date, selectedCategory]);

  const handleCategoryChange = (selectedCategory) => {
    setSelectedCategory(selectedCategory);
  };

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
      <Grid sx={{ maxHeight: "450px", minWidth: "320px", alignContent: 'center', textAlign: 'center' }}>
        <h2 style={{ fontWeight: 'bold' }}>Foods per Day</h2>
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
        <Grid sx={{ width: "73%", minWidth: 200, marginLeft: '13.5%' }}>
          <CategoryAutocomplete
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </Grid>
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
