import React, { useState } from "react";
import { IconButton, Typography } from "@mui/material";
import SuggestedMealsTable from "../Tables/SuggestedMealsTable";

const SuggestedMealList = ({selectedPlan}) => {

  return (
    <div style={{ textAlign: "center", marginBottom: "250px", color: "black" }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        align="center"
        marginBottom="2%"
      >
        SUGGESTED MEALS TABLE
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          maxWidth: "100%",
        }}
      >
        <SuggestedMealsTable selectedPlan={selectedPlan}/>
      </div>
    </div>
  );
};

export default SuggestedMealList;
