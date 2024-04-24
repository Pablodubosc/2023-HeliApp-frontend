import React, { useState } from "react";
import { IconButton, Typography } from "@mui/material";
import FoodForm from "../Forms/FoodForm";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import FoodTable from "../Tables/FoodTable";

const FoodList = () => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div style={{ textAlign: "center", color: "black" }}>
      <Typography variant="h5" fontWeight="bold" align='center' marginBottom='2%'>FOODS TABLE</Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          maxWidth: "100%",
        }}
      >
        <FoodTable filterOpen={filterOpen} modalOpen={isModalOpen} />
      </div>
      <React.Fragment>
        <FoodForm open={isModalOpen} setOpen={setIsModalOpen} />
      </React.Fragment>
      <IconButton
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <AddCircleRoundedIcon />
      </IconButton>
      <IconButton
        onClick={() => {
          setFilterOpen(!filterOpen);
        }}
      >
        <FilterAltRoundedIcon />
      </IconButton>
    </div>
  );
};

export default FoodList;
