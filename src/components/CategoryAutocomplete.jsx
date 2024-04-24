import React, { useState, useEffect } from "react";
import { TextField, Autocomplete } from "@mui/material";
import getApiUrl from "../helpers/apiConfig";

const CategoryAutocomplete = ({ selectedCategory, onCategoryChange, addModalOpen }) => {
  const [categoriesOptions, setCategoriesOptions] = useState([]);

  const apiUrl = getApiUrl();

  useEffect(() => {
    getCategories();
  }, [addModalOpen]);

  const getCategories = async () => {
    const response = await fetch(apiUrl + "/api/category/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    setCategoriesOptions(data.data);
  };

  return (
    <Autocomplete
      style={{ width: "100%", maxWidth: 400, minWidth: 200 }}
      value={selectedCategory}
      onChange={(event, newValue) => {
        onCategoryChange(newValue);
      }}
      options={categoriesOptions}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField {...params} label="Choose a Category" variant="outlined" />
      )}
      ListboxProps={{
        style: {
          maxHeight: 110,
        },
      }}
    />
  );
};

export default CategoryAutocomplete;
