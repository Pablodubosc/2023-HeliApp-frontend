import React, { useState } from 'react';
import {
    Button,
    Typography,
    TextField,
  } from "@mui/material";
import { useSnackbar } from "notistack";
import getApiUrl from "../../helpers/apiConfig";

const apiUrl = getApiUrl();

const PlanCalculator = () => {

  const { enqueueSnackbar } = useSnackbar();
  const initialPlan = {
    name: "",
    calories: "",
    meals: [],
    userId: localStorage.getItem("userId"),
  };

  const [planData, setPlanData] = useState(initialPlan);

  const handleCaloriesInputChange = (e, index) => {
    const inputValue = Number(e.target.value);
    if (!isNaN(inputValue) && inputValue >= 1) {
      setPlanData({ ...planData, calories: inputValue });
    } else {
      setPlanData({ ...planData, calories: "" });
    }
  };


  const handleCalculateClick = async () => {
    if (Number(planData.calories) < 1) { //agegar name al plan
        enqueueSnackbar("Please complete all the fields correctly.", {
          variant: "error",
        });
        return;
      } else {
        fetch(apiUrl + "/api/plans/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify(planData),
        }).then(function (response) {
          if (response.status === 200) {
            enqueueSnackbar("The plan was created successfully.", {
              variant: "success",
            });
          } else {
            enqueueSnackbar("An error occurred while creating the plan.", {
              variant: "error",
            });
          }
        });
      }
    };
  

  return (
    <div style={{ border: '1px solid black', padding: '10px', borderRadius: '5px', maxWidth: '600px', margin: 'auto', marginTop: '20px', textAlign: 'center' }}>
      <div className="input-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2%' }}>
    <Typography
      variant="h5"
      fontWeight="bold"
      style={{ color: 'black' }}
    >
      PLAN:
    </Typography>
    <TextField
      label="Name"
      variant="outlined"
      margin="normal"
      value={planData.name}
      onChange={(e) => setPlanData({ ...planData, name: e.target.value })}
      style={{ marginBottom: '7px', marginLeft: '10px', width: '65%', textAlign: 'center' }}
    />
  </div>
  <Typography
    variant="h5"
    fontWeight="bold"
    align="center"
    marginBottom="2%"
    style={{ color: 'black' }}
  >
    HOW MANY CALORIES YOU WANT TO EAT?
  </Typography>
  <TextField
    InputProps={{
      inputProps: { min: 1 },
    }}
    label={`Calories`}
    type="number"
    variant="outlined"
    fullWidth
    value={planData.calories}
    onChange={(e) => handleCaloriesInputChange(e)}
      style={{ marginBottom: '7px', width: '50%', textAlign: 'center' }}
    />
  </div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCalculateClick}
        style={{
          marginTop: '15px',
          backgroundColor: '#373D20',
          '&:hover': { backgroundColor: '#373D20' },
          fontWeight: 'bold',
        }}
        fullWidth
      >
        Create Plan
      </Button>
    </div>
  );
};

export default PlanCalculator;