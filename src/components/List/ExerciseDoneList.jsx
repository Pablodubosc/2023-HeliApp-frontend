import React, { useState } from "react";
import { IconButton, Typography } from "@mui/material";
import ExerciseDoneForm from "../Forms/ExerciseDoneForm";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import ExerciseDoneTable from "../Tables/ExerciseDoneTable";

const ExerciseDoneList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ textAlign: "center", marginBottom: "250px", color: "black" }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        align="center"
        marginBottom="2%"
      >
       EXERCISE DONE TABLE
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          maxWidth: "100%",
        }}
      >
        <ExerciseDoneTable modalOpen={isModalOpen}/>
      </div>

      <React.Fragment>
        <ExerciseDoneForm open={isModalOpen} setOpen={setIsModalOpen} />
      </React.Fragment>
      {localStorage.getItem("viewAs") === "false" && (
      <IconButton
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <AddCircleRoundedIcon />
      </IconButton>)}
    </div>
  );
};

export default ExerciseDoneList;
