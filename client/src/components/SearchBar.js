import React, { Fragment, useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import icon from "./constants";
import { useMap, Popup, Marker } from "react-leaflet";

const SearchBar = ({state,setState}) => {

  //navigate//
  const navigate = useNavigate();
  console.log(state)
  //useStates
  const [searchValue, setSearchValue] = useState(null);
  const [errorMessage, setErrorMessage] = useState(false);

  const onSubmitSearchValue = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/store?search_value=${searchValue}`);
      const returnStores = await response.json();

      if (returnStores === "Not found") {
        setErrorMessage("Η τοποθεσία δεν βρέθηκε!");
      } else if (returnStores.rows > 0) {
        setState(returnStores);
      }
    } catch (err) {
      setErrorMessage("Κάτι πήγε στραβά!");
    }
  };


  return (
    <Fragment>
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: 350,
          backgroundColor: "#62B6B7",
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1, color: "white" }}
          placeholder="Search..."
          inputProps={{ "aria-label": "search" }}
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        />
        {searchValue!== null && searchValue!=="" &&
        <IconButton type="button" sx={{ p: "10px" }} aria-label="search" onClick={onSubmitSearchValue}>
          <SearchIcon />
        </IconButton>
         }
      </Paper>
    </Fragment>
  );
};

export default SearchBar;
