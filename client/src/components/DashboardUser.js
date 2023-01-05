import React, { Fragment, useContext, useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import { Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import icon from "./constants";
import "leaflet/dist/leaflet.css";
import Navbar from "./Navbar";
import UserLocation from "./UserLocation";
import { Container } from "@mui/system";
import SearchBar from "./SearchBar";
import Alert from "@mui/material/Alert";

const DashboardUser = () => {
  //useState
  const { setIsAuthenticated } = useContext(UserContext);
  const [stores, setStores] = useState([]);
  const [searchValue, setSearchValue] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const getAllStores = async () => {
    try {
      const response = await fetch("http://localhost:5000/store");
      const getAllStrs = await response.json();

      setStores(getAllStrs);
    } catch (err) {
      console.error(err.message);
    }
  };

  const onSubmitSearchValue = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/store?search_value=${searchValue}`
      );
      const returnStores = await response.json();

      if (returnStores === "Not found") {
        setErrorMessage("Η τοποθεσία δεν βρέθηκε!");
      } else {
        console.log(returnStores);
        setStores(returnStores);
        setErrorMessage(null)
      }
    } catch (err) {
      setErrorMessage("Κάτι πήγε στραβά!");
    }
  };

  //useEffect//
  useEffect(() => {
    getAllStores();
  }, []);

  console.log(stores);

  return (
    <Fragment>
      <Container maxWidth="xl" disableGutters>
        <Fragment>
          <Navbar />
          <Paper
            component="form"
            sx={{
              ml: 143,
              mb: 1,
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
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {searchValue !== null && searchValue !== "" && (
              <IconButton
                type="button"
                sx={{ p: "10px" }}
                aria-label="search"
                onClick={onSubmitSearchValue}
              >
                <SearchIcon />
              </IconButton>
            )}
          </Paper>
        </Fragment>
        {errorMessage !== null && (
          <Alert severity="error"> {errorMessage}</Alert>
        )}
        <MapContainer
          center={[51.505, -0.09]}
          zoom={15}
          scrollWheelZoom
          style={{ width: "100%", height: "100vh" }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <UserLocation />
          {stores &&
            stores?.map((store) => (
              <Marker
                key={store.store_id}
                position={[
                  parseFloat(store.store_lat),
                  parseFloat(store.store_lon),
                ]}
                icon={icon}
              />
            ))}
        </MapContainer>

        <Grid container justifyContent="flex-end">
          {/*<Button variant="contained" onClick={() => setIsAuthenticated(false)}>
            Logout
          </Button>*/}
        </Grid>
      </Container>
    </Fragment>
  );
};

export default DashboardUser;
