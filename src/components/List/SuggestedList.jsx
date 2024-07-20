import React, { useState, useEffect } from "react";
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
          justifyContent: "center", // Alinea los elementos al centro horizontalmente
          maxWidth: "100%",
          width: "160%",
          marginBottom: "10px", // Agregamos margen inferior para separar del resto del contenido
        }}
      >
        <SuggestedTable selectedPlan={selectedPlan}/>
      </div>
    </div>
  );
};

export default SuggestedList;
