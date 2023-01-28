import { Box } from "@mui/system";
import React, { Fragment, useState } from "react";
import { Button, Typography, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";

const AdminInsertStore = () => {
  //useStates
  const [insertNewStore, setInsertNewStore] = useState({
    nameStore: "",
    shop: "",
    lat: "",
    lon: "",
  });
  const [errorMessage, setErrorMessage] = useState(false);
  const [insertMessage, setInsertMessage] = useState(false);

  //<------------------------ Fetch ---------------------------->

  const insertStore = async () => {
    if (
      insertNewStore.nameStore !== "" &&
      insertNewStore.shop !== "" &&
      insertNewStore.lat !== "" &&
      insertNewStore.lon !== ""
    ) {
      const body = insertNewStore;
      await fetch("http://localhost:5000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then(
        setErrorMessage(false),
        setInsertMessage("Το κατάστημα έχει διαγραφεί επιτυχώς!")
      );
    } else {
      setInsertMessage(false);
      setErrorMessage("Τα πεδία είναι κενά!");
    }
  };

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
          Προσθήκη νέου καταστήματος
        </Typography>
        <Box
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Box sx={{ minWidth: 120, m: 2 }}>
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
              sx={{ minWidth: 120 }}
              name="nameStore"
              label="Όνομα καταστήματος"
              type="text"
              id="name"
              value={insertNewStore.nameStore}
              onChange={(e) =>
                setInsertNewStore({
                  ...insertNewStore,
                  nameStore: e.target.value,
                })
              }
            />
          </Box>
          <Box sx={{ minWidth: 120, m: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="shop">Είδος</InputLabel>
              <Select
                labelId="shop"
                id="shop"
                value={insertNewStore.shop}
                label="Είδος"
                onChange={(e) =>
                  setInsertNewStore({
                    ...insertNewStore,
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
            value={insertNewStore.lat}
            onChange={(e) =>
              setInsertNewStore({ ...insertNewStore, lat: e.target.value })
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
            value={insertNewStore.lon}
            onChange={(e) =>
              setInsertNewStore({ ...insertNewStore, lon: e.target.value })
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
            <Grid style={{ width: "500px" }} fullWidth sx={{ mr: 20 }}>
              {insertMessage && (
                <Alert severity="success">{insertMessage}</Alert>
              )}
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            </Grid>
            <Button
              size="medium"
              type="submit"
              color="success"
              variant="contained"
              sx={{ m: 2 }}
              onClick={() => insertStore()}
              endIcon={<AddIcon />}
            >
              Προσθήκη
            </Button>
          </Box>
        </Grid>
      </Box>
    </Fragment>
  );
};

export default AdminInsertStore;
