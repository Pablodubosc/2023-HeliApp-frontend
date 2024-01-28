import React, { useState } from "react";
import { IconButton, Typography } from "@mui/material";
import SuggestedTable from "../Tables/SuggestedTable";

const SuggestedList = ({selectedPlan}) => {

  return (
    <div style={{ textAlign: "center", marginBottom: "250px", color: "black" }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        align="center"
        marginBottom="2%"
      >
        SUGGESTIONS TABLE
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          maxWidth: "100%",
        }}
      >
        <SuggestedTable selectedPlan={selectedPlan}/>
      </div>
    </div>
  );
};

export default SuggestedList;
