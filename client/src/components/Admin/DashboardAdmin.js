import React, { Fragment, useState, useEffect } from "react";
import { UserPosition } from "../UserContext";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import { redMrkr, greenMrkr } from "../constants";
import "leaflet/dist/leaflet.css";
import AdminNavbar from "./AdminNavbar";
import { Container } from "@mui/system";
import Alert from "@mui/material/Alert";
import UserLocation from "../UserLocation";

const DashboardAdmin = () => {
  //useState
  const [stores, setStores] = useState([]);
  const [offerProducts, setOfferProducts] = useState([]);
  const [searchValue, setSearchValue] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [position, setPosition] = useState(null);

  const getAllStores = async () => {
    try {
      const response = await fetch("http://localhost:5000/store");
      const getAllStrs = await response.json();

      setStores(getAllStrs);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getOfferProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/offerProducts");
      const getOfferProducts = await response.json();
      setOfferProducts(getOfferProducts);
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
        setStores(returnStores);
        setErrorMessage(null);
      }
    } catch (err) {
      setErrorMessage("Κάτι πήγε στραβά!");
    }
  };

  //format date //
  const getFormattedDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB");
  };

  //useEffect//
  useEffect(() => {
    getAllStores();
    getOfferProducts();
  }, []);

  return (
    <Fragment>
      <Container maxWidth="xl" disableGutters>
        <Fragment>
          <AdminNavbar />
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
          center={[38.24616237537946, 21.735024422651165]}
          zoom={15}
          scrollWheelZoom
          style={{ width: "100%", height: "100vh" }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <UserPosition.Provider
            value={{
              position,
              setPosition,
            }}
          >
            <UserLocation />
          </UserPosition.Provider>

          {stores &&
            stores.map((store) =>
              store.offer_id !== null ? (
                <Marker
                  key={store.store_id}
                  position={[
                    parseFloat(store.latitude),
                    parseFloat(store.longitude),
                  ]}
                  icon={greenMrkr}
                >
                  <Popup maxWidth="650">
                    <b>{store.name}</b> <br />
                    <br />
                    <b>ΠΡΟΣΦΟΡΕΣ</b> <br />
                    {offerProducts &&
                      offerProducts.map(
                        (indexProduct) =>
                          store.id === indexProduct.id && (
                            <p>
                              {indexProduct.product_name} {" Από "}
                              {indexProduct.init_price} {"€ Μόνο "}
                              {indexProduct.new_price} {"€ Ημερομηνία κατ: "}
                              {getFormattedDate(indexProduct.entry_date)}{" "}
                              {", Likes "}
                              {indexProduct.likes} {", Dislikes "}
                              {indexProduct.dislikes} {", Σε απόθεμα: "}
                              {indexProduct.stock === true ? "ΝΑΙ" : "OXI"}
                              <br />
                            </p>
                          )
                      )}
                  </Popup>
                </Marker>
              ) : (
                <Marker
                  key={store.store_id}
                  position={[
                    parseFloat(store.latitude),
                    parseFloat(store.longitude),
                  ]}
                  icon={redMrkr}
                >
                  <Popup>
                    <b>{store.name}</b> <br />
                  </Popup>
                </Marker>
              )
            )}
        </MapContainer>
      </Container>
    </Fragment>
  );
};

export default DashboardAdmin;