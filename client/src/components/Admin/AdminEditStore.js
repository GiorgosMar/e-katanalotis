import { Box } from "@mui/system";
import React, { Fragment, useState, useEffect } from "react";
import { Button, Typography, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SaveIcon from "@mui/icons-material/Save";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";

const AdminEditStores = () => {
  //useStates
  const [stores, setStores] = useState([]);
  const [editStore, setEditStore] = useState({
    storeId: "",
    newStoreName: "",
    shop: "",
    lat: "",
    lon: "",
  });
  const [updateMessage, setUpdateMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  //<------------------------ Fetch ---------------------------->

  const getAllStores = async () => {
    try {
      const response = await fetch("http://localhost:5000/store");
      const getAllStrs = await response.json();

      setStores(getAllStrs);
    } catch (err) {
      console.error(err.message);
    }
  };

  const updateStore = async () => {
    if (editStore.storeId !== "") {
      const body = editStore;
      await fetch("http://localhost:5000/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then(
        setErrorMessage(false),
        setUpdateMessage("Τα στοιχεία ενημερώθηκαν!")
      );
    } else {
      setUpdateMessage(false);
      setErrorMessage("Επιλέξτε κατάστημα");
    }
  };

  //auto Complete
  const setFields = async (storeid) => {
    const getstore = await fetch(
      `http://localhost:5000/store?storeid=${storeid}`
    );
    const storeInfo = await getstore.json().then(
      setEditStore({
        newStoreName: "",
        shop: storeInfo.shop,
        lat: storeInfo.latitude,
        lon: storeInfo.longitude,
      })
    );
  };

  //useEffect//
  useEffect(() => {
    getAllStores();
  }, []);

  useEffect(() => {
    setFields(editStore.storeId);
  }, [editStore.storeId]);

  return (
    <Fragment>
      <Box
        disableGutters
        sx={{
          minWidth: 1000,
          mx: 10,
          marginBottom: 1,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "flex-start",
          backgroundColor: "rgba(0,0,0,.5)",
          color: "#fff",
          borderRadius: "1%",
          padding: "20px",
        }}
      >
        <Typography component="h1" variant="h5">
          Επεξεργασία καταστήματος
        </Typography>
        <Box
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Box sx={{ minWidth: 120, m: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="store">Όνομα καταστήματος</InputLabel>
              <Select
                labelId="store"
                id="store"
                value={editStore.storeId}
                label="Όνομα καταστήματος"
                onChange={(e) =>
                  setEditStore({
                    ...editStore,
                    storeId: e.target.value,
                  })
                }
              >
                {stores &&
                  stores.map((storeIndex) => (
                    <MenuItem key={storeIndex.id} value={storeIndex.id}>
                      {storeIndex.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
          <TextField
            inputProps={{
              style: {
                fontFamily: "Arial",
                color: "white",
                outlineColor: "white",
              },
            }}
            InputLabelProps={{
              style: {
                fontFamily: "Arial",
                color: "black",
                opacity: "0.7",
              },
            }}
            sx={{ minWidth: 120, m: 2 }}
            name="newStoreName"
            label="Νεό όνομα καταστήματος"
            type="text"
            id="newStoreName"
            value={editStore.newStoreName}
            onChange={(e) =>
              setEditStore({ ...editStore, newStoreName: e.target.value })
            }
          />
          <Box sx={{ minWidth: 120, m: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="shop">Είδος</InputLabel>
              <Select
                labelId="shop"
                id="shop"
                value={editStore.shop}
                label="Είδος"
                onChange={(e) =>
                  setEditStore({
                    ...editStore,
                    shop: e.target.value,
                  })
                }
              >
                <MenuItem value={"supermarket"}>supermarket</MenuItem>
                <MenuItem value={"convenience"}>convenience</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TextField
            inputProps={{
              style: {
                fontFamily: "Arial",
                color: "white",
                outlineColor: "white",
              },
            }}
            InputLabelProps={{
              style: {
                fontFamily: "Arial",
                color: "black",
                opacity: "0.7",
              },
            }}
            sx={{ minWidth: 120, m: 2 }}
            name="latitude"
            label="latitude"
            type="text"
            id="latitude"
            value={editStore.lat}
            onChange={(e) =>
              setEditStore({ ...editStore, lat: e.target.value })
            }
          />
          <TextField
            inputProps={{
              style: {
                fontFamily: "Arial",
                color: "white",
                outlineColor: "white",
              },
            }}
            InputLabelProps={{
              style: {
                fontFamily: "Arial",
                color: "black",
                opacity: "0.7",
              },
            }}
            sx={{ minWidth: 120, m: 2 }}
            name="longitude"
            label="longitude"
            type="text"
            id="longitude"
            value={editStore.lon}
            onChange={(e) =>
              setEditStore({ ...editStore, lon: e.target.value })
            }
          />
        </Box>
        <Grid
          sx={{
            ml: 50,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <Grid
              style={{ width: "500px" }}
              fullWidth
              sx={{ mr:20 }}
            >
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
              {updateMessage && (
                <Alert severity="success">{updateMessage}</Alert>
              )}
            </Grid>
            <Button
              size="medium"
              type="submit"
              color="warning"
              variant="contained"
              sx={{ m: 2 }}
              onClick={() => updateStore()}
              endIcon={<SaveIcon />}
            >
              Αποθήκευση
            </Button>
          </Box>
        </Grid>
      </Box>
    </Fragment>
  );
};

export default AdminEditStores;