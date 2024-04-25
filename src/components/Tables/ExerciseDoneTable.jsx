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

const apiUrl = getApiUrl();

function Row(props) {
  const { row, onEditClick } = props;
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
        if (response.status === 200) {
          enqueueSnackbar("The exercise was deleted successfully.", {
            variant: "success",
          });

          props.onDelete(exercise);

          if (props.endIndex >= props.totalExercise - 1) {
            const newPage = props.page === 0 ? 0 : props.page - 1;
            props.onPageChange(newPage);
          }
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
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell width={5} align="center" sx={{ textAlign: "center" }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {row.name}
        </TableCell>
        <TableCell align="center">{row.date}</TableCell>
        <TableCell align="center">
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
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Name
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Calories Burn
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Time (minutes)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.exercises.map((exercise) => (
                    <TableRow key={exercise._id}>
                      <TableCell component="th" scope="row" align="center">
                        {exercise.exerciseId.name}
                      </TableCell>
                      <TableCell align="center">
                        {exercise.caloriesBurnPerExercise}
                      </TableCell>
                      <TableCell align="center">{exercise.timeWasted}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Total
                    </TableCell>
                    <TableCell align="center">{row.totalCaloriesBurn}</TableCell>
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

const rowsPerPage = 5;

export default function ExerciseDoneTable({modalOpen  })  {
  const [page, setPage] = useState(0);
  const [exerciseDone, setExerciseDone] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editExerciseDone, setEditExerciseDone] = useState(null);
  const [totalExerciseDone, setTotalExerciseDone] = useState(0);

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  useEffect(() => {
    getExerciseDone();
  }, [modalOpen,isModalOpen]);

  const getExerciseDone = async () => {
    const response = await fetch(
      apiUrl + "/api/exerciseDone/user/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    const data = await response.json();
    const exerciseDoneWithShortenedDates = data.data.map((exercise) => {
      return {
        ...exercise,
        date: exercise.date.substring(0, 10),
      };
    });
    setExerciseDone(exerciseDoneWithShortenedDates);
    setTotalExerciseDone(exerciseDoneWithShortenedDates.length);
  };

  const handleEditClick = (exercise) => {
    setEditExerciseDone(exercise);
    setIsModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleDelete = (deletedExerciseDone) => {
    setExerciseDone(exerciseDone.filter((exercise) => exercise._id !== deletedExerciseDone._id));
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ overflowX: "auto", minHeight: "450px" }}
    >
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell sx={{ fontWeight: "bold" }} align="center">
              Name
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">
              Date&nbsp;
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">
              Actions&nbsp;
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ textAlign: "center" }}>
          {exerciseDone.length > 0 ? (
            exerciseDone
              .slice(startIndex, endIndex)
              .map((row) => (
                <Row
                  key={row._id}
                  row={row}
                  sx={{ textAlign: "center" }}
                  onEditClick={handleEditClick}
                  onDelete={handleDelete}
                  page={page}
                  endIndex={endIndex}
                  totalExerciseDone={totalExerciseDone}
                  onPageChange={handlePageChange}
                />
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

      <div>
        <IconButton
          onClick={(e) => handlePageChange(page - 1)}
          disabled={page === 0}
        >
          <ArrowBackIosIcon />
        </IconButton>
        <IconButton
          onClick={(e) => handlePageChange(page + 1)}
          disabled={endIndex >= totalExerciseDone}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </div>

      <ExerciseDoneForm
        open={isModalOpen}
        setOpen={setIsModalOpen}
        initialData={editExerciseDone}
      />
    </TableContainer>
  );
}
