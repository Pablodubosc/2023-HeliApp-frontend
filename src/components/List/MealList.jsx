import React, { useState } from "react";
import { IconButton, Typography } from "@mui/material";
import MealForm from "../Forms/MealForm";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import MealTable from "../Tables/MealTable";

const MealList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ textAlign: "center", marginBottom: "250px", color: "black" }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        align="center"
        marginBottom="2%"
      >
        MEALS TABLE
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          maxWidth: "100%",
        }}
      >
        <MealTable modalOpen={isModalOpen}/>
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
