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
import CircularProgress from "@mui/material/CircularProgress"; // Importa CircularProgress
import getApiUrl from "../../helpers/apiConfig";

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

export default function PlanTable({ modalOpen, selectedPlan, setSelectedPlan }) {
  const [plans, setPlans] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(false); // Estado para controlar la carga

  useEffect(() => {
    getPlans();
  }, [modalOpen]);

  const getPlans = async () => {
    if(plans)
    {
      setLoading(true); // Inicia el estado de carga
    }
    try {
      const response = await fetch(apiUrl + "/api/plans/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      setPlans(data.data);
      setTotalItems(data.data.length);
    } catch (error) {
      console.error("Error fetching plans:", error);
      // Puedes manejar el error aquí según tu lógica de la aplicación
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowCheckboxChange = (event, row) => {
    setSelectedPlan(row);
  };

  return (
    <div
      style={{
        textAlign: "center",
        maxWidth: "100%",
        margin: "auto",
        minHeight: "400px",
        overflowY: "auto",
      }}
    >
      <TableContainer component={Paper} sx={{ overflowX: "auto", minHeight: "450px" }}>
        <Table aria-label="custom pagination table">
          <TableHead sx={{ fontWeight: "bold" }}>
            <TableRow sx={{ fontWeight: "bold" }}>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>Plan name</TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>Objective</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">From&nbsp;</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">To&nbsp;</TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>Tracking</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? ( // Muestra CircularProgress si loading es true
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress style={{ margin: "20px" }} />
                </TableCell>
              </TableRow>
            ) : plans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <div style={{ textAlign: 'center' }}>You don't have any plans.</div>
                </TableCell>
              </TableRow>
            ) : (
              plans.slice(page * 5, page * 5 + 5).map((row) => (
                <TableRow key={row._id} selected={selectedPlan === row}>
                  <TableCell component="th" scope="row" style={{ width: 200, height: 70 }} align="center">
                    {row.name}
                  </TableCell>
                  <TableCell style={{ width: 100 }} align="center">
                    {row.planObjective} {row.planType}
                  </TableCell>
                  <TableCell style={{ width: 220 }} align="center">
                    {row.startDate ? row.startDate.substring(0, 10) : ""}
                  </TableCell>
                  <TableCell style={{ width: 220 }} align="center">
                    {row.endDate ? row.endDate.substring(0, 10) : ""}
                  </TableCell>
                  <TableCell style={{ width: 50 }} align="center">
                    <input
                      type="checkbox"
                      checked={selectedPlan === row}
                      onChange={(event) => handleRowCheckboxChange(event, row)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {!loading && plans.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <TablePaginationActions count={totalItems} page={page} onPageChange={handleChangePage} />
          </Box>
        )}
      </TableContainer>
    </div>
  );
}
