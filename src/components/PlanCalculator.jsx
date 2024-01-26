import React, { useState } from 'react';
import {
    Button,
    Typography,
    TextField,
  } from "@mui/material";

const PlanCalculator = () => {
  const [calories, setCalories] = useState('');

  const handleCaloriesInputChange = (e, index) => {
    const inputValue = Number(e.target.value);
    if (!isNaN(inputValue) && inputValue >= 1) {
        setCalories(inputValue)
    } else {
        setCalories("")
    }
  };

  const handleCalculateClick = () => {
    // Aquí puedes realizar alguna lógica con las calorías ingresadas
    console.log(`Calories to eat: ${calories}`);
  };

  return (
    <div style={{ border: '1px solid black', padding: '10px', borderRadius: '5px', maxWidth: '600px', margin: 'auto', marginTop: '20px', textAlign: 'center' }}>
      <div className="input-container">
        <Typography
          variant="h5"
          fontWeight="bold"
          align="center"
          marginBottom="2%"
          style={{ color: 'black' }}
        >
          PLAN:
        </Typography>
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
          value={calories}
          onChange={(e) => handleCaloriesInputChange(e)}
          style={{ marginBottom: '7px', width: '50%', margin: 'auto', textAlign: 'center' }}
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
        Calculate
      </Button>
    </div>
  );
};

export default PlanCalculator;