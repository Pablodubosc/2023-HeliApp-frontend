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
import { TableHead } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import getApiUrl from "../../helpers/apiConfig";
import CircularProgress from "@mui/material/CircularProgress"; // Importa CircularProgress
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

export default function ExerciseTable({ modalOpen  }) {
  const [exercises, setExercises] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = React.useState(0);
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
      getExercise();
  }, [ modalOpen]);

  useEffect(() => {
    getExercise();
  }, []);

  const getExercise = async () => {
    setLoading(true)
    const response = await fetch(apiUrl + "/api/exercise" , {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    if (response.status == 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    if (data.data.length === 0) {
      setNoResults(true);
      setLoading(false)
    } else {
      setNoResults(false);
      setLoading(false)
      setExercises(data.data);
      setTotalItems(data.data.length);
    }
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  return (
    <div
      style={{
        textAlign: "center",
        maxWidth: "100%",
        margin: "auto",
        minHeight: "400px",
        overflowY: "auto",
        position: "relative", // Asegúrate de que el contenedor tenga posición relativa
        paddingBottom: "15px", // Ajusta esto según el alto de tus flechas de paginación
      }}
    >
      <TableContainer
        component={Paper}
        sx={{ overflowX: "auto", minHeight: "487px" }}
      >
        <Table aria-label="custom pagination table">
          <TableHead sx={{ height : '80px', bgcolor: "grey.200"  }}>
            <TableRow sx={{ fontWeight: "bold" }}>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold", width: 160, padding: "6px" }}>
                Name 
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold", width: 160, padding: "6px" }}>
                Calories Burn
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold", width: 160, padding: "6px" }}>
                Time (minutes)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {loading ? ( // Muestra CircularProgress si loading es true
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress style={{ margin: "20px" }} />
                </TableCell>
              </TableRow>
            ) : noResults ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No results found.{" "}
                </TableCell>
              </TableRow>
            ) : (
              (5 > 0 ? exercises.slice(page * 5, page * 5 + 5) : exercises).map(
                (row) => (
                  <TableRow key={row._id}>
                    <TableCell 
                      component="th"
                      scope="row"
                      style={{
                        width: 160,
                        border: "1px solid #ddd",
                        paddingTop: "26px", // Padding en la parte superior
                        paddingBottom: "26px", // Padding en la parte inferior
                        paddingLeft: "8px", // Padding a la izquierda (ejemplo, ajustable)
                        paddingRight: "8px", // Padding a la derecha (ejemplo, ajustable)
                      }}
                      align="center"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell style={{
                        width: 160,
                        border: "1px solid #ddd",
                        paddingTop: "26px", // Padding en la parte superior
                        paddingBottom: "26px", // Padding en la parte inferior
                        paddingLeft: "8px", // Padding a la izquierda (ejemplo, ajustable)
                        paddingRight: "8px", // Padding a la derecha (ejemplo, ajustable)
                      }} align="center">
                      {row.caloriesBurn}
                    </TableCell>
                    <TableCell style={{
                        width: 160,
                        border: "1px solid #ddd",
                        paddingTop: "26px", // Padding en la parte superior
                        paddingBottom: "26px", // Padding en la parte inferior
                        paddingLeft: "8px", // Padding a la izquierda (ejemplo, ajustable)
                        paddingRight: "8px", // Padding a la derecha (ejemplo, ajustable)
                      }} align="center">
                      {row.time}
                    </TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            padding: "10px", // Reducir padding para reducir el espacio
            backgroundColor: "grey.200", // O el color que desees
            borderTop: "1px solid #ddd",
          }}
        >
          <TablePaginationActions
            count={totalItems}
            page={page}
            onPageChange={handleChangePage}
          />
        </Box>
      </TableContainer>
    </div>
  );
}
