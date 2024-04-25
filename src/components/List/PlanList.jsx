import React, { useState } from "react";
import { IconButton, Typography } from "@mui/material";
import PlanForm from "../Forms/PlanForm";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import PlanTable from "../Tables/PlanTable";

const PlanList = ({selectedPlan,setSelectedPlan}) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ textAlign: "center", color: "black" }}>
      <Typography variant="h5" fontWeight="bold" align='center' marginBottom='2%'>PLANS TABLE</Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          maxWidth: "100%",
        }}
      >
        <PlanTable  modalOpen={isModalOpen} selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan}/>
      </div>
      <React.Fragment>
        <PlanForm open={isModalOpen} setOpen={setIsModalOpen} />
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

export default PlanList;
