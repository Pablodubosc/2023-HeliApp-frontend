import React, { useState } from "react";
import { IconButton, Typography } from "@mui/material";
import MealForm from "../Forms/MealForm";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import MealTable from "../Tables/MealTable";

const MealList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ textAlign: "center", color: "black", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <Typography variant="h5" fontWeight="bold" align="center" style={{ marginBottom: "5%" }}>
        MEALS TABLE
      </Typography>
      <div style={{ flex: 1, display: "flex", justifyContent: "flex-start", minHeight: "0" }}>
        <MealTable modalOpen={isModalOpen} style={{ width: "100%", height: "100%" }} />
      </div>

      <React.Fragment>
        <MealForm open={isModalOpen} setOpen={setIsModalOpen} />
      </React.Fragment>
      <IconButton
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <AddCircleRoundedIcon />
      </IconButton>
    </div>
  );
};

export default MealList;
