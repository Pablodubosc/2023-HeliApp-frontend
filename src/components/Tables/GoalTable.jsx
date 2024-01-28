import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import TableHead from "@mui/material/TableHead";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Modal from "@mui/material/Modal";
import getApiUrl from "../../helpers/apiConfig";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Grid, TextField } from "@mui/material";
import GoalForm from "../../components/Forms/GoalForm";
import { useSnackbar } from "notistack";
import InfoIcon from "@mui/icons-material/Info";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

const apiUrl = getApiUrl();

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, onPageChange } = props;

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  return (
    <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <ArrowForwardIosIcon />
        ) : (
          <ArrowBackIosIcon />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / 5) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <ArrowBackIosIcon />
        ) : (
          <ArrowForwardIosIcon />
        )}
      </IconButton>
    </Box>
  );
}

export default function GoalTable({ filterOpen, isCreateModalOpen }) {
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = React.useState(0);
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  useEffect(() => {
    if (!filterOpen) {
      setSelectedFilter("");
    }
    handleGetGoals();
  }, [
    isCreateModalOpen,
    isModalOpen,
    selectedFilter,
    filterOpen,
    selectedGoal,
  ]);

  const handleGetGoals = async () => {
    const response = await fetch(
      apiUrl + "/api/goals/goalsWithProgress/" + localStorage.getItem("userId"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    const data = await response.json();
    if (selectedFilter !== "" && filterOpen) {
      const filteredGoals = data.goalsWithProgress.filter(
        (item) => item.state === selectedFilter
      );
      setGoals(filteredGoals);
      setTotalItems(filteredGoals.length);
    } else {
      setGoals(data.goalsWithProgress);
      setTotalItems(data.goalsWithProgress.length);
    }
  };

  const handleDeleteGoal = async (goal) => {
    const response = await fetch(apiUrl + "/api/goals/" + goal._id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (response.status === 200) {
      setSelectedGoal(null);
      setIsModalOpen(false);
      enqueueSnackbar("The goal was delete successfully.", {
        variant: "success",
      });
    } else {
      enqueueSnackbar("An error occurred while deleting the goal.", {
        variant: "error",
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  function formatDate(date) {
    if (typeof date === "string") {
      const parts = date.substring(0, 10).split("-");
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return date.toLocaleDateString();
  }

  const getFaceIcon = (goal) => {
    const progress = goal.totalConsumido / goal.objetive;

    if (progress >= 1) {
      return <SentimentVerySatisfiedIcon style={{ color: "green" }} />;
    } else if (progress >= 0.5) {
      return <SentimentSatisfiedAltIcon style={{ color: "orange" }} />;
    } else {
      return <SentimentDissatisfiedIcon style={{ color: "red" }} />;
    }
  };
  const handleRecurrency = async (goal) => {
    goal.recurrency = "Non-Recurring";
    await fetch(apiUrl + "/api/goals/" + goal._id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(goal),
    }).then(function (response) {
      if (response.status === 200) {
        enqueueSnackbar("Recurrency Canceled", {
          variant: "success",
        });
        setSelectedGoal(null)
      }
    });
  };

  return (
    <div>
      {filterOpen && (
        <div style={{ marginBottom: "20px" }}>
          <FormControl
            variant="outlined"
            style={{ width: "50%", minWidth: 200, zIndex: 2 }}
          >
            <InputLabel>State</InputLabel>
            <Select
              label="State"
              value={selectedFilter}
              onChange={handleFilterChange}
              MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
            >
              <MenuItem value={"In progress"}>In progress</MenuItem>
              <MenuItem value={"Not started"}>Not started</MenuItem>
              <MenuItem value={"Expired"}>Expired</MenuItem>
            </Select>
          </FormControl>
        </div>
      )}
      <TableContainer component={Paper} sx={{ minWidth: 200, minHeight: 420 }}>
        <Table aria-label="custom pagination table">
          <TableHead sx={{ fontWeight: "bold" }}>
            <TableRow sx={{ fontWeight: "bold" }}>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Name
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Type
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                State
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Recurrency
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Info
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {totalItems === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              (5 > 0 ? goals.slice(page * 5, page * 5 + 5) : goals).map(
                (row) => (
                  <TableRow key={row.name}>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: 130 }}
                      align="center"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell style={{ width: 130 }} align="center">
                      {`${row.type}`}
                    </TableCell>
                    <TableCell style={{ width: 130 }} align="center">
                      {`${row.state}`}
                    </TableCell>
                    <TableCell style={{ width: 130 }} align="center">
                      {`${row.recurrency}`}
                    </TableCell>
                    <TableCell style={{ width: 50 }} align="center">
                      <IconButton
                        onClick={() => {
                          setSelectedGoal(row);
                        }}
                      >
                        <InfoIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <TablePaginationActions
            count={totalItems}
            page={page}
            onPageChange={handleChangePage}
          />
        </Box>
      </TableContainer>

      <Modal open={selectedGoal !== null} onClose={() => setSelectedGoal(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: 400,
            width: "90%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: "2%",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <IconButton
            aria-label="Close"
            onClick={() => setSelectedGoal(null)}
            sx={{
              position: "absolute",
              top: "3%",
              right: "10px",
              zIndex: 2,
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedGoal && (
            <div>
              <h3 style={{ textDecoration: "underline", fontWeight: "bold" }}>
                {selectedGoal.name} {getFaceIcon(selectedGoal)}
              </h3>
              <div style={{ textAlign: "left", marginTop: "5%" }}>
                <TextField
                  label="State"
                  value={selectedGoal.state}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                  style={{ marginBottom: 8 }}
                  fullWidth
                />
                <TextField
                  label="Type"
                  value={`${selectedGoal.type}`}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                  style={{ marginBottom: 8 }}
                  fullWidth
                />
                <TextField
                  label=" Consumed/Goal"
                  value={`${selectedGoal.totalConsumido}/${selectedGoal.objetive}`}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                  style={{ marginBottom: 8 }}
                  fullWidth
                />
                <TextField
                  label="Start Date"
                  value={formatDate(selectedGoal.startDate)}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                  style={{ marginBottom: 8 }}
                  fullWidth
                />
                <TextField
                  label="End Date"
                  value={formatDate(selectedGoal.endDate)}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                  style={{ marginBottom: 8 }}
                  fullWidth
                />
                <TextField
                  label="Recurrency"
                  value={selectedGoal.recurrency}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                  style={{ marginBottom: 8 }}
                  fullWidth
                />
              </div>

              {selectedGoal.state === "Not started" && (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setIsModalOpen(true)}
                      sx={{
                        backgroundColor: "#373D20",
                        "&:hover": { backgroundColor: "#373D20" },
                        fontWeight: "bold",
                      }}
                      fullWidth
                    >
                      Edit
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleDeleteGoal(selectedGoal)}
                      sx={{
                        backgroundColor: "#373D20",
                        "&:hover": { backgroundColor: "#373D20" },
                        fontWeight: "bold",
                      }}
                      fullWidth
                    >
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              )}
              {selectedGoal.recurrency !== "Non-Recurring" &&
                selectedGoal.state === "In progress" && (
                  <Grid>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleRecurrency(selectedGoal)}
                      sx={{
                        backgroundColor: "#373D20",
                        "&:hover": { backgroundColor: "#373D20" },
                        fontWeight: "bold",
                        marginTop: "10px",
                      }}
                      fullWidth
                    >
                      Cancel Recurrency
                    </Button>
                  </Grid>
                )}
              <GoalForm
                open={isModalOpen}
                setOpen={setIsModalOpen}
                initialData={selectedGoal}
                setSelectedGoal={setSelectedGoal}
              />
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
