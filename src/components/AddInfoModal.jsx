import React from "react";
import {
  TextField,
  Button,
  Modal,
  Box,
  IconButton,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
const InfoModal = ({ open, setOpen, newFood, setNewFood }) => {
  
  const closeModal = () => {
    setOpen(false);
  };

  const handleCarbsInputChange = (e, index) => {
    const inputValue = Number(e.target.value);
    if (!isNaN(inputValue) && inputValue > 0) {
      setNewFood({ ...newFood, carbs: inputValue });
    } else {
      setNewFood({ ...newFood, carbs: "" });
    }
  };

  const handleProteinsInputChange = (e, index) => {
    const inputValue = Number(e.target.value);
    if (!isNaN(inputValue) && inputValue > 0) {
      setNewFood({ ...newFood, proteins: inputValue });
    } else {
      setNewFood({ ...newFood, proteins: "" });
    }
  };

  const handleFatsInputChange = (e, index) => {
    const inputValue = Number(e.target.value);
    if (!isNaN(inputValue) && inputValue > 0) {
      setNewFood({ ...newFood, fats: inputValue });
    } else {
      setNewFood({ ...newFood, fats: "" });
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
          maxWidth: 300,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
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
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={10}>
            <TextField
              inputProps={{
                maxLength: 4, // Establecer el máximo de caracteres permitidos
              }}
              label="Carbs"
              variant="outlined"
              fullWidth
              value={newFood.carbs}
              onChange={(e) => handleCarbsInputChange(e)}
            />
          </Grid>
          <Grid item xs={10}>
            <TextField
              inputProps={{
                maxLength: 4, // Establecer el máximo de caracteres permitidos
              }}
              label="Proteins"
              variant="outlined"
              fullWidth
              value={newFood.proteins}
              onChange={(e) => handleProteinsInputChange(e)}
            />
          </Grid>
          <Grid item xs={10}>
            <TextField
              inputProps={{
                maxLength: 4, // Establecer el máximo de caracteres permitidos
              }}
              label="Fats"
              variant="outlined"
              fullWidth
              value={newFood.fats}
              onChange={(e) => handleFatsInputChange(e)}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          sx={{
            mt: 3,
            mb: 2,
            backgroundColor: "#373D20",
            "&:hover": { backgroundColor: "#373D20" },
            fontWeight: "bold",
          }}
          fullWidth
          onClick={closeModal}
        >
          Add +Info
        </Button>
      </Box>
    </Modal>
  );
};

export default InfoModal;
