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
import CategoryAutocomplete from "../CategoryAutocomplete";
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

export default function FoodTable({ filterOpen, modalOpen  }) {
  const [foods, setFoods] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = React.useState(0);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    selectedCategory ? getFoodByCategory() : getFoods();
  }, [selectedCategory]);

  useEffect(() => {
    if (filterOpen === false) {
      setSelectedCategory("");
      getFoods();
    }
  }, [filterOpen, modalOpen]);

  useEffect(() => {
    getFoods();
  }, []);

  const getFoods = async () => {
    const response = await fetch(apiUrl + "/api/foods/" + localStorage.getItem("userId") , {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    console.log(data.data)
    setFoods(data.data);
    setTotalItems(data.data.length);
  };

  const getFoodByCategory = async () => {
    if (selectedCategory !== "") {
      const response = await fetch(
        apiUrl + "/api/foods/category/" + selectedCategory + "/" +  localStorage.getItem("userId"),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      if (data.data.length === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
        setFoods(data.data);
        setTotalItems(data.data.length);
      }
    } else {
      getFoods();
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(0);
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
      {filterOpen && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <CategoryAutocomplete
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      )}
      <TableContainer
        component={Paper}
        sx={{ overflowX: "auto", minHeight: "450px" }}
      >
        <Table aria-label="custom pagination table">
          <TableHead sx={{ fontWeight: "bold" }}>
            <TableRow sx={{ fontWeight: "bold" }}>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Name (gr/ml)
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Calories
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Carbs
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Proteins
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Fats
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Category
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {noResults ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No results found.{" "}
                </TableCell>
              </TableRow>
            ) : (
              (5 > 0 ? foods.slice(page * 5, page * 5 + 5) : foods).map(
                (row) => (
                  <TableRow key={row.name}>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: 160 }}
                      align="center"
                    >
                      {row.name + " " + row.weight + "(gr/ml)"}
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="center">
                      {row.calories}
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="center">
                      {row.carbs === "0" ? "-" : row.carbs}
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="center">
                      {row.proteins === "0" ? "-" : row.proteins}
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="center">
                      {row.fats === "0" ? "-" : row.fats}
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="center">
                      {row.category}
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
    </div>
  );
}
