import React, { useEffect, useState } from "react";
import { TextField, Button, Modal, Box, Grid, IconButton,Typography, FormControl } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useSnackbar } from "notistack";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import CategoryForm from "./CategoryForm";
import CloseIcon from "@mui/icons-material/Close";
import getApiUrl from "../../helpers/apiConfig";
import CategoryAutocomplete from "../CategoryAutocomplete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import InfoModal from "../AddInfoModal";
import { formatISO, parseISO } from 'date-fns';

const apiUrl = getApiUrl();


const initialExerciseDoneState = {
  name: "",
  date: new Date(),
  exercises: [{ exerciseId: "", timeWasted: ""}],
};

const initialMealState = {
  name: "",
  date: new Date(),
  hour: new Date(),
  foods: [{ foodId: "", weightConsumed: ""}],
};

const SuggestionForm = ({ open, setOpen, suggestion, selectedPlan, doneIt }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [exerciseDoneData, setExerciseDoneData] = useState(initialExerciseDoneState);
  const [mealDoneData, setMealDoneData] = useState(initialMealState);

  const handleChangeDate = (e, index) => {
    setMealDoneData((prevData) => ({
      ...prevData,
      date: e,
    }));
    setExerciseDoneData((prevData) => ({
      ...prevData,
      date: e,
    }));
  };



  useEffect(() => {
    if (suggestion) {
      if (suggestion.suggestion.hasOwnProperty("exercises")){
      setExerciseDoneData({
        ...initialExerciseDoneState,
        name: suggestion.suggestion.name,
        date: selectedPlan.startDate,
        exercises : suggestion.suggestion.exercises
      });
     }
     else {
      setMealDoneData({
        ...initialMealState,
        name: suggestion.suggestion.name,
        date: selectedPlan.startDate,
        hour: selectedPlan.startDate,
        foods: suggestion.suggestion.foods
      });
    } 
  }
  }, [suggestion]);


  const handleUpdateSuggestion = () => {
    const index = selectedPlan.suggestions.findIndex(sugerencia => sugerencia._id === suggestion._id);

    if (index) {
       selectedPlan.suggestions[index].done = true; }
      // Envía la sugerencia actualizada al servidor
      fetch(apiUrl + "/api/plans", {
        method: "PUT", // Utiliza el método correcto según tu API
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(selectedPlan),
      })
    }

  const handleAddSuggestion = () => {
    suggestion.done = true;
    if(selectedPlan.planType === "Calories Burn"){

      fetch(apiUrl + "/api/exerciseDone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(exerciseDoneData),
      }).then(function (response) {
        if (response.status === 200) {
          enqueueSnackbar("The exercise was created successfully.", {
            variant: "success",
          });
          handleUpdateSuggestion();
          closeModal();

        } else {
          enqueueSnackbar("An error occurred while creating the exercise.", {
            variant: "error",
          });
        }
      });
    }
    else{
      mealDoneData.hour = mealDoneData.hour.slice(11, 16);

      fetch(apiUrl + "/api/meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(mealDoneData),
      }).then(function (response) {
        if (response.status === 200) {
          enqueueSnackbar("The meal was created successfully.", {
            variant: "success",
          });
          handleUpdateSuggestion();
          closeModal();
        } else {
          enqueueSnackbar("An error occurred while creating the meal.", {
            variant: "error",
          });
        }
      });
    }
    closeModal();
  };

  const closeModal = () => {
    setOpen(false);
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
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  minDate={parseISO(selectedPlan.startDate)}
                  maxDate={new Date() < new Date(selectedPlan.endDate) ? new Date() : parseISO(selectedPlan.endDate)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 60,
                  }}
                  value={parseISO(selectedPlan.startDate)}
                  onChange={(e) => handleChangeDate(e)}
                />
              </LocalizationProvider>
            </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddSuggestion}
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#373D20",
              "&:hover": { backgroundColor: "#373D20" },
              fontWeight: "bold",
            }}
            fullWidth
          >
           Done as suggested
          </Button>
      </Box>
    </Modal>
  );
};

export default SuggestionForm;
