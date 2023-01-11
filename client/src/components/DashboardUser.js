import React, { Fragment, useContext, useState, useEffect } from "react";
import { UserCircleBounds, UserContext, UserPosition } from "./UserContext";
import Grid from "@mui/material/Grid";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import { redMrkr, greenMrkr } from "./constants";
import "leaflet/dist/leaflet.css";
import Navbar from "./Navbar";
import { Container } from "@mui/system";
import Alert from "@mui/material/Alert";
import UserLocation from "./UserLocation";

const DashboardUser = () => {
  //useState
  const { setIsAuthenticated } = useContext(UserContext);
  const [stores, setStores] = useState([]);
  const [offerProducts, setOfferProducts] = useState([]);
  const [searchValue, setSearchValue] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [open, setOpen] = useState(false);
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

  const getOfferProducts = async (id) => {
    try {
      const response = await fetch("http://localhost:5000/products");
      const getOfferProducts = await response.json();
      setOfferProducts(getOfferProducts);
    } catch (err) {
      console.error(err.message);
    }
  };

  /*const getRadius = async (lat, lon) => {
    if (await circleBounds.contains([parseFloat(lat), parseFloat(lon)])) {
      return <b>ΝΑΙ</b> && console.log(circleBounds);
    } else {
      return <b>ΟΧΙ</b> && console.log(circleBounds);
    }
  };*/

  const getdistance = (lat1, lon1, lat2, lon2) => {
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000;
  }

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

  //useEffect//
  useEffect(() => {
    getAllStores();
    getOfferProducts();
  }, []);

  //format date //
  const getFormattedDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB");
  };

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
          <UserPosition.Provider
            value={{
              position,
              setPosition
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
                    {getdistance(position.lat, position.lng, store.latitude, store.longitude) < 500 ? <b>ΝΑΙ</b> : <b>ΟΧΙ</b>}
                  </Popup>
                </Marker>
              )
            )}
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
