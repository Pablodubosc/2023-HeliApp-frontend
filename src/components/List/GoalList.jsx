import React, { useState } from "react";
import { Typography } from "@mui/material";
import GoalTable from "../Tables/GoalTable";
import GoalForm from "../Forms/GoalForm";
import { IconButton } from "@mui/material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";

const GoalList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  return (
    <div
      style={{
        textAlign: "center",
        color: "black",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "100px",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        align="center"
        marginBottom="2%"
      >
        GOALS TABLE
      </Typography>
      <div style={{ maxWidth: "100%" }}>
        <GoalTable filterOpen={filterOpen} isCreateModalOpen={isModalOpen} />
      </div>

      <React.Fragment>
        <GoalForm open={isModalOpen} setOpen={setIsModalOpen} />
      </React.Fragment>

      <div style={{ display: "flex" }}>
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
    </div>
  );
};

export default GoalList;
