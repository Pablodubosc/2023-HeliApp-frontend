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
import MealForm from "../Forms/MealForm";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import getApiUrl from "../../helpers/apiConfig";

const apiUrl = getApiUrl();

function Row(props) {
  const { row, onEditClick } = props;
  const [open, setOpen] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();


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
                    <TableRow key={foodRow.name}>
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
      </TableRow>
    </React.Fragment>
  );
}

const rowsPerPage = 5;

export default function SuggestedMealsTable()  {
  const [page, setPage] = useState(0);
  const [meals, setMeals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalMeals, setTotalMeals] = useState(0);

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  useEffect(() => {
    getMeals();
  }, []);

  const getMeals = async () => {
    const response = await fetch(
      apiUrl + "/api/meals/user/" + localStorage.getItem("userId"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    const data = await response.json();

    const mealsWithShortenedDates = data.data.map((meal) => {
      return {
        ...meal,
        date: meal.date.substring(0, 10),
      };
    });

    setMeals(mealsWithShortenedDates);
    setTotalMeals(mealsWithShortenedDates.length);
  };


  const handlePageChange = (newPage) => {
    setPage(newPage);
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
          {meals.length > 0 ? (
            meals
              .slice(startIndex, endIndex)
              .map((row) => (
                <Row
                  key={row.name}
                  row={row}
                  sx={{ textAlign: "center" }}
                  page={page}
                  endIndex={endIndex}
                  totalMeals={totalMeals}
                  onPageChange={handlePageChange}
                />
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No meals to show
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
          disabled={endIndex >= totalMeals}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </div>
    </TableContainer>
  );
}
