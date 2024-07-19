import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Grid,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useSnackbar } from "notistack";
import CloseIcon from "@mui/icons-material/Close";
import getApiUrl from "../../helpers/apiConfig";

const apiUrl = getApiUrl();

const IntermittentFastingForm = ({
  openIntermittentFastingModal,
  closeModal,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(
    new Date(Date.now() + 3600000)
  );
  const [activeIntermittentFastings, setActiveIntermittentFastings] =
    useState();
  const [nextIntermittentFastings, setNextIntermittentFastings] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setActiveIntermittentFastings("");
    setNextIntermittentFastings("");
    setStartDateTime(new Date());
    setEndDateTime(new Date(Date.now() + 3600000));
    handleGetActiveIntermittentFasting();
  }, [openIntermittentFastingModal]);

  const handleGetActiveIntermittentFasting = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(apiUrl + "/api/intermittentFasting/active", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await response.json();

      if (data.filteredData) {
        setActiveIntermittentFastings(data.filteredData);
      } else {
        await handleGetNextIntermittentFasting();
      }
    } catch (error) {
      console.error("Error fetching active intermittent fasting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetNextIntermittentFasting = async () => {
    try {
      const response = await fetch(apiUrl + "/api/intermittentFasting/next", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      if (data.filteredData.length > 0) {
        setNextIntermittentFastings(data.filteredData);
      }
    } catch (error) {
      console.error("Error fetching next intermittent fasting:", error);
    }
  };

  const cancelIntermittentFasting = async () => {
    const id = activeIntermittentFastings
      ? activeIntermittentFastings._id
      : nextIntermittentFastings[0]._id;
    const cancel = activeIntermittentFastings ? "active" : "next";
    try {
      const response = await fetch(
        apiUrl + "/api/intermittentFasting/active/" + id,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (response.status === 200) {
        enqueueSnackbar(
          "The intermittent fasting was cancelled successfully.",
          {
            variant: "success",
          }
        );
        if (cancel === "active") {
          setActiveIntermittentFastings("");
          await handleGetNextIntermittentFasting();
        } else {
          setNextIntermittentFastings("");
        }
      } else if (response.status === 500) {
        enqueueSnackbar(
          "An error occurred while cancelling the intermittent fasting.",
          {
            variant: "error",
          }
        );
      }
    } catch (error) {
      console.error("Error cancelling intermittent fasting:", error);
    }
  };

  const handleStartIntermittentFasting = () => {
    setIsSubmitting(true);
    const timeDifferenceMillis = endDateTime - startDateTime;
    const timeDifferenceHours = timeDifferenceMillis / (1000 * 60 * 60);

    if (startDateTime > endDateTime) {
      enqueueSnackbar(
        "End date and time must be greater than start date and time.",
        {
          variant: "error",
        }
      );
      setIsSubmitting(false);
    } else if (timeDifferenceHours < 1) {
      enqueueSnackbar("The fasting period must be at least 1 hour.", {
        variant: "error",
      });
      setIsSubmitting(false);
    } else {
      startDateTime.setHours(startDateTime.getHours() - 3);
      startDateTime.setSeconds(0);
      endDateTime.setHours(endDateTime.getHours() - 3);
      endDateTime.setSeconds(0);
      fetch(apiUrl + "/api/intermittentFasting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          startDateTime: startDateTime,
          endDateTime: endDateTime,
          email: localStorage.getItem("userMail"),
          userName: localStorage.getItem("username"),
        }),
      })
        .then(function (response) {
          if (response.status === 200) {
            enqueueSnackbar(
              "The intermittent fasting was created successfully.",
              {
                variant: "success",
              }
            );
            setNextIntermittentFastings("");
            setActiveIntermittentFastings("");
            closeModal();
          } else if (response.status === 501) {
            enqueueSnackbar(
              "Another intermittent fasting is scheduled for the same time.",
              {
                variant: "error",
              }
            );
          }
        })
        .catch(function (error) {
          console.error("Error starting intermittent fasting:", error);
        })
        .finally(function () {
          setIsSubmitting(false);
        });
    }
  };

  function formatDate(date) {
    const fecha = date.substring(0, 10).split("-");
    const hora = date.substring(11, 19).split(":");
    return `${fecha[2]}/${fecha[1]}/${fecha[0]} ${hora[0]}:${hora[1]}:${hora[2]}`;
  }

  return (
    <Modal
      open={openIntermittentFastingModal}
      onClose={closeModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
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
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            {activeIntermittentFastings && (
              <Grid sx={{ textAlign: "center" }}>
                <span style={{ marginBottom: "5%", fontWeight: "bold" }}>
                  Active Intermittent Fasting:{" "}
                </span>
                <br />
                <span>
                  Start: {formatDate(activeIntermittentFastings.startDateTime)}
                </span>
                <br />
                <span>
                  End: {formatDate(activeIntermittentFastings.endDateTime)}
                </span>
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
                  onClick={cancelIntermittentFasting}
                >
                  Cancel
                </Button>
              </Grid>
            )}
            {!activeIntermittentFastings && nextIntermittentFastings && (
              <Grid sx={{ textAlign: "center" }}>
                <span style={{ marginBottom: "5%", fontWeight: "bold" }}>
                  Next Intermittent Fasting:{" "}
                </span>
                <br />
                <span>
                  Start: {formatDate(nextIntermittentFastings[0].startDateTime)}
                </span>
                <br />
                <span>
                  End: {formatDate(nextIntermittentFastings[0].endDateTime)}
                </span>
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
                  onClick={cancelIntermittentFasting}
                >
                  Cancel
                </Button>
              </Grid>
            )}

            <span
              style={{
                marginTop: "5%",
                marginBottom: "5%",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Configure your Intermittent Fasting:{" "}
            </span>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <div style={{ marginBottom: "15px" }}>
                <DateTimePicker
                  value={startDateTime}
                  label="Start Date Time"
                  disablePast
                  onChange={(newDate) => setStartDateTime(newDate)}
                />
              </div>
              <div>
                <DateTimePicker
                  value={endDateTime}
                  label="End Date Time"
                  disabled={!startDateTime}
                  minDate={startDateTime}
                  onChange={(newDate) => setEndDateTime(newDate)}
                />
              </div>
            </LocalizationProvider>
            <Grid item xs={12}>
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
                disabled={isSubmitting}
                onClick={handleStartIntermittentFasting}
              >
                {isSubmitting ? "Submitting..." : "Start Intermittent Fasting"}
              </Button>
            </Grid>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default IntermittentFastingForm;