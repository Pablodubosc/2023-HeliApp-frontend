import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import getApiUrl from "../../helpers/apiConfig";
import ExerciseDoneForm from "../Forms/ExerciseDoneForm";
import CircularProgress from "@mui/material/CircularProgress";

const apiUrl = getApiUrl();
const rowsPerPage = 5;

function Row(props) {
  const { row, onEditClick, onDelete } = props;
  const [open, setOpen] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteClick = (exercise) => {
    try {
      fetch(apiUrl + "/api/exerciseDone/" + exercise._id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }).then(function (response) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/";
        }
        if (response.status === 200) {
          enqueueSnackbar("The exercise was deleted successfully.", {
            variant: "success",
          });
          onDelete(exercise);
        } else {
          enqueueSnackbar("An error occurred while deleting the exercise.", {
            variant: "error",
          });
        }
      });
    } catch (error) {
      enqueueSnackbar("An error occurred while deleting the exercise.", {
        variant: "error",
      });
    }
  };

  return (
    <React.Fragment>
      <TableRow>
        <TableCell width={5} align="center" style={{ width: 160,border: "1px solid #ddd",
                        padding: "8px", }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center" style={{ width: 160,border: "1px solid #ddd",
                        padding: "18px", }}>{row.name}</TableCell>
        <TableCell align="center" style={{ width: 160,border: "1px solid #ddd",
                        padding: "18px", }}>{row.date}</TableCell>
        <TableCell align="center" style={{ width: 160,border: "1px solid #ddd",
                        padding: "18px", }}>
          <IconButton
            aria-label="edit row"
            size="small"
            onClick={() => onEditClick(row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete row"
            size="small"
            onClick={() => handleDeleteClick(row)}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead sx={{ fontWeight: "bold", bgcolor: "grey.200"}}>
                  <TableRow>
                    <TableCell align="center"sx={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell align="center"sx={{ fontWeight: "bold" }}>Calories Burn</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>Time (minutes)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.exercises.map((exercise) => (
                    <TableRow key={exercise._id}>
                      <TableCell align="center"style={{ width: 160,border: "1px solid #ddd",
                        padding: "6px", }}>
                        {exercise.exerciseId.name}
                      </TableCell>
                      <TableCell align="center"style={{ width: 160,border: "1px solid #ddd",
                        padding: "6px", }}>
                        {exercise.caloriesBurnPerExercise}
                      </TableCell>
                      <TableCell align="center"style={{ width: 160,border: "1px solid #ddd",
                        padding: "6px", }}>{exercise.timeWasted}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell align="center" style={{ width: 160,border: "1px solid #ddd",
                        padding: "6px", }}>
                      Total
                    </TableCell>
                    <TableCell align="center" style={{ width: 160,border: "1px solid #ddd",
                        padding: "6px", }}>{row.totalCaloriesBurn}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const ExerciseDoneTable = ({ modalOpen }) => {
  const [page, setPage] = useState(0);
  const [exerciseDone, setExerciseDone] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editExerciseDone, setEditExerciseDone] = useState(null);
  const [totalExerciseDone, setTotalExerciseDone] = useState(0);
  const [loading, setLoading] = useState(false);

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  useEffect(() => {
    getExerciseDone();
  }, [modalOpen, isModalOpen, page]);

  const getExerciseDone = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl + "/api/exerciseDone/user/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }

      const data = await response.json();
      const exerciseDoneWithShortenedDates = data.data.map((exercise) => ({
        ...exercise,
        date: exercise.date.substring(0, 10),
      }));

      setExerciseDone(exerciseDoneWithShortenedDates);
      setTotalExerciseDone(exerciseDoneWithShortenedDates.length);
    } catch (error) {
      console.error("Error fetching exercise done data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (exercise) => {
    setEditExerciseDone(exercise);
    setIsModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleDelete = (deletedExerciseDone) => {
    const updatedExerciseDone = exerciseDone.filter(
      (exercise) => exercise._id !== deletedExerciseDone._id
    );
    setExerciseDone(updatedExerciseDone);
    setTotalExerciseDone(updatedExerciseDone.length);
    // Adjust page if necessary
    if (page > 0 && updatedExerciseDone.length <= rowsPerPage * page) {
      setPage(page - 1);
    }
  };

  return (
    <Paper>
      <TableContainer sx={{ overflowX: "auto", minHeight: "437px", position: "relative" }}>
        <Table aria-label="collapsible table">
          <TableHead  sx={{ height : '80px', bgcolor: "grey.200"  }}>
            <TableRow>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold", width: 160, padding: "6px" }}>Details</TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold", width: 160, padding: "6px" }}>Name</TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold", width: 160, padding: "6px" }}>Date&nbsp;</TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold", width: 10, padding: "6px" }}>Actions&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress style={{ margin: "20px" }} />
                </TableCell>
              </TableRow>
            ) : exerciseDone.length > 0 ? (
              exerciseDone.slice(startIndex, endIndex).map((row) => (
                <React.Fragment key={row._id}>
                  <Row
                    row={row}
                    onEditClick={handleEditClick}
                    onDelete={handleDelete}
                  />
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No exercises to show
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: "11px", // Reducir padding para reducir el espacio
            backgroundColor: "grey.200", // O el color que desees
            borderTop: "1px solid #ddd",
        }}
      >
        <IconButton onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
          <ArrowBackIosIcon />
        </IconButton>
        <IconButton
          onClick={() => handlePageChange(page + 1)}
          disabled={endIndex >= totalExerciseDone}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
      <ExerciseDoneForm
        open={isModalOpen}
        setOpen={setIsModalOpen}
        initialData={editExerciseDone}
      />
    </Paper>
  );
};

export default ExerciseDoneTable;
