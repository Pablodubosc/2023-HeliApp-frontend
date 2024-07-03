import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

const CancelIntermittentFastingDialog = ({
  open,
  onClose,
  onConfirmCancel,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cancel Intermittent Fasting</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You are about to cancel an intermittent fasting.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirmCancel} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelIntermittentFastingDialog;
