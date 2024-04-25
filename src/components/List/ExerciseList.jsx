import React, { useState } from "react";
import { IconButton, Typography } from "@mui/material";
import ExerciseForm from "../Forms/ExerciseForm";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import ExerciseTable from "../Tables/ExerciseTable";

const ExerciseList = () => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ textAlign: "center", color: "black" }}>
      <Typography variant="h5" fontWeight="bold" align='center' marginBottom='2%'>EXERCISE TABLE</Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          maxWidth: "100%",
        }}
      >
        <ExerciseTable modalOpen={isModalOpen} />
      </div>
      <React.Fragment>
        <ExerciseForm open={isModalOpen} setOpen={setIsModalOpen} />
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

export default ExerciseList;
