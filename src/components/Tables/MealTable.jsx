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
import ErrorIcon from '@mui/icons-material/Error';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from "@mui/material/CircularProgress"; // Importa CircularProgress
import { useTheme } from "@mui/material/styles";
const apiUrl = getApiUrl();


function Row(props) {
  const { row, onEditClick } = props;
  const [open, setOpen] = React.useState(false);
  
  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteClick = (meal) => {
    try {
      fetch(apiUrl + "/api/meals/" + meal._id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }).then(function (response) {
        if (response.status == 401) {
          localStorage.removeItem("token");
          window.location.href = "/";
        }
        if (response.status === 200) {
          enqueueSnackbar("The meal was deleted successfully.", {
            variant: "success",
          });

          props.onDelete(meal);

          if (props.endIndex >= props.totalMeals - 1) {
            const newPage = props.page === 0 ? 0 : props.page - 1;
            props.onPageChange(newPage);
          }
        } else {
          enqueueSnackbar("An error occurred while deleting the meal.", {
            variant: "error",
          });
        }
      });
    } catch (error) {
      enqueueSnackbar("An error occurred while deleting the meal.", {
        variant: "error",
      });
    }
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset", height : '72px' } }}>
        <TableCell width={5} align="center" sx={{ textAlign: "center" }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" align="center" style={{ width: 160,border: "1px solid #ddd",
                        padding: "6px", }}>
          {row.name}
          {row.allergy && (<Tooltip title={"You are allergic to one or more ingredients in this meal"}>
            <ErrorIcon style={{ marginLeft: '5px', color: 'red' }} />
            </Tooltip>)} 
        </TableCell>
        <TableCell align="center" style={{ width: 160,border: "1px solid #ddd",
                        padding: "6px", }}>{row.date}</TableCell>
        <TableCell align="center" style={{ width: 160,border: "1px solid #ddd",
                        padding: "6px", }}>{row.hour}</TableCell>
        <TableCell align="center" style={{ width: 160,border: "1px solid #ddd",
                        padding: "6px", }}>
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
                <TableHead sx={{ fontWeight: "bold", bgcolor: "grey.200"}}>
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
                      <TableCell component="th" scope="row" align="center" style={{ width: 95,border: "1px solid #ddd",
                        padding: "6px", }}>
                        {foodRow.foodId.name}
                      </TableCell>
                      <TableCell align="center" style={{ width: 95,border: "1px solid #ddd",
                        padding: "6px", }}>
                        {foodRow.caloriesPerFood}
                      </TableCell>
                      <TableCell align="center" style={{ width: 95,border: "1px solid #ddd",
                        padding: "6px", }}>{foodRow.carbsPerFood}</TableCell>
                      <TableCell align="center" style={{ width: 95,border: "1px solid #ddd",
                        padding: "6px", }}>
                        {foodRow.proteinsPerFood}
                      </TableCell>
                      <TableCell align="center" style={{ width: 95,border: "1px solid #ddd",
                        padding: "6px", }}>{foodRow.fatsPerFood}</TableCell>
                      <TableCell align="center" style={{ width: 95,border: "1px solid #ddd",
                        padding: "6px", }}>
                        {foodRow.weightConsumed}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell align="center" style={{ width: 95,border: "1px solid #ddd",
                        padding: "6px", }}>
                      Total
                    </TableCell>
                    <TableCell align="center" style={{ width: 95,border: "1px solid #ddd",
                        padding: "6px", }}>{row.totalCalories}</TableCell>
                    <TableCell align="center" style={{ width: 95,border: "1px solid #ddd",
                        padding: "6px", }}>{row.totalCarbs}</TableCell>
                    <TableCell align="center" style={{ width: 95,border: "1px solid #ddd",
                        padding: "6px", }}>{row.totalProteins}</TableCell>
                    <TableCell align="center" style={{ width: 95,border: "1px solid #ddd",
                        padding: "6px", }}>{row.totalFats}</TableCell>
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

export default function MealTable({modalOpen  })  {
  const [page, setPage] = useState(0);
  const [meals, setMeals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMeal, setEditMeal] = useState(null);
  const [totalMeals, setTotalMeals] = useState(0);
  const [loading, setLoading] = useState(false);
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const theme = useTheme();
  useEffect(() => {
    getMeals();
  }, [modalOpen, isModalOpen, page]);

  const getMeals = async () => {
    setLoading(true)
    const response = await fetch(
      apiUrl + "/api/meals/user/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    const data = await response.json();
    if (response.status == 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }

    const mealsWithShortenedDates = data.data.map((meal) => {
      return {
        ...meal,
        date: meal.date.substring(0, 10),
      };
    });

    setMeals(mealsWithShortenedDates);
    setTotalMeals(mealsWithShortenedDates.length);
    setLoading(false)
  };

  const handleEditClick = (meal) => {
    setEditMeal(meal);
    setIsModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  

  const handleDelete = (deletedMeal) => {
    const updatedMeals = meals.filter((meal) => meal._id !== deletedMeal._id);
    setMeals(updatedMeals);
    setTotalMeals(updatedMeals.length); // Update totalMeals
    // Adjust page if necessary
    if (page > 0 && updatedMeals.length <= rowsPerPage * page) {
      setPage(page - 1);
    }
  };

  return (
    <Paper sx={{ maxWidth: "100%"}}>
    <TableContainer
      sx={{ overflowX: "auto", minHeight: "441px", position :"relative", maxWidth: "100%", }}
    >
      <Table aria-label="collapsible table">
        <TableHead sx={{ height : '80px', bgcolor: "grey.200"  }}>
          <TableRow sx={{ fontWeight: "bold" }}>
          <TableCell sx={{ fontWeight: "bold", width: 160, padding: "6px" }} align="center">
              Details
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", width: 160, padding: "6px" }} align="center">
              Name
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", width: 160, padding: "6px" }} align="center">
              Date&nbsp;
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", width: 160, padding: "6px" }} align="center">
              Hours&nbsp;
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", width: 160, padding: "6px" }} align="center">
              Actions&nbsp;
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ textAlign: "center" }}>
        {loading ? ( // Muestra CircularProgress si loading es true
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress style={{ margin: "20px" }} />
                </TableCell>
              </TableRow>
            ) :meals.length > 0 ? (
            meals
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
                  totalMeals={totalMeals}
                  onPageChange={handlePageChange}
                />
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No meals to show
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
       disabled={endIndex >= totalMeals}
     >
       <ArrowForwardIosIcon />
     </IconButton>
   </Box>
   <MealForm
        open={isModalOpen}
        setOpen={setIsModalOpen}
        initialData={editMeal}
      />
 </Paper>
  );
}
