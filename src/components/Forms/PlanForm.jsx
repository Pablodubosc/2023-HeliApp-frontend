import React, { useState } from "react";
import { TextField, Button, Modal, Box, Grid, IconButton } from "@mui/material";
import { useSnackbar } from "notistack";
import CategoryForm from "./CategoryForm";
import CloseIcon from "@mui/icons-material/Close";
import getApiUrl from "../../helpers/apiConfig";
import InfoModal from "../AddInfoModal";

const apiUrl = getApiUrl();

const initialPlanState = {
  name: "",
  calories: "",
  meals:[],
  userId: localStorage.getItem("userId"),
};

const PlanForm = ({ open, setOpen }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlan, setNewPlan] = useState(initialPlanState);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const handleAddPlan = () => {
    if (
      newPlan.name === "" ||
      newPlan.calories === "" ||
      Number(newPlan.calories) < 1 
    ) {
      enqueueSnackbar("Please complete all the fields correctly.", {
        variant: "error",
      });
      return;
    } else {
      fetch(apiUrl + "/api/plans/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(newPlan),
      }).then(function (response) {
        if (response.status === 200) {
          enqueueSnackbar("The plan was created successfully.", {
            variant: "success",
          });
          closeModal();
        } else {
          enqueueSnackbar("An error occurred while creating the plan.", {
            variant: "error",
          });
        }
      });
    }
  };

  const closeModal = () => {
    setOpen(false);
    setNewPlan(initialPlanState);
  };

  const handleCaloriesInputChange = (e, index) => {
    const inputValue = Number(e.target.value);
    if (!isNaN(inputValue) && inputValue >= 1) {
      setNewPlan({ ...newPlan, calories: inputValue });
    } else {
      setNewPlan({ ...newPlan, calories: "" });
    }
  };


  return (
    <Modal
      open={open}
      onClose={closeModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 5,
          borderRadius: "2%",
        }}
      >
        <IconButton
          aria-label="Close"
          onClick={closeModal}
          sx={{
            position: "absolute",
            top: "3%",
            right: "10px",
            zIndex: 2,
          }}
        >
          <CloseIcon />
        </IconButton>
        <div>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newPlan.name}
            onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                handleAddPlan();
              }
            }}
          />
              <TextField
                InputProps={{
                  inputProps: {
                    step: 1,
                  },
                }}
                label={`Calories`}
                type="number"
                variant="outlined"
                fullWidth
                value={newPlan.calories}
                onChange={(e) => handleCaloriesInputChange(e)}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    handleAddPlan();
                  }
                }}
              />

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddPlan}
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#373D20",
              "&:hover": { backgroundColor: "#373D20" },
              fontWeight: "bold",
            }}
            fullWidth
          >
            Add Plan
          </Button>
        </div>
        <CategoryForm open={isModalOpen} setOpen={setIsModalOpen} />
      </Box>
    </Modal>
  );
};

export default PlanForm;
