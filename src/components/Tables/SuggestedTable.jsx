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
import getApiUrl from "../../helpers/apiConfig";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SuggestionForm from  "../Forms/SuggestionForm";

const apiUrl = getApiUrl();


function Row(props) {
  //const planTypeWithoutQuotes = props.planType.replace(/"/g, "");
  console.log(props.planType)
  const { row, onDoneClick } = props;
  console.log(row)
  const [open, setOpen] = React.useState(false);

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
          {row.exerciseDoneSuggestionId.name}
        </TableCell>
        {props.planType !== "Calories Burn" ? (
        <TableCell align="center">
          {row.done == false && new Date(props.planStart) <= new Date() ? (
              <IconButton
                aria-label="done row"
                size="small"
                onClick={() => onDoneClick(row)}
              >
                <RestaurantIcon />
              </IconButton>
            ) : (
              <div style={{ opacity: 0.5, pointerEvents: 'none' }}>
                <IconButton
                  aria-label="done row"
                  size="small"
                  onClick={() => onDoneClick(row)}
                  disabled
                >
                  <RestaurantIcon />
                </IconButton>
              </div>
            )}
        </TableCell>
        ):(
          <TableCell align="center">
          {row.done == false && new Date(props.planStart) <= new Date() ? (
            <IconButton
              aria-label="done row"
              size="small"
              onClick={() => onDoneClick(row)}
            >
              <FitnessCenterIcon />
            </IconButton>
          ):(
            <div style={{ opacity: 0.5, pointerEvents: 'none' }}>
            <IconButton
            aria-label="done row"
            size="small"
            onClick={() => onDoneClick(row)}
          >
            <FitnessCenterIcon />
          </IconButton>
           </div>
          )}
        </TableCell>
        )}
      </TableRow>
      {props.planType !== "Calories Burn" ? (
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
                      Calories
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Carbs
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Proteins
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Fats
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Weight (gr/ml)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.foods.map((foodRow) => (
                    <TableRow key={foodRow._id}>
                      <TableCell component="th" scope="row" align="center">
                        {foodRow.name}
                      </TableCell>
                      <TableCell align="center">
                        {foodRow.totalCalories}
                      </TableCell>
                      <TableCell align="center">{foodRow.totalCarbs}</TableCell>
                      <TableCell align="center">
                        {foodRow.totalProteins}
                      </TableCell>
                      <TableCell align="center">{foodRow.totalFats}</TableCell>
                      <TableCell align="center">
                        {foodRow.weightConsumed}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Total
                    </TableCell>
                    <TableCell align="center">{row.calories}</TableCell>
                    <TableCell align="center">{row.carbs}</TableCell>
                    <TableCell align="center">{row.proteins}</TableCell>
                    <TableCell align="center">{row.fats}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>):(
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
                        {exercise.name}
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
      )}
    </React.Fragment>
  );
}

const rowsPerPage = 5;

export default function SuggestedTable({selectedPlan})  {
  const [page, setPage] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(rowsPerPage);
  const [isDoneSuggestionlModalOpen, setIsDoneSuggestionlModalOpen] = useState(false);
  const [suggestion, setSuggestion] = useState(null);

  const handleDoneClick = (suggestion) => {
    setSuggestion(suggestion);
    setIsDoneSuggestionlModalOpen(true);
  };

  useEffect(() => {
    const newStartIndex = page * rowsPerPage;
    const newEndIndex = newStartIndex + rowsPerPage;

    setStartIndex(newStartIndex);
    setEndIndex(newEndIndex);
  }, [page]);

  useEffect(() => {
    handlePageChange(0)
  }, [selectedPlan]);

  const handlePageChange = async (newPage) => {
    await setPage(newPage);
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
            {localStorage.getItem("viewAs") === "false" && (
            <TableCell sx={{ fontWeight: "bold" }} align="center">
              Actions&nbsp;
            </TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody sx={{ textAlign: "center" }}>
          {selectedPlan.suggestions.length > 0  ? (
            selectedPlan.suggestions
              .slice(startIndex, endIndex)
              .map((row) => (
                <Row
                  key={row._id}
                  row={row}
                  planType = {JSON.stringify(selectedPlan.planType)}
                  planStart = {selectedPlan.startDate}
                  onDoneClick = {handleDoneClick}
                  sx={{ textAlign: "center" }}
                  page={page}
                  endIndex={endIndex}
                  onPageChange={handlePageChange}
                />
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                Please select a plan.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <SuggestionForm open={isDoneSuggestionlModalOpen} setOpen={setIsDoneSuggestionlModalOpen} suggestion={suggestion} selectedPlan={selectedPlan}/>
      <div>
        <IconButton
          onClick={(e) => handlePageChange(page - 1)}
          disabled={page === 0}
        >
          <ArrowBackIosIcon />
        </IconButton>
        <IconButton
          onClick={(e) => handlePageChange(page + 1)}
          disabled={endIndex >= selectedPlan.suggestions.length}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </div>
    </TableContainer>
    
  );
}
