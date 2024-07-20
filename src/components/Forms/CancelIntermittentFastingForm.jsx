import React, { useState } from "react";
import { Button, Modal, Box, IconButton, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import CloseIcon from "@mui/icons-material/Close";
import getApiUrl from "../../helpers/apiConfig";

const apiUrl = getApiUrl();

const CancelIntermittentFastingForm = ({ open, setOpen, onConfirm }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          maxWidth: 500, // Aumentar el maxWidth según sea necesario
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "4%",
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
        <Typography
          variant="body1"
          sx={{
            marginBottom: 3,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          You are about to add a meal that will cancel an active intermittent fasting.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onConfirm}
            sx={{
              backgroundColor: "#373D20",
              "&:hover": { backgroundColor: "#373D20" },
              fontWeight: "bold",
              flex: 1,
              marginRight: 1,
            }}
            fullWidth
          >
            Confirm
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={closeModal}
            disabled={isSubmitting}
            sx={{
              backgroundColor: "#373D20",
              "&:hover": { backgroundColor: "#373D20" },
              fontWeight: "bold",
              flex: 1,
              marginLeft: 1,
            }}
            fullWidth
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CancelIntermittentFastingForm;
