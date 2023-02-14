import { Box } from "@mui/system";
import React, { Fragment, useState, useEffect } from "react";
import { Button, Typography } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";

const AdminDeleteStore = () => {
  //useStates
  const [stores, setStores] = useState([]);
  const [returnStore, setReturnStore] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  //<------------------------ Fetch ---------------------------->

  //Get all stores//
  const getAllStores = async () => {
    try {
      const response = await fetch("http://localhost:5000/store");
      const getAllStrs = await response.json();

      setStores(getAllStrs);
    } catch (err) {
      console.error(err.message);
    }
  };

  //Delete store//
  const deleteStore = async (storeid) => {
    if (storeid !== null) {
      const body = { storeid };
      await fetch("http://localhost:5000/deleteStore", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then(
        setReturnStore(null),
        setErrorMessage(false),
        setDeleteMessage("Το κατάστημα έχει διαγραφεί επιτυχώς!")
      );
    } else {
      setDeleteMessage(false);
      setErrorMessage("Επιλέξτε κατάστημα");
    }
  };

  //useEffect//
  useEffect(() => {
    getAllStores();
  }, []);

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
          Διαγραφή καταστήματος
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
                value={returnStore}
                label="Όνομα καταστήματος"
                onChange={(e) => setReturnStore(e.target.value)}
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
              sx={{mr: 20 }}
            >
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
              {deleteMessage && (
                <Alert severity="success">{deleteMessage}</Alert>
              )}
            </Grid>
            <Button
              sx={{
                m: 2
              }}
              size="medium"
              type="submit"
              color="error"
              variant="contained"
              onClick={() => deleteStore(returnStore)}
              endIcon={<DeleteIcon />}
            >
              Αποθήκευση
            </Button>
          </Box>
        </Grid>
      </Box>
    </Fragment>
  );
};

export default AdminDeleteStore;
